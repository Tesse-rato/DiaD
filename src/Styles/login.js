import React from 'react';
import { View } from 'react-native';

import styled from 'styled-components/native';
import { StandardButton, StandardInput } from './standard';

export const LogIn = styled(StandardButton)`
  background-color: transparent;
`;

export const Register = styled(StandardButton)`
  border-color: transparent;
  background-color: transparent;
  margin-top: 10px;
  width: 200px;
`;

export const MeuInput = (props) => (
  <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8', alignItems: 'center', margin: 5, borderRadius: 25 }}>
    <props.ico width={25} height={25} margin={10} />
    <StandardInput value={props.value} onChangeText={props.onChangeText} placeholder={props.placeholder} placeholderTextColor='#FFF' selectionColor='#FFF' />
  </View>
);