import React, { Component } from 'react';
import { View, ProgressBarAndroid, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import Debug from '../funcs/debug';
import Api from '../api';

import { UserSearchComp } from '../styles/userSearch';

class UserSearch extends Component {
  constructor() {
    super();

    this.state = {
      users: [],
      loading: true,
    };
    this.config = {
      headers: {
        authorization: ''
      }
    }
  }

  componentWillMount() {
    this.config.headers.authorization = `Bearer ${this.props.account.token}`
  }

  componentWillReceiveProps(receiveProps) {
    this.setState({ users: [], loading: true }, () => {

      Api.get(`/users/search/${receiveProps.search}`, this.config)
        .then(({ data: users }) => {
          this.setState({ users, loading: false });
        })
        .catch(() => {
          this.setState({ users: [], loading: false });
        });
    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            marginTop: 20,
          }}>
            <ProgressBarAndroid
              styleAttr='Small'
              indeterminate
            />
          </View>
        ) : (
            <UserSearchComp
              result={this.state.users}
              clickImageProfile={this.props.clickImageProfile}
            />
          )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(UserSearch);