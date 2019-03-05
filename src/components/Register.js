import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import store from '../redux/store';
import { MeuInput, MeuBotao } from '../Styles/register';
import Logo from '../assets/Logo.svg';
import GoBack from '../assets/GoBackDiaD.svg';

class Register extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    console.log(this.props);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar backgroundColor='#FFF' barStyle='dark-content' />
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <GoBack />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', top: 50 }}>
          <Logo width={200} height={200} />
        </View>
        <View style={{ marginTop: 30 }}>
          <MeuInput placeholder='Email' />
          <MeuInput placeholder='Senha' />
          <MeuInput placeholder='Confirmar Senha' />
        </View>
      </View>
    );
  }
}

const mapStateToProps = states => {
  return {
    account: states.account
  }
}

export default connect(mapStateToProps)(Register);