/**
 * @module types
 */
import Immutable from "immutable";

export interface TransformsRecordProps {
  handlers: Immutable.List<any>;
  displayOrder: Immutable.List<string>;
  byId: Immutable.Map<string, any>;
}

export type TransformsRecord = Immutable.RecordOf<TransformsRecordProps>;

export const makeTransformsRecord = Immutable.Record<TransformsRecordProps>({
  handlers: Immutable.List<any>(),
  displayOrder: Immutable.List<string>(),
  byId: Immutable.Map<string, any>()
});
