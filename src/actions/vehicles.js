const baseUrl = "https://jlrc.dev.perx.ru/carstock/api/v1/";
const PAGE_SIZE = 25;
const TOTAL_VEHICLES = 2295;
const CURRENT_PAGE = 1;

function serializeQuery(query) {
  return Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&');
}

function diff(a1, a2) {
  return a2.filter(i=>!a1.includes(i))
}

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

export function dealersNameFetchData(data, pageNumber, dealersList) {
  return (dispatch) => {
    const vehicles = data.map(vehicle => {
      return (
        {
          key: vehicle.vin,
          vin: vehicle.vin,
          dealerId: vehicle.dealer,
        }
      );
    });

    //Сравниваем список вновь полученных ID дилеров для авто с уже имеющимся массивом списка диллеров
    const dealersId = data.map(vehicle => {
      return (vehicle.dealer);
    });

    const dealersListId = dealersList.map(dealer => {
      return (dealer.dealerId);
    });

    const diffArrays = diff(dealersListId, dealersId);

    //Если это не первая страница или совпадений нет, то получаем имена дилеров из уже имеющегоса списка дилеров
    if(diffArrays.length === 0 && dealersList.length !== 0){
      const dealersName = dealersList;
      //Находим в dealersName дилера по ID и записываем его название
      vehicles.forEach(vehicle => {
        let findName = dealersName.filter(dealer => dealer.dealerId === vehicle.dealerId);

        if(findName.length === 0) {
          vehicle.dealerNameFromDealer = 'отсутствует';
        } else {
          vehicle.dealerNameFromDealer = findName[0].dealerName;
        }
      })

      dispatch(
        fetchIndexSuccess({
          isFetching: false,
          vehicles: vehicles,
          dealersList: dealersList,
          pagination: {
            currentPage: pageNumber,
            pageSize: PAGE_SIZE,
            totalVehicles: TOTAL_VEHICLES,
          },
        })
      );
      //Если страница первая или есть дилеры о которых у нас ещё нет информации, отправляем запрос на сервер
    } else {
      const dealersIdList = () => {
        if(dealersList.length === 0) {
          const dealersIdString = dealersId;
          return dealersIdString;
        } else {
          const dealersIdString = diffArrays;
          return dealersIdString;
        }
      }
      const dealersIdString = dealersIdList().join(',');
      fetch(`${baseUrl}/dealers/?id__in=${dealersIdString}`)
        .then (response => response.json())
        .then(data => {
          const dealersName = data.map((dealer) => {
            return ({
              dealerId: dealer.id,
              dealerName: dealer.name
            });
          });

          //Существуют пустые запросы (например https://jlrc.dev.perx.ru/carstock/api/v1/dealers/?id__in=58ab48083ce18b01eaed826e)
          //Извлекаем информацию о таких запросах и добавляем пустые ID в список дилеров, чтобы лишний раз не срабатывал запрос на сервер          
          const dealersNameId = dealersName.map(dealer => {
            return (dealer.dealerId);
          });

          const emptyArrays = () => {
            const emptyEntries = diff(dealersNameId, dealersIdList());

            const list = emptyEntries.map(entry => {
              return ({
                dealerId: entry,
                dealerName: 'отсутствует'
              });
            });
            return list;
          }

          //Собираем массив диллеров
          const dealersNameWithEmpties = [...dealersList, ...dealersName, ...emptyArrays()];

          //Находим в dealersName дилера по ID и записываем его название
          vehicles.forEach(vehicle => {
            let findName = dealersNameWithEmpties.filter(dealer => dealer.dealerId === vehicle.dealerId);
            if(findName.length === 0) {
              vehicle.dealerNameFromDealer = 'отсутствует';
            } else {
              vehicle.dealerNameFromDealer = findName[0].dealerName;
            }
          })
    
          dispatch(
            fetchIndexSuccess({
              isFetching: false,
              vehicles: vehicles,
              dealersList: dealersNameWithEmpties,
              pagination: {
                currentPage: pageNumber,
                pageSize: PAGE_SIZE,
                totalVehicles: TOTAL_VEHICLES,
              },
            })
          );
        })
        .catch(console.log)
      }
    }
}

export function vehiclesFetchData(pageNumber, dealersList) {
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
      .then(data => dispatch(dealersNameFetchData(data, pageNumber, dealersList)))
      .catch(error => dispatch(fetchIndexFailure(error)));
  };
}