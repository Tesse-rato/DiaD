import React, { Component } from 'react';
import { View, Text, StatusBar, FlatList, Dimensions, Animated, ProgressBarAndroid } from 'react-native';
import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import api from '../api';

import { MinhaView } from "../styles/standard";
import { HeaderProfile } from "../styles/headerProfile";
import { PostProfile } from '../styles/postProfile';


class Profile extends React.PureComponent {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);
    this.state = {
      posts: [{
        pushes: {
          times: 0,
          users: []
        },
        createdAt: '',
        _id: 0,
        assignedTo: '',
        content: '',
        comments: [{
          content: '',
        }],
        __v: 0
      }],
      loading: true,
      animatedValueToBioView: new Animated.Value(45),
      animatedValueToProfileImage: new Animated.Value(120),
      bio: 'Curabitur bibendum dolor quis purus ultrices egestas. Sed aliquet, quam nec gravida commodo, odio arcu tempor nibh, sit amet porta tortor nibh sit amet tellus. Vivamus ultrices convallis mauris ac dapibus. Nam mattis laoreet lacus, a fringilla magna vulputate eget. Sed iaculis eros turpis, nec sagittis dolor bibendum nec. Quisque a nibh at felis aliquet fringilla et eget nisi. Sed congue volutpat.',
      tamBio: '',
      startScroll: '',
    };
  }

  componentWillMount() {
    const { bio } = this.state;

    const tamBio = (Dimensions.get('window').height - 200) - (Math.ceil((Math.ceil(this.state.bio.length / 45) * 17.2) + 45));

    this.setState({ tamBio, animatedValueToBioView: new Animated.Value(tamBio) }, () => {
      const config = {
        headers: {
          'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2ZiYzBiZWRlODlmMWZiMDRhMjNiYyIsImlhdCI6MTU1MjM1NzU3NSwiZXhwIjoxNTUyNDQzOTc1fQ.Fgijw2DYlhBTrcc-x__gXXs513BZcqL8r-7h9o7kF2A'
        }
      };

      api.get('/posts/list', config).then(({ data: posts }) => {
        this.setState({ posts, loading: false });
      }).catch(err => {
        console.log(err.response);
      })
    })
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.x);
  }

  momentumScroll(e) {
    const { y } = e.nativeEvent.contentOffset;
    this.setState({ startScroll: y })
    if (y < 1) {
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(
          this.state.animatedValueToBioView,
          {
            toValue: 0,
            duration: 500
          }
        ),
        Animated.timing(
          this.state.animatedValueToProfileImage,
          {
            toValue: 60,
            duration: 1000
          }
        )
      ]).start()
    }
  }
  compareOffset(currentValueScroll) {
    const { startScroll } = this.state;
    const differenceBettweenValues = Math.abs(startScroll - currentValueScroll);

    let valueToBioView = startScroll < currentValueScroll ? 0 : differenceBettweenValues > 400 || currentValueScroll <= 1 ? this.state.tamBio : null;
    let valueToProfileImage = startScroll < currentValueScroll ? 60 : differenceBettweenValues > 400 || currentValueScroll <= 1 ? 120 : 60;

    Animated.sequence([
      Animated.delay(300),
      Animated.timing(
        this.state.animatedValueToBioView,
        {
          toValue: valueToBioView,
          duration: 500
        }
      ),
      Animated.timing(this.state.animatedValueToProfileImage,
        {
          toValue: valueToProfileImage,
          duration: 1000
        }
      )
    ]).start();
  }

  render() {
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        <HeaderProfile bio={this.state.bio}
          goBack={this.props.navigation.goBack}
          settings={this.props.navigation.navigate}
          animatedValueToBioView={this.state.animatedValueToBioView}
          animatedValueToProfileImage={this.state.animatedValueToProfileImage}
        />
        {
          !this.state.loading ? (
            <View style={{ backgroundColor: '#E8E8E8', flex: 1 }}>
              <FlatList
                onScrollBeginDrag={e => this.momentumScroll(e)}
                onMomentumScrollEnd={e => this.compareOffset(e.nativeEvent.contentOffset.y)}
                data={this.state.posts}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <PostProfile content={item.content} comments={item.comments} debug={this.debug.bind(this)} />
                )}
              />
            </View>
          ) : (
              <ProgressBarAndroid
                indeterminate={true}
                color={'#FFF'}
                styleAttr='Horizontal'
                style={{ width: Dimensions.get('window').width, height: 10 }} />
            )
        }
      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);