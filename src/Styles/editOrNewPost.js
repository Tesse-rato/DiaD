import React from 'react';
import { View, Text, Dimensions, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';

import styled from 'styled-components/native';

import { HeaderPost } from '../styles/postFeed';

import BackIco from '../assets/GoBackDiaD.svg';
import DoneIco from '../assets/DoneGreenDiaD.svg'
import DeleteIco from '../assets/DeleteDiaD.svg';
import LoadImageIco from '../assets/LoadImageDiaD.svg';

const ContainerEditPost = styled.View`
  width: ${Dimensions.get('window').width};
  height: ${Dimensions.get('window').height};
  align-items: center;
  border-radius: 10px;
  background-color: #FFF;
`;

const ContainerBackDoneOrDelete = styled.View`
  width: ${Dimensions.get('window').width};
  padding: 10px;
  flex-direction: row;
  justify-content: space-between;
`;
const ContainerContentPost = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;
const BackDoneOrDelete = props => (
  <ContainerBackDoneOrDelete>
    <TouchableOpacity onPress={() => props.cancelEditPost()}>
      <BackIco width={20} height={20} />
    </TouchableOpacity>

  </ContainerBackDoneOrDelete>
);

const ContentPost = props => (
  <ContainerContentPost>
    <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
      {props.contentPost ? (
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <TextInput
            multiline
            maxLength={400}
            onChangeText={e => props.editContentPost(e)}
            value={props.contentPost}
          />
        </View>
      ) : null}
      {props.photoPost ? (
        <View>
          <TouchableOpacity onPress={() => props.loadImageOnEditPost(props.post_id)}>
            <Image
              style={{
                width: props.photoPost.width,
                height: props.photoPost.height
              }}
              source={{ uri: props.photoPost.content }}
            />
          </TouchableOpacity>
        </View>
      ) : (
          <View style={{ flex: 1, height: 400, opacity: .5, justifyContent: 'center', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => props.loadImageOnEditPost(props.post_id)}>
              <LoadImageIco width={100} height={100} />
            </TouchableOpacity>
          </View>
        )}
    </ScrollView>
  </ContainerContentPost>
);
export const EditOrNewPost = props => (
  <ContainerEditPost>
    <BackDoneOrDelete
      cancelEditPost={props.cancelEditPost}
      doneEditPost={props.doneEditPost}
      deletePost={props.deletePost}
      post_id={props.post_id}
    />

    <HeaderPost
      push_ico={props.push_ico}
      post_id={props.post_id}
      thumbnail={props.thumbnail}
      firstName={props.firstName}
      lastName={props.lastName}
      nickname={props.nickname}
      pushTimes={props.pushTimes}
      assignedTo_id={props.assignedTo_id}
      clickImageProfile={props.clickImageProfile}
      pushPost={props.pushPost}
    />

    <ContentPost
      loadImageOnEditPost={props.loadImageOnEditPost}
      editContentPost={props.editContentPost}
      contentPost={props.contentPost}
      photoPost={props.photoPost}
    />

    <View
      style={{
        width: Dimensions.get('window').width,
        justifyContent: 'space-between',
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        padding: 20,
      }}
    >
      <TouchableOpacity onPress={() => props.deletePost()}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#F1F1F1',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DeleteIco width={20} height={20} />
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.doneEditPost()}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#F1F1F1',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <DoneIco width={20} height={20} />
        </View>
      </TouchableOpacity>
    </View>

  </ContainerEditPost>
);