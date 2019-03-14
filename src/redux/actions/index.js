import Action from './types';

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
export const setNickname = (payload) => {
  return {
    type: Action.SET_NICKNAME,
    payload: {
      newValue: payload
    },
  }
}
export const setEmail = (payload) => {
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
export const setToken = (payload) => {
  return {
    type: Action.SET_TOKEN,
    payload: {
      newValue: payload
    },
  }
}
export const setUser = (payload) => {
  return {
    type: Action.SET_USER,
    payload: {
      newValue: payload
    },
  }
}
export const setProfileId = (payload) => {
  return {
    type: Action.SET_PROFILE_ID,
    payload: {
      newValue: payload
    },
  }
}