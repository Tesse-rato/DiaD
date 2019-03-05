import { combineReducers } from "redux";
import Action from '../actions/actions';

const INITIAL_STATE_ACCOUNT = {
  name: {
    first: '',
    last: '',
    nickname: '',
  },
  email: '',
  password: '',
  bio: '',
}


function account(state = INITIAL_STATE_ACCOUNT, action) {
  switch (action.type) {
    case Action.SET_FIRST_NAME: {
      const name = state.name;
      name.first = action.payload.newValue;
      return { ...state, name }
    }
    case Action.SET_LAST_NAME: {
      const name = state.name;
      name.last = action.payload.newValue;
      return { ...state, name }
    }
    case Action.SET_NICKNAME: {
      const name = state.name;
      name.nickname = action.payload.newValue;
      return { ...state, name }
    }
    case Action.SET_EMAIL.toString(): {
      return { ...state, email: action.payload.newValue }
    }
    case Action.SET_PASSWORD: {
      return { ...state, password: action.payload.newValue }
    }
    case Action.SET_BIO: {
      return { ...state, bio: action.payload.newValue }
    }
    default: {
      return state
    }
  }
}

const Reducers = combineReducers({
  account,
});

export default Reducers;