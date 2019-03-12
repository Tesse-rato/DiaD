import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, Picker } from 'react-native';

import { ScrollView } from 'react-native-gesture-handler'

import styled from 'styled-components/native';
import GoBackIcon from '../assets/GoBackDiaD.svg';
import DoneIco from '../assets/DoneDiaD.svg';
import FaceBookIco from '../assets/Facebook.svg';
import LinkedinIco from '../assets/Linkedin.svg';
import TumblrIco from '../assets/Tumblr.svg';
import WhatsAppIco from '../assets/WhatsApp.svg';
import YouTubeIco from '../assets/YouTube.svg';

const ContainerHeaderSettingsProfile = styled.View`
  width: ${Dimensions.get('window').width};
  align-items: center;
  background-color: #FFF;
  margin-bottom: 10px;
`;
const ContainerGoBackDone = styled.View`
  width: ${Dimensions.get('window').width};
  justify-content: space-between;
  flex-direction: row;
  position: absolute;
  padding: 20px;
  top: 10px;
`;
const Separator = styled.View`
  width: ${Dimensions.get('window').width - 80};
  height: 0.5px;
  background-color: #333;
  margin: 10px;
`;
const ContainerContentSettingsProfile = styled.View`
  width: ${Dimensions.get('window').width - 13};
  background-color: #FFF;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  border-width: 0.5px;
  border-color: #08F;
`;
const ContentSettingsProfile = props => (
  <TouchableOpacity onPress={() => props.socialMediaEndCity()}>
    <ContainerContentSettingsProfile>
      <Text>Midias Sociais e Cidade</Text>
    </ContainerContentSettingsProfile>
  </TouchableOpacity>
);
const GoBackDone = props => (
  <ContainerGoBackDone>
    <TouchableOpacity onPress={() => props.goBack()} >
      <GoBackIcon width={32} height={32} />
    </TouchableOpacity>
    <TouchableOpacity onPress={() => props.done()} >
      <DoneIco width={32} height={32} />
    </TouchableOpacity>
  </ContainerGoBackDone>
);
export const HeaderSettingsProfile = props => (
  <ContainerHeaderSettingsProfile>
    <GoBackDone goBack={props.goBack} done={props.done} />
    <TouchableOpacity onPress={() => props.selectImage()}>
      <Image style={{ width: 120, height: 120, borderRadius: 60, marginTop: 20, marginBottom: 10 }} source={{ uri: 'http://192.168.1.2:3333/selfie.jpg' }} />
    </TouchableOpacity>
    <TextInput value={props.name} style={{ fontSize: 28, color: '#333' }} />
    <TextInput value={props.nickname} style={{ fontSize: 16, color: '#333' }} />
    <Separator />
    <ContentSettingsProfile socialMediaEndCity={props.socialMediaEndCity} >
    </ContentSettingsProfile>
    <TextInput value={props.bio} multiline style={{ textAlign: 'center' }} />
    {props.SettingsSocialMedia ? (<SettingsSocialMedia doneSocialMediaAndCity={props.socialMediaEndCity} />) : null}
  </ContainerHeaderSettingsProfile>
);


const ContainerSettingsSocialMediaEndCity = styled.View`
  position: absolute;
  width: ${Dimensions.get('window').width};
  height: ${Dimensions.get('window').height - 280};
  background-color: #E8E8E8;
  align-items: center;
  justify-content: center;
  top: 20px;
  border-radius: 10px;
`;

const ContainerSettings = styled.View`
  width: ${Dimensions.get('window').width - 30};
  padding: 10px;
  background-color: #FFF;
  margin: 5px;
  border-radius: 10px;
  flex-direction: row;
  align-items: center;
`;
const ContainerDone = styled.View`
  width: 40px;
  height: 40px;
  margin: 10px;
  border-radius: 20px;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
`;
const MeuTextInput = styled.TextInput`
  width: ${Dimensions.get('window').width - 30};
`;
const MeuPicker = styled.Picker`
  width: ${Dimensions.get('window').width - 60};
`;
export const SettingsSocialMedia = props => (
  <ContainerSettingsSocialMediaEndCity >
    <TouchableOpacity onPress={() => props.doneSocialMediaAndCity()}>
      <ContainerDone>
        <DoneIco width={24} height={24} />
      </ContainerDone>
    </TouchableOpacity>
    <ScrollView >
      <ContainerSettings>
        <FaceBookIco width={24} height={24} />
        <MeuTextInput placeholder='facebook.com/NomeDeUsuario' />
      </ContainerSettings>
      <ContainerSettings>
        <LinkedinIco width={24} height={24} />
        <MeuTextInput placeholder='linkedin.com/in/NomeDeUsuario' />
      </ContainerSettings>
      <ContainerSettings>
        <TumblrIco width={24} height={24} />
        <MeuTextInput placeholder='url.tumblr.com/' />
      </ContainerSettings>
      <ContainerSettings>
        <WhatsAppIco width={24} height={24} />
        <MeuTextInput placeholder='(0XX) XXXXX-XXXX' />
      </ContainerSettings>
      <ContainerSettings>
        <YouTubeIco width={24} height={24} />
        <MeuTextInput placeholder='youtube.com/channel/_ID' />
      </ContainerSettings>
      <ContainerSettings>
        <MeuPicker>
          <Picker.Item label='Tupaciguara' value='tupaciguara' />
          <Picker.Item label='Uberlandia' value='uberlandia' />
        </MeuPicker>
      </ContainerSettings>
    </ScrollView>
  </ContainerSettingsSocialMediaEndCity>
);
