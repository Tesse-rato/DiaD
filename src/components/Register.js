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
      error: 'Password not match'
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
      <MinhaView >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

        <View style={{ flex: 1, marginBottom: 20, justifyContent: 'center' }}>
          <LogoIcoIco width={150} height={150} />
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: '#F00', fontSize: 12 }}>{this.state.error}</Text>
          <MeuInput placeholder='Email' ico={EmailIco} />
          <MeuInput placeholder='Senha' ico={PasswordIco} />
          <MeuInput placeholder='Confirme Senha' ico={PasswordIco} />
        </View>

        <View style={{ flex: 0.5, justifyContent: 'center', alignItems: 'center', flexDirection: 'row-reverse' }}>
          <Continue onPress={() => this.props.navigation.navigate('Register2')}>
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