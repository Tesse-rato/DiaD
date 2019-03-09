import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

class Justice extends Component {
constructor(props){
  super(props);
  this.state = {};
}

  render(){
    return(
      <View>
        <Text>JUSTICE</Text>
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account : state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(Justice);