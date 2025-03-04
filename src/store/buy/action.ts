import type { Action } from "redux";

// 리덕스 액션 구현
export type SetDataAction = Action<"setBuy"> & {
    harumarket_userBasket_indexs: (number | string | object)[];
    harumarket_userBuy: (number | string | object)[];
    haruMarket_buy_ready: boolean;
};
export type Actions = SetDataAction;