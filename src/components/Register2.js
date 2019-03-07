import React, { Component } from 'react';
import { View } from "react-native";
import Register from './Register';

import { MeuInput } from "../styles/register";

export default class Register2 extends Component {
  render() {
    return (
      <View>
        <View>
          <Register />
        </View>
        <MeuInput placeholder='Nome' />
        <MeuInput placeholder='Senha' />
        <MeuInput placeholder='Apelido' />
      </View>
    );
  }
}