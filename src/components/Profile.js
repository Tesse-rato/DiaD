import React, { PureComponent as Component } from 'react';
import { View, Text, StatusBar, FlatList, Dimensions, Animated, Easing, ProgressBarAndroid } from 'react-native';
//import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import Api from '../api';
import { editOrNewComment, newComment, pushPost, decreasePostsUserName } from '../funcs'

import { MinhaView } from "../styles/standard";
import { HeaderProfile } from "../styles/headerProfile";
import { PostProfile } from '../styles/postProfile';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';

class Profile extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);

    this.pushPost = pushPost.bind(this);
    this.newComment = newComment.bind(this);
    this.editOrNewComment = editOrNewComment.bind(this);

    this.state = {
      user: {},
      posts: [],
      force: true,
      loading: true,
      following: false,
      commentController: {
        edit: false,
        upload: false,
        commentId: '',
        newComment: false,
        tempCommentContent: '',
      },
      newComment: {
        postId: '',
        content: '',
      },
      tamBio: 0,
      startScroll: 0,
      animatedValueToBioView: new Animated.Value(45),
      animatedValueToProfileImage: new Animated.Value(120),
      animatedValueToBottomNotificationFollowing: new Animated.Value(0)
    };
  }
  componentDidMount() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const url = `/users/profile/${this.props.account.profileId}`;

    Api.get(url, config).then(({ data: user }) => {

      const tamBio = (Dimensions.get('window').height - 580) + (Math.ceil((Math.ceil(user.bio.length / 45) * 17.2) + 45));
      const following = this.props.account.user.following.find(id => id.toString() == user._id.toString());

      decreasePostsUserName(user.posts).then(posts => {
        this.setState({
          user,
          posts,
          tamBio,
          following,
          loading: false,
          animatedValueToBioView: new Animated.Value(tamBio)
        });
      }).catch(err => {
        console.log(err);
      });

    }).catch(err => {
      console.log(err);
    });
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

  clickImageProfile(_id) {
    console.log(_id);
  }

  sharePost(_id) {
    console.log(_id);
  }

  _pushPost(postId) {
    this.pushPost(postId).then(posts => {
      this.setState({ posts, force: !this.state.force });
    }).catch(err => {
      console.log(err);
    })
  }

  follow(_id) {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }
    const data = {
      userId: this.props.account.user._id,
      followUserId: _id
    }

    Api.post('/users/follow', data, config).then(() => {
      this.setState({ following: true });

      Animated.sequence([
        Animated.delay(200),
        Animated.timing(
          this.state.animatedValueToBottomNotificationFollowing,
          {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.bounce
          }
        ),
        Animated.delay(1000),
        Animated.timing(
          this.state.animatedValueToBottomNotificationFollowing,
          {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
            easing: Easing.circle
          }
        )
      ]).start();

    }).catch(err => {
      const data = {
        userId: this.props.account.user._id,
        unfollowUserId: _id
      }

      Api.post('/users/unfollow', data, config).then(() => {
        this.setState({ following: false });
        console.log('unfollow');

      }).catch(err => {
        console.log(err.response);
      });
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {!this.state.loading ? (
          <View style={{ backgroundColor: '#E8E8E8', flex: 1, alignItems: 'center' }}>
            <HeaderProfile
              user_id={this.state.user._id}
              my_user_id={this.props.account.user._id}
              bio={this.state.user.bio}
              firstName={this.state.user.name.first}
              lastName={this.state.user.name.last}
              nickname={this.state.user.name.nickname}
              thumbnail={this.state.user.photo.thumbnail}
              goBack={this.props.navigation.goBack}
              settings={this.props.navigation.navigate}
              following={this.state.following}
              follow={this.follow.bind(this)}
              animatedValueToBioView={this.state.animatedValueToBioView}
              animatedValueToProfileImage={this.state.animatedValueToProfileImage}
            />

            <FlatList
              onScrollBeginDrag={e => this.momentumScroll(e)}
              onMomentumScrollEnd={e => this.compareOffset(e.nativeEvent.contentOffset.y)}
              data={this.state.posts}
              showsVerticalScrollIndicator={false}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                const datePost = item.createdAt.split('T')[0].split('-').reverse();
                const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                const ico = pushed ? FlameRedIco : FlameBlueIco;
                return (
                  <View style={{ backgroundColor: '#E8E8E8' }}>
                    <PostProfile
                      push_ico={ico}
                      post_id={item._id}
                      user_id={this.props.account.user._id}
                      datePost={datePost}
                      pushTimes={item.pushes.times}
                      comments={item.comments}
                      content={item.content}
                      commentController={this.state.commentController}
                      clickImageProfile={this.clickImageProfile}
                      editOrNewComment={this.editOrNewComment}
                      newComment={this.newComment}
                      pushPost={this._pushPost.bind(this)}
                      sharePost={this.sharePost.bind(this)}
                      debug={this.debug.bind(this)}
                    />
                  </View>
                )
              }}
            />
            <Animated.View
              style={{
                width: Dimensions.get('window').width, height: 30,
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#08F',
                transform: [{
                  translateY: this.state.animatedValueToBottomNotificationFollowing.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, Dimensions.get('window').height - 30]
                  })
                }]
              }}
            >
              <Text style={{ fontSize: 12, color: '#FFF' }}>Seguindo</Text>
            </Animated.View>
          </View>
        ) : (
            <ProgressBarAndroid
              indeterminate={true}
              color={'#FFF'}
              styleAttr='Horizontal'
              style={{ width: Dimensions.get('window').width, height: 10 }}
            />
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