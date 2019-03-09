import React from 'react';
import { View, ScrollView, Image, Dimensions, Text } from 'react-native'

import styled from 'styled-components';

const ContainerComment = styled.View`
  width: ${Dimensions.get('window').width - 50};
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 0px;
  margin-left: 3px;
  padding: 10px;
  background-color: #E8E8E8;
  border-radius: 10px;
`;
export const Comment = props => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    pagingEnabled={true}
    stickyHeaderIndices={true}
    style={{ width: Dimensions.get('window').width - 40, padding: 2 }}
    onMomentumScrollEnd={(e) => props.debug(e)}
    snapToAlignment='center'
    snapToInterval={Dimensions.get('window').width - 47}
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
);