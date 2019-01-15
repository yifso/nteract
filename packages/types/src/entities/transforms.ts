/**
 * @module types
 */
import * as Immutable from "immutable";

export interface TransformsRecordProps {
  transforms: Immutable.List<React.Component>;
  byId: Immutable.Map<string, React.Component>;
}

export type TransformsRecord = Immutable.RecordOf<TransformsRecordProps>;

export const makeTransformsRecord = Immutable.Record<TransformsRecord>({
  transforms: Immutable.List<React.Component>(),
  byId: Immutable.Map<string, React.Component>()
});
