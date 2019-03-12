import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import Api from '../api';

import { MinhaView } from '../styles/standard';
import { MeuInput, Continue, GoBack } from '../styles/register';

import LogoIcoIco from '../assets/Logo.svg';
import EmailIco from '../assets/EmailWhiteDiaD.svg';
import PasswordIco from '../assets/PassWordWhiteDiaD.svg';

class Register extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()
    this.state = {
      name: {
        first: '',
        last: '',
        nickname: '',
      },
      email: '',
      password: '',
      confirmPassword: '',
      error: ''
    }
  }

  componentWillMount() {
    if (!this.state.email && !this.state.password) {
      this.setState({ email: this.props.account.user.email, password: this.props.account.user.password });
    }
  }


  verifyUserAccount() {
    if (this.props.account.user.password != this.state.confirmPassword) {
      return this.setState({ error: 'Senhas não combinam' });
    }

    const url = '/users/exists/' + this.props.account.user.email;
    Api.get(url).then(() => {
      this.props.navigation.navigate('Register2');
    }).catch(err => {
      err.response.data.error == 'User already exists' ?
        this.setState({ error: 'Email já cadastrado' }) :
        this.setState({ error: 'Verifique sua conexão ' });
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView white >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

        <View style={{ flex: 1, marginBottom: 20, justifyContent: 'center' }}>
          <LogoIcoIco width={150} height={150} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#F00', fontSize: 12 }}>{this.state.error}</Text>
          <MeuInput onChangeText={this.props.setEmail} placeholder='Email' ico={EmailIco} />
          <MeuInput onChangeText={this.props.setPassword} placeholder='Senha' ico={PasswordIco} />
          <MeuInput value={this.state.confirmPassword} onChangeText={(e) => this.setState({ confirmPassword: e })} placeholder='Confirme Senha' ico={PasswordIco} />
        </View>

        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse' }}>
          <Continue onPress={() => this.verifyUserAccount()}>
            <Text style={{ color: '#08F', fontSize: 16 }}>Continuar</Text>
          </Continue>
          <GoBack onPress={() => this.props.navigation.goBack()}>
            <Text style={{ color: '#08F', fontSize: 14 }}>Voltar</Text>
          </GoBack>
        </View>

      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = states => {
  return {
    account: states.account
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);