export type PrimitiveImmutable = string | boolean | null;
export type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
export interface JSONObject { [key: string]: JSONType }
export interface JSONArray extends Array<JSONType> {}

export type ExecutionCount = number | null;

export type MimeBundle = JSONObject;

export type CellType = "markdown" | "code";
export type CellId = string;

// These are very unserious types, since Records are not quite typable
export interface ImmutableNotebook { [key: string]: any }
export interface ImmutableCodeCell { [key: string]: any }
export interface ImmutableMarkdownCell { [key: string]: any }
export interface ImmutableRawCell { [key: string]: any }
export type ImmutableCell = ImmutableCodeCell | ImmutableMarkdownCell;
export interface ImmutableOutput { [key: string]: any }
export type ImmutableOutputs = Array<ImmutableOutput>;

export interface ImmutableMimeBundle { [key: string]: any }

export type ImmutableCellOrder = Array<CellId>;
export interface ImmutableCellMap { [key: string]: any }
