import Action from './actions';

export const setFirstName = (payload) => {
  return {
    type: Action.SET_FIRST_NAME,
    payload: {
      newValue: payload
    },
  }
}
export const setLastName = (payload) => {
  return {
    type: Action.SET_LAST_NAME,
    payload: {
      newValue: payload
    },
  }
}
export const setNickName = (payload) => {
  return {
    type: Action.SET_NICKNAME,
    payload: {
      newValue: payload
    },
  }
}
export const setEmail = (payload) => {
  console.log("ACITON ", payload);
  return {
    type: Action.SET_EMAIL,
    payload: {
      newValue: payload
    },
  }
}
export const setPassword = (payload) => {
  return {
    type: Action.SET_PASSWORD,
    payload: {
      newValue: payload
    },
  }
}