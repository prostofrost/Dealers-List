export function vehiclesFetchDataSuccess(vehicles){
  return {
    type: 'VEHICLES_FETCH_DATA_SUCCESS',
    vehicles,
    isFetching: false
  }
}

export function vehiclesFetchData(url){
  return (dispatch) => {
    fetch(url, {
      headers: {
        "X-CS-LazyDealer": 1
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
      .then(vehicles => dispatch(vehiclesFetchDataSuccess(vehicles)))
      .catch(error => alert(error.message));
  }
}