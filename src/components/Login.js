import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MinhaView, Input, MeuBotao } from '../Styles/login';
import Logo from '../../assets/Logo.svg';


export default class App extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView>
        <View style={{ marginTop: 50 }}>
          <Logo width={200} height={200} />
        </View>
        <View style={{ marginBottom: 50, alignItems: 'center', justifyContent: 'space-between' }} >
          <Input placeholder='Email' ></Input>
          <Input placeholder='Senha' ></Input>
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <MeuBotao onPress={() => this.props.navigation.navigate('Register')}>
              <Text style={{ color: '#08F' }}>Entrar</Text>
            </MeuBotao>
            <MeuBotao style={{ backgroundColor: '#08F', borderWidth: 0 }} >
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
