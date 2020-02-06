import { Action } from "redux";
import { makeEpics } from "./epics";
import { makeCreateConnectedComponent } from "./react";
import { makeReducer } from "./reducer";
import { Myth, MythDefinition, MythicAction, Myths } from "./types";

export const makeCreateMyth =
  <PKG extends string, STATE>(pkg: PKG, myths: Myths<PKG, STATE>) =>
    <NAME extends string>(name: NAME) =>
      <PROPS>(
        definition: MythDefinition<STATE, PROPS>,
      ): Myth<PKG, NAME, PROPS, STATE> => {
        type OurMyth = Myth<PKG, NAME, PROPS, STATE>;

        if (myths.hasOwnProperty(name)) {
          throw new Error(`Package "${pkg}" cannot have two myths with the same name ("${name}")`);
        }

        const mythWIP: Partial<OurMyth> = {
          pkg,
          name,
          type: `${pkg}/${name}`,

          // for use in typeof expressions:
          props: undefined as unknown as PROPS,
          state: undefined as unknown as STATE,
          action: undefined as unknown as MythicAction<PKG, NAME, PROPS>,
        };

        mythWIP.create =
          (payload: PROPS) => ({ type: mythWIP.type!, payload });

        mythWIP.epics =
          makeEpics(mythWIP.create, definition.epics ?? []);

        mythWIP.appliesTo =
          (action: Action) => action.type === mythWIP.type;

        mythWIP.reduce =
          makeReducer(definition.reduce, mythWIP.appliesTo);

        mythWIP.createConnectedComponent =
          makeCreateConnectedComponent(mythWIP as OurMyth);

        const myth: OurMyth = mythWIP as OurMyth;
        myths[name] = myth;
        return myth;
      };
