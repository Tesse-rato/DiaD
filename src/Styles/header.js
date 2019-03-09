import React from 'react';
import { View, Image, Dimensions, TouchableOpacity } from 'react-native';

import styled from 'styled-components';

import { StandardInput } from './standard';

export const Find = props => (
  <View style={{ backgroundColor: '#CCC', borderRadius: 25, marginRight: 15 }}>
    <StandardInput onChangeText={props.onChangeText} style={{ height: 35 }} placeholder={props.placeholder} placeholderTextColor='#FFF' selectionColor='#FFF' />
  </View>
);

export const Profile = props => (
  <TouchableOpacity onPress={props.onPress}>
    <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={props.source} resizeMode='cover' />
  </TouchableOpacity>
);

const ContainerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${Dimensions.get('window').width};
  height: ${Dimensions.get('window').height - 535};
  background-color: #FFF;
  border-bottom-width: 0.5px;
  border-bottom-color: #AAA;
  padding-left: 5px;
`;
export const Header = props => (
  <ContainerHeader>
    <Find placeholder='ID/Apelido' onChangeText={props.onChangeText} />
    <Profile onPress={props.onPress} source={props.source} />
  </ContainerHeader>
);