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
    {props.commentController.upload ? (
      <ContainerToButtonsCloseEditComment>
        <ProgressBarAndroid styleAttr='Small' color='#08F' />
      </ContainerToButtonsCloseEditComment>
    ) : (
        <ContainerToButtonsCloseEditComment>
          <TouchableOpacity onPress={() => props.editOrNewComment('delete', props.commentId, props.post_id)} >
            <DeleteIco width={24} heigth={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.editOrNewComment('done', props.commentId, props.post_id)} >
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
              <TouchableOpacity onPress={() => props.editOrNewComment('edit', comment._id, props.post_id)} >
                <EditIco width={32} height={32} />
              </TouchableOpacity>
            </View>
          ) : null
          }
        </View>
        <View style={{ marginTop: 10 }}>
          {props.commentController.edit && props.commentController.commentId == comment._id.toString() ? (
            <TextInput
              multiline
              keyboardAppearance='light'
              maxLength={200}
              onChangeText={e => props.editOrNewComment('editContent', comment._id, props.post_id, e)}
              onEndEditing={() => props.editOrNewComment('done', comment._id, props.post_id)}
              value={props.commentController.tempCommentContent}
              style={{ borderRadius: 30, backgroundColor: '#F1F1F1' }}
            />
          ) : (
              <Text>{comment.content}</Text>
            )
          }
        </View>
        {
          props.commentController.edit && props.commentController.commentId == comment._id.toString() ? (
            <CloseDoneToEditComment
              editOrNewComment={props.editOrNewComment}
              commentId={comment._id}
              post_id={props.post_id}
              commentController={props.commentController}
            />
          ) : null
        }
      </ContainerComment>
    ))}
  </ScrollView>
);