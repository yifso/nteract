import fileUrl from "file-url";
import { of } from "rxjs";
import { windowing } from "../package";

export const openExternalUrl =
  windowing.createMyth("openExternalUrl")<string>({
    thenDispatch: [
      (action, state) =>
        state.backend.openExternalUrl(action.payload),
    ],
  });


export const openExternalFile =
  windowing.createMyth("openExternalFile")<string>({
    thenDispatch: [
      (action, _state) =>
        of(openExternalUrl.create(fileUrl(action.payload))),
    ],
  });
