import type { Action } from "redux";

// 리덕스 액션 구현
export type SetDataAction = Action<"setData"> & {
    haruMarket_productCategory_index: Number;
    harumarket_product_index: Number;
    harumarket_product_name: String;
};
export type Actions = SetDataAction;