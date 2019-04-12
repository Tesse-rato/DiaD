import React, { Component } from 'react';
import { View, Animated, Dimensions, ProgressBarAndroid } from 'react-native';
import { connect } from 'react-redux';

import Api from '../api';

import { FeedHeader } from '../styles/standard';
import { UserSearch } from '../styles/userSearch';
import Debug from '../funcs/debug';

class FeedHeaderComp extends Component {
  constructor() {
    super();

    this.tamBottomBar = 50;
    this.tamSearchBar = 60;

    this.config = {
      headers: {
        authorization: ''
      }
    }

    this.state = {
      users: [],
      loading: true,
      userSearch: '',
      animatedValueToUserSearchView: new Animated.Value(0),
    };
  }
  componentWillMount() {
    this.config.headers.authorization = `Bearer ${this.props.account.token}`;
  }
  getResultsFromApi() {

    this.setState({ loading: true }, () => {
      Api.get(`/users/search/${this.state.userSearch}`, this.config).then(({ data: users }) => {
        this.setState({ users, loading: false });

      }).catch(() => {
        this.setState({ users: [], loading: false });

      });
    })

  }
  animResultsConteiner(arg) {
    const value = arg ? 1 : 0;

    Animated.timing(
      this.state.animatedValueToUserSearchView,
      {
        toValue: value,
        duration: 1000
      }
    ).start();
  }
  onChangeSearchText(newValue) {

    this.setState({ userSearch: newValue }, () => {

      if (!newValue) return this.animResultsConteiner(false);

      this.animResultsConteiner(true);

      this.getResultsFromApi()

    });
  }

  render() {
    return (
      <View>
        <FeedHeader
          placeholder={this.props.placeholder}
          clickImageProfile={() => this.props.clickImageProfile(this.props.account.user._id)}
          profilePhotoSource={this.props.profilePhotoSource}
          onChangeText={this.onChangeSearchText.bind(this)}
          value={this.state.search}
          textColor='#333'
        />

        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - (this.tamBottomBar + this.tamSearchBar - 2),
            backgroundColor: '#FFF',
            transform: [{
              translateY: this.state.animatedValueToUserSearchView.interpolate({
                inputRange: [0, .6],
                outputRange: [
                  Dimensions.get('window').height,
                  this.tamSearchBar,
                ],
                extrapolate: 'clamp'
              })
            }],
            opacity: this.state.animatedValueToUserSearchView.interpolate({
              inputRange: [0, .5, 1],
              outputRange: [0, 0, 1]
            })
          }}
        >
          {this.state.loading ? (
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <ProgressBarAndroid styleAttr='Small' indeterminate />
            </View>
          ) : (
              <UserSearch
                result={this.state.users}
                clickImageProfile={this.props.clickImageProfile}
              />
            )}
        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(FeedHeaderComp);
