import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Image, Picker, AsyncStorage, ProgressBarAndroid } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import ImagePicker from 'react-native-image-picker';

import * as Actions from '../redux/actions';
import Api from '../api';

import { Continue, GoBack } from "../styles/register";
import { MinhaView, MeuInput } from "../styles/standard";

import UserIco from '../assets/UserWhiteDiaD.svg';
import UserImageIco from '../assets/UserImageDiaD.svg';
import CityIco from '../assets/CityWhiteDiaD.svg';

export class Register2 extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()

    this.state = {
      error: '',
      imageUri: '',
      loading: false,
      dataFormImage: '',
      loadedImage: false,
      selectedCity: 'Tupaciguara'
    }
  }

  selectImage() {
    const options = {
      quality: .5,
      title: 'Selecione uma Foto',
      cancelButtonTitle: 'Cancelar',
      takePhotoButtonTitle: 'Tirar Foto',
      chooseFromLibraryButtonTitle: 'Escolher da Galeria',
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        return;
      } else if (response.error) {
        return this.setState({ error: 'Ouve um erro ao carregar a imagem da galeria' });
      }
      else {
        let data = new FormData()
        data.append('file', {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        });
        this.setState({
          imageUri: { uri: 'data:image/jpeg;base64,' + response.data },
          dataFormImage: data,
          loadedImage: true
        });
      }
    });
  }

  validateUserInput() {
    const { name: { first, last, nickname } } = this.props.account.user;
    if (!first) return this.setState({ error: 'Preencha o campo Nome' });
    if (!last) return this.setState({ error: 'Preencha o campo Sobrenome' });
    if (!nickname) return this.setState({ error: 'Preencha o campo Apelido' });

    this.setState({ error: '' });
    this.registerUser();

  }

  registerUser() {

    this.setState({ loading: true });

    const {
      name,
      email,
      password,
    } = this.props.account.user

    const data = {
      name,
      email,
      password,
      city: this.state.selectedCity,
      confirmPassword: this.props.account.user.password
    }

    Api.post('/users/create', data).then(({ data }) => {

      this.props.setUser({ token: data.token, user: data.user });

      AsyncStorage.setItem('email', email);
      AsyncStorage.setItem('password', password);
      AsyncStorage.setItem('_id', data.user._id);
      AsyncStorage.setItem('token', data.token);

      const config = {
        headers: {
          'authorization': `Bearer ${data.token}`
        }
      }

      const url = `/users/profilePhoto/${data.user._id}`;

      if (this.state.loadedImage) {

        config.headers['Content-Type'] = 'multipart/form-data';
        const file = this.state.dataFormImage;

        Api.patch(url, file, config).then(({ data: { photo } }) => {

          this.props.setUser({
            token: data.token,
            user: {
              ...this.props.account.user,
              photo
            }
          });

          this.props.navigation.navigate('MainScreen');

        }).catch(err => { this.setState({ error: 'Verifique sua conexão', loading: false }); });
      } else {
        console.log('Nao registrou imagem');
        this.props.navigation.navigate('MainScreen');
      }

    }).catch(err => {
      console.log(err.response);
      err.response.data.error == 'Nickname already exists' ? this.setState({ error: 'Apelido já está em uso', loading: false }) : null;
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView white >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />

        <View style={{ flex: 1, justifyContent: 'center' }}>
          <TouchableOpacity onPress={this.selectImage.bind(this)} style={{ alignItems: 'center', margin: 10 }}>
            {
              this.state.imageUri === '' ? (
                <UserImageIco width={150} height={150} />
              ) : (
                  <Image style={{ width: 150, height: 150, borderRadius: 75 }} source={this.state.imageUri} />
                )
            }
          </TouchableOpacity>
        </View>

        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, color: '#F00' }}>{this.state.error}</Text>
          <MeuInput
            textContentType='name'
            value={this.props.account.user.name.first}
            onChangeText={this.props.setFirstName}
            placeholder='Nome'
            ico={UserIco}
            textColor='#FFF'
          />
          <MeuInput
            textContentType='nameSuffix'
            value={this.props.account.user.name.last}
            onChangeText={this.props.setLastName}
            placeholder='Sobrenome'
            ico={UserIco}
            textColor='#FFF'
          />
          <MeuInput
            textContentType='nickname'
            value={this.props.account.user.name.nickname}
            onChangeText={this.props.setNickname}
            placeholder='Apelido'
            ico={UserIco}
            textColor='#FFF'
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8E8E8', borderRadius: 25, margin: 5 }}>
            <CityIco width={25} height={25} margin={10} />
            <Picker style={{ width: 285, height: 50, color: '#FFF', fontSize: 12, backgroundColor: 'transparent' }} mode='dialog' selectedValue={this.state.selectedCity} onValueChange={(value) => this.setState({ selectedCity: value })} >
              <Picker.Item label='Tupaciguara' value='tupaciguara' />
              <Picker.Item label='Uberlandia' value='uberlandia' />
            </Picker>
          </View>
        </View>

        <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'row-reverse' }}>
          {this.state.loading ? (
            <ProgressBarAndroid
              style={{ width: 150 }}
              styleAttr='Small'
              indeterminate={true}
            />
          ) : (
              <Continue onPress={() => this.validateUserInput()} >
                <Text style={{ fontSize: 16, color: '#08F' }}>Registrar</Text>
              </Continue>
            )}
          <GoBack onPress={() => this.props.navigation.goBack()}>
            <Text style={{ fontSize: 14, color: '#08F' }}>Voltar</Text>
          </GoBack>
        </View>

      </MinhaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Register2)
