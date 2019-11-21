export const START_SESSION = "START_SESSION";
export interface StartSession {
  type: "START_SESSION";
  payload: {
    kernel: {
      id: string;
      name: string;
    };
    name: string;
    path: string;
    type: string;
  };
}
