import React from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, Animated } from 'react-native';

import styled from 'styled-components/native';

import { MinhaView } from "./standard";

import GoBackIco from '../assets/GoBackDiaD.svg';
import ConfigIco from '../assets/ConfigDiaD.svg';
import FaceBookIco from '../assets/Facebook.svg';
import LinkedinIco from '../assets/Linkedin.svg';
import TumblrIco from '../assets/Tumblr.svg';
import WhatsAppIco from '../assets/WhatsApp.svg';
import YouTubeIco from '../assets/YouTube.svg';



export const ContainerHeaderProfile = styled.View`
  width: ${Dimensions.get('window').width};
  background-color: #fff;
  align-items: center;
`;
const ImageProfile = styled.Image`
  width: 120px;
  height: 120px;
  border-radius: 60px;
  margin-bottom: 20px;
  margin-top: 20px;
`;
const ContainerBackConfig = styled.View`
  width: ${Dimensions.get('window').width};
  position: absolute;
  top: 0px;
  padding: 20px;
  justify-content: space-between;
  flex-direction: row;
`;
const Separator = styled.View`
  width: ${Dimensions.get('window').width - 80};
  height: 0.5px;
  background-color: #333;
  margin: 10px;
`;
const ContainerBio = styled.View`
  padding: 20px;
`;
const ContainerSocialMedia = styled.View`
  width: ${Dimensions.get('window').width - 100};
  flex-direction: row;
  justify-content: space-around;
`;
const ContainerPostProfile = styled.View`
  width: ${Dimensions.get('window').width - 13};
  align-items: center;
  background-color: #FFF;
  border-radius: 10px;
`;
const SocialMedia = props => (
  <ContainerSocialMedia>
    <TouchableOpacity>
      <FaceBookIco width={24} height={24} />
    </TouchableOpacity>
    <TouchableOpacity>
      <LinkedinIco width={24} height={24} />
    </TouchableOpacity>
    <TouchableOpacity>
      <TumblrIco width={24} height={24} />
    </TouchableOpacity>
    <TouchableOpacity>
      <WhatsAppIco width={24} height={24} />
    </TouchableOpacity>
    <TouchableOpacity>
      <YouTubeIco width={24} height={24} />
    </TouchableOpacity>
  </ContainerSocialMedia>
);
const GoBackConfig = props => (
  <ContainerBackConfig>
    <TouchableOpacity>
      <GoBackIco width={32} height={32} />
    </TouchableOpacity>
    <TouchableOpacity>
      <ConfigIco width={32} height={32} />
    </TouchableOpacity>
  </ContainerBackConfig>
);
const BioHeaderProfile = props => (
  <ContainerBio>
    <Text style={{ textAlign: 'center', fontSize: 14 }}>
      {props.bio}
    </Text>
  </ContainerBio>
);
export const HeaderProfile = props => (
  <ContainerHeaderProfile>
    <GoBackConfig />
    <Animated.Image
      style={{
        width: props.animatedValueToProfileImage,
        height: props.animatedValueToProfileImage,
        borderRadius: 60,
        marginTop: 20,
        marginBottom: 10
      }}
      resizeMode='cover'
      source={{ uri: 'http://192.168.1.2:3333/selfie.jpg' }}
    />
    <Text style={{ fontSize: 28, color: '#333' }}>Amanda Lee</Text>
    <Text style={{ fontSize: 16, color: '#333' }}>@LeeManda</Text>
    <Separator />
    <Animated.View style={{ height: props.animatedValueToBioView, alignItems: 'center' }}>
      <SocialMedia />
      <BioHeaderProfile bio={props.bio} />
    </Animated.View>
    <View style={{ width: Dimensions.get('window').width, height: 3, backgroundColor: '#E8E8E8' }} />
  </ContainerHeaderProfile>
);

export const PostProfile = props => (
  <ContainerPostProfile>

  </ContainerPostProfile>
);