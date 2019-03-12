import React, { Component } from 'react';
import { View, Text, StatusBar, Dimensions } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';
import Api from '../api';

import { MeuInput, LogIn, Register } from '../styles/login';
import { MinhaView } from '../styles/standard';

import Logo from '../assets/Logo.svg';
import EmailIco from '../assets/EmailWhiteDiaD.svg';
import PasswordIco from '../assets/PassWordWhiteDiaD.svg';

class Login extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()
    this.state = {
      error: 'Senha incorreta'
    }
  }

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
      <MinhaView white >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

        <View style={{ flex: 2, marginBottom: 20, justifyContent: 'center' }}>
          <Logo width={150} height={150} />
        </View>

        <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{ color: '#F00', fontSize: 12 }}>{this.state.error}</Text>
          <MeuInput placeholder='Email' ico={EmailIco} />
          <MeuInput placeholder='Senha' ico={PasswordIco} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center' }} >
          <LogIn onPress={() => { this.props.navigation.navigate('Register') }} >
            <Text style={{ color: '#08F', fontSize: 14 }}>Logar</Text>
          </LogIn>
          <Register onPress={() => this.props.navigation.navigate('Profile')}>
            <Text style={{ color: '#08F', fontSize: 14 }}>Cadastrar</Text>
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
