import React, { Component } from 'react';
import { View, Text } from "react-native";

import { Provider } from "react-redux";
import store from '../src/redux/store';
import Comp from './comp';

export default class Redux extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={store}>
        <Comp />
      </Provider>
    );
  }
}

