import React, { Component } from 'react';
import { View, ProgressBarAndroid, Dimensions } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import Api from '../api';

import Feed from './Feed';

class Geral extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
    };
  }

  componentWillMount() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    Api.get('/posts/list', config).then(({ data }) => {
      this.setState({ data, loading: false });
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.loading ? (
          <View style={{ width: Dimensions.get('window').width, flex: 1, justifyContent: 'center' }} >
            <ProgressBarAndroid
              indeterminate={true}
              color={'#FFF'}
              styleAttr='Horizontal'
              style={{ width: Dimensions.get('window').width, height: 10 }} />
          </View>
        ) : (
            <Feed data={this.state.data} />
          )}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(Geral);