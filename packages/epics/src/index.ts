/**
 * Imports for epics that are agnostic across both local and
 * remote Jupyter hosts.
 */
import { commListenEpic } from "./jupyter/generic/comm";
import {
  executeAllCellsEpic,
  executeCellEpic,
  sendInputReplyEpic,
  updateDisplayEpic
} from "./jupyter/generic/execute";

import {
  acquireKernelInfoEpic,
  watchExecutionStateEpic
} from "./jupyter/generic/kernel";

/**
 * Imports for epics that are specific to local Jupyter hosts.
 */
import { restartKernelEpic } from "./jupyter/local/kernel";

/**
 * Imports for epics that are specific to remote Jupyter hosts.
 */
import {
  publishToBookstore,
  publishToBookstoreAfterSave
} from "./jupyter/remote/bookstore";
import {
  autoSaveCurrentContentEpic,
  fetchContentEpic,
  saveContentEpic,
  updateContentEpic,
  closeNotebookEpic
} from "./jupyter/remote/contents";
import {
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  launchWebSocketKernelEpic,
  restartWebSocketKernelEpic,
  launchKernelWhenNotebookSetEpic,
  startSessionEpic
} from "./jupyter/remote/kernel";
import { fetchKernelspecsEpic } from "./jupyter/remote/kernelspecs";

// Because `@nteract/core` ends up being a commonjs import, we can't currently
// rely on `import { epics } from ""@nteract/core"`
// as it would collide the array with the named exports
const allEpics = [
  executeCellEpic,
  updateDisplayEpic,
  executeAllCellsEpic,
  commListenEpic,
  launchWebSocketKernelEpic,
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  launchKernelWhenNotebookSetEpic,
  restartKernelEpic,
  fetchKernelspecsEpic,
  fetchContentEpic,
  updateContentEpic,
  saveContentEpic,
  autoSaveCurrentContentEpic,
  publishToBookstore,
  publishToBookstoreAfterSave,
  restartWebSocketKernelEpic,
  sendInputReplyEpic,
  closeNotebookEpic,
  startSessionEpic
];

export {
  allEpics,
  executeCellEpic,
  updateDisplayEpic,
  executeAllCellsEpic,
  commListenEpic,
  launchWebSocketKernelEpic,
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  acquireKernelInfoEpic,
  watchExecutionStateEpic,
  launchKernelWhenNotebookSetEpic,
  restartKernelEpic,
  fetchKernelspecsEpic,
  fetchContentEpic,
  updateContentEpic,
  saveContentEpic,
  autoSaveCurrentContentEpic,
  publishToBookstore,
  publishToBookstoreAfterSave,
  restartWebSocketKernelEpic,
  sendInputReplyEpic,
  closeNotebookEpic,
  startSessionEpic
};
