import { Channels } from "@nteract/messaging";
import { CellType, CellId } from "@nteract/commutable";
import * as monaco from "monaco-editor";
import * as React from "react";
import { completionProvider } from "./completions/completionItemProvider";
import { ContentRef } from "@nteract/core";
import { DocumentUri } from "./documentUri";
import debounce from "lodash/debounce";

export type IModelContentChangedEvent = monaco.editor.IModelContentChangedEvent;

/**
 * Settings for configuring keyboard shortcuts with Monaco
 */
export interface IMonacoShortCutProps {
  cellType: CellType;
  cellFocusDirection: string | undefined;
  setCellFocusDirection: (direction?: string) => void;
  focusCell: (payload: { id: CellId; contentRef: ContentRef }) => void;
  focusAboveCellCommandMode: () => void;
  focusBelowCellCommandMode: () => void;
  insertCellBelow: (contentRef: ContentRef, cellType: CellType) => void;
  executeCell: () => void;
  focusEditor: () => void;
  focusNextCellEditor: (setPosition?: boolean) => void;
  focusPreviousCellEditor: () => void;
  unfocusEditor: () => void;
}

/**
 * Common props passed to the editor component
 */
export interface IMonacoComponentProps {
  id: string;
  contentRef: ContentRef;
  theme: string;
  readOnly?: boolean;
  channels?: Channels | undefined;
  value: string;
  editorType?: string;
  editorFocused?: boolean;
  onChange?: (value: string, event?: any) => void;
  onFocusChange?: (focus: boolean) => void;
}

/**
 * Props passed for configuring Monaco Editor
 */
export interface IMonacoConfiguration {
  /**
   * modelUri acts an identifier to query the editor model
   * without being tied to the UI
   * Calling the getModel(modelUri) API
   */
  modelUri?: monaco.Uri;
  enableCompletion?: boolean;
  shouldRegisterDefaultCompletion?: boolean;
  onCursorPositionChange?: (selection: monaco.ISelection | null) => void;
  onRegisterCompletionProvider?: (languageId: string) => void;
  language: string;
  lineNumbers?: boolean;
  /** set height of editor to fit the specified number of lines in display */
  numberOfLines?: number;
  indentSize?: number;
  tabSize?: number;
  options?: monaco.editor.IEditorOptions;
  shortcutsOptions?: IMonacoShortCutProps;
  shortcutsHandler?: (editor: monaco.editor.IStandaloneCodeEditor, settings?: IMonacoShortCutProps) => void;
  cursorPositionHandler?: (editor: monaco.editor.IStandaloneCodeEditor, settings?: IMonacoProps) => void;
}

/**
 * Initial props for Monaco Editor received from agnostic component
 */
export type IMonacoProps = IMonacoComponentProps & IMonacoConfiguration;

/**
 * Creates a MonacoEditor instance
 */
export default class MonacoEditor extends React.Component<IMonacoProps> {

  editor?: monaco.editor.IStandaloneCodeEditor;
  editorContainerRef = React.createRef<HTMLDivElement>();
  contentHeight?: number;
  private cursorPositionListener?: monaco.IDisposable;

  /**
   * Reference to parameter widget (used by monaco to display parameter docs).
   */
  private parameterWidget?: Element;
  private blurEditorWidgetListener?: monaco.IDisposable;
  private focusEditorWidgetListener?: monaco.IDisposable;
  private mouseMoveListener?: monaco.IDisposable;

  constructor(props: IMonacoProps) {
    super(props);
    this.calculateHeight = this.calculateHeight.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onDidChangeModelContent = this.onDidChangeModelContent.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.resize = this.resize.bind(this);
    this.hideAllOtherParameterWidgets = debounce(this.hideAllOtherParameterWidgets.bind(this), 150);
  }

  onDidChangeModelContent(e: monaco.editor.IModelContentChangedEvent) {
    if (this.editor) {
      if (this.props.onChange) {
        this.props.onChange(this.editor.getValue(), e);
      }

      this.calculateHeight();
    }
  }

  /**
   * Adjust the height of editor
   *
   * @remarks
   * The way to determine how many lines we should display in editor:
   * If numberOfLines is not set or set to 0, we adjust the height to fit the content
   * If numberOfLines is specified we respect that setting
   */
  calculateHeight() {
    // Make sure we have an editor
    if (!this.editor) {
      return;
    }

    // Make sure we have a model
    const model = this.editor.getModel();
    if (!model) {
      return;
    }

    if (this.editorContainerRef && this.editorContainerRef.current) {
      const expectedLines = this.props.numberOfLines || model.getLineCount();
      // The find & replace menu takes up 2 lines, that is why 2 line is set as the minimum number of lines
      const finalizedLines = Math.max(expectedLines, 1) + 1;
      const lineHeight = this.editor.getConfiguration().lineHeight;
      const contentHeight = finalizedLines * lineHeight;

      if (this.contentHeight !== contentHeight) {
        this.editorContainerRef.current.style.height = contentHeight + "px";
        this.editor.layout();
        this.contentHeight = contentHeight;
      }
    }
  }

  componentDidMount() {
    if (this.editorContainerRef && this.editorContainerRef.current) {
      // Register Jupyter completion provider if needed
      this.registerCompletionProvider();

      // Use Monaco model uri if provided. Otherwise, create a new model uri using editor id.
      const uri = this.props.modelUri ? this.props.modelUri : monaco.Uri.file(this.props.id);

      // Only create a new model if it does not exist. For example, when we double click on a markdown cell,
      // an editor model is created for it. Once we go back to markdown preview mode that doesn't use the editor,
      // double clicking on the markdown cell will again instantiate a monaco editor. In that case, we should
      // rebind the previously created editor model for the markdown instead of recreating one. Monaco does not
      // allow models to be recreated with the same uri.
      let model = monaco.editor.getModel(uri);
      if (!model) {
        model = monaco.editor.createModel(this.props.value, this.props.language, uri);
      }

      // Update Text model options
      model.updateOptions({
        indentSize: this.props.indentSize,
        tabSize: this.props.tabSize
      });

      // Create Monaco editor backed by a Monaco model.
      this.editor = monaco.editor.create(this.editorContainerRef.current, {
        autoIndent: true,
        // Allow editor pop up widgets such as context menus, signature help, hover tips to be able to be
        // displayed outside of the editor. Without this, the pop up widgets can be clipped.
        fixedOverflowWidgets: true,
        find: {
          addExtraSpaceOnTop: false, // pops the editor out of alignment if turned on
          seedSearchStringFromSelection: true, // default is true
          autoFindInSelection: false // default is false
        },
        language: this.props.language,
        lineNumbers: this.props.lineNumbers ? "on" : "off",
        minimap: {
          enabled: false
        },
        model,
        overviewRulerLanes: 0,
        readOnly: this.props.readOnly,
        // Disable highlight current line, too much visual noise with it on.
        // VS Code also has it disabled for their notebook experience.
        renderLineHighlight: "none",
        scrollbar: {
          useShadows: false,
          verticalHasArrows: false,
          horizontalHasArrows: false,
          vertical: "hidden",
          horizontal: "hidden",
          verticalScrollbarSize: 0,
          horizontalScrollbarSize: 0,
          arrowSize: 30
        },
        scrollBeyondLastLine: false,
        theme: this.props.theme,
        value: this.props.value,
        // Apply custom settings from configuration
        ...this.props.options,
      });

      this.addEditorTopMargin();

      // Handle custom keyboard shortcuts
      if (this.editor && this.props.shortcutsHandler && this.props.shortcutsOptions) {
        this.props.shortcutsHandler(this.editor, this.props.shortcutsOptions);
      }

      this.toggleEditorOptions(!!this.props.editorFocused);

      if (this.props.editorFocused) {
        if (!this.editor.hasTextFocus()) {
          // Bring browser focus to the editor if text not already in focus
          this.editor.focus();
        }
        this.registerCursorListener();
      }

      // Adds listener under the resize window event which calls the resize method
      window.addEventListener("resize", this.resize);

      // Adds listeners for undo and redo actions emitted from the toolbar
      this.editorContainerRef.current.addEventListener("undo", () => {
        if (this.editor) {
          this.editor.trigger("undo-event", "undo", {});
        }
      });
      this.editorContainerRef.current.addEventListener("redo", () => {
        if (this.editor) {
          this.editor.trigger("redo-event", "redo", {});
        }
      });

      this.editor.onDidChangeModelContent(this.onDidChangeModelContent);
      this.editor.onDidFocusEditorText(this.onFocus);
      this.editor.onDidBlurEditorText(this.onBlur);
      this.calculateHeight();

      // Ensures that the source contents of the editor (value) is consistent with the state of the editor
      this.editor.setValue(this.props.value);
      if(this.props.cursorPositionHandler){
        this.props.cursorPositionHandler(this.editor, this.props);
      }

      // When editor loses focus, hide parameter widgets (if any currently displayed).
      this.blurEditorWidgetListener = this.editor.onDidBlurEditorWidget(() => {
        this.hideParameterWidget();
      });

      this.focusEditorWidgetListener = this.editor.onDidFocusEditorWidget(() => {
        this.hideAllOtherParameterWidgets();
      });

      if (this.editor) {
        this.mouseMoveListener = this.editor.onMouseMove(() => {
            this.hideAllOtherParameterWidgets();
        });
      }
    }
  }

  addEditorTopMargin() {
    if (this.editor) {
      // Monaco editor doesn't have margins
      // https://github.com/notable/notable/issues/551
      // This is a workaround to add an editor area 12px padding at the top
      // so that cursors decorators and context menus can be rendered correctly.
      this.editor.changeViewZones((changeAccessor) => {
        const domNode = document.createElement("div");
        changeAccessor.addZone({
          afterLineNumber: 0,
          heightInPx: 12,
          domNode
        });
      });
    }
  }

  /**
   * Tells editor to check the surrounding container size and resize itself appropriately
   */
  resize() {
    if (this.editor) {
      this.editor.layout();
    }
  }

  componentDidUpdate() {
    if (!this.editor) {
      return;
    }

    const { value, language, contentRef, id, editorFocused, theme } = this.props;

    if(this.props.cursorPositionHandler){
      this.props.cursorPositionHandler(this.editor, this.props);
    }

    // Ensures that the source contents of the editor (value) is consistent with the state of the editor
    if (this.editor.getValue() !== this.props.value) {
      this.editor.setValue(this.props.value);
    }

    completionProvider.setChannels(this.props.channels);

    // Register Jupyter completion provider if needed
    this.registerCompletionProvider();

    // Apply new model to the editor when the language is changed.
    const model = this.editor.getModel();
    if (model && language && model.getModeId() !== language) {
      const newUri = DocumentUri.createCellUri(contentRef, id, language);
      if (!monaco.editor.getModel(newUri)) {
        // Save the cursor position before we set new model.
        const position = this.editor.getPosition();

        // Set new model targeting the changed language.
        this.editor.setModel(monaco.editor.createModel(value, language, newUri));
        this.addEditorTopMargin();

        // Restore cursor position to new model.
        if (position) {
          this.editor.setPosition(position);
        }

        // Dispose of the old model in a seperate event. We cannot dispose of the model within the
        // componentDidUpdate method or else the editor will throw an exception. Zero in the timeout field
        // means execute immediately but in a seperate next event.
        setTimeout(() => model.dispose(), 0);
      }
    }
    
    if (theme) {
      monaco.editor.setTheme(theme);
    }

    // In the multi-tabs scenario, when the notebook is hidden by setting "display:none",
    // Any state update propagated here would cause a UI re-layout, monaco-editor will then recalculate
    // and set its height to 5px.
    // To work around that issue, we skip updating the UI when paraent element's offsetParent is null (which
    // indicate an ancient element is hidden by display set to none)
    // We may revisit this when we get to refactor for multi-notebooks.
    if (!this.editorContainerRef.current?.offsetParent) {
      return;
    }

    // Set focus
    if (editorFocused && !this.editor.hasTextFocus()) {
      this.editor.focus();
    }

    // Tells the editor pane to check if its container has changed size and fill appropriately
    this.editor.layout();
  }

  componentWillUnmount() {
    if (this.editor) {
      try {
        const model = this.editor.getModel();
        // Remove the resize listener
        window.removeEventListener("resize", this.resize);
        if (model) {
          model.dispose();
        }

        this.editor.dispose();
      } catch (err) {
        // tslint:disable-next-line
        console.error(`Error occurs in disposing editor: ${JSON.stringify(err)}`);
      }
    }
    if (this.parameterWidget) {
      this.parameterWidget.removeEventListener('mouseleave', this.outermostParentLeave);
      this.parameterWidget = undefined;
    }
    if (this.blurEditorWidgetListener) {
      this.blurEditorWidgetListener.dispose();
    }
    if (this.focusEditorWidgetListener) {
      this.focusEditorWidgetListener.dispose();
    }
  }

  render() {
    return (
      <div className="monaco-container">
        <div ref={this.editorContainerRef} id={`editor-${this.props.id}`} />
      </div>
    );
  }

  /**
   * Register default kernel-based completion provider.
   * @param language Language
   */
  registerDefaultCompletionProvider(language: string) {
    // onLanguage event is emitted only once per language when language is first time needed.
    monaco.languages.onLanguage(language, () => {
      monaco.languages.registerCompletionItemProvider(language, completionProvider);
    });
  }

  private onFocus() {
    if(this.props.onFocusChange){
      this.props.onFocusChange(true);
    }
    this.toggleEditorOptions(true);
    this.registerCursorListener();
  }

  private onBlur() {
    if(this.props.onFocusChange){
      this.props.onFocusChange(false);
    }
    this.toggleEditorOptions(false);
    this.unregisterCursorListener();
  }

  private registerCursorListener() {
    if (this.editor && this.props.onCursorPositionChange) {
      const selection = this.editor.getSelection();
      this.props.onCursorPositionChange(selection);

      if (!this.cursorPositionListener) {
        this.cursorPositionListener = this.editor.onDidChangeCursorSelection((event) =>
          this.props.onCursorPositionChange!(event.selection)
        );
      }
    }
  }

  private unregisterCursorListener() {
    if (this.cursorPositionListener) {
      this.cursorPositionListener.dispose();
      this.cursorPositionListener = undefined;
    }
  }

  /**
   * Toggle editor options based on if the editor is in active state (i.e. focused).
   * When the editor is not active, we want to deactivate some of the visual noise.
   * @param isActive Whether editor is active.
   */
  private toggleEditorOptions(isActive: boolean) {
    if (this.editor) {
      this.editor.updateOptions({
        matchBrackets: isActive,
        occurrencesHighlight: isActive,
        renderIndentGuides: isActive
      });
    }
  }

  /**
   * Register language features for target language. Call before setting language type to model.
   */
  private registerCompletionProvider() {
    const { enableCompletion, language, onRegisterCompletionProvider, shouldRegisterDefaultCompletion } = this.props;

    if (enableCompletion && language) {
      if (onRegisterCompletionProvider) {
        onRegisterCompletionProvider(language);
      } else if (shouldRegisterDefaultCompletion) {
        this.registerDefaultCompletionProvider(language);
      }
    }
  }

  /**
   * Hide the parameter widget on mouse leave event.
   */
  private outermostParentLeave() {
    if (this.editor) {
      // Possible user is viewing the parameter hints, wait before user moves the mouse.
      // Waiting for 1s is too long to move the mouse and hide the hints (100ms seems like a good fit).
      setTimeout(() => this.hideParameterWidget(), 100);
    }
  }

  /**
   * This will hide the parameter widget if the user is not hovering over
   * the parameter widget for this monaco editor.
   *
   * Notes: See issue https://github.com/microsoft/vscode-python/issues/7851 for further info.
   * Hide the parameter widget if all of the following conditions have been met:
   * - Editor doesn't have focus
   * - Mouse is not over the editor
   * - Mouse is not over (hovering) the parameter widget
   *
   * @private
   * @returns
   * @memberof MonacoEditor
   */
  private hideParameterWidget() {
    if (!this.editor || !this.editor.getDomNode() ||
      // Make sure that we don't break screen readers
      this.parameterWidget?.contains(document.activeElement)) {
      return;
    }

    // Find all elements that the user is hovering over.
    // It's possible the parameter widget is one of them.
    const hoverElements: Element[] = Array.prototype.slice.call(document.querySelectorAll(':hover'));
    if (!this.editorContainerRef.current) {
      return;
    }

    // Find all parameter widgets related to this monaco editor that are currently displayed.
    const visibleParameterHintsWidgets: Element[] = Array.prototype.slice.call(this.editorContainerRef.current.querySelectorAll('.parameter-hints-widget.visible'));
    if (hoverElements.length === 0 && visibleParameterHintsWidgets.length === 0) {
      // If user is not hovering over anything and there are no visible parameter widgets,
      // then, we have nothing to do but get out of here.
      return;
    }

    // Find all parameter widgets related to this monaco editor.
    const knownParameterHintsWidgets: HTMLDivElement[] = Array.prototype.slice.call(this.editorContainerRef.current.querySelectorAll('.parameter-hints-widget'));

    // Let's not assume we'll have the exact same DOM for parameter widgets.
    // So, just remove the event handler, and add it again later.
    if (this.parameterWidget) {
      this.parameterWidget.removeEventListener('mouseleave', this.outermostParentLeave);
    }

    // These are the classes that will appear on a parameter widget when they are visible.
    const parameterWidgetClasses = ['editor-widget', 'parameter-hints-widget', 'visible'];

    // Find the parameter widget the user is currently hovering over.
    this.parameterWidget = hoverElements.find(item => {
      if (!item.className) {
        return false;
      }

      // Check if user is hovering over a parameter widget.
      const classes = item.className.split(' ');

      if (!parameterWidgetClasses.every(cls => classes.indexOf(cls) >= 0)) {
        // Not all classes required in a parameter hint widget are in this element.
        // Hence this is not a parameter widget.
        return false;
      }

      // Ok, this element that the user is hovering over is a parameter widget.
      // Next, check whether this parameter widget belongs to this monaco editor.
      // We have a list of parameter widgets that belong to this editor, hence a simple lookup.
      return knownParameterHintsWidgets.some(widget => widget === item);
    });

    if (this.parameterWidget) {
      // We know the user is hovering over the parameter widget for this editor.
      // Hovering could mean the user is scrolling through a large parameter list.
      // We need to add a mouse leave event handler, so as to hide this.
      this.parameterWidget.addEventListener('mouseleave', this.outermostParentLeave);
      // In case the event handler doesn't get fired, have a backup of checking within 1s.
      setTimeout(() => this.hideParameterWidget(), 1000);
      return;
    }

    if (visibleParameterHintsWidgets.length === 0) {
      // There are no parameter widgets displayed for this editor.
      // Hence nothing to do.
      return;
    }

    // If the editor has focus, don't hide the parameter widget.
    // This is the default behavior. Let the user hit `Escape` or click somewhere
    // to forcefully hide the parameter widget.
    if (this.editor.hasWidgetFocus()) {
      return;
    }

    // If we got here, then the user is not hovering over the parameter widgets.
    // & the editor doesn't have focus.
    // However some of the parameter widgets associated with this monaco editor are visible.
    // We need to hide them.
    // Solution: Hide the widgets manually.
    knownParameterHintsWidgets.forEach(widget => {
      widget.setAttribute('class', widget.className.split(' ').filter(cls => cls !== 'visible').join(' '));
      if (widget.style.visibility !== 'hidden') {
        widget.style.visibility = 'hidden';
      }
    });
  }

  /**
     * Hides widgets such as parameters and hover, that belong to a given parent HTML element.
     *
     * @private
     * @param {HTMLDivElement} widgetParent
     * @param {string[]} selectors
     * @memberof MonacoEditor
     */
    private hideWidgets(widgetParent: HTMLDivElement, selectors: string[]){
      for (const selector of selectors){
        for (const widget of Array.from<HTMLDivElement>(widgetParent.querySelectorAll(selector))) {
            widget.setAttribute('class', widget.className.split(' ').filter((cls: string) => cls !== 'visible').join(' '));
            if (widget.style.visibility !== 'hidden') {
              widget.style.visibility = 'hidden';
            }
        }
      }
    }

     /**
     * Hides the parameters widgets related to other monaco editors.
     * Use this to ensure we only display parameters widgets for current editor (by hiding others).
     *
     * @private
     * @returns
     * @memberof MonacoEditor
     */
    private hideAllOtherParameterWidgets(){
      const root = document.getElementById('app');
      if (!root || !this.editorContainerRef.current){
          return;
      }
      const widgetParents: HTMLDivElement[] = Array.prototype.slice.call(root.querySelectorAll('div.monaco-container'));
      widgetParents
      .filter(widgetParent => widgetParent !== this.editorContainerRef.current)
      .forEach(widgetParent => this.hideWidgets(widgetParent, ['.parameter-hints-widget']));
    }
}
