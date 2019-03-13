import React from 'react';
import { View, ScrollView, Image, Dimensions, Text, TextInput, TouchableOpacity, ProgressBarAndroid } from 'react-native'

import styled from 'styled-components';

import EditIco from '../assets/EditDiaD.svg';
import DoneGreenIco from '../assets/DoneGreenDiaD.svg';
import DeleteIco from '../assets/DeleteDiaD.svg';

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
const ContainerDeleteDoneEditComment = styled.View`
  width: ${Dimensions.get('window').width - 230};
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  position: absolute;
  top: 5px;
  right: 60px;
  padding: 10px;
  border-radius: 10px;
  background-color: #FFF;
`;
const ContainerToButtonsCloseEditComment = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
const CloseDoneToEditComment = props => (
  <ContainerDeleteDoneEditComment>
    {props.editContentComment.upload ? (
      <ContainerToButtonsCloseEditComment>
        <ProgressBarAndroid styleAttr='Small' color='#08F' />
      </ContainerToButtonsCloseEditComment>
    ) : (
        <ContainerToButtonsCloseEditComment>
          <TouchableOpacity onPress={() => props.editComment('delete', props.commentId, props.post_id)} >
            <DeleteIco width={24} heigth={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.editComment('done', props.commentId, props.post_id)} >
            <DoneGreenIco width={24} heigth={24} />
          </TouchableOpacity>
        </ContainerToButtonsCloseEditComment>
      )}
  </ContainerDeleteDoneEditComment>
);
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
            <View>
              <TouchableOpacity onPress={() => props.editComment('edit', comment._id, props.post_id)} >
                <EditIco width={32} height={32} />
              </TouchableOpacity>
            </View>
          ) : null
          }
        </View>
        <View style={{ margin: 10 }}>
          {props.editContentComment.edit && props.editContentComment.commentId == comment._id.toString() ? (
            <TextInput
              multiline
              onChangeText={e => props.editComment('editContent', comment._id, props.post_id, e)}
              value={props.editContentComment.contentComment}
              style={{ borderRadius: 10, backgroundColor: '#FFF' }}
            />
          ) : (
              <Text>{comment.content}</Text>
            )
          }
        </View>
        {
          props.editContentComment.edit && props.editContentComment.commentId == comment._id.toString() ? (
            <CloseDoneToEditComment
              editComment={props.editComment}
              commentId={comment._id}
              post_id={props.post_id}
              editContentComment={props.editContentComment}
            />
          ) : null
        }
      </ContainerComment>
    ))}
  </ScrollView>
);