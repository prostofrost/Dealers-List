import React, { Component } from 'react';
import { Table } from 'antd';

import { Wrapper, StyledPagination } from './styled';

import { connect } from 'react-redux';
import { vehiclesFetchData } from 'actions/vehicles';

const baseUrl = "https://jlrc.dev.perx.ru/carstock/api/v1/vehicles";

class Vehicles extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      currentPage: 0,
      perPage: 25,
      totalPages: 0,
      totalVehicles: 0,
      dataSource: []
    };
    this.onChangePage = this.onChangePage.bind(this);
  }

  componentDidMount() {
    const { currentPage, perPage } = this.state;
    this.props.fetchData(`${baseUrl}/?page=${currentPage}&per_page=${perPage}&state=active&hidden=false&group=new`)

    //Получаем количество автомобилей и рассчитываем данные для пагинации
    const totalVehicles = 2295;
    this.setState({ totalVehicles: Number(totalVehicles) });

    const totalPages = totalVehicles / perPage;
    this.setState({ totalPages: Number(totalPages) });

    setTimeout(() => {this.getTableData()}, 2000)
  }

  onChangePage(pageNumber) {
    const currentPage = pageNumber - 1;

    this.props.fetchData(`${baseUrl}/?page=${currentPage}&per_page=${this.state.perPage}&state=active&hidden=false&group=new`)

    setTimeout(() => {this.getTableData()}, 2000)
  }

  getTableData() {
    const { vehiclesWithDealer } = this.props;

    const dataTable = 
      vehiclesWithDealer.map((vehicle) => (
        {
          key: vehicle.vin,
          vin: vehicle.vin,
          dealerId: vehicle.dealer,
          dealerName: vehicle.dealerNameFromDealer || 'отсутствует',
        }
      ));
      
      this.setState({dataSource: dataTable});
  }

  render() {
    const { isFetching } = this.props;
    const { totalVehicles, perPage, dataSource } = this.state;

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
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          loading={isFetching}
        />
        <StyledPagination
          total={totalVehicles}
          showTotal={total => `Всего автомобилей: ${total}`}
          pageSize={perPage}
          defaultCurrent={1}
          onChange={this.onChangePage}
        />
      </Wrapper>
    );
  }
}

const mapStateToProps = state => ({
  vehiclesWithDealer: state.vehiclesWithDealer,
  isFetching: Boolean(state.isFetching),
});

const mapDispatchToProps = dispatch => {
  return {
    fetchData: url => dispatch(vehiclesFetchData(url))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Vehicles);