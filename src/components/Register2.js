import React, { Component } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import ImagePicker from 'react-native-image-picker';

import * as Actions from '../redux/actions';
import api from '../api';

export class Register2 extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super()

    this.state = {
      imageUri: ''
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
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2UzYjZmNzMyODA5MjcxMGIwNjgxNyIsImlhdCI6MTU1MTg2NjIzNiwiZXhwIjoxNTUxOTUyNjM2fQ.QNiGB6zssrAZZNLD8c_vPIyl_3tbfmxxLeXnhqV66l4'
      }
    }

    ImagePicker.showImagePicker(options, response => {
      let data = new FormData()

      data.append('file', {
        name: response.fileName,
        type: response.type,
        uri: response.uri,
      })

      api.patch('/users/profilePhoto/5c7fbc0bede89f1fb04a23bc', data, header).then((response) => {
        console.log('OKOK');

      }).catch(err => {
        console.log(err.response);
      });
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity onPress={this.selectImage.bind(this)} >
          <View style={{ width: 200, height: 200, alignItems: 'center', justifyContent: 'center', backgroundColor: '#DDD' }}>
            <Text>Select Image</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Register2)
