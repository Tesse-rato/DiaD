import React, { Component } from 'react';
import { View, Text, Animated, Dimensions, Easing } from 'react-native';

import { FeedHeaderComp } from '../styles/standard';

import UserSearch from './UserSearch';

export default class FeedHeader extends Component {
  constructor() {
    super();

    this.tamSearchBar = 60;
    this.tamBottomBar = 50;

    this.state = {
      userSearch: '',
      animatedValueToUserSearchView: new Animated.Value(0),
    }
  }

  animUserSearchView(arg) {
    const value = arg ? 1 : 0;
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.animatedValueToUserSearchView,
        {
          toValue: value,
          duration: 1000,
        }
      )
    ]).start();
  }

  onChangeTextUserSearch(newValue) {
    this.setState({ userSearch: newValue });

    if (!newValue) return this.animUserSearchView(false);

    this.animUserSearchView(true);

  }

  render() {
    return (
      <View>
        <FeedHeaderComp
          placeholder={this.props.placeholder}
          profilePhotoSource={this.props.profilePhotoSource}
          clickImageProfile={this.props.clickImageProfile}
          value={this.state.userSearch}
          onChangeText={this.onChangeTextUserSearch.bind(this)}
        >
        </FeedHeaderComp>
        <Animated.View
          style={{
            position: 'absolute',
            top: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height - (this.tamBottomBar + this.tamSearchBar - 2),
            backgroundColor: '#FFF',
            transform: [{
              translateY: this.state.animatedValueToUserSearchView.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  Dimensions.get('window').height,
                  this.tamSearchBar
                ]
              })
            }],
            opacity: this.state.animatedValueToUserSearchView.interpolate({
              inputRange: [0, .9, 1],
              outputRange: [0, 0, 1]
            })
          }}
        >
          <UserSearch
            search={this.state.userSearch}
            clickImageProfile={this.props.clickImageProfile}
          />
        </Animated.View>
      </View>
    );
  }
}
