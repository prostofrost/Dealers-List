import React, { Component } from 'react';
import { Table } from 'antd';

import { connect } from 'react-redux';
import { vehiclesFetchData } from 'actions/vehicles';

import { Wrapper, StyledPagination } from './styled';

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    const { fetchData } = this.props;

    const dealersList = [];
    const pageNumber = 1;

    fetchData(pageNumber, dealersList);
  }

  onChangePage(pageNumber) {
    const { dealersList, fetchData } = this.props;
    const dealersListArray = Object.values(dealersList);

    fetchData(pageNumber, dealersListArray);
  }

  render() {
    const { isFetching, pagination, vehicles } = this.props;
    const { totalVehicles, pageSize } = pagination;

    const vehiclesArray = Object.values(vehicles);

    const columns = [
      {
        title: 'Vin',
        dataIndex: 'vin',
        key: 'vin',
      },
      {
        title: 'Dealer ID',
        dataIndex: 'dealerId',
        key: 'dealerId',
      },
      {
        title: 'Dealer Name',
        dataIndex: 'dealerNameFromDealer',
        key: 'dealerNameFromDealer',
      },
    ];

    return (
      <Wrapper>
        <h1>Таблица дилеров</h1>
        <Table
          dataSource={vehiclesArray}
          columns={columns}
          pagination={false}
          loading={isFetching}
        />
        {!isNaN(pageSize) && (
        <StyledPagination
          total={totalVehicles}
          showTotal={total => `Всего автомобилей: ${total}`}
          pageSize={pageSize}
          defaultCurrent={pagination.currentPage}
          onChange={this.onChangePage}
        />
)}
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return { 
    isFetching: Boolean(state.isFetching),
    vehicles: {...state.vehicles},
    dealersList: {...state.dealersList},
    pagination: {...state.pagination},
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchData: (pageNumber, dealersList) => dispatch(vehiclesFetchData(pageNumber, dealersList))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);