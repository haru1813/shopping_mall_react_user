import * as dataStore from "./dataStore"
import * as join from "./join"
import * as buy from "./buy"

export type AppState = {
    dataStore: dataStore.state;
    join: join.state;
    buy: buy.state;
};
  