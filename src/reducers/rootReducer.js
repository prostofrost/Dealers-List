import { combineReducers } from 'redux';
import { vehicles } from "./vehicles";
import { isFetching } from "./fetchingdata";

const rootReducer = combineReducers({
  isFetching,
  vehicles
});

export default rootReducer;