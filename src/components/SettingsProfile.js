import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Easing, StatusBar, Dimensions, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions';

import Api from '../api';

import { MinhaView } from "../styles/standard";
import { HeaderSettingsProfile, SettingsSocialMedia } from '../styles/settingsProfile';

class SettingsProfile extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      user: {
        name: {
          first: '',
          last: '',
          nickname: ''
        },
        socialMedia: {
          facebook: '',
          linkedin: '',
          tumblr: '',
          whatsapp: '',
          youtube: '',
        },
        photo: {
          thumbnail: '',
          originalPhoto: '',
        },
        bio: '',
      },
      update: {
        ok: true,
        message: 'Lembre-se de seguir como no exemplo nas Redes Sociais'
      },
      done: {
        ok: false,
        show: false,
        message: '',
      },
      imageUri: '',
      dataImage: '',
      oldNickname: '',
      currentPassword: '',
      changePassword: false,
      newPasswordOnChange: '',
      currentPasswordOnChange: '',
      settingsSocialMedia: false,
      animatedValueToChangePassword: new Animated.Value(0),
      animatedValueToSettingsSocialMediaAndCity: new Animated.Value(0),
      animatedValueToDoneMessageOrFailedMessage: new Animated.Value(0),
    };
  }

  async componentDidMount() {
    const currentPassword = await AsyncStorage.getItem('password');

    const config = {
      headers: {
        authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjODdiYzFlMTI0NTgyNDBmNDcxYzhmYiIsImlhdCI6MTU1Mjg0MDAzNSwiZXhwIjoxNTUyOTI2NDM1fQ.ppFUrSlSBiRBoUBQJBoFUqa_Jc00MtbaH7xSs6Edw58'
      }
    }

    Api.get('/users/profile/5c87bc1e12458240f471c8fb', config).then(({ data: user }) => {

      this.setState({ user: { ...this.state.user, ...user }, currentPassword, oldNickname: user.name.nickname });

      this.props.setUser({
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjODdiYzFlMTI0NTgyNDBmNDcxYzhmYiIsImlhdCI6MTU1Mjg0MDAzNSwiZXhwIjoxNTUyOTI2NDM1fQ.ppFUrSlSBiRBoUBQJBoFUqa_Jc00MtbaH7xSs6Edw58',
        user
      })

    })

    // this.setState({ user: { ...this.state.user, ...this.props.account.user }, currentPassword });
  }

  showOrHiddenOtherSettings() {

    if (!this.state.settingsSocialMedia) {
      return this.setState({ settingsSocialMedia: true }, () => {
        this.animeshowOrHiddenOtherSettings('show');
      });
    }

    this.animeshowOrHiddenOtherSettings('hidden');
  }

  animeshowOrHiddenOtherSettings(arg) {
    if (arg == 'show') {
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(
          this.state.animatedValueToSettingsSocialMediaAndCity,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.circle
          }
        )
      ]).start()
    }
    else if (arg == 'hidden') {
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(
          this.state.animatedValueToSettingsSocialMediaAndCity,
          {
            ToValue: 0,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.circle
          }
        )
      ]).start(() => {
        this.setState({ settingsSocialMedia: false });
        this.props.setUser({ token: this.props.account.token, user: this.state.user });
      });
    }
  }
  animeDoneMessage() {
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.animatedValueToDoneMessageOrFailedMessage,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.bounce
        }
      ),
      Animated.delay(3000),
      Animated.timing(
        this.state.animatedValueToDoneMessageOrFailedMessage,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.circle
        }
      )
    ]).start(() => {
      this.setState({
        done: {
          ...this.state.done,
          show: false
        }
      });
    });
  }

  doneOtherSettings() {

    if (this.state.currentPasswordOnChange) {

      if (this.state.currentPasswordOnChange != this.state.currentPassword) {
        return this.setState({
          update: {
            ok: false,
            message: 'A senha atual fornecida nao está correta'
          }
        }, () => this.scrollViewRef.scrollTo({ X: 0, y: 0 }));

      } else {
        this.setState({
          user: {
            ...this.state.user,
            password: this.state.newPasswordOnChange
          }
        });
        this.verifyEmail();
      }
    } else {
      this.setState({
        user: {
          ...this.state.user,
          password: this.state.currentPassword
        }
      }, () => this.verifyEmail());
    }
  }

  verifyEmail() {

    if (this.state.user.email != this.props.account.user.email) {

      const url = '/users/exists/' + this.state.user.email;

      Api.get(url).then(() => {

        this.showOrHiddenOtherSettings();

      }).catch(err => {
        if (err.response.data.error == 'User already exists') {
          this.setState({
            update: {
              ok: false,
              message: 'Esse email já esta sendo usado'
            }
          }, () => this.scrollViewRef.scrollTo({ X: 0, y: 0 }));
        }
      });
    } else {
      this.showOrHiddenOtherSettings();
    }
  }

  verifyNickname() {

    if (this.state.user.name.nickname != this.state.oldNickname) {
      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      const url = '/users/nicknameExists/' + this.state.user.name.nickname;

      Api.get(url, config).then(() => {
        this.upToApi();

      }).catch(err => {
        this.setState({ done: { ok: false, show: true, message: 'Esse apelido já está em uso' } }, () => {
          this.animeDoneMessage();
        });
      });
    } else {
      this.upToApi();
    }
  }

  upToApi() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const data = {
      userId: this.state.user._id,
      name: this.state.user.name,
      socialMedia: this.state.socialMedia,
      bio: this.state.user.bio,
      photo: this.state.user.photo,
      email: this.state.user.email,
      password: this.state.currentPassword
    }

    Api.put('/users/edit', data, config).then(() => {

      alert('Sucesso na api ao editar');

      this.setState({
        done: {
          ok: true,
          show: true,
          message: 'Sua conta foi atualizada c:'
        }
      }, () => {
        this.animeDoneMessage();
      });

    }).catch(err => {
      alert(err.response.data.error);
      return this.setState({
        done: {
          ok: false,
          show: true,
          message: 'Verifique sua internet'
        }
      }, () => this.animeDoneMessage());
    });
  }

  done() {
    this.verifyNickname();
  }

  setOtherSettingsValue(arg, value) {
    const obj = this.state;

    obj.user.socialMedia[arg] = value;

    this.setState(obj);
  }

  setUser(arg, value) {
    const obj = this.state.user;

    if (arg == 'first' || arg == 'last' || arg == 'nickname') {
      obj.name[arg] = value;
    }
    else {
      obj[arg] = value;
    }

    this.setState(obj);

  }
  changePassword() {
    if (!this.state.changePassword) {
      this.setState({ changePassword: true }, () => {
        Animated.sequence([
          Animated.delay(200),
          Animated.timing(
            this.state.animatedValueToChangePassword,
            {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
              easing: Easing.circle
            }
          )
        ]).start()
      });
    }
    else if (this.state.changePassword) {
      Animated.sequence([
        Animated.delay(200),
        Animated.timing(
          this.state.animatedValueToChangePassword,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.circe
          }
        )
      ]).start(() => {
        this.setState({ changePassword: false });
      })
    }
  }

  selectImage() {
    const options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {

      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          imageUri: { uri: 'data:image/jpeg;base64,' + response.data },
          dataImage: response.data
        });
      }
    });
  }

  getRefToScrollViewSettingsProfile(ref) {
    this.scrollViewRef = ref;
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }} >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        <HeaderSettingsProfile
          firstName={this.state.user.name.first}
          lastName={this.state.user.name.last}
          nickname={this.state.user.name.nickname}
          bio={this.state.user.bio}
          thumbnail={this.state.user.photo.thumbnail}
          goBack={this.props.navigation.goBack}
          showOrHiddenOtherSettings={this.showOrHiddenOtherSettings.bind(this)}
          selectImage={this.selectImage.bind(this)}
          done={this.done.bind(this)}
          setUser={this.setUser.bind(this)}
        />

        {this.state.settingsSocialMedia ? (
          <Animated.View
            style={{
              width: Dimensions.get('window').width - 50,
              height: Dimensions.get('window').height / 2,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: '#FFF',
              transform: [{
                translateY: this.state.animatedValueToSettingsSocialMediaAndCity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-Dimensions.get('window').height, Dimensions.get('window').height / 4]
                })
              }]
            }}
          >
            <SettingsSocialMedia
              showOrHiddenOtherSettings={this.showOrHiddenOtherSettings.bind(this)}
              setOtherSettingsValue={this.setOtherSettingsValue.bind(this)}
              doneOtherSettings={this.doneOtherSettings.bind(this)}
              socialMedia={this.state.user.socialMedia}
              stateToUpdate={this.state.update}
              user={this.state.user}
              setUser={this.setUser.bind(this)}
              changePassword={this.changePassword.bind(this)}
              getRef={this.getRefToScrollViewSettingsProfile.bind(this)}
            />
          </Animated.View>
        ) : null}

        {this.state.changePassword ? (
          <Animated.View
            style={{
              width: Dimensions.get('window').width - 50,
              top: Dimensions.get('window').height / 2,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 20,
              borderRadius: 10,
              backgroundColor: '#FFF',
              transform: [{
                translateX: this.state.animatedValueToChangePassword.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-Dimensions.get('window').width, 0]
                })
              }]
            }}
          >
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 10, margin: 10 }}>
              <TextInput onChangeText={e => this.setState({ currentPasswordOnChange: e })} placeholder='Senha Atual' ></TextInput>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 20, padding: 10, margin: 10 }}>
              <TextInput onChangeText={e => this.setState({ newPasswordOnChange: e })} placeholder='Nova senha' ></TextInput>
            </View>
            <TouchableOpacity onPress={() => this.changePassword()}>
              <Text style={{ color: '#08F', fontSize: 16 }}>Certo</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : null}

        {this.state.done.show ? (
          <Animated.View
            style={{
              width: Dimensions.get('window').width - 50,
              position: 'absolute',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 18,
              borderRadius: 20,
              backgroundColor: '#08F',
              transform: [{
                translateY: this.state.animatedValueToDoneMessageOrFailedMessage.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').height, Dimensions.get('window').height / 1.5]
                })
              }]
            }}
          >
            <Text style={{ fontSize: 16, color: '#FFF' }}>{this.state.done.message}</Text>
          </Animated.View>
        ) : null}
      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsProfile);