import { createStore, combineReducers } from "redux";
import rootReducer from "./reducers/root.reducer";

const store = createStore(combineReducers(rootReducer));

export default store;
