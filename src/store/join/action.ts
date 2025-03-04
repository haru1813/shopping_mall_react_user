import type { Action } from "redux";

// 리덕스 액션 구현
export type SetDataAction = Action<"join"> & {
  haruMarket_user_birthday: String;
  haruMarket_user_gender: String;
  haruMarket_user_name: String;
  haruMarket_user_phone: String;
  haruMarket_user_uniqueKey: String;
  haruMarket_join_certification: boolean;
};
export type Actions = SetDataAction;