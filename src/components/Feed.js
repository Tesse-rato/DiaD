import React, { Component } from 'react'
import { View, Text, StatusBar, FlatList } from 'react-native'

import { connect } from 'react-redux'
import { bindActionCreators } from "redux";
import * as Actions from '../redux/actions';

import api from '../api';

import { Header } from '../styles/header';
import { Post } from '../styles/post';

class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

    this.state = {
      posts: [{
        pushes: {
          times: 0,
          users: []
        },
        createdAt: '',
        _id: 0,
        assignedTo: '',
        content: '',
        comments: [{
          content: '',
        }],
        __v: 0
      }],
      loading: true
    };
  }

  componentWillMount() {
    console.log('Component will mount');
    const config = {
      headers: {
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjN2ZiYzBiZWRlODlmMWZiMDRhMjNiYyIsImlhdCI6MTU1MjA1NDE5NCwiZXhwIjoxNTUyMTQwNTk0fQ.cNJoinQPzl6QNmuawHibZRadiofPGMsm9Iu7-ynhO9A'
      }
    }

    api.get('http://192.168.1.2/posts/list', config).then(({ data: posts }) => {
      this.setState({ posts, loading: false });
    }).catch(err => {
      console.log(err.response);
    })
  }

  debug() {
    console.log('Clicou aqui e deu certo');
    console.log(this.state.posts[0].content);
  }

  render() {
    console.disableYellowBox = true;
    return (
      <View style={{ flex: 1, backgroundColor: '#E8E8E8', alignItems: 'center' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' />

        <Header placeholder='Id/Apelido' source={{ uri: 'http://192.168.1.2:3333/selfie.jpg' }} />
        {
          this.state.loading == false ? (
            <FlatList
              data={this.state.posts}
              renderItem={({ item }) => (
                <Post content={item.content} comments={item.comments} />
              )
              }
              keyExtractor={item => item._id}
            />
          ) : null
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);


export default connect(mapStateToProps, mapDispatchToProps)(Feed)
