import React, { Component } from 'react';
import { View, Text } from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postController: {
        post: {
          _id: '_id',
          content: '',

        },
        edit: false,
        content: '',
        photo: {
          content: '',
          width: null,
          heigth: null,
        }
      }
    };
  }

  render() {
    return (
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
        thumbnail={this.state.posts[0].assignedTo.photo.thumbnail}
        firstName={this.state.posts[0].assignedTo.name.first}
        lastName={this.state.posts[0].assignedTo.name.last}
        nickname={this.state.posts[0].assignedTo.name.nickname}
        pushTimes={this.state.postController.post.pushes.times}
        assignedTo_id='-'
        clickImageProfile={() => null}
        pushPost={() => null}
      // FAKE
      />
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);