import type { Action } from "redux";
import type { DataStore } from "./dataStore";

// 리덕스 액션 구현
export type SetDataAction = Action<"setData"> & {
  haruMarket_productCategory_index: Number;
  harumarket_product_index: Number;
  harumarket_product_name: String;
};
export type Actions = SetDataAction;

const initialAppState = {
  haruMarket_productCategory_index: 0,
  harumarket_product_index: 0,
  harumarket_product_name: ""
};
export const rootReducer = (
  state: DataStore = initialAppState,
  action: Actions
) => {
  switch (action.type) {
    case "setData": {
      return { ...state, haruMarket_productCategory_index: action.haruMarket_productCategory_index };
    }
  }
  return state;
};
