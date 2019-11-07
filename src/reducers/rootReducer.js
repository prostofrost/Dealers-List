export default function rootReducer(state = [], action) {
  switch (action.type) {
    case 'VEHICLE_INDEX_REQUEST':
        return {
          isFetching: true,
        };
    case 'VEHICLE_INDEX_SUCCESS':
      return {
        vehicles: [
          ...action.data.vehicles
        ],
        dealersList: [
          ...action.data.dealersList
        ],
        pagination: {
          ...state.pagination,
          ...action.data.pagination
        },
      };
    default:
      return state;
  }
}