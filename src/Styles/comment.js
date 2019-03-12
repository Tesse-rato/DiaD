import React from 'react';
import { View, ScrollView, Image, Dimensions, Text, TouchableOpacity } from 'react-native'

import styled from 'styled-components';

import EditIco from '../assets/EditDiaD.svg';

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
export const ContainerHeaderComment = styled.View`
  width: ${Dimensions.get('window').width - 100};
  flex-direction: row;
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <ContainerHeaderComment>
            <TouchableOpacity onPress={() => props.clickImageProfile(comment.assignedTo._id)}>
              <Image style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode='cover' source={{ uri: comment.assignedTo.photo.thumbnail }} />
            </TouchableOpacity>
            <View style={{ marginLeft: 8 }}>
              <Text style={{ fontSize: 16 }} >{`${comment.assignedTo.name.first} ${comment.assignedTo.name.last}`}</Text>
              <Text style={{ fontSize: 12 }} >@{comment.assignedTo.name.nickname}</Text>
            </View>
          </ContainerHeaderComment>
          {props.user_id == comment.assignedTo._id ? (
            <TouchableOpacity onPress={() => props.editComment(comment._id, props.post_id)} >
              <EditIco width={32} height={32} />
            </TouchableOpacity>
          ) : null
          }
        </View>
        <View style={{ margin: 10 }}>
          <Text>{comment.content}</Text>
        </View>
      </ContainerComment>
    )
    )}
  </ScrollView>
);