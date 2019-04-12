import React from 'react';
import { View, ScrollView, Image, Dimensions, Text, TextInput, TouchableOpacity, ProgressBarAndroid } from 'react-native'

import styled from 'styled-components';

import EditIco from '../assets/EditDiaD.svg';
import DoneGreenIco from '../assets/DoneGreenDiaD.svg';
import DeleteIco from '../assets/DeleteDiaD.svg';

export const ContainerComment = styled.View`
  width: ${Dimensions.get('window').width - 50};
  justify-content: space-evenly;
  background-color: #FFF;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 0px;
  margin-left: 3px;
`;
export const ContainerHeaderComment = styled.View`
  width: ${Dimensions.get('window').width - 100};
  flex-direction: row;
  padding-top: 10px;
  padding-left: 10px;
  padding-right: 10px;
  border-color: #333;
  border-left-width: 1px;
`;
const ContainerDeleteDoneEditComment = styled.View`
  width: 150px;
  height: 50px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  border-radius: 10px;
  background-color: #FFF;
`;
const ContainerToButtonsCloseEditComment = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
`;
export const CloseDoneToEditComment = props => (
  <ContainerDeleteDoneEditComment>
    {props.commentController.upload ? (
      <ContainerToButtonsCloseEditComment>
        <ProgressBarAndroid styleAttr='Small' color='#08F' />
      </ContainerToButtonsCloseEditComment>
    ) : (
        <ContainerToButtonsCloseEditComment>
          <TouchableOpacity onPress={() => props.editComment('delete', props.comment_id/*, props.post_id*/)} >
            <DeleteIco width={40} heigth={40} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => props.editComment('done', props.comment_id/*, props.post_id*/)} >
            <DoneGreenIco width={40} heigth={40} />
          </TouchableOpacity>
        </ContainerToButtonsCloseEditComment>
      )}
  </ContainerDeleteDoneEditComment>
);

export const CommentHeader = props => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <ContainerHeaderComment>
      <TouchableOpacity onPress={() => props.clickImageProfile(props.assignedTo)}>
        <Image style={{ width: 40, height: 40, borderRadius: 20 }} resizeMode='cover' source={{ uri: props.thumbnail }} />
      </TouchableOpacity>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 16 }} >{`${props.firstName} ${props.lastName}`}</Text>
        <Text style={{ fontSize: 12 }} >@{props.nickname}</Text>
      </View>
    </ContainerHeaderComment>
    {props.user_id == props.assignedTo ? (
      <View>
        <TouchableOpacity onPress={() => props.editComment('edit', props.comment_id)} >
          <EditIco width={32} height={32} />
        </TouchableOpacity>
      </View>
    ) : null
    }
  </View>
);

export const CommentContent = props => (
  <View style={{ paddingVertical: 10 }}>
    {props.commentController.edit && props.commentController.commentId == props.comment_id.toString() ? (
      <TextInput
        multiline
        keyboardAppearance='light'
        placeholder='Comentario'
        maxLength={200}
        onChangeText={e => props.editComment('editContent', props.comment_id, e)}
        onEndEditing={() => props.editComment('done', props.comment_id)}
        value={props.valueOnEditing}
        style={{ borderRadius: 10, backgroundColor: '#F1F1F1' }}
      />
    ) : (
        <View style={{ paddingHorizontal: 10 }}>
          <Text>{props.content}</Text>
        </View>
      )
    }
  </View>
);
