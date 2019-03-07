import React, { Component } from 'react'
import { View, Text, Image, TextInput, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators } from "redux";

import * as Actions from '../redux/actions';

class Home extends Component {
  static navigationOptions = {
    header: null
  }

  render() {
    console.disableYellowBox = true;
    console.log(this.props);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput placeholder='Testando' style={{ width: 250, height: 40, backgroundColor: '#DDD' }} />
        <TextInput placeholder='Testando' style={{ width: 250, height: 40, backgroundColor: '#DDD' }} />
        <TextInput placeholder='Testando' style={{ width: 250, height: 40, backgroundColor: '#DDD' }} />
        {/* <Image source={{
          uri: 'http://caserahost.ddns.net:3333/thumbnail-7f381dc57cba798b-upPost.png'
        }}
          style={{ width: 120, height: 120 }}
        /> */}
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Home)
