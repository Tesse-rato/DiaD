import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Image, Picker } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import ImagePicker from 'react-native-image-picker';

import * as Actions from '../redux/actions';
import Api from '../api';

import { Continue, GoBack, MeuInput } from "../styles/register";
import { MinhaView } from "../styles/standard";

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
      dataFormImage: '',
      buttonNextState: '',
      selectedCity: 'Tupaciguara'
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
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
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
        });
      }
    });
  }

  registerUser() {

    const {
      name,
      email,
      password,
    } = this.props.account.user

    Api.post('/users/create', { name, email, password, city: this.state.selectedCity, confirmPassword: this.props.account.user.password }).then(({ data }) => {
      this.props.setUser(data);

      const config = {
        headers: {
          'authorization': `Bearer ${data.token}`
        }
      }

      const url = `/users/profilePhoto/${data.user._id}`;

      Api.patch(url, this.state.dataFormImage, config).then(() => {
        console.log('Navegando pro Feed');
        this.props.navigation.navigate('Feed');

      }).catch(err => { this.setState({ error: 'Verifique sua conexão' }); });
    }).catch(err => {
      err.response.data.error == 'Nickname already exists' ? this.setState({ error: 'Apelido já está em uso' }) : null;
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
          <MeuInput value={this.props.account.user.name.first} onChangeText={this.props.setFirstName} placeholder='Nome' ico={UserIco} />
          <MeuInput value={this.props.account.user.name.last} onChangeText={this.props.setLastName} placeholder='Sobrenome' ico={UserIco} />
          <MeuInput value={this.props.account.user.name.nickname} onChangeText={this.props.setNickname} placeholder='Apelido' ico={UserIco} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8E8E8', borderRadius: 25, margin: 5 }}>
            <CityIco width={25} height={25} margin={10} />
            <Picker style={{ width: 285, height: 50, color: '#FFF', fontSize: 12, backgroundColor: 'transparent' }} mode='dialog' selectedValue={this.state.selectedCity} onValueChange={(value) => this.setState({ selectedCity: value })} >
              <Picker.Item label='Tupaciguara' value='tupaciguara' />
              <Picker.Item label='Uberlandia' value='uberlandia' />
            </Picker>
          </View>
        </View>

        <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'row-reverse' }}>
          <Continue onPress={() => this.registerUser()} >
            <Text style={{ fontSize: 16, color: '#08F' }}>Registrar</Text>
          </Continue>
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
