import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';

import styled from 'styled-components/native';

import FlameBlue from '../assets/FlameBlueDiaD.svg';

import { Comment } from './comment';


const ContainerPost = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  background-color: #FFF;
  border-radius: 5px;
  margin-top: 10px;
`;
export const Post = props => (
  <ContainerPost>
    <View style={{ flexDirection: 'row', padding: 10 }}>
      <View style={{ width: Dimensions.get('window').width - 70, flexDirection: 'row', alignItems: 'center' }}>
        <View>
          <Image style={{ width: 60, height: 60, borderRadius: 30 }} resizeMode='cover' source={{ uri: 'http://192.168.1.2:3333/selfie.jpg' }} />
        </View>
        <View style={{ marginLeft: 8 }}>
          <Text style={{ fontSize: 22 }} >Nome Sobrenome</Text>
          <Text style={{ fontSize: 12 }} >@ap3liDo</Text>
          <Text style={{ fontSize: 12 }} >email@gmail.com</Text>
        </View>
      </View>

      <View style={{ alignItems: 'center' }}>
        <FlameBlue width={32} height={32} />
        <Text style={{ color: '#333' }}>4235</Text>
      </View>
    </View>
    <View style={{ margin: 10 }}>
      <Text style={{ textAlign: 'center' }}>{props.content}</Text>
    </View>
    <Comment comments={props.comments} debug={props.debug} />
  </ContainerPost >
);