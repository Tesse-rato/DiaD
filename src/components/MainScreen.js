import React, { Component } from 'react';
import { View, Text, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';

import FeedHeader from './FeedHeaderComp';
import Profile from './Profile';
import Feed from './Feed';

class MainScreen extends Component {

  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.tamSearchBar = 60;

    this.state = {
      visitinProfile: false,
      idToVisitProfile: '',
      animatedValueToContentScrollY: new Animated.Value(0),
      animatedValueToProfileContent: new Animated.Value(0),
    }
  }

  animProfileContainer(arg, cb) {
    const value = arg ? 1 : 0;
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.animatedValueToProfileContent,
        {
          toValue: value,
          duration: 500
        }
      )
    ]).start(cb ? cb() : null);
  }
  returnProfileScreen() {
    this.animProfileContainer(false, () => {
      this.setState({
        visitinProfile: false,
        idToVisitProfile: '',
      });
    });
  }
  clickImageProfile(_id) {
    this.animProfileContainer(true, () => {
      this.setState({
        visitinProfile: true,
        idToVisitProfile: _id,
      });
    });
  }

  render() {
    return (
      <View style={{ flex: 1, width: Dimensions.get('window').width, height: Dimensions.get('window').height }}>
        <Feed
          navigation={this.props.navigation}
          tamSearchBar={this.tamSearchBar}
          clickImageProfile={this.clickImageProfile.bind(this)}
          animatedValueToContentScrollY={this.state.animatedValueToContentScrollY}
        />

        <Animated.View
          style={{
            position: 'absolute',
            top: this.state.animatedValueToContentScrollY.interpolate({
              inputRange: [0, this.tamSearchBar * 40, this.tamSearchBar * 50],
              outputRange: [0, 0, this.tamSearchBar * -1],
              extrapolate: 'clamp'
            })
          }}
        >
          <FeedHeader
            placeholder='Buscar Usuário'
            profilePhotoSource={{ uri: this.props.account.user.photo.thumbnail }}
            clickImageProfile={() => this.clickImageProfile(this.props.account.user._id)}
          />
        </Animated.View>

        {this.state.visitinProfile ? (
          <Animated.View
            style={{
              position: 'absolute',
              top: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              left: this.state.animatedValueToProfileContent.interpolate({
                inputRange: [0, 1],
                outputRange: [Dimensions.get('window').width * .15, 0]
              })
            }}
          >
            <Profile
              _id={this.state.idToVisitProfile}
              returnProfileScreen={this.returnProfileScreen.bind(this)}
            />
          </Animated.View>
        ) : null}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(MainScreen);