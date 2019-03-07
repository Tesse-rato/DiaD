import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';
import Api from '../api';

import { Input, LogIn, Register } from '../styles/login';
import { MinhaView } from '../styles/standard';
import Logo from '../assets/Logo.svg';

class Login extends Component {
  constructor() {
    super()
    this.state = {
      error: ''
    }
  }
  static navigationOptions = {
    header: null
  };
  login() {
    Api.post('/users/auth', {
      email: this.props.account.user.email,
      password: this.props.account.user.password
    }).then(({ data }) => {
      this.props.setUser(data);
      return this.props.navigation.navigate('Home');
    }).catch(err => {
      if (err.response.data.error === 'Invalid password') {
        return this.setState({ error: err.response.data.error });
      }
      return this.props.navigation.navigate('Register');
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

        <View style={{ flex: 5, justifyContent: 'center', alignItems: 'center' }} >
          <View style={{ marginBottom: 20 }}>
            <Logo width={150} height={150} />
          </View>
          <Text style={{ color: '#F00', fontSize: 12 }}>{this.state.error}</Text>
          <Input placeholder='Email' />
          <Input placeholder='Senha' />
        </View>

        <View style={{ flex: 2, alignItems: 'center' }} >
          <LogIn >
            <Text style={{ color: '#08F', fontSize: 14 }}>Logar</Text>
          </LogIn>
          <Register onPress={() => this.props.navigation.navigate('Register')}>
            <Text style={{ color: '#FFF', fontSize: 14 }}>Cadastrar</Text>
          </Register>
        </View>

      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = states => ({
  account: states.account
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
