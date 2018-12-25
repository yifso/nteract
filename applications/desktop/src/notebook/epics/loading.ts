import * as path from "path";
import * as fs from "fs";

import { empty, of, forkJoin } from "rxjs";
import {
  map,
  tap,
  switchMap,
  mergeMap,
  catchError,
  timeout
} from "rxjs/operators";
import { ofType } from "redux-observable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { readFileObservable, statObservable } from "fs-observable";
import { monocellNotebook, toJS } from "@nteract/commutable";
import { ImmutableNotebook } from "@nteract/commutable";
import { actions, selectors } from "@nteract/core";
import { AppState } from "@nteract/core";

import { contents } from "rx-jupyter";

import { Actions } from "../actions";

/**
 * Determines the right kernel to launch based on a notebook
 */
export const extractNewKernel = (
  filepath: string | null,
  notebook: ImmutableNotebook
) => {
  // NOTE: There's some incongruence between desktop and web app here, regarding path vs. filename
  //       Instead, this function is slightly repeated between here and @nteract/core
  const cwd =
    (filepath != null && path.dirname(path.resolve(filepath))) || process.cwd();
  const kernelSpecName =
    notebook.getIn(["metadata", "kernelspec", "name"]) ||
    notebook.getIn(["metadata", "language_info", "name"]) ||
    "python3";
  return {
    cwd,
    kernelSpecName
  };
};

function createContentsResponse(
  filePath: string,
  stat: fs.Stats,
  content: string
): contents.Payload {
  const parsedFilePath = path.parse(filePath);

  const name = parsedFilePath.base;
  const writable = Boolean(fs.constants.W_OK & stat.mode);
  /**
   * TODO: Determine if the content record can encode created and last_modified
   * as pure `Date`s or if it's supposed to match the jupyter API response literally
   */
  const created = (stat.birthtime as unknown) as string;
  const last_modified = (stat.mtime as unknown) as string;

  if (stat.isDirectory()) {
    return {
      type: "directory",
      mimetype: null,
      format: "json",
      content,
      writable,
      name: name === "." ? "" : name,
      path: filePath === "." ? "" : filePath,
      created,
      last_modified
    };
  } else if (stat.isFile()) {
    if (parsedFilePath.ext === ".ipynb") {
      return {
        type: "notebook",
        mimetype: null,
        format: "json",
        content: content ? JSON.parse(content) : null,
        writable,
        name,
        path: filePath,
        created,
        last_modified
      };
    }

    // TODO: Mimetype detection
    return {
      type: "file",
      mimetype: null,
      format: "text",
      content,
      writable,
      name,
      path: filePath,
      created,
      last_modified
    };
  }

  throw new Error(`Unsupported filetype at ${filePath}`);
}

/**
 * Loads a notebook and launches its kernel.
 *
 * @param  {ActionObservable}  A LOAD action with the notebook filename
 */
export const fetchContentEpic = (action$: ActionsObservable<Actions>) =>
  action$.pipe(
    ofType(actions.FETCH_CONTENT),
    tap((action: actions.FetchContent) => {
      // If there isn't a filepath, save-as it instead
      if (!action.payload.filepath) {
        throw new Error("fetch content needs a path");
      }
    }),
    // Switch map since we want the last load request to be the lead
    switchMap(action => {
      const filepath = action.payload.filepath;

      return forkJoin(
        readFileObservable(filepath),
        statObservable(filepath),
        // Project onto the Contents API response
        (content, stat): contents.Payload =>
          createContentsResponse(filepath, stat, content)
      ).pipe(
        // Timeout after one minute
        timeout(60 * 1000),
        map(model =>
          actions.fetchContentFulfilled({
            filepath: model.path,
            model,
            kernelRef: action.payload.kernelRef,
            contentRef: action.payload.contentRef
          })
        ),
        catchError((err: Error) =>
          of(
            actions.fetchContentFailed({
              filepath,
              error: err,
              kernelRef: action.payload.kernelRef,
              contentRef: action.payload.contentRef
            })
          )
        )
      );
    })
  );

export const launchKernelWhenNotebookSetEpic = (
  action$: ActionsObservable<Actions>,
  state$: StateObservable<AppState>
) =>
  action$.pipe(
    ofType(actions.FETCH_CONTENT_FULFILLED),
    mergeMap((action: actions.FetchContentFulfilled) => {
      const contentRef = action.payload.contentRef;

      const content = selectors.content(state$.value, { contentRef });

      if (
        !content ||
        content.type !== "notebook" ||
        content.model.type !== "notebook"
      ) {
        // This epic only handles notebook content
        return empty();
      }

      const filepath = content.filepath;
      const notebook = content.model.notebook;

      const { cwd, kernelSpecName } = extractNewKernel(filepath, notebook);

      return of(
        actions.launchKernelByName({
          kernelSpecName,
          cwd,
          kernelRef: action.payload.kernelRef,
          selectNextKernel: true,
          contentRef: action.payload.contentRef
        })
      );
    })
  );

/**
 * Sets a new empty notebook.
 *
 * @param  {ActionObservable}  ActionObservable for NEW_NOTEBOOK action
 */
export const newNotebookEpic = (action$: ActionsObservable<Actions>) =>
  action$.pipe(
    ofType(actions.NEW_NOTEBOOK),
    map((action: actions.NewNotebook) => {
      const {
        payload: {
          kernelSpec: { name, spec }
        }
      } = action;

      // TODO: work on a raw javascript object since we convert it over again
      let notebook = monocellNotebook;
      if (name) {
        notebook = notebook
          .setIn(["metadata", "kernel_info", "name"], name)
          .setIn(["metadata", "language_info", "name"], name);
      }
      if (spec) {
        notebook = notebook
          .setIn(["metadata", "kernelspec"], spec)
          .setIn(["metadata", "kernelspec", "name"], name);
      }

      const timestamp = new Date();

      return actions.fetchContentFulfilled({
        // NOTE: A new notebook on desktop does not have a filepath, unlike
        //       the web app which uses UntitledX.ipynb
        filepath: "",
        model: {
          type: "notebook",
          mimetype: null,
          format: "json",
          // Back to JS, only to immutableify it inside of the reducer
          content: toJS(notebook),
          writable: true,
          name: null,
          // Since we have the filepath above, do we need it here (?)
          path: null,
          created: timestamp,
          last_modified: timestamp
        },
        kernelRef: action.payload.kernelRef,
        contentRef: action.payload.contentRef
      });
    })
  );
