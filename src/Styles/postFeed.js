import React from 'react';
import { View, Image, Text, Dimensions, TouchableOpacity } from 'react-native';

import styled from 'styled-components/native';

import CommentIco from '../assets/CommentDiaD.svg';
import ShareIco from '../assets/ShareDiaD.svg';
import EditIco from '../assets/EditDiaD.svg';


const ContainerPost = styled.View`
  width: ${Dimensions.get('window').width};
  align-items: center;
  background-color: #FFF;
  border-radius: 15px;
  margin-top: 2px;
`;
const HeaderContainer = styled.View`
  flex-direction: row;
  padding: 10px;
`;
const PostHeaderContainer = styled.View`
  width: ${Dimensions.get('window').width - 70};
  flex-direction: row;
  align-items: center;
`;
const ImageHeaderPost = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;
const PostFooterContainer = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;

export const FeedHeaderOfPost = props => (
  <HeaderContainer>
    <PostHeaderContainer>
      <TouchableOpacity onPress={() => props.clickImageProfile(/*props.assignedTo_id*/)} >
        <ImageHeaderPost resizeMode='cover' source={{ uri: props.thumbnail }} />
      </TouchableOpacity>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 22 }} >{`${props.firstName} ${props.lastName}`}</Text>
        <Text style={{ fontSize: 12 }} >@{props.nickname}</Text>
        <Text style={{ fontSize: 12 }} >email@gmail.com</Text>
      </View>
    </PostHeaderContainer>
    <View style={{ alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.pushPost(/*porps.post_id*/)}>
        <props.push_ico width={32} height={32} />
      </TouchableOpacity>
      <Text style={{ color: '#333' }}>{props.pushTimes}</Text>
    </View>
  </HeaderContainer>
);
export const ProfileHeaderOfPost = props => (
  <HeaderContainer style={{justifyContent: 'space-between'}}>
    <Text>{`${props.postDate[0]} ${props.postDate[1]} ${props.postDate[2]}`}</Text>
      <Text>{props.category}</Text>
      {props.user_id == props.post_user_id ? (
      <TouchableOpacity onPress={() => props.editPost(props.post_id)}>
        <EditIco width={24} height={24} />
      </TouchableOpacity>
    ) : (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 12, marginRight: 5 }}>{props.pushTimes}</Text>
          <TouchableOpacity onPress={() => props.pushPost(props.post_id)}>
            <props.push_ico width={24} height={24} />
          </TouchableOpacity>
        </View>
      )}
  </HeaderContainer>
);
export const ContentPost = props => (
  <View>
    {props.content ? (
      <View style={{ paddingHorizontal: 15 }}>
        <Text style={{ textAlign: 'left', color: '#333', fontSize: 16 }}>{props.content}</Text>
      </View>
    ) : null}
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
  </View>
);

export const FooterPost = props => (
  <PostFooterContainer>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => props.newComment(props.post_id)}>
        <CommentIco width={24} height={24} />
      </TouchableOpacity>
      <Text style={{ marginLeft: 2 }}>{props.commentsLength}</Text>
    </View>
    <TouchableOpacity onPress={() => props.sharePost(props.post_id)}>
      <ShareIco width={24} height={24} />
    </TouchableOpacity>
  </PostFooterContainer>
);
