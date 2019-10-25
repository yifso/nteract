import * as React from "react";
import { RecordOf } from "immutable";
import { WidgetManager } from "./widget-manager";
import BackboneWrapper from "../renderer/backbone-wrapper";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { AppState, selectors, KernelNotStartedProps, LocalKernelProps, RemoteKernelProps } from "@nteract/core";
import { commOpenAction, commMessageAction } from "@nteract/actions";
import { WidgetModel } from "@jupyter-widgets/base";

interface Props {
  model: WidgetModel;
  model_id: string;
  model_lookup_by_id: (id: string) => any;
  kernel?: RecordOf<KernelNotStartedProps> | RecordOf<LocalKernelProps> | RecordOf<RemoteKernelProps> | null | undefined
}

interface State {
  manager: WidgetManager
}

/**
 * This component is is a wrapper component that initializes a
 * WidgetManager singleton and passes a model reference to the
 * BackboneModelWrapper. It's doing most of the heavy lifting with
 * respect to bridging the kernels comms that the WidgetManager provides,
 * our client-side state model, and the view.
 */
class Manager extends React.Component<Props, State> {
  widgetContainerRef = React.createRef<HTMLDivElement>();
  static manager: WidgetManager;

  constructor(props: Props) {
    super(props);
    this.state = {
      manager: new WidgetManager(this.props.kernel, this.props.model_lookup_by_id)
    };
  }

  getManager(){
    if(Manager.manager == undefined){
      Manager.manager = new WidgetManager(this.props.kernel, this.props.model_lookup_by_id)
    }else{
      Manager.manager.update(this.props.kernel, this.props.model_lookup_by_id);
    }
    return Manager.manager;
  }

  getManager2(){
    this.state.manager.update(this.props.kernel, this.props.model_lookup_by_id);
    return this.state.manager;
  }

  render() {
    return (
      <React.Fragment>
        <BackboneWrapper
          model={this.props.model.get("state").toJS()}
          manager={this.getManager()}
          model_id={this.props.model_id}
          widgetContainerRef={this.widgetContainerRef}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: AppState, props: Props) => {
  return {
    model_lookup_by_id: (model_id: string) => selectors.modelById(state, { commId: model_id }).toJS(),
    kernel: selectors.currentKernel(state)
  };
};
export default connect(mapStateToProps)(Manager);

