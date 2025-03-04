import type { state } from "./state.ts";
import type { Actions } from "./action.ts";
import { AnyAction } from 'redux';

const initialAppState = {
    haruMarket_productCategory_index: 0,
    harumarket_product_index: 0,
    harumarket_product_name: "",
    authorization:"",
};

export const reducer = (state: state = initialAppState, action: AnyAction) => {
  switch (action.type) {
    case "setCategory": {
      return { ...state, haruMarket_productCategory_index: action.haruMarket_productCategory_index };
    }
    case "setProduct": {
      return { ...state, harumarket_product_index: action.harumarket_product_index };
    }
    case "setAuthorization": {
      return { ...state, authorization: action.authorization };
    }
  }
  return state;
};