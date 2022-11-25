import {combineReducers} from "redux";
import Settings from "./Settings";
import Common from "./Common";
import {connectRouter} from 'connected-react-router'

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  settings: Settings,
  common: Common,
});

export default createRootReducer;
