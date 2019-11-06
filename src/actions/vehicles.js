const baseUrl = "https://jlrc.dev.perx.ru/carstock/api/v1/";
const PAGE_SIZE = 25;
const TOTAL_VEHICLES = 2295;
const CURRENT_PAGE = 1;

function serializeQuery(query) {
  return Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');
}

// REQUEST LOADING VEHICLES
const VEHICLE_FETCHING_FALSE = 'VEHICLE_FETCHING_FALSE';
const endFetching = () => {
  return {
    type: VEHICLE_FETCHING_FALSE,
  };
};

// REQUEST LOADING VEHICLES
const VEHICLE_INDEX_REQUEST = 'VEHICLE_INDEX_REQUEST';
const fetchIndexRequest = () => {
  return {
    type: VEHICLE_INDEX_REQUEST,
    data: {
      vehicles: [],
      pagination: {
        currentPage: CURRENT_PAGE,
        pageSize: PAGE_SIZE,
        totalVehicles: TOTAL_VEHICLES,
      },
    }
  };
};

// VEHICLES RETREIVED WITH SUCCESS
const VEHICLE_INDEX_SUCCESS = 'VEHICLE_INDEX_SUCCESS';
const fetchIndexSuccess = payload => {
  return {
    type: VEHICLE_INDEX_SUCCESS,
    data: payload,
  };
};

// FAILED TO RETREIVE VEHICLES
const VEHICLE_INDEX_FAILURE = 'VEHICLE_INDEX_FAILURE';
const fetchIndexFailure = () => {
  return {
    type: VEHICLE_INDEX_FAILURE,
  };
};

export function dealerNameFetchData(vehicles, pageNumber){
  return (dispatch) => {
    // const dealersId = vehicles.map((vehicle) => {
    //   return (vehicle.dealer);
    // });

    // const dealersIdString = dealersId.join(',');

    // fetch(`${baseUrl}/dealers/?id__in=${dealersIdString}`)
    // .then (response => response.json())
    // .then((data) => {
    //   const dealersName = data.map((dealer) => {
    //     return (dealer.name);
    //   });
    //   console.log(dealersName);
    // })
    // .catch(console.log)

    vehicles.forEach(function(vehicle){
      fetch(`${baseUrl}/dealers/?id__in=${vehicle.dealer}`)
      .then (response => response.json())
      .then((data) => {
        if(data.length === 0) {
          vehicle.dealerNameFromDealer = 'отсутствует'
        } else {
          vehicle.dealerNameFromDealer = data[0].name;
        }
      })
      .catch(console.log)
    })

    dispatch(
      fetchIndexSuccess({
        isFetching: false,
        vehicles: vehicles,
        pagination: {
          currentPage: pageNumber,
          pageSize: PAGE_SIZE,
          totalVehicles: TOTAL_VEHICLES,
        },
      })
    );
    dispatch(endFetching());
  }
}

export function vehiclesFetchData(pageNumber) {
  return (dispatch, getState) => {
    dispatch(fetchIndexRequest());
    return fetch(
      `${baseUrl}/vehicles/?${serializeQuery({
        page: pageNumber - 1,
        per_page: PAGE_SIZE,
        state: 'active',
        hidden: 'false',
        group: 'new'
      })}`, {
        headers: {
          "X-CS-Dealer-Id-Only": 1
        },
      })
      .then (response => response.json())
      .then(vehicles => dispatch(dealerNameFetchData(vehicles, pageNumber)))
      .catch(error => dispatch(fetchIndexFailure(error)));
  };
}