import { commListenEpic } from "./jupyter/generic/comm";
import {
  autoSaveCurrentContentEpic,
  fetchContentEpic,
  saveContentEpic,
  updateContentEpic,
  closeNotebookEpic
} from "./jupyter/remote/contents";
import {
  executeAllCellsEpic,
  executeCellEpic,
  sendInputReplyEpic,
  updateDisplayEpic
} from "./jupyter/generic/execute";
import {
  publishToBookstore,
  publishToBookstoreAfterSave
} from "./jupyter/remote/bookstore";
import {
  acquireKernelInfoEpic,
  watchExecutionStateEpic
} from "./jupyter/generic/kernel";
import { restartKernelEpic } from "./jupyter/local/kernel";
import { fetchKernelspecsEpic } from "./jupyter/remote/kernelspecs";
import {
  changeWebSocketKernelEpic,
  interruptKernelEpic,
  killKernelEpic,
  launchWebSocketKernelEpic,
  restartWebSocketKernelEpic,
  launchKernelWhenNotebookSetEpic
} from "./jupyter/remote/kernel";

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
  closeNotebookEpic
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
  closeNotebookEpic
};
