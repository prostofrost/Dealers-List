import { combineReducers } from 'redux';
import { vehiclesWithDealer } from "./vehicles";
import { isFetching } from "./fetchingdata";

const rootReducer = combineReducers({
  isFetching,
  vehiclesWithDealer
});

export default rootReducer;