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
  BackHandler,
} from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import Api from '../api';

import ScrolltoUpIco from '../assets/ScrollToUp.svg';

import { FooterPost } from '../styles/FooterComponent';

import Post from './Post';

import { decreasePostsUserName, decreaseUserName } from "../funcs";

import Debug from '../funcs/debug';
class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.tamBottomBar = 50;

    this.state = {
      erro: '',
      posts: [],
      onFeed: true,
      loading: true,
      refresh: false,
      loadingMore: false,
      limit: 10,
      page: 0,
      indexDisplayed: 0,
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
    };
  }
  componentWillMount() {
    this.props.navigation.addListener('didFocus', () => this.setState({ onFeed: true }));

    this.props.navigation.addListener('willBlur', () => this.setState({ onFeed: false }));

    BackHandler.addEventListener('hardwareBackPress', this._goBack.bind(this));

    this.loadFromApi();
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
        }
        else {
          this.setState({ posts: _posts, loading: false, refresh: false });
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
  donePostRender(index) {
    if (++index >= this.state.posts.length) {
      this.animeContainerView(true);
    }
  }
  handleRefresh() {
    this.setState({ page: 0, listComplete: false, refresh: true }, () => {
      this.loadFromApi();
    });
  }
  animeContainerView(arg, cb) {
    let value = arg ? 1 : 0;
    let date = Date.now();
    Debug.post({ msg: 'Comeco da animacao', date: date - Date.now() })
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(
        this.state.valueToAnimatedContainerView,
        {
          toValue: value,
          duration: 1000,
        }
      )
    ]).start(() => {
      cb ? cb() : null
      Debug.post({ msg: 'Final da animacao', date: Date.now() - date + ' ms' })
    });
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
      <Animated.View
        style={{
          flexDirection: 'row',
          width: Dimensions.get('window').width * 2,
          heigth: Dimensions.get('window').heigth,
          left: this.state.valueToAnimatedContainerView.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -Dimensions.get('window').width]
          }),
          marginTop: this.props.animatedValueToContentScrollY.interpolate({
            inputRange: [0, this.props.tamSearchBar * 20, this.props.tamSearchBar * 30],
            outputRange: [this.props.tamSearchBar, this.props.tamSearchBar, 0],
            extrapolate: 'clamp'
          })
        }}
      >
        <StatusBar barStyle='' backgroundColor='#FFF' hidden={false} />
        <View
          style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFF'
          }}
        >
          <ProgressBarAndroid
            indeterminate={this.state.loading}
            progress={this.state.indexDisplayed * .1}
            color='#08F'
            styleAttr={'Horizontal'}
          />
        </View>

        {!this.state.loading ? (
          <FlatList
            ref={(ref) => this.flatListRef = ref}
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.props.animatedValueToContentScrollY } } }])}
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
            renderItem={({ item, index }) => (
              <Post
                post={item}
                index={index}
                donePostRender={this.donePostRender.bind(this)}
                environment='Feed'
                clickImageProfile={this.props.clickImageProfile}
                updateAndSortPosts={this.updateAndSortPosts.bind(this)}
              />
            )}
          />
        ) : null}

        <Animated.View
          style={{
            position: 'absolute',
            right: 20,
            bottom: this.props.animatedValueToContentScrollY.interpolate({
              inputRange: [0, this.props.tamSearchBar * 70, this.props.tamSearchBar * 80],
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
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Feed)
