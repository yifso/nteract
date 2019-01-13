import { combineReducers } from "redux-immutable";

import {
  EntitiesRecord,
  EntitiesRecordProps,
  makeEntitiesRecord
} from "@nteract/types";

import { Action } from "redux";

import { contents } from "./contents";
import { hosts } from "./hosts";
import { kernels } from "./kernels";
import { kernelspecs } from "./kernelspecs";
import { modals } from "./modals";

export const entities = combineReducers(
  {
    contents,
    hosts,
    kernels,
    kernelspecs,
    modals
  },
  makeEntitiesRecord as any
);
