/**
 * @module types
 */
import Immutable from "immutable";

export interface TransformsRecordProps {
  transforms: Immutable.List<any>;
  byId: Immutable.Map<string, any>;
}

export type TransformsRecord = Immutable.RecordOf<TransformsRecordProps>;

export const makeTransformsRecord = Immutable.Record<TransformsRecordProps>({
  transforms: Immutable.List<any>(),
  byId: Immutable.Map<string, any>()
});
