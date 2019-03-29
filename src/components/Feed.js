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

import { MinhaView, FeedHeader } from "../styles/standard";
import { Post } from '../styles/postFeed';
import UserSearch from './UserSearch';

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
      userSearch: '',
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
      animatedValueToOffsetScroll: new Animated.Value(0),
      valueToAnimatedContainerView: new Animated.Value(0),
      animatedValueToUserSearchView: new Animated.Value(0),
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

    Api.get(this.props.url, config).then(({ data }) => {
      decreasePostsUserName(data).then(posts => {
        this.setState({ posts, loading: false }, () => {
          this.animeContainerView(true);
        });

      }).catch(err => {
        alert('Confira sua conexao');
      })
    }).catch(err => {
      alert(err.response.data.error);
    })
  }
  handleRefresh() {
    this.setState({ refreshing: true }, () => {
      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      Api.get(this.props.url, config).then(({ data: posts }) => {
        decreasePostsUserName(posts).then(posts => {
          this.setState({ posts, refreshing: false });
        })
      }).catch(err => {
        alert('Nao foi possivel atualzar');
        this.setState({ refreshing: false });
      });
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
  animUserSearchView(arg) {
    const value = arg ? 1 : 0;

    Animated.timing(
      this.state.animatedValueToUserSearchView,
      {
        toValue: value,
        duration: 1000,
        easing: Easing.ease
      }
    ).start()
  }
  onChangeTextUserSearch(newValue) {
    this.setState({ userSearch: newValue });

    if (!newValue) return this.animUserSearchView(false);

    this.animUserSearchView(true);

  }
  clickImageProfile(_id) {
    this.animeContainerView(false);
    this.props.setProfileId(_id);
    this.props.navigation.navigate('Profile', { animFeedContainer: this.animeContainerView.bind(this) });
  }
  _pushPost(_id) {
    this.pushPost(_id).then(posts => {
      this.setState({ posts });
    }).catch(err => {
      console.log(err);
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
      <MinhaView style={{ justifyContent: 'flex-end' }}>
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
                top: this.state.animatedValueToOffsetScroll.interpolate({
                  inputRange: [0, this.tamSearchBar * 15],
                  outputRange: [60, 0],
                  extrapolate: 'clamp'
                })
              }}
            >
              <FlatList
                ref={(ref) => this.flatListRef = ref}
                onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.state.animatedValueToOffsetScroll } } }])}
                onRefresh={() => this.handleRefresh()}
                refreshing={this.state.refresh}
                ListFooterComponent={() => (
                  <View style={{ alignItems: 'center', padding: 5 }}>
                    <TouchableOpacity
                      style={{
                        alignItems: 'center',
                        width: Dimensions.get('window').width - 100,
                        height: 50,
                        padding: 10,
                        borderRadius: 60,
                        backgroundColor: '#FFF'
                      }}
                      onPress={() => this.scrollTo()}
                    >
                      <ScrolltoUpIco width={32} height={32} />
                    </TouchableOpacity>
                  </View>
                )}
                data={this.state.posts}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                  const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                  const ico = pushed ? FlameRedIco : FlameBlueIco;
                  if (item.photo) item.photo = resizeImage(item.photo);

                  return (
                    <Post
                      key={item._id}
                      push_ico={ico}
                      user_id={this.props.account.user._id}
                      post_id={item._id}
                      assignedTo_id={item.assignedTo._id}
                      firstName={item.assignedTo.name.first}
                      lastName={item.assignedTo.name.last}
                      nickname={item.assignedTo.name.nickname}
                      thumbnail={item.assignedTo.photo.thumbnail}
                      pushTimes={item.pushes.times}
                      pushAssignedTo={pushed}
                      content={item.content}
                      postPhoto={item.photo}
                      comments={item.comments}
                      commentController={this.state.commentController}
                      clickImageProfile={this.clickImageProfile.bind(this)}
                      pushPost={this._pushPost.bind(this)}
                      newComment={this.newComment.bind(this)}
                      editOrNewComment={this.editOrNewComment.bind(this)}
                      sharePost={this.sharePost.bind(this)}
                    />
                  )
                }}
              />
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                width: Dimensions.get('window').width,
                height: 60,
                transform: [{
                  translateY: this.state.animatedValueToOffsetScroll.interpolate({
                    inputRange: [0, this.tamSearchBar * 10, this.tamSearchBar * 15],
                    outputRange: [0, 0, -this.tamSearchBar],
                    extrapolate: 'clamp'
                  })
                }]
              }}
            >
              <FeedHeader
                placeholder='Buscar Usuário'
                profilePhotoSource={{ uri: this.props.account.user.photo.thumbnail }}
                clickImageProfile={() => this.clickImageProfile(this.props.account.user._id)}
                value={this.state.userSearch}
                onChangeText={this.onChangeTextUserSearch.bind(this)}
              />
            </Animated.View>

            <Animated.View
              style={{
                position: 'absolute',
                top: 0,
                width: Dimensions.get('window').width,
                height: Dimensions.get('window').height - (this.tamBottomBar + this.tamSearchBar),
                backgroundColor: '#FFF',
                transform: [{
                  translateY: this.state.animatedValueToUserSearchView.interpolate({
                    inputRange: [0, 1],
                    outputRange: [
                      -Dimensions.get('window').height,
                      this.tamSearchBar
                    ]
                  })
                }]
              }}
            >
              <UserSearch
                search={this.state.userSearch}
                clickImageProfile={this.clickImageProfile.bind(this)}
              />
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
