import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  Easing,
  StatusBar,
  Dimensions,
  AsyncStorage,
  FlatList,
  ProgressBarAndroid
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions';

import Api from '../api';

import { MinhaView } from "../styles/standard";
import { HeaderSettingsProfile, SettingsSocialMedia } from '../styles/settingsProfile';
import { PostProfile } from '../styles/postProfile';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';

import Debug from '../funcs/debug';
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
        email: '',
        password: '',
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
      commentController: {
        edit: false,
        upload: false,
        commentId: '',
        newComment: false,
        tempCommentContent: '',
      },
      newComment: {
        postId: '',
        content: '',
      },
      loading: true,
      changed: false,
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
    // const currentPassword = await AsyncStorage.getItem('password');
    // const posts = await this.props.navigation.getParam('posts');
    // this.animFeedContainer = this.props.navigation.getParam('animFeedContainer');

    // // const config = {
    // //   headers: {
    // //     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjODdiYzFlMTI0NTgyNDBmNDcxYzhmYiIsImlhdCI6MTU1Mjg0MDAzNSwiZXhwIjoxNTUyOTI2NDM1fQ.ppFUrSlSBiRBoUBQJBoFUqa_Jc00MtbaH7xSs6Edw58'
    // //   }
    // // }

    // // Api.get('/users/profile/5c87bc1e12458240f471c8fb', config).then(({ data: user }) => {

    // //   this.setState({ user: { ...this.state.user, ...user }, currentPassword, oldNickname: user.name.nickname });

    // //   this.props.setUser({
    // //     token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjODdiYzFlMTI0NTgyNDBmNDcxYzhmYiIsImlhdCI6MTU1Mjg0MDAzNSwiZXhwIjoxNTUyOTI2NDM1fQ.ppFUrSlSBiRBoUBQJBoFUqa_Jc00MtbaH7xSs6Edw58',
    // //     user
    // //   })

    // // })

    // this.setState({
    //   posts,
    //   loading: false,
    //   currentPassword,
    //   user: { ...this.state.user, ...this.props.account.user },
    //   oldNickname: this.props.account.user.name.nickname
    // });
    this.setUserData();
  }
  async setUserData() {
    const currentPassword = await AsyncStorage.getItem('password');
    const posts = await this.props.navigation.getParam('posts');
    const user = await this.props.navigation.getParam('user');
    this.animFeedContainer = this.props.navigation.getParam('animFeedContainer');

    this.setState({
      posts,
      loading: false,
      currentPassword,
      user: { ...this.state.user, ...user },
      oldNickname: user.name.nickname
    });
  }

  showOrHideOtherSettings() {

    if (!this.state.settingsSocialMedia) {
      return this.setState({ settingsSocialMedia: true }, () => {
        this.animeBoxOtherSettings('show');
      });
    }

    this.animeBoxOtherSettings('hidden');
  }

  animeBoxOtherSettings(arg) {
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
  animeBoxDoneMessage() {
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
      Animated.delay(1000),
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
  animeBoxChangePassword() {
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

        this.showOrHideOtherSettings();

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
      this.showOrHideOtherSettings();
    }
  }

  verifyNickname() {
    if (!this.state.user.name.nickname) {
      return this.setState({
        done: {
          ok: true,
          show: true,
          message: 'Faltando o campo Apelido'
        }
      }, () => {
        this.animeBoxDoneMessage();
      });
    }

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
          this.animeBoxDoneMessage();
        });
      });
    } else {
      this.upToApi();
    }
  }

  upToApi() {
    if (!this.state.user.name.first) {
      return this.setState({
        done: {
          ok: true,
          show: true,
          message: 'Faltando o campo nome'
        }
      }, () => {
        this.animeBoxDoneMessage();
      });
    }
    if (!this.state.user.name.last) {
      return this.setState({
        done: {
          ok: true,
          show: true,
          message: 'Faltando o campo sobrenome'
        }
      }, () => {
        this.animeBoxDoneMessage();
      });
    }

    this.success('Carregando'); // Só uma mensagem reusando ao funcao

    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const data = {
      userId: this.state.user._id,
      name: this.state.user.name,
      socialMedia: this.state.user.socialMedia,
      bio: this.state.user.bio,
      photo: this.state.user.photo,
      email: this.state.user.email,
      password: this.state.user.password
    }

    Api.put('/users/edit', data, config).then(() => {

      if (this.state.dataImage) {

        const file = this.state.dataImage;

        Api.patch(`/users/profilePhoto/${this.state.user._id}`, file, config).then(({ data }) => {
          const user = this.props.account.user;
          user.photo = data.photo;

          this.props.setUser({
            token: this.props.account.token,
            user,
          })

          this.success('Perfil e foto atualizada');

        }).catch(err => {
          Debug.post({ err });
          this.failed('Erro ao atualizar foto');
        });

      } else {
        this.success('Perfil atualizado');
      }

    }).catch(err => {
      Debug.post({ err });
      this.failed('Erro ao atualizar usuário');
    });
  }

  success(msg) {
    this.setState({
      done: {
        ok: true,
        show: true,
        message: msg
      }
    }, () => {
      this.animeBoxDoneMessage();
    });
  }

  failed(msg) {
    this.setState({
      done: {
        ok: false,
        show: true,
        message: msg
      }
    }, () => this.animeBoxDoneMessage());
  }
  done() {
    if (!this.state.changed) {
      this.props.navigation.goBack();

    } else if (!this.state.user.password) {

      this.setState({
        user: {
          ...this.state.user,
          password: this.state.currentPassword
        }
      }, () => {
        this.verifyNickname();
      });
    } else {
      this.verifyNickname();
    }
  }

  setOtherSettingsValue(arg, value) {
    const obj = this.state;

    obj.changed = true;
    obj.user.socialMedia[arg] = value;

    this.setState(obj);
  }

  setUser(arg, value) {
    const obj = this.state;

    if (arg == 'first' || arg == 'last' || arg == 'nickname') {
      obj.user.name[arg] = value;
    }
    else {
      obj.user[arg] = value;
    }

    obj.changed = true;
    this.setState(obj);

  }


  selectImage() {
    const options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {

        const formDataImage = new FormData();
        formDataImage.append('file', {
          name: response.fileName,
          type: response.type,
          uri: response.uri
        })

        this.setState({
          user: {
            ...this.state.user,
            photo: {
              ...this.state.user.photo,
              thumbnail: 'data:image/jpeg;base64,' + response.data
            }
          },
          dataImage: formDataImage,
          changed: true,
        });
      }
    });
  }

  getRefToScrollViewSettingsProfile(ref) {
    this.scrollViewRef = ref;
  }

  logOut() {
    AsyncStorage.clear();
    const user = this.props.account.user;

    user.email = '';
    user.password = '';

    this.props.setUser({ token: '', user });
    this.props.navigation.navigate('Login');
  }
  _goBack() {
    if (!this.state.changed) {
      this.setState({ changed: false });
      this.props.navigation.goBack();
    } else {
      this.setUserData();
      this.animFeedContainer(true);
      this.props.navigation.navigate('Geral');
    }
  }
  clickImageProfile() { }
  editOrNewComment() { }
  newComment() { }
  _pushPost() { }
  sharePost() { }
  debug() { }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }} >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        {!this.state.loading ? (
          <View>
            <HeaderSettingsProfile
              firstName={this.state.user.name.first}
              lastName={this.state.user.name.last}
              nickname={this.state.user.name.nickname}
              bio={this.state.user.bio}
              thumbnail={this.state.user.photo.thumbnail}
              goBack={this._goBack.bind(this)}
              showOrHiddenOtherSettings={this.showOrHideOtherSettings.bind(this)}
              selectImage={this.selectImage.bind(this)}
              done={this.done.bind(this)}
              setUser={this.setUser.bind(this)}
            />
            <FlatList
              data={this.state.posts}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                const datePost = item.createdAt.split('T')[0].split('-').reverse();
                const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                const ico = pushed ? FlameRedIco : FlameBlueIco;
                return (
                  <View style={{ backgroundColor: '#E8E8E8' }}>
                    <PostProfile
                      push_ico={ico}
                      post_id={item._id}
                      user_id={this.props.account.user._id}
                      datePost={datePost}
                      pushTimes={item.pushes.times}
                      comments={item.comments}
                      content={item.content}
                      postPhoto={item.photo}
                      commentController={this.state.commentController}
                      clickImageProfile={this.clickImageProfile}
                      editOrNewComment={this.editOrNewComment}
                      newComment={this.newComment}
                      pushPost={this._pushPost.bind(this)}
                      sharePost={this.sharePost.bind(this)}
                      debug={this.debug.bind(this)}
                    />
                  </View>
                )
              }}
            />
          </View>
        ) : (
            <View style={{ flex: 1, width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
              <ProgressBarAndroid
                indeterminate={true}
                color={'#08F'}
                styleAttr='Normal'
              />
            </View>
          )}
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
              showOrHiddenOtherSettings={this.showOrHideOtherSettings.bind(this)}
              setOtherSettingsValue={this.setOtherSettingsValue.bind(this)}
              doneOtherSettings={this.doneOtherSettings.bind(this)}
              socialMedia={this.state.user.socialMedia}
              stateToUpdate={this.state.update}
              user={this.state.user}
              setUser={this.setUser.bind(this)}
              changePassword={this.animeBoxChangePassword.bind(this)}
              getRef={this.getRefToScrollViewSettingsProfile.bind(this)}
              logOut={this.logOut.bind(this)}
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
            <TouchableOpacity onPress={() => this.animeBoxChangePassword()}>
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