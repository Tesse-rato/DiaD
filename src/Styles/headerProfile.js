import React from 'react';
import { Dimensions, View, Text, Image, TouchableOpacity, Animated, ScrollView } from 'react-native';

import styled from 'styled-components/native';

import GoBackIco from '../assets/GoBackDiaD.svg';
import ConfigIco from '../assets/ConfigDiaD.svg';
import FaceBookIco from '../assets/Facebook.svg';
import LinkedinIco from '../assets/Linkedin.svg';
import TumblrIco from '../assets/Tumblr.svg';
import WhatsAppIco from '../assets/WhatsApp.svg';
import YouTubeIco from '../assets/YouTube.svg';
import FollowIco from '../assets/Follow.svg';
import DontFollowIco from '../assets/DontFollow.svg';

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
    {props.socialMedia.facebook ? (
      <TouchableOpacity onPress={() => props.clickSocialMedia('facebook')}>
        <FaceBookIco width={24} height={24} />
      </TouchableOpacity>
    ) : null}
    {props.socialMedia.linkedin ? (
      <TouchableOpacity onPress={() => props.clickSocialMedia('linkedin')}>
        <LinkedinIco width={24} height={24} />
      </TouchableOpacity>
    ) : null}
    {props.socialMedia.tumblr ? (
      <TouchableOpacity onPress={() => props.clickSocialMedia('tumblr')}>
        <TumblrIco width={24} height={24} />
      </TouchableOpacity>
    ) : null}
    {props.socialMedia.whatsapp ? (
      <TouchableOpacity onPress={() => props.clickSocialMedia('whatsapp')}>
        <WhatsAppIco width={24} height={24} />
      </TouchableOpacity>
    ) : null}
    {props.socialMedia.youtube ? (
      <TouchableOpacity onPress={() => props.clickSocialMedia('youtube')}>
        <YouTubeIco width={24} height={24} />
      </TouchableOpacity>
    ) : null}
  </ContainerSocialMedia>
);
const GoBackOrConfigOrFollow = props => (
  <ContainerBackConfig>
    <TouchableOpacity onPress={() => props.goBack()} >
      <GoBackIco width={32} height={32} />
    </TouchableOpacity>
    {props.user_id.toString() == props.my_user_id.toString() ? (
      <TouchableOpacity onPress={() => props.settings()}>
        <ConfigIco width={32} height={32} />
      </TouchableOpacity>
    ) : props.following ? (
      <TouchableOpacity onPress={() => props.follow(props.user_id)} >
        <FollowIco width={42} height={42} />
      </TouchableOpacity>
    ) : (
          <TouchableOpacity onPress={() => props.follow(props.user_id)} >
            <DontFollowIco width={42} height={42} />
          </TouchableOpacity>
        )}
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
    <GoBackOrConfigOrFollow
      goBack={props.goBack}
      follow={props.follow}
      following={props.following}
      settings={props.settings}
      user_id={props.user_id}
      my_user_id={props.my_user_id}
    />

    <Animated.Image
      style={{
        width: props.animatedValueToProfileImage,
        height: props.animatedValueToProfileImage,
        borderRadius: 4,
        marginTop: 20,
        marginBottom: 10,
        transform: [{
          translateX: props.animatedValueToTransform.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').width, 0]
          }),
        }]
      }}
      resizeMode='cover'
      source={{ uri: props.thumbnail }}
    />

    <Animated.View
      style={{
        alignItems: 'center',
        transform: [{
          translateY: props.animatedValueToTransform.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').height * 2, 0]
          })
        }]
      }}
    >
      <Text style={{ textAlign: 'center', fontSize: 28, color: '#333' }}>{`${props.firstName} ${props.lastName}`}</Text>
      <Text style={{ textAlign: 'center', fontSize: 16, color: '#333' }}>@{props.nickname}</Text>

      <Separator />

      <Animated.View style={{ height: props.animatedValueToBioView, alignItems: 'center' }}>

        <SocialMedia
          clickSocialMedia={props.clickSocialMedia}
          socialMedia={props.socialMedia}
        />

        <BioHeaderProfile bio={props.bio} />
      </Animated.View>
    </Animated.View>

    <View style={{ width: Dimensions.get('window').width, height: 3, backgroundColor: '#E8E8E8' }} />
  </ContainerHeaderProfile>
);
