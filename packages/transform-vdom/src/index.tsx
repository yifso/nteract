import * as React from "react";
import { cloneDeep } from "lodash";

import { objectToReactElement, VDOMEl, Attributes } from "./object-to-react";
import { serializeEvent, SerializedEvent } from "./event-to-object";

interface Props {
  mediaType: "application/vdom.v1+json";
  data: VDOMEl;
  onVDOMEvent: (targetName: string, event: SerializedEvent<any>) => void;
}

// Provide object-to-react as an available helper on the library
export { objectToReactElement, serializeEvent, VDOMEl, Attributes, SerializedEvent };

const mediaType = "application/vdom.v1+json";

export default class VDOM extends React.PureComponent<Props> {
  static MIMETYPE = mediaType;

  static defaultProps = {
    mediaType
  };

  render(): React.ReactElement<any> {
    try {
      const obj = this.mergeEventHandlers(cloneDeep(this.props.data));
      return objectToReactElement(obj);
    } catch (err) {
      return (
        <React.Fragment>
          <pre
            style={{
              backgroundColor: "ghostwhite",
              color: "black",
              fontWeight: 600,
              display: "block",
              padding: "10px",
              marginBottom: "20px"
            }}
          >
            There was an error rendering VDOM data from the kernel or notebook
          </pre>
          <code>{err.toString()}</code>
        </React.Fragment>
      );
    }
  }

  // Merge event handlers (if any) into attributes as callback functions that
  // serialize the event object and call `this.props.onVDOMEvent` with the
  // comm target name and serialized event so that the Jupyter client can
  // send a comm message for the kernel to handle the event.
  mergeEventHandlers = (obj: VDOMEl): VDOMEl => {
    if (obj.eventHandlers) {
      for (let eventType in obj.eventHandlers) {
        const targetName = obj.eventHandlers[eventType];
        obj.attributes[eventType] = (event: React.SyntheticEvent<any>) => {
          const serializedEvent = serializeEvent(event);
          this.props.onVDOMEvent(targetName, serializedEvent);
        };
      }
    }
    return obj;
  };
}
