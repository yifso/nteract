import * as React from "react";
import { 
  Button, 
  Classes, 
  EditableText,
  Icon, 
  Intent, 
  Label, 
  Overlay 
} from "@blueprintjs/core";

export type EditableTitleOverlayProps = {
  defaultValue: string;
  isOpen: boolean;
  onCancel: () => void;
  onSave: (value) => void;
};

export class EditableTitleOverlay extends React.Component<EditableTitleOverlayProps> {
  constructor(props) {
    super(props);

    this.state = {
      value: props.defaultValue || ""
    };
  }

  handleClose = () => this.props.onCancel();
  handleSave = (value: string) => this.setState({ value }, () => {
    this.props.onSave(this.state.value);
  });

  render() {
    return (
      <Overlay 
        autoFocus={true} 
        canEscapeKeyClose={true}
        canOutsideClickClose={true}
        usePortal={false}
        isOpen={this.props.isOpen}
        onClose={this.handleClose}
      >
        <div className="bp3-dialog-container">
          <div className="bp3-dialog">
            <div className="bp3-dialog-header">
              <h4 className="bp3-heading">Rename Notebook</h4>
              <Icon 
                icon="small-cross" 
                style={{ cursor: "pointer" }}
                onClick={this.handleClose}
              />
            </div>
            <div className="bp3-dialog-body">
              <Label>Enter a new notebook name:</Label>
              <EditableText
                className={Classes.INPUT}
                disabled={false}
                defaultValue={this.props.defaultValue}
                minWidth={500}
                intent={"none"}
                selectAllOnFocus={true}
                confirmOnEnterKey={true}
                onConfirm={this.handleSave}
              />
            </div>
            <div className="bp3-dialog-footer">
              <div className="bp3-dialog-footer-actions">
                <Button onClick={this.handleClose}>Cancel</Button>
                <Button intent={Intent.PRIMARY} onClick={this.handleSave}>
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Overlay>
    );
  }
}