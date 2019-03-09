import React, { Component } from 'react';
import { View, Text, ImageBackground } from 'react-native';

export default class Welcome extends Component {
  static navigationOptions = {
    header: null
  }
  render() {
    return (
      <ImageBackground style={{ flex: 1 }} source={require('../assets/BackgroundWelcomeDiaD.png')}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Testando</Text>
        </View>
      </ImageBackground>
    );
  }
}