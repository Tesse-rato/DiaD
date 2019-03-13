import React, { Component } from 'react'
import { View, StatusBar, FlatList, ProgressBarAndroid, Dimensions } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import Api from '../api';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';

import { MinhaView, Header } from "../styles/standard";
import { Post } from '../styles/postFeed';

class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.state = {
      posts: [],
      loading: true,
      atualizar: false,
      editContentComment: {
        edit: false,
        upload: false,
        commentId: '',
        contentComment: '',
      },
      newComment: {
        postId: '',
        content: '',
      }
    };
  }

  componentWillMount() {
    this.setState({ posts: this.props.data }, () => {
      this.setState({ loading: false });
    });
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.y);
  }

  clickImageProfile(_id) {
    console.log('Clicoi em aqi oh - ', _id);
  }

  pushPost(_id) {

    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const payload = {
      assignedTo: this.props.account._id,
      postId: _id
    }

    Api.patch('/posts/push', payload, config).then(() => {

      const posts = this.state.posts;

      posts.map(post => {
        if (post._id == _id) {
          post.pushes.times++
          post.pushes.users.push(this.props.account._id);
        }
      });

      this.setState({ posts });

    }).catch(err => {

      Api.delete('/posts/push', { data: payload, headers: { authorization: `Bearer ${this.props.account.token}` } }).then(() => {
        const posts = this.state.posts;

        posts.map(post => {
          if (post._id == _id) {
            post.pushes.times--
            post.pushes.users = post.pushes.users.filter(user => user != this.props.account._id);
          }
        });

        this.setState({ posts });
      }).catch(err => {
        console.log(err, 'ERROR');
        console.log(err.response, 'ERROR');
      });
    });
  }
  newComment(postId) {

    // let posts = this.state.posts;
    // let comment = {
    //   _id: 'NADA POR ENQUANTO',
    //   assignedTo: `${this.props.account}`
    // }

    let random = [];
    for (let i = 0; i < 12; i++) {
      random.push(Math.random() * 100);
    }

    console.log(random.toString('hex'));
  }
  editComment(arg, commentId, postId, newContent) {

    let posts = this.state.posts;

    if (!this.state.editContentComment.edit && arg === 'edit') {
      console.log(arg);

      this.setState({ editContentComment: { edit: true, commentId } });

      posts.forEach((post, index) => {
        post._id.toString() == postId ? this.indexOfPost = index : null
      });

      posts[this.indexOfPost].comments.forEach((comment, index) => {
        comment._id.toString() == commentId ? this.indexOfComment = index : null
      });

      const contentComment = this.state.posts[this.indexOfPost].comments[this.indexOfComment].content;

      this.setState({
        editContentComment: {
          commentId,
          edit: true,
          contentComment
        }
      });
    }
    else if (arg === 'editContent') {
      this.setState({
        editContentComment: {
          commentId,
          edit: true,
          contentComment: newContent
        }
      });
    }
    else if (arg === 'edit' && this.state.editContentComment.edit) {
      this.setState({
        editContentComment: {
          edit: false
        }
      });
    }
    else if (arg === 'done') {

      if (this.state.editContentComment.contentComment == '') return this.editComment('delete', commentId, postId);

      const payload = this.state.posts;
      payload[this.indexOfPost].comments[this.indexOfComment].content = this.state.editContentComment.contentComment;

      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      let data = {
        postId,
        commentId,
        content: this.state.editContentComment.contentComment
      }

      this.setState({ editContentComment: { ...this.state.editContentComment, upload: true } }, () => {
        Api.patch('/posts/editComment', data, config).then(() => {
          this.setState({
            posts: payload
          }, () => {
            this.setState({
              editContentComment: {
                edit: false,
                upload: false
              }
            });
          });
        }).catch(err => {
          console.log(err);
        });
      })
    }
    else if (arg === 'delete') {

      let config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        },
        data: {
          commentId,
          postId
        }
      }
      this.setState({ editContentComment: { ...this.state.editContentComment, upload: true } });
      Api.delete('/posts/comment', config).then(() => {

        let payload = [];

        payload = this.state.posts[this.indexOfPost].comments.filter(comment => comment._id.toString() != commentId);

        let posts = this.state.posts;

        posts[this.indexOfPost].comments = payload;

        this.setState({ posts, editContentComment: { edit: false, upload: false } });


      }).catch(err => {
        console.log(err);
      });
    }
  }

  sharePost(_id) {
    console.log('SHARE POST - ', _id);
  }

  render() {
    console.disableYellowBox = true;
    return (
      //style={{ width: Dimensions.get('window').width, height: this.state.valueToAnimatedView, opacity: this.state.valueToOpacity, backgroundColor: '#E8E8E8', alignItems: 'center', justifyContent: 'center' }}
      <MinhaView style={{ justifyContent: 'center' }} >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        <Header
          placeholder='Id/Apelido'
          source={{ uri: this.props.account.photo.thumbnail }}
          clickImageProfile={this.clickImageProfile.bind(this)}

        />
        {!this.state.loading ? (
          <FlatList
            onMomentumScrollEnd={(e) => this.debug(e)}
            data={this.state.posts}
            extraData={this.state.posts}
            keyExtractor={item => item._id}
            renderItem={({ item }) => {
              let ico;
              const pushed = item.pushes.users.find(id => id.toString() == this.props.account._id)
              ico = pushed ? FlameRedIco : FlameBlueIco;

              return (
                <Post
                  key={item._id}
                  push_ico={ico}
                  user_id={this.props.account._id}
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
                  editContentComment={this.state.editContentComment}
                  clickImageProfile={this.clickImageProfile.bind(this)}
                  pushPost={this.pushPost.bind(this)}
                  newComment={this.newComment.bind(this)}
                  editComment={this.editComment.bind(this)}
                  sharePost={this.sharePost.bind(this)}
                  debug={this.debug.bind(this)}
                />
              )
            }}
          />
        ) : (
            <View style={{ width: Dimensions.get('window').width, flex: 1, justifyContent: 'center' }} >
              <ProgressBarAndroid
                indeterminate={true}
                color={'#FFF'}
                styleAttr='Horizontal'
                style={{ width: Dimensions.get('window').width, height: 10 }} />
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
