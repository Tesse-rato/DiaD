import React, { PureComponent as Component } from 'react';
import {
  View,
  Text,
  StatusBar,
  FlatList,
  Dimensions,
  Animated,
  Easing,
  ProgressBarAndroid,
  Linking,
  Clipboard,
  BackHandler
} from 'react-native';

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
      user: {
        socialMedia: {
          tumblr: '',
          youtube: '',
          facebook: '',
          linkedin: '',
          whatsapp: '',
        }
      },
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
      messageSocialMedia: '',
      animatedValueToBioView: new Animated.Value(45),
      animatedValueToTransform: new Animated.Value(0),
      animatedValueToProfileHeader: new Animated.Value(0),
      animatedValueToContainerView: new Animated.Value(0),
      animatedValueToProfileImage: new Animated.Value(120),
      animatedValueToBottomNotificationFollowing: new Animated.Value(0),
      animatedValueToNotificationErrorOrWhatsappNumber: new Animated.Value(0),
    };
  }

  componentWillMount() {
    this.animFeedContainer = this.props.navigation.getParam('animFeedContainer');
  }
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this._goBack.bind(this));
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
        // authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjODdiYzFlMTI0NTgyNDBmNDcxYzhmYiIsImlhdCI6MTU1MjczNDU2NCwiZXhwIjoxNTUyODIwOTY0fQ.qNo8hwY_6g_RUw2WaiSlpfGaRyERJarYPH5GKtd3goY`
      }
    }

    // const url = `/users/profile/5c87bcc212458240f471c8fc`;
    const url = `/users/profile/${this.props.account.profileId}`;

    Api.get(url, config).then(({ data: user }) => {

      const tamBio = user.bio ? Math.ceil((Math.ceil(user.bio.length / 45) * 17.2) + 55) : 55;

      const following = this.props.account.user.following.find(id => id.toString() == user._id.toString());

      decreasePostsUserName(user.posts).then(posts => {
        this.setState({
          user: { ...this.state.user, ...user },
          posts,
          tamBio,
          following,
          loading: false,
          animatedValueToBioView: new Animated.Value(tamBio)
        }, () => {
          this.animateContainerView(true);
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
    Linking.openURL('https://www.facebook.com/').catch(err => {
    });
  }

  animateMessageSocialMedia() {
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.animatedValueToNotificationErrorOrWhatsappNumber,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.circle
        }
      ),
      Animated.delay(5000),
      Animated.timing(
        this.state.animatedValueToNotificationErrorOrWhatsappNumber,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.circle
        }
      )
    ]).start();
  }

  animateContainerView(arg) {
    let value = arg ? 1 : 0;

    Animated.sequence([
      Animated.delay(100),
      Animated.timing(
        this.state.animatedValueToContainerView,
        {
          toValue: value,
          duration: 100,
          useNativeDriver: true,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.state.animatedValueToProfileHeader,
        {
          toValue: value,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.ease
        }
      ),
      Animated.timing(
        this.state.animatedValueToTransform,
        {
          toValue: value,
          duration: 300,
          easing: Easing.ease
        }
      )
    ]).start()
  }

  socialMedia(arg) {


    if (arg == 'whatsapp') {

      Clipboard.setString(this.state.user.socialMedia.whatsapp);

      return this.setState({ messageSocialMedia: 'O numero foi copiado c:' }, () => {
        this.animateMessageSocialMedia();
      });
    }

    let url = this.state.user.socialMedia[arg];

    Linking.openURL('https://' + url).catch(err => {
      this.setState({ messageSocialMedia: 'Algum problema com o link :/' });
      this.animateMessageSocialMedia()
    });
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
  goSttings() {
    this.props.navigation.navigate('SettingsProfile', {
      posts: this.state.posts
    });
  }

  _goBack() {
    this.animFeedContainer(true);
    this.props.navigation.goBack();
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {!this.state.loading ? (
          <Animated.View
            style={{
              flex: 1,
              backgroundColor: '#E8E8E8',
              alignItems: 'center',
              transform: [{
                translateX: this.state.animatedValueToContainerView.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').width, 0]
                })
              }]
            }}
          >
            <Animated.View
              style={{
                transform: [{
                  translateY: this.state.animatedValueToProfileHeader.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-Dimensions.get('window').height, 0]
                  })
                }]
              }}
            >
              <HeaderProfile
                user_id={this.state.user._id}
                my_user_id={this.props.account.user._id}
                bio={this.state.user.bio}
                firstName={this.state.user.name.first}
                lastName={this.state.user.name.last}
                nickname={this.state.user.name.nickname}
                thumbnail={this.state.user.photo.thumbnail}
                goBack={this._goBack.bind(this)}
                settings={this.goSttings.bind(this)}
                following={this.state.following}
                follow={this.follow.bind(this)}
                clickSocialMedia={this.socialMedia.bind(this)}
                socialMedia={this.state.user.socialMedia}
                animatedValueToBioView={this.state.animatedValueToBioView}
                animatedValueToProfileImage={this.state.animatedValueToProfileImage}
                animatedValueToTransform={this.state.animatedValueToTransform}
              />
            </Animated.View>
            {this.state.posts.length ? (
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
            ) : (
                <View style={{ flex: 1, backgroundColor: '#FFF', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
                  <Text style={{ color: '#08F', fontSize: 16, textAlign: 'center' }}>
                    Parece que é sua primeira vez,
                    comesse configurando seu perfil,
                    adicionando suas redes sociais,
                    adicionando uma breve biografia
                    e faça uma postagem de boas vindas
                  </Text>
                </View>
              )}
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
            <Animated.View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                width: Dimensions.get('window').width - 50,
                height: 100,
                borderRadius: 10,
                position: 'absolute',
                backgroundColor: '#FFF',
                transform: [{
                  translateY: this.state.animatedValueToNotificationErrorOrWhatsappNumber.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-Dimensions.get('window').height / 2, Dimensions.get('window').height / 2]
                  })
                }]
              }}
            >
              <Text style={{ color: '#08F', textAlign: 'center', fontSize: 18 }}>{this.state.messageSocialMedia}</Text>
            </Animated.View>
          </Animated.View>
        ) : (
            <View style={{ flex: 1, width: Dimensions.get('window').width, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' }}>
              <ProgressBarAndroid
                indeterminate={true}
                color={'#08F'}
                styleAttr='Normal'
              />
            </View>
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