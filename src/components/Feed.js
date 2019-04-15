import React, { Component } from 'react'
import {
  View,
  Text,
  StatusBar,
  FlatList,
  ProgressBarAndroid,
  Dimensions,
  Animated,
  TouchableOpacity,
  Share,
  Linking,
  Easing,
  BackHandler
} from 'react-native'

// import { generateSecureRandom } from 'react-native-securerandom'; ISSO È UM DEMONIO LEMBRE DE TIRALO DE DESLINKALO

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import Api from '../api';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';
import ScrolltoUpIco from '../assets/ScrollToUp.svg';

import { MinhaView } from "../styles/standard";
import { FooterPost } from '../styles/FooterComponent';

import Post from './Post';
import FeedHeader from './FeedHeaderComp';

import { editOrNewComment, newComment, pushPost, decreasePostsUserName, resizeImage, decreaseUserName } from "../funcs";

import Debug from '../funcs/debug';
class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.editOrNewComment = editOrNewComment.bind(this);
    this.newComment = newComment.bind(this);
    this.pushPost = pushPost.bind(this);

    this.tamSearchBar = 60;
    this.tamBottomBar = 50;

    this.state = {
      erro: '',
      posts: [],
      onFeed: true,
      loading: true,
      refresh: false,
      loadingMore: false,
      userSearch: '',
      limit: 5,
      page: 0,
      listComplete: false,
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
      animatedValueToFooterPost: new Animated.Value(0),
      valueToAnimatedContainerView: new Animated.Value(0),
      animatedValueToContentScrollY: new Animated.Value(0),
    };
  }
  componentWillMount() {
    this.props.navigation.addListener('didFocus', () => {
      this.loadFromApi();
      this.setState({ onFeed: true });
    });

    this.props.navigation.addListener('willBlur', () => this.setState({ onFeed: false }));

    BackHandler.addEventListener('hardwareBackPress', this._goBack.bind(this));
  }
  loadFromApi() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const { page, limit } = this.state;
    const url = `/posts/list/general/${page}/${limit}`;

    Api.get(url, config).then(({ data }) => {

      if (data.posts.length < limit) {
        this.setState({
          refresh: false,
          listComplete: true
        });
        Debug.post({ msg: 'Array Vazio loadFromApi' });
      }

      decreasePostsUserName(data.posts).then(_posts => {

        let { posts } = this.state;

        if (page > 0) {
          _posts.forEach(post => posts.push(post));
          this.setState({ posts, loadingMore: false });

        } else {
          posts = _posts;
          this.setState({ posts, loading: false, refresh: false }, () => {
            this.animeContainerView(true);
          });
        }


      }).catch(err => {
        Debug.post({ err, local: 'Feed.js loadFromApi(){ decrasePostUserName() }' });
        alert('Confira sua conexao');
      });

    }).catch(err => {
      Debug.post({ err, local: 'Feed.js loadFromApi(){ Api.get() }' });
    })
  }

  loadMorePosts() {
    const { listComplete } = this.state;

    if (listComplete) return;

    this.setState({ page: ++this.state.page, loadingMore: true }, () => {
      Debug.post({ page: this.state.page });
      this.loadFromApi();
    });

  }
  handleRefresh() {
    this.setState({ page: 0, listComplete: false, refresh: true }, () => {
      this.loadFromApi();
    });
  }
  animeContainerView(arg) {
    let value = arg ? 1 : 0;

    Animated.sequence([
      Animated.delay(200),
      Animated.timing(
        this.state.valueToAnimatedContainerView,
        {
          toValue: value,
          duration: 200,
          useNativeDriver: true,
          easing: Easing.in(Easing.ease)
        }
      )
    ]).start(() => this.setState({ onFeed: arg }));
  }
  clickImageProfile(_id) {
    this.animeContainerView(false);
    this.props.setProfileId(_id);
    this.props.navigation.navigate('Profile', { animFeedContainer: this.animeContainerView.bind(this) });
  }
  updateAndSortPosts(_id, post) {
    return new Promise(resolve => {
      const posts = this.state.posts;
      let indexOfPost;

      posts.forEach((post, index) => post._id.toString() == _id ? indexOfPost = index : null);

      Debug.post({
        _id,
        indexOfPost,
        times: post.pushes.times,
        users: { ...post.pushes.users }
      })

      posts[indexOfPost] = post;

      const payload = posts.reverse().sort((a, b) => a.pushes.times - b.pushes.times).reverse();

      this.setState({ posts: payload }, () => resolve());
    });
  }
  sharePost(_id) {
    console.log('SHARE POST - ', _id);
    Linking.openURL('https://www.facebook.com').catch(err => {
      alert('Erro');
    })
  }
  scrollTo() {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0, duration: 1000 });
  }
  _goBack() {
    if (this.state.onFeed) {
      BackHandler.exitApp();
      return false;
    }
    return true;
  }

  render() {
    console.disableYellowBox = true;
    return (
      <MinhaView white style={{ justifyContent: 'flex-end' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {!this.state.loading ? (
          <Animated.View
            style={{
              flex: 1,
              alignItems: 'center',
              transform: [{
                translateX: this.state.valueToAnimatedContainerView.interpolate({
                  inputRange: [0, 1],
                  outputRange: [Dimensions.get('window').width, 0]
                })
              }]
            }}
          >

            <Animated.View
              style={{
                flex: 1,
                marginTop: this.state.animatedValueToContentScrollY.interpolate({
                  inputRange: [0, this.tamSearchBar * 20, this.tamSearchBar * 30],
                  outputRange: [this.tamSearchBar, this.tamSearchBar, 0],
                  extrapolate: 'clamp'
                })
              }}
            >
              <FlatList
                ref={(ref) => this.flatListRef = ref}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.animatedValueToContentScrollY } } }])}
                onRefresh={this.handleRefresh.bind(this)}
                refreshing={this.state.refresh}
                onEndReached={this.loadMorePosts.bind(this)}
                onEndReachedThreshold={1}
                ItemSeparatorComponent={() => (
                  <View style={{ alignSelf: 'center', height: 1, marginVertical: 25, width: Dimensions.get('window').width * .75, backgroundColor: '#BABABF' }} />
                )}
                ListFooterComponent={() => (
                  <FooterPost
                    animatedValueToFooterPost={this.state.animatedValueToFooterPost}
                    listComplete={this.state.listComplete}
                  />
                )}
                data={this.state.posts}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                renderItem={({ item }) => (
                  <Post
                    post={item}
                    environment='Feed'
                    clickImageProfile={this.clickImageProfile.bind(this)}
                    updateAndSortPosts={this.updateAndSortPosts.bind(this)}
                  />
                )}
              />
            </Animated.View>

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
                clickImageProfile={this.clickImageProfile.bind(this)}
              />
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                right: 20,
                bottom: this.state.animatedValueToContentScrollY.interpolate({
                  inputRange: [0, this.tamSearchBar * 70, this.tamSearchBar * 80],
                  outputRange: [-this.tamBottomBar, -this.tamBottomBar, 20],
                  extrapolate: 'clamp'
                })
              }}
            >
              <TouchableOpacity onPressOut={() => this.scrollTo()}>
                <ScrolltoUpIco width={50} height={50} />
              </TouchableOpacity>
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
          )}
      </MinhaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Feed)
