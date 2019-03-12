import React, { Component } from 'react'
import { View, Text, TouchableOpacity, StatusBar, Image, Picker } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import ImagePicker from 'react-native-image-picker';

import * as Actions from '../redux/actions';
import api from '../api';

import { Input, Continue, GoBack, MeuInput } from "../styles/register";
import { MinhaView } from "../styles/standard";

import UserIco from '../assets/UserWhiteDiaD.svg';
import UserImageIco from '../assets/UserImageDiaD.svg';
import CityIco from '../assets/CityWhiteDiaD.svg';
import DropDownIco from '../assets/DropDownDiaD.svg';

export class Register2 extends Component {
  static navigationOptions = {
    header: null
  }
  constructor() {
    super()

    this.state = {
      error: 'Apelido já esta em uso',
      imageUri: '',
      dataFormImage: '',
      buttonNextState: '',
      selectedCity: 'Cidade'
    }
  }

  selectImage() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
      },
    };

    const header = {
      headers: {
        'Accept': '',
        'Content-Type': 'multipart/form-data',
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2ZiYzBiZWRlODlmMWZiMDRhMjNiYyIsImlhdCI6MTU1MTk2MTI2NCwiZXhwIjoxNTUyMDQ3NjY0fQ.4mvkRiXRUaHciL01MnFh5meuJo5kMVhLWAHqmJlzpFY'
      }
    }

    ImagePicker.showImagePicker(options, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        let data = new FormData()
        data.append('file', {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        });
        this.setState({
          imageUri: { uri: 'data:image/jpeg;base64,' + response.data },
          dataFormImage: data,
        }, () => {
          api.patch('/users/profilePhoto/5c7fbc0bede89f1fb04a23bc', this.state.dataFormImage, header).then((response) => {

          }).catch(err => {
            console.log(err.response);
          });
        });
      }

    });
  }

  render() {
    console.disableYellowBox = true;
    console.log('TESTEANDO DEPURADOR');
    return (
      <MinhaView white >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

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
          {/* <Text style={{ fontSize: 12 }}>Selecionar Foto de Perfil</Text> */}
        </View>

        <View style={{ flex: 2, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 12, color: '#F00' }}>{this.state.error}</Text>
          <MeuInput placeholder='Nome' ico={UserIco} />
          <MeuInput placeholder='Sobrenome' ico={UserIco} />
          <MeuInput placeholder='Apelido' ico={UserIco} />
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8E8E8', borderRadius: 25, margin: 5 }}>
            <CityIco width={25} height={25} margin={10} />
            <Picker style={{ width: 285, height: 50, color: '#FFF', fontSize: 12, backgroundColor: 'transparent' }} mode='dialog' selectedValue={this.state.selectedCity} onValueChange={(value) => this.setState({ selectedCity: value })} >
              <Picker.Item label='Cidade' value='' />
              <Picker.Item label='Tupaciguara' value='tupaciguara' />
              <Picker.Item label='Uberlandia' value='uberlandia' />
            </Picker>
          </View>
        </View>

        <View style={{ flex: 0.5, alignItems: 'center', flexDirection: 'row-reverse' }}>
          <Continue onPress={() => this.props.navigation.navigate('Profile')} >
            <Text style={{ fontSize: 16, color: '#08F' }}>Cadastrar</Text>
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
