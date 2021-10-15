const authState = JSON.parse(localStorage.getItem('store') ?? '{}')?.auth ?? {
  user: null,
  token: null
}

const AuthReducer = (state = authState, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return action.payload
    case "UPDATE_AUTH":
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}
export default AuthReducer