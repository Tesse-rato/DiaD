import React, { Component } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Api from '../api';
import * as Actions from '../redux/actions';
import { MinhaView, Input, MeuBotao } from '../Styles/login';
import Logo from '../assets/Logo.svg';


class Login extends Component {
  state = {
    error: ''
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
    const {
      setEmail,
      setPassword,
      navigation: { navigate },
      account: { user: { email, password } }
    } = this.props;

    return (
      <MinhaView>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        <View style={{ positon: 'absolute', top: 50 }}>
          <Logo width={200} height={200} />
        </View>
        <View style={{ position: 'absolute', top: 10 }}>
          <Text style={{ color: '#F00' }}>{this.state.error}</Text>
        </View>
        <View style={{ marginBottom: 50, alignItems: 'center', justifyContent: 'space-between' }} >
          <Input value={email} placeholder='Email' onChangeText={e => setEmail(e)} />
          <Input value={password} placeholder='Senha' onChangeText={e => setPassword(e)} />
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <MeuBotao onPress={() => this.login()}>
              <Text style={{ color: '#08F' }}>Entrar</Text>
            </MeuBotao>
            <MeuBotao style={{ backgroundColor: '#08F', borderWidth: 0 }} onPress={() => navigate('Register')} >
              <Text style={{ color: '#FFF' }}>Cadastrar</Text>
            </MeuBotao>
          </View>
        </View>
        <View style={{ marginBottom: 10, alignItems: 'center' }}>
          <Text stlye={{ color: '#333' }}>Atualizações do que acontece na cidade!</Text>
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