import React from "react";
import os from "os";
import {
  CommandPalette as Palette,
  CommandButtonRow,
  CommandPaletteProps,
  Icons,
} from "@nteract/presentational-components";
import { GlobalHotKeys, KeyMap } from "react-hotkeys";
import { ContentRef } from "@nteract/core";
import {
  CommandContainer,
  CommandDispatchProps,
  CommandContext,
} from "@nteract/stateful-components";

const isMac = os.platform() === "darwin";

const keymap: KeyMap = {
  HIDE_MENU: ["ctrl+p", "meta+p"],
  RUN_CELL: "shift+enter",
  CREATE_CELL_ABOVE: "shift+m",
  CREATE_CELL_BELOW: "shift+backspace",
  CONVERT_TO_MARKDOWN: ["ctrl+m"],
  HIDE_OUTPUT: ["shift+o"],
  HIDE_INPUT: ["shift+i"],
};

const filters = [
  {
    icon: <Icons.Play />,
    onClick: console.log("play"),
    text: "Run Cell",
    shortCut: ["Shift", "Enter"],
  },
  {
    icon: <Icons.AddCell />,
    onClick: () => console.log("Add Cell Below"),
    shortCut: ["Shift", "M"],
    text: "Add Cell Below",
  },
  {
    icon: <Icons.AddCell />,
    onClick: () => console.log("Add Cell Above"),
    shortCut: ["Shift", "Backspace"],
    text: "Add Cell Above",
  },
  {
    icon: <Icons.Markdown />,
    onClick: () => console.log("Markdown"),
    shortCut: ["Control", "M"],
    text: "Convert to Markdown",
  },
  {
    icon: <Icons.Eye />,
    onClick: () => console.log("Hide Output"),
    shortCut: ["Shift", "O"],
    text: "Hide Output",
  },
  {
    icon: <Icons.Eye />,
    onClick: () => console.log("Hide Input"),
    shortCut: ["Shift", "I"],
    text: "Hide Input",
  },
];

interface Props extends CommandDispatchProps {
  isVisible: boolean;
}
class CommandPalette extends React.Component<Props> {
  state = {
    filter: "",
  };

  getFilteredData = (search: string) => {
    return (
      filters.filter(
        (filter) => filter.text.toLowerCase().indexOf(search.toLowerCase()) > -1
      ) || []
    );
  };

  getHandlers = () => {
    const {
      restartAndRun,
      addCellAbove,
      addCellBelow,
      hideOutput,
      hideInput,
      onToggleVisibility,
      convertToMarkdown,
    } = this.props;

    const handlers = {
      RUN_CELL: () => {
        restartAndRun();
        onToggleVisibility();
      },
      CREATE_CELL_ABOVE: () => {
        addCellAbove();
        onToggleVisibility();
      },
      CREATE_CELL_BELOW: () => {
        addCellBelow();
        onToggleVisibility();
      },
      CONVERT_TO_MARKDOWN: () => {
        convertToMarkdown();
        onToggleVisibility();
      },
      HIDE_OUTPUT: () => {
        hideOutput();
        onToggleVisibility();
      },
      HIDE_INPUT: () => {
        hideInput();
        onToggleVisibility();
      },
    };

    return handlers;
  };

  render() {
    console.log("PROPS", this.props);
    const { isVisible, onToggleVisibility } = this.props;
    const data = this.getFilteredData(this.state.filter);
    const handlers = this.getHandlers();

    return isVisible ? (
      <GlobalHotKeys keyMap={keymap} handlers={handlers}>
        <Palette
          placeholder="Filter commands"
          onChange={(value) => this.setState({ filter: value })}
          shortCut={["Control", "P"]}
          isVisible={isVisible}
          onClose={onToggleVisibility}
          selectedIndex={2}
        >
          {data.map((item) => (
            <CommandButtonRow onClick={item.onClick} shortCut={item.shortCut}>
              {item.icon}
              {item.text}
            </CommandButtonRow>
          ))}
        </Palette>
      </GlobalHotKeys>
    ) : null;
  }
}

interface ComponentProps {
  contentRef: ContentRef;
}

const Container = (props: Props & ComponentProps) => {
  console.log("PROPS", props.componentRef);
  return (
    <CommandContainer contentRef={props.contentRef} id="command-palette">
      <CommandContext.Consumer>
        {(actions: CommandDispatchProps) => (
          <CommandPalette
            {...props}
            addCellBelow={actions.addCellBelow}
            addCellAbove={actions.addCellAbove}
            restartAndRun={actions.restartAndRun}
            hideOutput={actions.hideOutput}
            hideInput={actions.hideInput}
            convertToMarkdown={actions.convertToMarkdown}
          />
        )}
      </CommandContext.Consumer>
    </CommandContainer>
  );
};

export default Container;
