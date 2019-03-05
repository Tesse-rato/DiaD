import React, { Component } from 'react';
import { View, TextInput } from 'react-native';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import * as Actions from '../src/redux/actions';

class Comp extends Component {

  state = {
    email: ''
  }

  componentWillUpdate() {
    console.log(this.props);
  }

  montar(e) {
    this.setState({ email: e });
    this.props.setEmail(e);
  }

  render() {
    console.log(this.props);

    return (
      <View>
        <TextInput placeholder='So pra enxergar' onChangeText={e => this.montar(e)} />
      </View>
    );
  }
}

const dispacthToProps = dispach => {
  return bindActionCreators(Actions, dispach);
}

const mapStateToProps = (states) => {
  return ({
    account: states.account
  });
}

export default connect(mapStateToProps, dispacthToProps)(Comp);