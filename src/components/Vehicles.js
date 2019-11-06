import React, { Component } from 'react';
import { Table } from 'antd';

import { Wrapper, StyledPagination } from './styled';

import { connect } from 'react-redux';
import { vehiclesFetchData } from 'actions/vehicles';

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: [] };
    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    const pageNumber = 1;
    this.props.fetchData(pageNumber);

    this.getTableData();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps !== this.props || nextState !== this.state;
  }

  getTableData() {
    const vehiclesArray = Object.values(this.props.vehicles);

    const dataSource = 
      vehiclesArray.map((vehicle) => (
        {
          key: vehicle.vin,
          vin: vehicle.vin,
          dealerId: vehicle.dealer,
          dealerName: vehicle.dealerName,
        }
      ));
      
      return dataSource;
  }

  onChangePage(pageNumber) {
    this.props.fetchData(pageNumber);

    this.getTableData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isFetching !== prevProps.isFetching) {
      this.getTableData();
    }
  }

  render() {
    const { isFetching, pagination } = this.props;
    const { totalVehicles, pageSize } = pagination;

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
        dataIndex: 'dealerName',
        key: 'dealerName',
      },
    ];

    return (
      <Wrapper>
        <h1>Таблица дилеров</h1>
        <Table
          dataSource={this.getTableData()}
          columns={columns}
          pagination={false}
          loading={isFetching}
        />
        {!isNaN(pageSize) &&
          <StyledPagination
            total={totalVehicles}
            showTotal={total => `Всего автомобилей: ${total}`}
            pageSize={pageSize}
            defaultCurrent={1}
            onChange={this.onChangePage}
          />
        }
      </Wrapper>
    );
  }
}

const mapStateToProps = state => {
  return { 
    isFetching: Boolean(state.isFetching),
    vehicles: {...state.vehicles},
    pagination: {...state.pagination},
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchData: pageNumber => dispatch(vehiclesFetchData(pageNumber))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);