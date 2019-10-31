const initialState = {
  isFetching: true
}

export function isFetching(state = initialState, action) {
  switch (action.type) {
    case 'VEHICLES_FETCH_DATA_SUCCESS':
      return action.isFetching;
    default:
      return state;
  }
}
