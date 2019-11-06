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
          isFetching: action.data.isFetching,
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
        isFetching: false,
      };
    default:
      return state;
  }
}