export type PrimitiveImmutable = string | boolean | null;
export type JSONType = PrimitiveImmutable | JSONObject | JSONArray;
export type JSONObject = { [key: string]: JSONType };
export interface JSONArray extends Array<JSONType> {}

export type ExecutionCount = number | null;

export type MimeBundle = JSONObject;

export type CellType = "markdown" | "code";
export type CellId = string;

// These are very unserious types, since Records are not quite typable
export type ImmutableNotebook = JSONObject;
export type ImmutableCodeCell = JSONObject;
export type ImmutableMarkdownCell = JSONObject;
export type ImmutableRawCell = JSONObject;
export type ImmutableCell = ImmutableCodeCell | ImmutableMarkdownCell;
export type ImmutableOutput = JSONObject;
export type ImmutableOutputs = Array<ImmutableOutput>;

export type ImmutableMimeBundle = JSONObject;

export type ImmutableCellOrder = Array<CellId>;
export type ImmutableCellMap = JSONObject;
