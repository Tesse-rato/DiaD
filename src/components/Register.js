import React, { Component } from 'react';
import { View, Text, StatusBar, TouchableOpacity } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { MeuInput, MeuBotao } from '../Styles/register';
import Logo from '../assets/Logo.svg';
import GoBack from '../assets/GoBackDiaD.svg';

import * as Actions from '../redux/actions';
import Api from '../api';

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

  register() {
    Api.post('/users/create', { ...this.state }).then(({ data }) => {
      console.log(data);
      console.log('DEU CERTO');
      this.props.setUser(data);
      return this.props.navigation.navigate('Home');
    }).catch(err => {
      return this.setState({ error: err.response.data.error })
    })
  }

  render() {
    console.disableYellowBox = true;
    const {
      account: {
        user: {
          email, password
        }
      }
    } = this.props;

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <StatusBar backgroundColor='#FFF' barStyle='dark-content' />
        <View style={{ position: 'absolute', top: 10, left: 10 }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <GoBack />
          </TouchableOpacity>
        </View>
        <View style={{ position: 'absolute', top: 80 }}>
          <Logo width={150} height={150} />
        </View>
        <View stlye={{ alignItems: 'center' }}>
          <Text style={{ color: '#F00' }}>{this.state.error}</Text>
        </View>
        <View style={{ marginTop: 250 }}>
          <MeuInput onChangeText={e => this.setState({ ...this.state, name: { ...this.state.name, first: e } })} value={this.state.name.first} placeholder='Nome' />
          <MeuInput onChangeText={e => this.setState({ ...this.state, name: { ...this.state.name, last: e } })} value={this.state.name.last} placeholder='Sobrenome' />
          <MeuInput onChangeText={e => this.setState({ ...this.state, name: { ...this.state.name, nickname: e } })} value={this.state.name.nickname} placeholder='Apelido' />
          <MeuInput onChangeText={e => this.setState({ ...this.state, email: e })} value={email} value={this.state.email} placeholder='Email' />
          <MeuInput onChangeText={e => this.setState({ ...this.state, password: e })} value={password} value={this.state.password} placeholder='Senha' />
          <MeuInput onChangeText={e => this.setState({ ...this.state, confirmPassword: e })} value={this.state.confirmPassword} placeholder='Confirmar Senha' />
        </View>
        <Text style={{ fontSize: 12, margin: 5 }}>O seu apelido é o que vai te identificar no aplicativo, lembre-se disso</Text>
        <MeuBotao onPress={() => this.register()}>
          <Text style={{ color: '#FFF' }}>Continar</Text>
        </MeuBotao>
      </View>
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