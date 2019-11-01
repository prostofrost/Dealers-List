export function vehiclesWithDealer(state = [], action) {
  switch (action.type) {
    case 'VEHICLES_FETCH_DATA_SUCCESS':
      return action.vehiclesWithDealer;
    default:
      return state;
  }
}
