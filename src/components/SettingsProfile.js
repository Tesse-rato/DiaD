import React, { Component } from 'react';
import { View, StatusBar } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import { MinhaView } from "../styles/standard";
import { HeaderSettingsProfile } from '../styles/settingsProfile';

class SettingsProfile extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      settingsSocialMedia: false,
      imageUri: '',
      dataImage: '',
    };
  }

  setSettingsSocialMedia() {
    this.setState({ settingsSocialMedia: !this.state.settingsSocialMedia });
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

  done() {
    this.props.navigation.goBack();
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }} >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        <HeaderSettingsProfile
          name={'Amanda Lee'}
          nickname={'@leManda'}
          bio={'Curabitur bibendum dolor quis purus ultrices egestas. Sed aliquet, quam nec gravida commodo, odio arcu tempor nibh, sit amet porta tortor nibh sit amet tellus. Vivamus ultrices convallis mauris ac dapibus. Nam mattis laoreet lacus, a fringilla magna vulputate eget. Sed iaculis eros turpis, nec sagittis dolor bibendum nec. Quisque a nibh at felis aliquet fringilla et eget nisi. Sed congue volutpat.'}
          goBack={this.props.navigation.goBack}
          socialMediaEndCity={this.setSettingsSocialMedia.bind(this)}
          SettingsSocialMedia={this.state.settingsSocialMedia}
          selectImage={this.selectImage.bind(this)}
          done={this.done.bind(this)}
        />
      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsProfile);