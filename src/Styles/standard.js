
import React from 'react';
import { Dimensions, View, TouchableOpacity, Image, ScrollView, Text } from "react-native";

import styled from 'styled-components/native';

export const MinhaView = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.white ? '#FFF' : '#E8E8E8'};
`;

export const StandardButton = styled.TouchableOpacity`
  width: 200px;
  height: 45px;
  margin: 5px;
  background-color: #08F;
  border: 1px solid #08f;
  border-radius: 15px;
  align-items: center;
  justify-content: center;
`;

export const StandardInput = styled.TextInput`
  width: ${Dimensions.get('window').width - 85};
  /* height: ${Dimensions.get('window').height - 600}; */
  height: 55px;
  background-color: transparent;
  border-radius: 8px;
  padding: 10px;
  border: 0px;
  margin: 4px;
  font-size: 14;
  color: #FFF;
`;

const ContainerHeader = styled.View`
  flex-direction: row;
  align-items: center;
  width: ${Dimensions.get('window').width};
  /* height: ${Dimensions.get('window').height - 535}; */
  height: 60px;
  padding: 5px;
  background-color: #FFF;
  border-bottom-width: 0.5px;
  border-bottom-color: #AAA;
  padding-left: 5px;
`;
export const Find = props => (
  <View style={{ backgroundColor: '#CCC', borderRadius: 25, marginRight: 15 }}>
    <StandardInput value={props.value} onChangeText={(e) => props.onChangeText(e)} style={{ height: 35 }} placeholder={props.placeholder} placeholderTextColor='#FFF' selectionColor='#FFF' />
  </View>
);

export const Profile = props => (
  <TouchableOpacity onPress={() => props.clickImageProfile()}>
    <Image style={{ width: 48, height: 48, borderRadius: 24 }} source={props.source} resizeMode='cover' />
  </TouchableOpacity>
);
export const Header = props => (
  <ContainerHeader>
    <Find placeholder='ID/Apelido' onChangeText={props.onChangeText} />
    <Profile clickImageProfile={props.clickImageProfile} source={props.source} />
  </ContainerHeader>
);
export const MeuInput = (props) => (
  <View style={{ flexDirection: 'row', backgroundColor: '#08F', alignItems: 'center', margin: 5, borderRadius: 20 }}>
    <props.ico width={25} height={25} margin={10} />
    <StandardInput
      secureTextEntry={props.secureTextEntry}
      keyboardAppearance='light'
      keyboardType={props.keyboardType}
      textContentType={props.textContentType}
      value={props.value}
      onChangeText={props.onChangeText}
      placeholder={props.placeholder}
      placeholderTextColor='#FFF'
      selectionColor='#FFF'
    />
  </View>
);