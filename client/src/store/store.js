import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import drugReducer from './reducers/drug.reducer';

const store = createStore(drugReducer, applyMiddleware(thunk));

export default store;