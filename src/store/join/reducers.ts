import type { state } from "./state.ts";
import type { Actions } from "./action.ts";
import { AnyAction } from 'redux';

const initialAppState = {
  haruMarket_user_birthday: "",
  haruMarket_user_gender: "",
  haruMarket_user_name: "",
  haruMarket_user_phone: "",
  haruMarket_user_uniqueKey: "",
  haruMarket_join_certification: false
};

export const reducer = (state: state = initialAppState, action: AnyAction) => {
  switch (action.type) {
    case "join": {
      return { ...state, 
        haruMarket_user_birthday: action.haruMarket_user_birthday, 
        haruMarket_user_gender: action.haruMarket_user_gender,
        haruMarket_user_name: action.haruMarket_user_name,
        haruMarket_user_phone: action.haruMarket_user_phone,
        haruMarket_user_uniqueKey: action.haruMarket_user_uniqueKey,
        haruMarket_join_certification: action.haruMarket_join_certification
      };
    }
    case "ok": {
      return { ...state,
        haruMarket_join_certification: action.haruMarket_join_certification
      };
    }
  }
  return state;
};