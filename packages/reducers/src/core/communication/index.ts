import { combineReducers } from "redux-immutable";

import { makeCommunicationRecord } from "@nteract/types";

import { contents } from "./contents";
import { kernels } from "./kernels";
import { kernelspecs } from "./kernelspecs";

export const communication = combineReducers(
  {
    contents,
    kernels,
    kernelspecs
  },
  makeCommunicationRecord as any
);
