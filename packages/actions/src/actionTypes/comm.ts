// tslint:disable:max-line-length
import * as actionTypes from "./index";

export const REGISTER_COMM_TARGET = "REGISTER_COMM_TARGET";
export const COMM_OPEN = "COMM_OPEN";
export const COMM_MESSAGE = "COMM_MESSAGE";

export interface RegisterCommTargetAction  { type: "REGISTER_COMM_TARGET"; name: string; handler: string; }
export interface CommOpenAction  { type: "COMM_OPEN"; target_name: string; target_module: string; data: any; comm_id: string; }
export interface CommMessageAction  { type: "COMM_MESSAGE"; data: any; comm_id: string; }

/**
 * Action creator for comm_open messages
 * @param  {jmp.Message} a comm_open message
 * @return {Object}      COMM_OPEN action
 */
export function commOpenAction(message: any) {
  // invariant: expects a comm_open message
  return {
    type: actionTypes.COMM_OPEN,
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
    type: actionTypes.COMM_MESSAGE,
    comm_id: message.content.comm_id,
    data: message.content.data,
    // Pass through the buffers
    buffers: message.blob || message.buffers
    // NOTE: Naming inconsistent between jupyter notebook and jmp
    //       see https://github.com/n-riesco/jmp/issues/14
    //       We just expect either one
  };
}