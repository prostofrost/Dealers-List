export function vehiclesFetchDataSuccess(vehiclesWithDealer){
  return {
    type: 'VEHICLES_FETCH_DATA_SUCCESS',
    vehiclesWithDealer,
    isFetching: false
  }
}

export function dealerNameFetchData(vehicles){
  return (dispatch) => {
    vehicles.forEach( function(vehicle){
      let dealerName = '';

      fetch(`https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=${vehicle.dealer}`)
      .then (response => response.json())
      .then((data) => dealerName = data[0].name)
      .then(() => vehicle.dealerNameFromDealer = dealerName)
      .catch(console.log)
    })
    dispatch(vehiclesFetchDataSuccess(vehicles));
  }
}

export function vehiclesFetchData(url){
  return (dispatch) => {
    fetch(url, {
      headers: {
        "X-CS-Dealer-Id-Only": 1
      },
    })
      .then(response => {
        if(!response.ok) {
          throw new Error(response.statusText);
        }
        return response;
      })
      .then(response => {
        console.log(response.status); //=> number 100–599
        console.log(response.statusText); //=> String
        console.log(response.headers); //=> Headers
        console.log(response.url); //=> String

        return response;
      })
      .then (response => response.json())
      .then(vehicles => dispatch(dealerNameFetchData(vehicles)))
      // .then(vehicles => dispatch(vehiclesFetchDataSuccess(vehicles)))
      .catch(error => alert(error.message));
  }
}