import { OnDiskOutput } from "@nteract/commutable";

export const REDIRECT_OUTPUT_TO_MODEL = "REDIRECT_OUTPUT_TO_MODEL";
export interface RedirectOutputToModelAction {
  type: "REDIRECT_OUTPUT_TO_MODEL";
  payload: {
    modelId: string;
    output: OnDiskOutput;
    contentRef: string;
  };
}

export const CLEAR_OUTPUT_IN_MODEL = "CLEAR_OUTPUT_IN_MODEL";
export interface ClearOutputInModelAction {
  type: "CLEAR_OUTPUT_IN_MODEL";
  payload: {
    modelId: string;
  };
}
