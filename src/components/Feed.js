import React, { Component } from 'react'
import { View, StatusBar, FlatList, ProgressBarAndroid, Dimensions, Animated, TouchableOpacity } from 'react-native'
// import { generateSecureRandom } from 'react-native-securerandom'; ISSO È UM DEMONIO LEMBRE DE TIRALO DE DESLINKALO

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import Api from '../api';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';
import ScrolltoUpIco from '../assets/ScrollToUp.svg';

import { MinhaView, Header } from "../styles/standard";
import { Post } from '../styles/postFeed';

import { editOrNewComment, newComment, pushPost, increaseUserNamePosts } from "../funcs";

class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.editOrNewComment = editOrNewComment.bind(this);
    this.newComment = newComment.bind(this);
    this.pushPost = pushPost.bind(this);

    this.state = {
      posts: [],
      loading: true,
      refresh: false,
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
      valueToAnimatedView: new Animated.Value(0)
    };
  }
  componentWillMount() {
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    Api.get(this.props.url, config).then(({ data: posts }) => {
      increaseUserNamePosts(posts).then(posts => {
        this.setState({ posts, loading: false });
      });
    });
  }
  componentDidMount() {
    // this.setState({ loading: false });
    Animated.sequence([
      Animated.delay(100),
      Animated.timing(
        this.state.valueToAnimatedView,
        {
          toValue: Dimensions.get('window').height,
          duration: 500,
        }
      )
    ]).start(() => this.setState({ loading: false }));
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.y);
  }

  clickImageProfile(_id) {
    this.props.setProfileId(_id);
    this.props.navigation.navigate('Profile');
  }

  handleRefresh() {
    this.setState({ refreshing: true }, () => {
      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      Api.get(this.props.url, config).then(({ data: posts }) => {
        this.setState({ posts, refreshing: false });

      }).catch(err => {
        alert('Nao foi possivel atualzar');
        this.setState({ refreshing: false });
      });
    });
  }

  sharePost(_id) {
    console.log('SHARE POST - ', _id);
  }
  scrollTo() {
    this.flatListRef.scrollToOffset({ animated: true, offset: 0, duration: 1000 });
  }
  _pushPost(postId) {
    this.pushPost(postId).then(posts => {
      this.setState({ posts });
    }).catch(err => {
      console.log(err);
    });
  }

  render() {
    console.disableYellowBox = true;
    return (
      //style={{ width: Dimensions.get('window').width, height: this.state.valueToAnimatedView, opacity: this.state.valueToOpacity, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' }}
      <MinhaView style={{ justifyContent: 'center' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {!this.state.loading ? (
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Header
              placeholder='Id/Apelido'
              source={{ uri: this.props.account.user.photo.thumbnail }}
              clickImageProfile={() => this.clickImageProfile(this.props.account.user._id)}
            />
            <FlatList
              ref={(ref) => this.flatListRef = ref}
              onRefresh={() => this.handleRefresh()}
              refreshing={this.state.refresh}
              onMomentumScrollEnd={(e) => this.debug(e)}
              ListFooterComponent={() => (
                <View style={{ alignItems: 'center', padding: 5 }}>
                  <TouchableOpacity
                    style={{
                      alignItems: 'center',
                      width: Dimensions.get('window').width - 20,
                      height: Dimensions.get('window').height - 540,
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
                    comments={item.comments}
                    commentController={this.state.commentController}
                    clickImageProfile={this.clickImageProfile.bind(this)}
                    pushPost={this._pushPost.bind(this)}
                    newComment={this.newComment.bind(this)}
                    editOrNewComment={this.editOrNewComment.bind(this)}
                    sharePost={this.sharePost.bind(this)}
                    debug={this.debug.bind(this)}
                  />
                )
              }}
            />
          </View>
        ) : (
            <Animated.View style={{ width: Dimensions.get('window').width, height: this.state.valueToAnimatedView, alignItems: 'center', justifyContent: 'center', backgroundColor: '#E8E8E8' }}>
              <View style={{ width: Dimensions.get('window').width, flex: 1, justifyContent: 'center', backgroundColor: '#FFF' }} >
                <ProgressBarAndroid
                  indeterminate={true}
                  color={'#08F'}
                  styleAttr='Normal'
                />
              </View>
            </Animated.View>
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
