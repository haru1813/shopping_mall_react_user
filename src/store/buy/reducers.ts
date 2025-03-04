import type { state } from "./state.ts";
import type { Actions } from "./action.ts";
import { AnyAction } from 'redux';

const initialAppState = {
    harumarket_userBasket_indexs: [],
    harumarket_userBuy: [],
    haruMarket_buy_ready: false
};

export const reducer = (state: state = initialAppState, action: AnyAction) => {
  switch (action.type) {
    case "setBuy": {
      return { ...state, 
        harumarket_userBasket_indexs: action.harumarket_userBasket_indexs, 
        harumarket_userBuy: action.harumarket_userBuy,
        haruMarket_buy_ready: action.haruMarket_buy_ready,
      };
    }
  }
  return state;
};