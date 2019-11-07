import * as React from "react";
import { RecordOf } from "immutable";
import { WidgetManager } from "./widget-manager";
import BackboneWrapper from "../renderer/backbone-wrapper";
import { connect } from "react-redux";
import {
  AppState,
  selectors,
  actions,
  KernelNotStartedProps,
  LocalKernelProps,
  RemoteKernelProps,
  ContentRef
} from "@nteract/core";
import { CellId } from "@nteract/commutable";
import { WidgetModel } from "@jupyter-widgets/base";

interface ConnectedProps {
  modelById: (id: string) => any;
  kernel?:
    | RecordOf<KernelNotStartedProps>
    | RecordOf<LocalKernelProps>
    | RecordOf<RemoteKernelProps>
    | null;
}

interface DispatchProps {
  actions: {
    appendOutput: (output: any) => void;
    clearOutput: () => void;
    updateCellStatus: (status: string) => void;
    promptImputRequest: (prompt: string, password: boolean) => void;
  };
}

interface OwnProps {
  model: WidgetModel;
  model_id: string;
  id: CellId;
  contentRef: ContentRef;
}

type Props = ConnectedProps & OwnProps & DispatchProps;

/**
 * This component is is a wrapper component that initializes a
 * WidgetManager singleton and passes a model reference to the
 * BackboneModelWrapper. It's doing most of the heavy lifting with
 * respect to bridging the kernels comms that the WidgetManager provides,
 * our client-side state model, and the view.
 */
class Manager extends React.Component<Props> {
  widgetContainerRef = React.createRef<HTMLDivElement>();
  static manager: WidgetManager;

  constructor(props: Props) {
    super(props);
  }

  /**
   * Because the iPyWidgets keeps track of the widgets it creates as a
   * member variable, the WidgetManager needs to be treated like a singleton.
   * However, we still need to be constantly updating the singleton with the most up
   * to date modelById function, otherwise it will be searching a stale state for a
   * model
   */
  getManager() {
    if (Manager.manager === undefined) {
      Manager.manager = new WidgetManager(
        this.props.kernel,
        this.props.modelById,
        this.props.actions
      );
    } else {
      Manager.manager.update(
        this.props.kernel,
        this.props.modelById,
        this.props.actions
      );
    }
    return Manager.manager;
  }

  render() {
    return (
      <React.Fragment>
        <BackboneWrapper
          model={this.props.model.get("state")}
          manager={this.getManager()}
          model_id={this.props.model_id}
          widgetContainerRef={this.widgetContainerRef}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState, props: OwnProps): ConnectedProps => {
  return {
    modelById: (model_id: string) =>
      selectors.modelById(state, { commId: model_id }),
    kernel: selectors.currentKernel(state)
  };
};

const mapDispatchToProps = (dispatch: any, props: OwnProps): DispatchProps => {
  return {
    actions: {
      appendOutput: (output: any) =>
        dispatch(
          actions.appendOutput({
            id: props.id,
            contentRef: props.contentRef,
            output
          })
        ),
      clearOutput: () =>
        dispatch(
          actions.clearOutputs({
            id: props.id,
            contentRef: props.contentRef
          })
        ),
      updateCellStatus: (status: string) =>
        dispatch(
          actions.updateCellStatus({
            id: props.id,
            contentRef: props.contentRef,
            status
          })
        ),
      promptImputRequest: (prompt: string, password: boolean) =>
        dispatch(
          actions.promptInputRequest({
            id: props.id,
            contentRef: props.contentRef,
            prompt,
            password
          })
        )
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Manager);
