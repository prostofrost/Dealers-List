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
        dealersName: [
          ...action.data.dealersName
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