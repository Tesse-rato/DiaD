import React from 'react';
import { View } from 'react-native';

import styled from 'styled-components/native';
import { StandardInput, StandardButton } from './standard';

export const Continue = styled(StandardButton)`
  width: 150;
  background-color: #FFF;
  border: 0px;
`;

export const GoBack = styled(StandardButton)`
  width: 150;
  background-color: transparent;
  border-color: transparent;
`;

export const MeuInput = (props) => (
  <View style={{ flexDirection: 'row', backgroundColor: '#E8E8E8', alignItems: 'center', margin: 5, borderRadius: 25 }}>
    <props.ico width={25} height={25} margin={10} />
    <StandardInput keyboardAppearance='light' keyboardType='email-address' value={props.value} onChangeText={(e) => props.onChangeText(e)} placeholder={props.placeholder} placeholderTextColor='#FFF' selectionColor='#FFF' />
  </View>
);