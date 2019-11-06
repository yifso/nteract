import { WidgetModel } from "@jupyter-widgets/base";
import {
  AppState,
  KernelNotStartedProps,
  LocalKernelProps,
  RemoteKernelProps,
  selectors
} from "@nteract/core";
import { RecordOf } from "immutable";
import * as React from "react";
import { connect } from "react-redux";
import BackboneWrapper from "../renderer/backbone-wrapper";
import WidgetManager from "./widget-manager";

interface ConnectedProps {
  modelById: (id: string) => any;
  outputsByModelId: any;
  kernel?:
    | RecordOf<KernelNotStartedProps>
    | RecordOf<LocalKernelProps>
    | RecordOf<RemoteKernelProps>
    | null;
}
interface OwnProps {
  model: WidgetModel;
  model_id: string;
  contentRef: string;
}

type Props = ConnectedProps & OwnProps;

/**
 * This component is is a wrapper component that initializes a
 * WidgetManager singleton and passes a model reference to the
 * BackboneModelWrapper. It's doing most of the heavy lifting with
 * respect to bridging the kernels comms that the WidgetManager provides,
 * our client-side state model, and the view.
 */
class Manager extends React.Component<Props> {
  static manager: WidgetManager;
  widgetContainerRef = React.createRef<HTMLDivElement>();

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
        this.props.outputsByModelId
      );
    } else {
      Manager.manager.update(
        this.props.kernel,
        this.props.modelById,
        this.props.outputsByModelId
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
    outputsByModelId: (modelId: string) =>
      selectors.notebook.outputsByModelId(
        selectors.model(state, { contentRef: props.contentRef }),
        { modelId }
      ),
    kernel: selectors.currentKernel(state)
  };
};
export default connect(mapStateToProps)(Manager);
