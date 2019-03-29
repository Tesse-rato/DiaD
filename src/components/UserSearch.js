import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';

import Debug from '../funcs/debug';
import Api from '../api';

import { UserSearchComp } from '../styles/userSearch';

class UserSearch extends Component {
  constructor() {
    super();

    this.state = {
      users: []
    };
  }
  componentWillReceiveProps(props) {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const url = `/users/search/${props.search}`;

    Api.get(url, config).then(({ data: users }) => {
      this.setState({ users });

    }).catch(() => {
      this.setState({ users: [] });

    });
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <UserSearchComp
          search={this.state.users}
          clickImageProfile={this.props.clickImageProfile}
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(UserSearch);