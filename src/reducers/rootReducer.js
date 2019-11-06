export default function rootReducer(state = [], action) {
  switch (action.type) {
    case 'VEHICLE_INDEX_REQUEST':
        return {
          vehicles: [
            ...action.data.vehicles
          ],
          pagination: {
            ...state.pagination,
            ...action.data.pagination
          },
          isFetching: true,
        };
    case 'VEHICLE_INDEX_SUCCESS':
      return {
        vehicles: [
          ...action.data.vehicles
        ],
        pagination: {
          ...state.pagination,
          ...action.data.pagination
        },
        isFetching: true,
      };
      case 'VEHICLE_FETCHING_FALSE':
          return {
            ...state,
            isFetching: false,
          };
    default:
      return state;
  }
}