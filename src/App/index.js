import React from 'react';
import { Provider } from 'react-redux';
import store from 'store';

import 'antd/dist/antd.css';

import Vehicles from 'components/Vehicles';

function App() {
  return (
    <Provider store={store}>
      <Vehicles />
    </Provider>
  );
}

export default App;
