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

const TAM_MAX_PHOTO = 120;
const TAM_MIN_PHOTO = 60;
const POS_MAX_PHOTO = { x: Dimensions.get('window').width / 2, y: 120 };
const POS_MIN_PHOTO = { x: 20, y: 100 };
const POS_MAX_TEXT = { x: Dimensions.get('window').width / 2, y: 160 }


export const HeaderProfile = props => (
  // <ContainerHeaderProfile>
  // </ContainerHeaderProfile>
  <Animated.View
    style={{
      width: Dimensions.get('window').width,
      height: props.animatedValueFromScrollY.interpolate({
        inputRange: [0, props.tamFrameProfile - 100],
        outputRange: [props.tamFrameProfile, 100],
        extrapolate: 'clamp'
      }),
      backgroundColor: '#FFF',
    }}
  >

    <Animated.Image
      style={{
        borderRadius: 4,
        position: 'absolute',
        top: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 250],
          outputRange: [40, 20],
          extrapolate: 'clamp'
        }),
        left: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [(Dimensions.get('window').width / 2) - 120 / 2, 60],
          extrapolate: 'clamp'
        }),
        width: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [120, 60],
          extrapolate: 'clamp'
        }),
        height: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [120, 60],
          extrapolate: 'clamp'
        }),
        transform: [{
          translateX: props.animatedValueToTransform.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').width / 4, 0]
          }),
        }]
      }}
      resizeMode='cover'
      source={{ uri: props.thumbnail }}
    />

    <Animated.Text
      style={{
        color: '#333',
        textAlign: 'center',
        position: 'absolute',
        top: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100, 250],
          outputRange: [160, 140, 20],
          extrapolate: 'clamp'
        }),
        left: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 120],
          outputRange: [0, 125],
          extrapolate: 'clamp'
        }),
        fontSize: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [26, 14],
          extrapolate: 'clamp'
        }),
        width: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [Dimensions.get('window').width, 140],
          extrapolate: 'clamp'
        }),
      }}
    >
      {props.firstName + ' ' + props.lastName}
    </Animated.Text>
    <Animated.Text
      style={{
        color: '#333',
        textAlign: 'center',
        position: 'absolute',
        top: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100, 250],
          outputRange: [200, 170, 35],
          extrapolate: 'clamp'
        }),
        left: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 120],
          outputRange: [0, 125],
          extrapolate: 'clamp'
        }),
        fontSize: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [16, 10],
          extrapolate: 'clamp'
        }),
        width: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 200],
          outputRange: [Dimensions.get('window').width, 140],
          extrapolate: 'clamp'
        }),
      }}
    >
      @{props.nickname}
    </Animated.Text>



    <Animated.View
      style={{
        alignItems: 'center',
        position: 'absolute',
        top: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100],
          outputRange: [240, 220],
          extrapolate: 'clamp'
        }),
        height: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 120],
          outputRange: [props.tamBio, 0],
          extrapolate: 'clamp'
        }),
        opacity: props.animatedValueFromScrollY.interpolate({
          inputRange: [0, 100, 120],
          outputRange: [1, 1, 0],
          extrapolate: 'clamp'
        }),
        transform: [{
          translateY: props.animatedValueToTransform.interpolate({
            inputRange: [0, 1],
            outputRange: [Dimensions.get('window').height * 2, 0]
          })
        }],
      }}
    >

      <SocialMedia
        clickSocialMedia={props.clickSocialMedia}
        socialMedia={props.socialMedia}
      />

      <BioHeaderProfile bio={props.bio} />

      {props.bio && props.socialMedia ? (
        <View
          style={{
            width: 200,
            height: 0.5,
            backgroundColor: '#333',
            position: 'absolute',
            top: -10,
          }}
        />
      ) : null}

    </Animated.View>

    <GoBackOrConfigOrFollow // Position Absolute
      goBack={props.goBack}
      follow={props.follow}
      following={props.following}
      settings={props.settings}
      user_id={props.user_id}
      my_user_id={props.my_user_id}
    />

    {/* <View style={{ width: Dimensions.get('window').width, height: 3, backgroundColor: '#E8E8E8' }} /> */}
  </Animated.View>
);
