import React, { Component } from 'react';
import { View, Text, StatusBar, AsyncStorage, Animated, Easing, ProgressBarAndroid } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';
import Api from '../api';

import { LogIn, Register } from '../styles/login';
import { MeuInput, MinhaView } from '../styles/standard';

import Logo from '../assets/Logo.svg';
import LogoOnly from '../assets/LogoOnly.svg';
import EmailIco from '../assets/EmailWhiteDiaD.svg';
import PasswordIco from '../assets/PassWordWhiteDiaD.svg';

class Login extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()
    this.state = {
      error: '',
      automaticLogin: true,
      valueSpin: new Animated.Value(0),
      loading: false,
    }
    this.spinLogo = this.state.valueSpin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
  }

  spin() {
    this.state.valueSpin.setValue(0);
    Animated.sequence([
      Animated.timing(
        this.state.valueSpin,
        {
          toValue: 1,
          duration: 20000,
          useNativeDriver: true,
          easing: Easing.linear
        }
      )
    ]).start(() => {
      this.spin();
    })
  }
  componentDidMount() {
    this.spin();
  }

  async componentWillMount() {

    const token = await AsyncStorage.getItem('token');

    if (token) {

      const config = {
        headers: {
          'authorization': `Bearer ${token}`
        }
      }

      const email = await AsyncStorage.getItem('email');
      const password = await AsyncStorage.getItem('password');
      const _id = await AsyncStorage.getItem('_id');

      Api.post('users/validateToken', { userId: _id }, config).then(async ({ data }) => {

        const user = { token, user: data }

        this.props.setUser(user);

        this.props.navigation.navigate('Geral');
        this.setState({ automaticLogin: false });
        console.log('Login Automatico');

      }).catch(async (err) => {

        if (email && password) {

          Api.post('/users/auth', { email, password }).then(({ data }) => {

            if (!data) return

            this.props.setUser(data);

            AsyncStorage.setItem('token', data.token);
            AsyncStorage.setItem('_id', data.user._id);

            this.props.navigation.navigate('Geral');
            this.setState({ automaticLogin: false });
            console.log('Login com email e senha do AsyncStorage');

          }).catch(err => {
            this.setState({ error: 'Verifique sua conexão', automaticLogin: false });
          });
        } else {
          this.setState({ automaticLogin: false });
          console.log('Login Manual');
        }
      });
    } else {
      this.setState({ automaticLogin: false });
      console.log('Login Manual');
    }
  }

  validateUserInput() {
    const { user: { email, password } } = this.props.account;

    if (!email) return this.setState({ error: 'Preencha o campo Email' });

    if (!password) return this.setState({ error: 'Preencha o campo Senha' });

    this.login();

  }

  login() {
    this.setState({ loading: true });

    const { user: { email, password } } = this.props.account

    Api.post('/users/auth', { email, password }).then(({ data }) => {

      this.props.setUser(data);

      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('password', password);
      AsyncStorage.setItem('token', data.token);
      AsyncStorage.setItem('_id', data.user._id);

      this.setState({ loading: false });
      return this.props.navigation.navigate('Geral');

    }).catch(err => {

      console.log(err.response);

      // if (!err.response.data) return alert('Verifique sua conexão com a internet');

      if (err.response.data.error === 'Invalid password') {
        return this.setState({ error: 'Senha incorreta' });
      }

      return this.props.navigation.navigate('Register');
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView white >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {!this.state.automaticLogin ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

            <View style={{ flex: 2, marginBottom: 20, justifyContent: 'center' }}>
              <Logo width={150} height={150} />
            </View>

            <View style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }} >
              <Text style={{ color: '#F00', fontSize: 12 }}>{this.state.error}</Text>
              <MeuInput
                keyboardType='email-address'
                textContentType='emailAddress'
                value={this.props.account.user.email}
                onChangeText={this.props.setEmail}
                placeholder='Email'
                ico={EmailIco}
              />
              <MeuInput
                secureTextEntry
                textContentType='password'
                value={this.props.account.user.password}
                onChangeText={this.props.setPassword}
                placeholder='Senha'
                ico={PasswordIco}
              />
            </View>

            <View style={{ flex: 1, justifyContent: 'center' }} >
              {this.state.loading ? (
                <ProgressBarAndroid
                  styleAttr='Small'
                  color='#08F'
                  indeterminate={true}
                />
              ) : (
                  <LogIn onPress={() => this.validateUserInput()} >
                    <Text style={{ color: '#08F', fontSize: 14 }}>Logar</Text>
                  </LogIn>
                )}
              <Register onPress={() => this.props.navigation.navigate('Register')}>
                <Text style={{ color: '#08F', fontSize: 14 }}>Cadastrar</Text>
              </Register>
            </View>
          </View>
        ) : (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Animated.View style={{ transform: [{ rotate: this.spinLogo }] }} >
                <LogoOnly width={150} height={150} />
              </Animated.View>
            </View>
          )
        }

      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = states => ({
  account: states.account
})

export default connect(mapStateToProps, mapDispatchToProps)(Login);
