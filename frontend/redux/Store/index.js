import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import updateUserData from '@redux/Reducers/UserDataReducer';

const allReducer = combineReducers({
    userData: updateUserData,
});

const initialStates = {
    userData: null,
};

const middleware = [thunk];

export const store = createStore(allReducer, initialStates, compose(applyMiddleware(...middleware)));
