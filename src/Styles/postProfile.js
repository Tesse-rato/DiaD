import React from 'react';
import { View, Text, Dimensions, TouchableOpacity } from 'react-native'

import styled from 'styled-components/native';
import CommentIco from '../assets/CommentDiaD.svg';
import ShareIco from '../assets/ShareDiaD.svg';

import { Comment } from './comment';


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
const ContainerFooterPost = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;

const HeaderPostProfile = props => (
  <ContainerHeaderPostProfile>
    <Text>{`${props.datePost[0]} ${props.datePost[1]} ${props.datePost[2]}`}</Text>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text style={{ fontSize: 12, marginRight: 5 }}>{props.pushTimes}</Text>
      <TouchableOpacity onPress={() => props.pushPost(props.post_id)}>
        <props.push_ico width={24} height={24} />
      </TouchableOpacity>
    </View>
  </ContainerHeaderPostProfile>
);
const ContentPostProfile = props => (
  <ContainerContentPostProfile>
    <Text style={{ textAlign: 'center' }}>{props.content}</Text>
  </ContainerContentPostProfile>
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
export const PostProfile = props => (
  <ContainerPostProfile>
    <HeaderPostProfile
      post_id={props.post_id}
      push_ico={props.push_ico}
      pushPost={props.pushPost}
      datePost={props.datePost}
      pushTimes={props.pushTimes}
    />

    <ContentPostProfile content={props.content} />

    <Comment
      user_id={props.user_id}
      comments={props.comments}
      commentController={props.commentController}
      debug={props.debug}
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

  </ContainerPostProfile>
);
