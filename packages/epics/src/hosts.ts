/**
 * @module epics
 */
// Vendor modules
import * as actions from "@nteract/actions";
import { toJS } from "@nteract/commutable";
import { NotebookV4 } from "@nteract/commutable/lib/v4";
import * as selectors from "@nteract/selectors";
import {
  AppState,
  DirectoryContentRecordProps,
  DummyContentRecordProps,
  FileContentRecordProps,
  NotebookContentRecordProps
} from "@nteract/types";
import { RecordOf } from "immutable";
import { ofType } from "redux-observable";
import { ActionsObservable, StateObservable } from "redux-observable";
import { bookstore, contents, ServerConfig } from "rx-jupyter";
import { IContent } from "rx-jupyter/lib/contents";
import { empty, Observable, of } from "rxjs";
import { AjaxResponse } from "rxjs/ajax";
import { catchError, map, switchMap, tap } from "rxjs/operators";

/**
 * Converts a `Notebook` content to the Jupyter `Content`
 * type expected in Bookstore.
 *
 * @param content {NotebookContentRecordProps}  Notebook
 */
function convertNotebookToContent(
  content: NotebookContentRecordProps
): Partial<IContent<"notebook">> & { type: "notebook" } {
  const { filepath, lastSaved, mimetype, model, type } = content;
  const notebook: any = model.toJS().savedNotebook;

  return {
    name: filepath.split("/").pop() || "",
    path: filepath,
    type,
    created: "",
    last_modified:
      lastSaved && lastSaved.toString() ? lastSaved.toString() : "",
    content: notebook,
    mimetype: mimetype || "",
    format: "json"
  };
}

/**
 * Publishes `Content` to bookstore.
 * Only publishes notebooks to bookstore.
 *
 * @param action$ Publish to bookstore action type.
 * @param state$  Application state.
 */
export function publishToBookstore(
  action$: ActionsObservable<actions.PublishToBookstore>,
  state$: StateObservable<AppState>
): Observable<any> {
  return action$.pipe(
    ofType(actions.PUBLISH_TO_BOOKSTORE),
    switchMap(action => {
      const state: any = state$.value;
      const host: any = selectors.currentHost(state);
      const serverConfig: ServerConfig = selectors.serverConfig(host);

      if (!action.payload) {
        return of({
          type: "ERROR",
          error: true,
          payload: {
            error: new Error("saving content to Bookstore needs a payload")
          }
        }) as any;
      }

      // Dismiss any usage that isn't targeting a jupyter server
      if (host.type !== "jupyter") {
        return empty();
      }

      const content:
        | RecordOf<NotebookContentRecordProps>
        | RecordOf<DummyContentRecordProps>
        | RecordOf<FileContentRecordProps>
        | RecordOf<DirectoryContentRecordProps>
        | undefined = selectors
        .contentByRef(state)
        .get(action.payload.contentRef);

      if (!content || content.type !== "notebook") {
        return of({
          type: "ERROR",
          error: true,
          payload: {
            error: new Error("Only Notebooks can be published to Bookstore")
          }
        }) as any;
      }

      const notebook: NotebookV4 = toJS(content.model.savedNotebook);

      // Save notebook first before sending to Bookstore
      return contents
        .save(serverConfig, content.filepath, {
          content: notebook,
          type: "notebook"
        })
        .pipe(
          tap((xhr: AjaxResponse) => {
            if (xhr.status !== 200) {
              throw new Error(xhr.response);
            }
          }),
          map((nb: AjaxResponse) => {
            return bookstore
              .publish(serverConfig, "/published", {
                name: content.filepath.split("/").pop(),
                path: content.filepath,
                type: content.type,
                created: content.created!.toString(),
                last_modified: "",
                content: notebook,
                mimetype: content.mimetype,
                format: content.format
              })
              .pipe(
                tap((xhr: AjaxResponse) => {
                  if (xhr.status !== 200) {
                    throw new Error(xhr.response);
                  }
                }),
                map(resp => {
                  actions.publishToBookstoreSucceeded({
                    contentRef: action.payload.contentRef
                  });
                }),
                catchError((xhrError: any) =>
                  of(
                    actions.publishToBookstoreFailed({
                      error: xhrError,
                      contentRef: action.payload.contentRef
                    })
                  )
                )
              );
          }),
          catchError((xhrError: any) =>
            of(
              actions.saveFailed({
                error: xhrError,
                contentRef: action.payload.contentRef
              })
            )
          )
        );
    })
  );
}
