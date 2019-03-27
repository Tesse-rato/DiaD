import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';

import styled from 'styled-components/native';

import CommentIco from '../assets/CommentDiaD.svg';
import ShareIco from '../assets/ShareDiaD.svg';

import { Comment } from './comment';


const ContainerPost = styled.View`
  width: ${Dimensions.get('window').width};
  align-items: center;
  background-color: #FFF;
  border-radius: 15px;
  margin-top: 2px;
`;
const ContainerHeader = styled.View`
  flex-direction: row;
  padding: 10px;
`;
const ContainerContentPost = styled.View`
  margin: 5px;
`;
const ContainerHeaderPost = styled.View`
  width: ${Dimensions.get('window').width - 70};
  flex-direction: row;
  align-items: center;
`;
const ImageHeaderPost = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;
const ContainerFooterPost = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;


export const HeaderPost = props => (
  <ContainerHeader>
    <ContainerHeaderPost>
      <TouchableOpacity onPress={() => props.clickImageProfile(props.assignedTo_id)} >
        <ImageHeaderPost resizeMode='cover' source={{ uri: props.thumbnail }} />
      </TouchableOpacity>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 22 }} >{`${props.firstName} ${props.lastName}`}</Text>
        <Text style={{ fontSize: 12 }} >@{props.nickname}</Text>
        <Text style={{ fontSize: 12 }} >email@gmail.com</Text>
      </View>
    </ContainerHeaderPost>
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.pushPost(props.post_id)}>
        <props.push_ico width={32} height={32} />
      </TouchableOpacity>
      <Text style={{ color: '#333' }}>{props.pushTimes}</Text>
    </View>
  </ContainerHeader>
);
export const ContentPost = props => (
  <ContainerContentPost>
    {props.postPhoto ? (
      <Image
        style={{
          width: props.postPhoto.width,
          height: props.postPhoto.height,
        }}
        resizeMode='contain'
        source={{ uri: props.postPhoto.content }}
      />
    ) : null}
    {props.content ? (
      <View style={{ paddingLeft: 15, paddingRight: 15 }}>
        <Text style={{ textAlign: 'left' }}>{props.content}</Text>
      </View>
    ) : null}
  </ContainerContentPost>
);

export const FooterPost = props => (
  <ContainerFooterPost>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.newComment(props.post_id)}>
        <CommentIco width={24} height={24} />
      </TouchableOpacity>
      <Text style={{ marginLeft: 2 }}>{props.comments.length}</Text>
    </View>
    <TouchableOpacity onPress={() => props.sharePost(props.post_id)}>
      <ShareIco width={24} height={24} />
    </TouchableOpacity>
  </ContainerFooterPost>
);

export const Post = props => (
  <ContainerPost>
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
      content={props.content}
      postPhoto={props.postPhoto}
    />

    <Comment
      user_id={props.user_id}
      comments={props.comments}
      commentController={props.commentController}
      clickImageProfile={props.clickImageProfile}
      editOrNewComment={props.editOrNewComment}
      post_id={props.post_id}
    />

    <FooterPost
      comments={props.comments}
      post_id={props.post_id}
      newComment={props.newComment}
      sharePost={props.sharePost}
    />
  </ContainerPost >
);