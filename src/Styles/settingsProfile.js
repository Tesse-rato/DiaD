import React from 'react'
import { View, Text, TextInput, Image, TouchableOpacity, Dimensions, Picker, ScrollView } from 'react-native';

import styled from 'styled-components/native';
import GoBackIcon from '../assets/GoBackDiaD.svg';
import DoneIco from '../assets/DoneDiaD.svg';
import FaceBookIco from '../assets/Facebook.svg';
import LinkedinIco from '../assets/Linkedin.svg';
import TumblrIco from '../assets/Tumblr.svg';
import WhatsAppIco from '../assets/WhatsApp.svg';
import YouTubeIco from '../assets/YouTube.svg';
import EmailIco from '../assets/EmailBlackDiaD.svg';
import PasswordIco from '../assets/PassWordBlackDiaD.svg';
import NicknameIco from '../assets/UserBlackDiaD.svg';
import UserIco from '../assets/UserBlackDiaD.svg';

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
  width: ${Dimensions.get('window').width - 100};
  background-color: #FFF;
  align-items: center;
  border-radius: 10px;
  padding: 10px;
  margin-top: 10px;
  border-width: 0.5px;
  border-color: #08F;
`;
const ButtonSettingsMediaSocialAndCity = props => (
  <TouchableOpacity onPress={() => props.showOrHiddenOtherSettings()}>
    <ContainerContentSettingsProfile>
      <Text>Outras configurações</Text>
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
      <Image style={{ width: 120, height: 120, borderRadius: 60, marginTop: 20, marginBottom: 10 }} source={{ uri: props.thumbnail }} />
    </TouchableOpacity>

    <View style={{ height: 50, flexDirection: 'row', alignItems: 'center' }}>
      <TextInput onChangeText={e => props.setUser('first', e)} value={props.firstName} style={{ fontSize: 28, color: '#333' }} />
      <TextInput onChangeText={e => props.setUser('last', e)} value={props.lastName} style={{ fontSize: 28, color: '#333' }} />
    </View>
    <View style={{ height: 45, flexDirection: 'row', alignItems: 'center' }}>
      <Text>@</Text>
      <TextInput onChangeText={e => props.setUser('nickname', e)} value={props.nickname} style={{ fontSize: 16, color: '#333' }} />
    </View>

    <Separator />

    <ButtonSettingsMediaSocialAndCity showOrHiddenOtherSettings={props.showOrHiddenOtherSettings} />

    <ScrollView>
      <TextInput onChangeText={e => props.setUser('bio', e)} value={props.bio} multiline style={{ textAlign: 'center' }} />
    </ScrollView>

  </ContainerHeaderSettingsProfile>
);


const ContainerSettingsSocialMediaEndCity = styled.View`
  position: absolute;
  top: 20px;
  width: ${Dimensions.get('window').width};
  height: ${Dimensions.get('window').height - 280};
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 20px;
  background-color: #FFF;
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
  width: 50px;
  height: 50px;
  margin: 10px;
  border-radius: 25px;
  align-items: center;
  justify-content: center;
  background-color: #FFF;
  border-width: 0.5px;
  border-color: ${props => props.stateToUpdate.ok ? '#0F0' : '#F00'};
`;
const MeuTextInput = styled.TextInput`
  width: ${Dimensions.get('window').width - 70};
`;
const MeuPicker = styled.Picker`
  width: ${Dimensions.get('window').width - 60};
`;
export const SettingsSocialMedia = props => (
  <ContainerSettingsSocialMediaEndCity >

    <TouchableOpacity onPress={() => props.doneOtherSettings()}>
      <ContainerDone stateToUpdate={props.stateToUpdate}>
        <DoneIco width={24} height={24} />
      </ContainerDone>
    </TouchableOpacity>

    <ScrollView ref={ref => props.getRef(ref)} showsVerticalScrollIndicator={false} >
      <View style={{ flex: 1, margin: 20, padding: 10, borderRadius: 10, backgroundColor: '#FFF' }}>
        <Text style={{ color: '#08F', fontSize: 14, textAlign: 'center' }}>{props.stateToUpdate.message}</Text>
      </View>
      <ContainerSettings>
        <FaceBookIco width={24} height={24} />
        <MeuTextInput value={props.socialMedia.facebook} onChangeText={e => props.setOtherSettingsValue('facebook', e)} placeholder='https://facebook.com/NomeDeUsuario' />
      </ContainerSettings>
      <ContainerSettings>
        <LinkedinIco width={24} height={24} />
        <MeuTextInput value={props.socialMedia.linkedin} onChangeText={e => props.setOtherSettingsValue('linkedin', e)} placeholder='https://linkedin.com/in/NomeDeUsuario' />
      </ContainerSettings>
      <ContainerSettings>
        <TumblrIco width={24} height={24} />
        <MeuTextInput value={props.socialMedia.tumblr} onChangeText={e => props.setOtherSettingsValue('tumblr', e)} placeholder='https://url.tumblr.com/' />
      </ContainerSettings>
      <ContainerSettings>
        <WhatsAppIco width={24} height={24} />
        <MeuTextInput value={props.socialMedia.whatsapp} onChangeText={e => props.setOtherSettingsValue('whatsapp', e)} placeholder='(0XX) XXXXX-XXXX' />
      </ContainerSettings>
      <ContainerSettings>
        <YouTubeIco width={24} height={24} />
        <MeuTextInput value={props.socialMedia.youtube} onChangeText={e => props.setOtherSettingsValue('youtube', e)} placeholder='https://youtube.com/channel/_ID' />
      </ContainerSettings>
      <ContainerSettings>
        <NicknameIco width={24} height={24} />
        <MeuTextInput value={props.user.name.nickname} onChangeText={e => props.setUser('nickname', e)} placeholder='Apelido' />
      </ContainerSettings>
      <ContainerSettings>
        <EmailIco width={24} height={24} />
        <MeuTextInput value={props.user.email} onChangeText={e => props.setUser('email', e)} placeholder='Email' />
      </ContainerSettings>
      <TouchableOpacity onPress={() => props.changePassword()}>
        <ContainerSettings>
          <PasswordIco width={24} height={24} />
          <Text style={{ marginLeft: 4 }}>Alterar Senha</Text>
        </ContainerSettings>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.logOut()}>
        <ContainerSettings>
          <UserIco width={24} height={24} />
          <Text style={{ marginLeft: 4 }}>LogOut</Text>
        </ContainerSettings>
      </TouchableOpacity>
      <ContainerSettings>
        <MeuPicker>
          <Picker.Item label='Tupaciguara' value='tupaciguara' />
          <Picker.Item label='Uberlandia' value='uberlandia' />
        </MeuPicker>
      </ContainerSettings>
    </ScrollView>
  </ContainerSettingsSocialMediaEndCity>
);
