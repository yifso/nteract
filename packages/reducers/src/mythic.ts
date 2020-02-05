import { initializeSystem, sendNotification } from "@nteract/mythic-notifications";
import { makeMythicRecord, MythicRecord } from "@nteract/types";
import { Action } from "redux";

const allMyths = [
  initializeSystem,
  sendNotification,
];

export default function handleMythic(
  state: MythicRecord = makeMythicRecord(),
  action: Action,
): MythicRecord {
  const applicableMyths = allMyths.filter(myth => myth.appliesTo(action));

  if (applicableMyths.length === 0 || applicableMyths[0].reduce === undefined) {
    return state;
  }
  else {
    return state.set(
      applicableMyths[0].pkg,
      applicableMyths[0].reduce(state[applicableMyths[0].pkg] as any, action),
    );
  }
}
