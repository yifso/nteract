import { CellId } from "@nteract/commutable";
import { ContentRef, HostRef, KernelRef, KernelspecsRef } from "@nteract/types";

export interface Action<T extends string, P = undefined> {
  type: T;
  payload: P;
}

export interface ErrorAction<T extends string, P extends {} | Error = Error>
  extends Action<T, P extends Error ? P : P & { error: Error }> {
  error: true;
}

export const makeActionFunction =
  <T extends Action<string, any>>
  (type: T["type"]) => (payload: T["payload"]) =>
    ({ type, payload });

export const makeErrorActionFunction =
  <T extends ErrorAction<string, any>>
  (type: T["type"]) => (payload: T["payload"]) =>
    ({ type, payload, error: true });

export interface HasKernel { kernelRef: KernelRef }
export interface MaybeHasKernel { kernelRef?: KernelRef }
export interface HasContent { contentRef: ContentRef }
export interface MaybeHasContent { contentRef?: ContentRef }
export interface HasCell extends HasContent { id: CellId }
export interface MaybeHasCell extends HasContent { id?: CellId }
export interface HasFilepath { filepath: string; }
export interface HasFilepathChange extends HasFilepath { prevFilePath: string }
export interface HasKernelspecs { kernelspecsRef: KernelspecsRef }
export interface HasHost { hostRef: HostRef }
