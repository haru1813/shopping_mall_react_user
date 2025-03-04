import { combineReducers } from "redux";
import * as dataStore from "./dataStore/index.ts"
import * as join from "./join/index.ts"
import * as buy from "./buy/index.ts"

export const rootReducer = combineReducers({
  dataStore: dataStore.reducer,
  join: join.reducer,
  buy: buy.reducer,
});