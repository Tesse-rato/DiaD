import React, { Component } from 'react'
import { View, StatusBar, FlatList, ProgressBarAndroid, Dimensions, AsyncStorage } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import api from '../api';

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
      user: [],
      loading: true
    };
  }

  componentWillMount() {

    const token = this.props.account.token;

    const config = {
      headers: {
        'authorization': `Bearer ${token}`
      }
    }

    api.get('/posts/list', config).then(({ data: posts }) => {
      this.setState({ posts, loading: false });
    }).catch(err => {
      console.log(err.response);
    })
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.y);
  }

  clickImageProfile(_id) {
    console.log('Clicoi em aqi oh - ', _id);
  }

  pushPost(_id) {
    console.log('pushPost - ', _id);
  }
  newComment(_id) {
    console.log('New Comente - ', _id);
  }
  editComment(commentId, postId) {
    console.log(commentId, ' COMMENT ID');
    console.log(postId, ' POST ID');
  }

  sharePost(_id) {
    console.log('SHARE POST - ', _id);
  }

  render() {
    console.disableYellowBox = true;
    console.log(this.props);
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }} >
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />
        <Header
          placeholder='Id/Apelido'
          source={{ uri: this.props.account.photo.thumbnail }}
          clickImageProfile={this.clickImageProfile.bind(this)}

        />
        {
          this.state.loading == false ? (
            <FlatList
              onMomentumScrollEnd={(e) => this.debug(e)}
              data={this.state.posts}
              keyExtractor={item => item._id}
              renderItem={({ item }) => {
                return (
                  <Post
                    user_id={this.props.account._id}
                    post_id={item._id}
                    assignedTo_id={item.assignedTo._id}
                    firstName={item.assignedTo.name.first}
                    lastName={item.assignedTo.name.last}
                    nickname={item.assignedTo.name.nickname}
                    thumbnail={item.assignedTo.photo.thumbnail}
                    pushTimes={item.pushes.times}
                    content={item.content}
                    comments={item.comments}
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
            )
        }
      </MinhaView>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Feed)
