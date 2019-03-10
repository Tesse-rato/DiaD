import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';

import styled from 'styled-components/native';

import FlameBlue from '../assets/FlameBlueDiaD.svg';
import CommentIco from '../assets/CommentDiaD.svg';
import ShareIco from '../assets/ShareDiaD.svg';

import { Comment } from './comment';


const ContainerPost = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  background-color: #FFF;
  border-radius: 5px;
  margin-top: 10px;
`;
export const ContainerHeaderPost = styled.View`
  flex-direction: row;
  padding: 10px;
`;
export const ContainerContentPost = styled.View`
  margin: 10px;
`;
export const HeaderPost = styled.View`
  width: ${Dimensions.get('window').width - 70};
  flex-direction: row;
  align-items: center;
`;
export const ImageHeaderPost = styled.Image`
  width: 60px;
  height: 60px;
  border-radius: 30px;
`;
export const ContainerFooterPost = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  justify-content: space-between;
  flex-direction: row;
  padding: 10px;
`;
export const Header = props => (
  <ContainerHeaderPost style={{ flexDirection: 'row', padding: 10 }}>
    <HeaderPost>
      <TouchableOpacity>
        <ImageHeaderPost resizeMode='cover' source={{ uri: 'http://192.168.1.2:3333/selfie.jpg' }} />
      </TouchableOpacity>
      <View style={{ marginLeft: 8 }}>
        <Text style={{ fontSize: 22 }} >Nome Sobrenome</Text>
        <Text style={{ fontSize: 12 }} >@ap3liDo</Text>
        <Text style={{ fontSize: 12 }} >email@gmail.com</Text>
      </View>
    </HeaderPost>
    <View style={{ alignItems: 'center' }}>
      <FlameBlue width={32} height={32} />
      <Text style={{ color: '#333' }}>4235</Text>
    </View>
  </ContainerHeaderPost>
);
export const ContentPost = props => (
  <ContainerContentPost>
    <Text style={{ textAlign: 'center' }}>{props.content}</Text>
  </ContainerContentPost>
);
export const FooterPost = props => (
  <ContainerFooterPost>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity>
        <CommentIco width={24} height={24} />
      </TouchableOpacity>
      <Text>54</Text>
    </View>
    <TouchableOpacity>
      <ShareIco width={24} height={24} />
    </TouchableOpacity>
  </ContainerFooterPost>
);

export const Post = props => (
  <ContainerPost>
    <Header />
    <ContentPost content={props.content} />
    <Comment comments={props.comments} debug={props.debug} />
    <FooterPost />
  </ContainerPost >
);