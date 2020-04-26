import * as React from "react";
import { Mood } from "../types";

type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

type Action =
  | FluxStandardAction<"createdMoodIds/set", string[]>
  | FluxStandardAction<"moods/add", Mood>
  | FluxStandardAction<"moods/set", Mood[]>
  | FluxStandardAction<"syncFromServer/error">
  | FluxStandardAction<"syncFromServer/start">
  | FluxStandardAction<"syncFromServer/success">
  | FluxStandardAction<"syncToServer/error">
  | FluxStandardAction<"syncToServer/start">
  | FluxStandardAction<"syncToServer/success">
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface State {
  createdMoodsIds: string[];
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  moods: Mood[];
  syncFromServerError: boolean;
  syncToServerError: boolean;
  userEmail: string | undefined;
}

const initialState: State = {
  createdMoodsIds: [],
  isSyncingFromServer: false,
  isSyncingToServer: false,
  moods: [],
  syncFromServerError: false,
  syncToServerError: false,
  userEmail: undefined,
};

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {}
);
export const StateContext = React.createContext<State>(initialState);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "createdMoodIds/set":
      return { ...state, createdMoodsIds: action.payload };
    case "moods/add":
      return {
        ...state,
        createdMoodsIds: [...state.createdMoodsIds, action.payload.createdAt],
        moods: [...state.moods, action.payload],
      };
    case "moods/set":
      return { ...state, moods: action.payload };
    case "syncFromServer/error":
      return {
        ...state,
        isSyncingFromServer: false,
        syncFromServerError: true,
      };
    case "syncFromServer/start":
      return {
        ...state,
        isSyncingFromServer: true,
        syncFromServerError: false,
      };
    case "syncFromServer/success":
      return {
        ...state,
        isSyncingFromServer: false,
        syncFromServerError: false,
      };
    case "syncToServer/error":
      return { ...state, isSyncingToServer: false, syncToServerError: true };
    case "syncToServer/start":
      return { ...state, isSyncingToServer: true, syncToServerError: false };
    case "syncToServer/success":
      return {
        ...state,
        createdMoodsIds: [],
        isSyncingToServer: false,
        syncToServerError: false,
      };
    case "user/clearEmail":
      return { ...state, userEmail: undefined };
    case "user/setEmail":
      return { ...state, userEmail: action.payload };
  }
};

export default function AppState({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}