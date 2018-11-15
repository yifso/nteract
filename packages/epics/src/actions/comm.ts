import {
    COMM_OPEN,
    COMM_MESSAGE
} from "../types/actions/kernel";

/**
 * Action creator for comm_open messages
 * @param  {jmp.Message} a comm_open message
 * @return {Object}      COMM_OPEN action
 */
export function commOpenAction(message: any) {
    // invariant: expects a comm_open message
    return {
      type: COMM_OPEN,
      data: message.content.data,
      metadata: message.content.metadata,
      comm_id: message.content.comm_id,
      target_name: message.content.target_name,
      target_module: message.content.target_module,
      // Pass through the buffers
      buffers: message.blob || message.buffers
      // NOTE: Naming inconsistent between jupyter notebook and jmp
      //       see https://github.com/n-riesco/jmp/issues/14
      //       We just expect either one
    };
  }

  /**
 * Action creator for comm_msg messages
 * @param  {jmp.Message} a comm_msg
 * @return {Object}      COMM_MESSAGE action
 */
export function commMessageAction(message: any) {
    return {
      type: COMM_MESSAGE,
      comm_id: message.content.comm_id,
      data: message.content.data,
      // Pass through the buffers
      buffers: message.blob || message.buffers
      // NOTE: Naming inconsistent between jupyter notebook and jmp
      //       see https://github.com/n-riesco/jmp/issues/14
      //       We just expect either one
    };
  }