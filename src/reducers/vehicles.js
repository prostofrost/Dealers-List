export function vehicles(state = [], action) {
  switch (action.type) {
    case 'VEHICLES_FETCH_DATA_SUCCESS':
      return action.vehicles;
    default:
      return state;
  }
}
