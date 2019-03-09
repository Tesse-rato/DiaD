import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';

import styled from 'styled-components/native';
import { StandardInput } from "./standard";

import FlameBlue from '../assets/FlameBlueDiaD.svg';

const ContainerComment = styled.View`
  width: ${Dimensions.get('window').width - 25};
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 1px;
  margin-left: 1px;
  padding: 10px;
  background-color: #E8E8E8;
  border-radius: 10px;
`;
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
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      pagingEnabled={true}
      stickyHeaderIndices={true}
      style={{ width: Dimensions.get('window').width - 23 }}
      onMomentumScrollEnd={(e) => { console.log(e.nativeEvent.contentOffset.x) }}
    >
      {props.comments.map(comment => (
        <ContainerComment key={comment._id} >
          <View style={{ width: Dimensions.get('window').width - 70, flexDirection: 'row' }}>
            <View>
              <Image style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode='cover' source={{ uri: 'http://192.168.1.2:3333/comment.jpg' }} />
            </View>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 16 }} >Nome Sobrenome</Text>
              <Text style={{ fontSize: 12 }} >@ap3liDo</Text>
            </View>
          </View>
          <View style={{ margin: 10 }}>
            <Text>{comment.content}</Text>
          </View>
        </ContainerComment>
      ))}
    </ScrollView>

  </ContainerPost >
);