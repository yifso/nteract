import { ofMessageType, JupyterMessage } from "@nteract/messaging";
import { commOpenAction, appendOutput } from "@nteract/actions";
import { of } from "rxjs";
import { filter, switchMap, takeUntil } from "rxjs/operators";

/**
 * Listen for comm_open messages from the kernel that are associated
 * with models that will not be rendered on the page.
 */
export const ipywidgetsModel$ = (kernel, model, contentRef) =>
  kernel.channels.pipe(
    ofMessageType("comm_open"),
    filter((msg: JupyterMessage) => {
      if (msg.content.data.state._model_name === "LinkModel") {
        return true;
      }
      return false;
    }),
    switchMap((msg: JupyterMessage) =>
      of(
        commOpenAction(msg),
        /**
         * If the content we are running under is a notebook,
         * then append a mock output for the linkModel to the
         * notebook.
         */
        model && model.type === "notebook"
          ? appendOutput({
              /**
               * We currently append the output to the first cell
               * in the notebook. Since we are just doing this to
               * get the LinkModel loaded into our WidgetManager
               * singleton, it doesn't matter which cell it is rendered
               * under.
               *
               * However, this approach is rather messy since this
               * output will be serialized to the notebook. TODO: we
               * should try to get the cell that contained the jslink
               * code and store the tempoary output there.
               */
              id: model.notebook.cellOrder.first(),
              contentRef,
              output: {
                output_type: "display_data",
                data: {
                  "application/vnd.jupyter.widget-view+json": {
                    model_id: msg.content.comm_id,
                    version_major: 2,
                    version_minor: 0
                  }
                },
                metadata: {},
                transient: {}
              }
            })
          : null
      )
    )
  );
