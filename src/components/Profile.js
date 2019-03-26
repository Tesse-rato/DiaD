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
  BackHandler,
  ScrollView
} from 'react-native';

//import { AnimatedCircularProgress } from 'react-native-circular-progress';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import Api from '../api';
import {
  editOrNewComment,
  newComment,
  pushPost,
  decreasePostsUserName,
  resizeImage,
  decreaseUserName
} from '../funcs'

import { MinhaView } from "../styles/standard";
import { HeaderProfile } from "../styles/headerProfile";
import { PostProfile } from '../styles/postProfile';
import { EditOrNewPost } from '../styles/editOrNewPost';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';

import Debug from '../funcs/debug';
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
      postController: {
        post: {
          _id: '_id',
          content: '',
          photo: undefined,
        },
        edit: false,
        oldContent: '',
        loadedImage: false,
        newImage: undefined,
      },
      tamBio: 0,
      startScroll: 0,
      tamFrameProfile: 240,
      messageSocialMedia: '',
      animatedValueToTransform: new Animated.Value(0),
      animatedValueFromScrollY: new Animated.Value(0),
      animatedValueToProfileHeader: new Animated.Value(0),
      animatedValueToContainerView: new Animated.Value(0),
      animatedValueToEditPostContainer: new Animated.Value(0),
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
        decreaseUserName(user).then(user => {
          this.setState({
            user: { ...this.state.user, ...user },
            posts,
            tamBio,
            following,
            loading: false,
            animatedValueToBioView: new Animated.Value(tamBio)
          }, () => {
            this.animContainerView(true);
          });
        });
      });
    }).catch(err => {
      console.log(err);
    });
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.x);
  }
  clickImageProfile(_id) {
    if (_id == this.state.user._id) return;

    this.state.animatedValueFromScrollY.setValue(0);
    this.props.setProfileId(_id);
    this.animContainerView(false);
    this.setState({ loading: true }, () => {
      this.componentDidMount();
    });
  }

  sharePost(_id) {
    Linking.openURL('https://www.facebook.com/').catch(err => {
    });
  }

  displayMessageSocialMedia() {
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

  animContainerView(arg) {
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

  displayEditPost() {
    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.animatedValueToEditPostContainer,
        {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease
        }
      )
    ]).start();
  }

  socialMedia(arg) {


    if (arg == 'whatsapp') {

      Clipboard.setString(this.state.user.socialMedia.whatsapp);

      return this.setState({ messageSocialMedia: 'O numero foi copiado c:' }, () => {
        this.displayMessageSocialMedia();
      });
    }

    let url = this.state.user.socialMedia[arg];

    Linking.openURL(url).catch(err => {
      this.setState({ messageSocialMedia: 'Algum problema com o link :/' });
      this.displayMessageSocialMedia()
    });
  }

  editPost(_id) {
    let payload;

    this.state.posts.forEach((post, index) => {
      if (post._id.toString() == _id) {
        payload = post;
        this.indexOfPost = index;
      }
    })

    this.setState({
      postController: {
        post: payload,
        edit: true,
        oldContent: payload.content,
      }
    }, () => this.displayEditPost(true));
  }
  editContentPost(newValue) {
    this.setState({
      postController: {
        ...this.state.postController,
        post: {
          ...this.state.postController.post,
          content: newValue
        }
      }
    });
  }
  doneEditPost() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const payload = this.state.posts;
    payload[this.indexOfPost] = this.state.postController.post;

    if (this.state.postController.post.content != this.state.postController.oldContent) {
      const data = {
        userId: this.props.account.user._id,
        postId: this.state.postController.post._id,
        content: this.state.postController.post.content,
      }

      Api.put('/posts/edit', data, config).then(() => {
        this.setState({ posts: payload }, () => this.oculteEditPost());

      }).catch(err => {
        Debug.post({ erro: err.response.data.error });
      })
    }

    if (this.state.postController.loadedImage) {

      const url = `/posts/postPhoto/${this.state.postController.post._id}`;

      const data = this.state.postController.newImage

      Api.patch(url, data, config).then(({ data }) => {

        payload[this.indexOfPost].photo.post = data;
        this.setState({ posts: payload }, () => this.oculteEditPost());

      }).catch(err => Debug.post({ post: err.response.data.error }));
    }
  }
  deletePost(_id) {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      },
      data: {
        id: this.state.postController.post._id.toString()
      }
    }

    Api.delete('/posts/delete', config).then(() => {

      const payload = this.state.posts.filter(post => post._id.toString() != this.state.postController.post._id);

      this.setState({ posts: payload });

      this.oculteEditPost();

    }).catch(err => {
      Debug.post({ err: err.response.data.error });
    });
  }
  oculteEditPost() {
    Animated.sequence([
      Animated.timing(
        this.state.animatedValueToEditPostContainer,
        {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
          easing: Easing.ease
        }
      )
    ]).start(() => {
    })
    this.setState({
      postController: {
        post: {},
        edit: false,
        newContent: '',
        newImage: undefined
      }
    })
  }
  cancelEditPost() {
    this.oculteEditPost();
  }
  loadImageOnEditPost() {
    const options = {
      quality: 1.0,
      storageOptions: {
        skipBackup: true,
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      } else if (response.error) {
        this.setState({ error: 'Ouve um erro ao carregar a imagem da galeria' });
      }
      else {
        let data = new FormData()
        data.append('file', {
          name: response.fileName,
          type: response.type,
          uri: response.uri,
        });

        const photo = resizeImage({
          width: response.width,
          height: response.height,
          content: 'data:image/jpeg;base64,' + response.data
        });

        console.log(photo);

        this.setState({
          postController: {
            ...this.state.postController,
            post: {
              ...this.state.postController.post,
              photo,
            },
            newImage: data,
            loadedImage: true
          },
          // imageUri: { uri: 'data:image/jpeg;base64,' + response.data },
        });
      }
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
      posts: this.state.posts,
      animFeedContainer: this.animFeedContainer.bind(this)
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


            <View style={{ width: Dimensions.get('window').width, backgroundColor: '#E8E8E8' }}>
              <FlatList
                ref={ref => this.flatListRef = ref}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.animatedValueFromScrollY } } }])}
                data={this.state.posts}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                ListHeaderComponent={() => (<View style={{ height: this.state.tamFrameProfile + this.state.tamBio + 10 }} />)}
                renderItem={({ item }) => {
                  const datePost = item.createdAt.split('T')[0].split('-').reverse();
                  const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                  const ico = pushed ? FlameRedIco : FlameBlueIco;
                  if (item.photo) item.photo = resizeImage(item.photo);

                  return (
                    <View style={{ backgroundColor: '#E8E8E8' }}>
                      <PostProfile
                        push_ico={ico}
                        post_id={item._id}
                        user_id={this.props.account.user._id}
                        post_user_id={item.assignedTo._id}
                        datePost={datePost}
                        pushTimes={item.pushes.times}
                        comments={item.comments}
                        content={item.content}
                        postPhoto={item.photo}
                        commentController={this.state.commentController}
                        editOrNewComment={this.editOrNewComment}
                        newComment={this.newComment}
                        pushPost={this._pushPost.bind(this)}
                        sharePost={this.sharePost.bind(this)}
                        editPost={this.editPost.bind(this)}
                        debug={this.debug.bind(this)}
                        clickImageProfile={this.clickImageProfile.bind(this)}
                      />
                    </View>
                  )
                }}
              />
              {!this.state.posts.length ? (
                <View
                  style={{
                    width: Dimensions.get('window').width,
                    height: Dimensions.get('window').height,
                    padding: 20,
                    position: 'absolute',
                    backgroundColor: '#FFF',
                  }}
                >
                  <View style={{ height: this.state.tamBio + this.state.tamFrameProfile }} />
                  <Text style={{ color: '#08F', fontSize: 16 }}>
                    Parece que é sua primeira vez,
                    comesse configurando seu perfil,
                    adicionando suas redes sociais,
                    adicionando uma breve biografia
                    e faça uma postagem de boas vindas.
                      </Text>
                </View>
              ) : null}

              <Animated.View
                style={{
                  position: 'absolute',
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
                  animatedValueToTransform={this.state.animatedValueToTransform}
                  animatedValueFromScrollY={this.state.animatedValueFromScrollY}
                  tamBio={this.state.tamBio}
                  tamFrameProfile={this.state.tamFrameProfile + this.state.tamBio}
                />
              </Animated.View>



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
            </View>
            {this.state.postController.edit ? (
              <Animated.View
                style={{
                  width: Dimensions.get('window').width,
                  height: Dimensions.get('window').height,
                  transform: [{
                    translateY: this.state.animatedValueToEditPostContainer.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-Dimensions.get('window').height, 0]
                    }),
                  }],
                  backgroundColor: '#FFF',
                  position: 'absolute',
                  top: 0
                }}
              >
                <EditOrNewPost
                  contentPost={this.state.postController.post.content}
                  photoPost={this.state.postController.post.photo}
                  post_id={this.state.postController.post._id}
                  loadImageOnEditPost={this.loadImageOnEditPost.bind(this)}
                  editContentPost={this.editContentPost.bind(this)}
                  cancelEditPost={this.cancelEditPost.bind(this)}
                  doneEditPost={this.doneEditPost.bind(this)}
                  deletePost={this.deletePost.bind(this)}

                  // FAKE
                  push_ico={FlameBlueIco}
                  post_id='-'
                  thumbnail={this.props.account.user.photo.thumbnail}
                  firstName={this.props.account.user.name.first}
                  lastName={''}
                  nickname={this.props.account.user.name.nickname}
                  pushTimes={
                    this.state.postController.post.pushes.times ? this.state.postController.post.pushes.times : 0
                  }
                  assignedTo_id='-'
                  clickImageProfile={() => null}
                  pushPost={() => null}
                // FAKE
                />
                {Debug.post({ post: this.state.posts[0] })}
              </Animated.View>
            ) : null}
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