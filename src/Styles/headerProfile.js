import React from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, Animated, ScrollView } from 'react-native';

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
    <TouchableOpacity onPress={() => props.goBack()} >
      <GoBackIco width={32} height={32} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.settings('SettingsProfile')}>
      <ConfigIco width={32} height={32} />
    </TouchableOpacity>
  </ContainerBackConfig>
);
const BioHeaderProfile = props => (
  <ContainerBio>
    <ScrollView>
      <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 10 }}>
        {props.bio}
      </Text>
    </ScrollView>
  </ContainerBio>
);
export const HeaderProfile = props => (
  <ContainerHeaderProfile>
    <GoBackConfig goBack={props.goBack} settings={props.settings} />
    <Animated.Image
      style={{
        width: props.animatedValueToProfileImage,
        height: props.animatedValueToProfileImage,
        borderRadius: 60,
        marginTop: 20,
        marginBottom: 10
      }}
      resizeMode='cover'
      source={{ uri: props.thumbnail }}
    />
    <Text style={{ fontSize: 28, color: '#333' }}>{`${props.firstName} ${props.lastName}`}</Text>
    <Text style={{ fontSize: 16, color: '#333' }}>@{props.nickname}</Text>
    <Separator />
    <Animated.View style={{ height: props.animatedValueToBioView, alignItems: 'center' }}>
      <SocialMedia />
      <BioHeaderProfile bio={props.bio} />
    </Animated.View>
    <View style={{ width: Dimensions.get('window').width, height: 3, backgroundColor: '#E8E8E8' }} />
  </ContainerHeaderProfile>
);
