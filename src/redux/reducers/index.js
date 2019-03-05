import { combineReducers } from "redux";
import Action from '../actions/types';

const INITIAL_STATE_ACCOUNT = {
  token: '',
  user: {
    _id: '',
    createdAt: '',
    posts: [],
    name: {
      first: '',
      last: '',
      nickname: '',
    },
    email: '',
    password: '',
    bio: '',
    photo: {
      originalPhoto: '',
      thumbnail: '',
    },
  },
};


function account(state = INITIAL_STATE_ACCOUNT, action) {
  switch (action.type) {
    case Action.SET_USER: {
      return { ...state, ...action.payload.newValue }
    }
    case Action.SET_FIRST_NAME: {
      const user = state.user;
      user.name.first = action.payload.newValue;
      return { ...state, user }
    }
    case Action.SET_LAST_NAME: {
      const user = state.user;
      user.name.last = action.payload.newValue;
      return { ...state, user }
    }
    case Action.SET_NICKNAME: {
      const user = state.user;
      user.name.nickname = action.payload.newValue;
      return { ...state, user }
    }
    case Action.SET_EMAIL: {
      return { ...state, user: { ...state.user, email: action.payload.newValue } }
    }
    case Action.SET_PASSWORD: {
      return { ...state, user: { ...state.user, password: action.payload.newValue } }
    }
    case Action.SET_BIO: {
      return { ...state, user: { ...state.user, bio: action.payload.newValue } }
    }
    case Action.SET_TOKEN: {
      return { ...state, token: action.payload.newValue }
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