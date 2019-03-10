import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'

import styled from 'styled-components/native';
import FlameBlueIco from '../assets/FlameBlueDiaD.svg';

import { Comment } from './standard';


const ContainerPostProfile = styled.View`
  width: ${Dimensions.get('window').width - 13};
  background-color: #FFF;
  border-radius: 12px;
  align-items: center;
  padding: 10px;
  margin-top: 10px;
`;
const ContainerHeaderPostProfile = styled.View`
  width: ${Dimensions.get('window').width - 23};
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 5px;
`;

const ContainerContentPostProfile = styled.View`
  width: ${Dimensions.get('window').width - 30};
  padding: 10px;
`;
const HeaderPostProfile = props => (
  <ContainerHeaderPostProfile>
    <Text>28 Jan 2019</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 12, marginRight: 5 }}>228</Text>
      <TouchableOpacity>
        <FlameBlueIco width={24} height={24} />
      </TouchableOpacity>
    </View>
  </ContainerHeaderPostProfile>
);
const ContentPostProfile = props => (
  <ContainerContentPostProfile>
    <Text style={{ textAlign: 'center' }}>{props.content}</Text>
  </ContainerContentPostProfile>
);
export const PostProfile = props => (
  <ContainerPostProfile>
    <HeaderPostProfile />
    <ContentPostProfile content={props.content} />
    <Comment comments={props.comments} debug={props.debug} />
  </ContainerPostProfile>
);
