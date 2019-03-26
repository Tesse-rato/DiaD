import React, { Component } from 'react';
import { View, Text, ProgressBarAndroid, Dimensions, BackHandler } from 'react-native';
import ImagePicker from 'react-native-image-picker';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import Api from '../api';
import { resizeImage } from '../funcs';
import { EditOrNewPost } from '../styles/editOrNewPost';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';

import Debug from '../funcs/debug';

class NewPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      postController: {
        post: {
          _id: '_id',
          content: '',
          photo: undefined
        },
        edit: false,
        oldContent: '',
        loadedImage: false,
        newImage: undefined,
      },
      uploading: false
    };
  }
  componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', () => this.cancelEditPost());
  }
  editContentPost(newValue) {
    this.setState({
      postController: {
        ...this.state.postController,
        post: {
          ...this.state.postController.post,
          content: newValue,
        }
      }
    });
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
  cancelEditPost() {
    this.deletePost();
    this.props.navigation.goBack();
  }
  doneEditPost() {
    if (!this.state.postController.loadedImage && !this.state.postController.post.content) {
      return this.cancelEditPost()
    }

    this.setState({ uploading: true });

    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      },
    };

    const data = {
      assignedTo: this.props.account.user._id,
      content: this.state.postController.post.content
    }

    Api.post('/posts/create', data, config).then(({ data: post }) => {

      if (this.state.postController.loadedImage) {

        const url = `/posts/postPhoto/${post._id}`

        const file = this.state.postController.newImage;

        Api.patch(url, file, config).then(({ data }) => {

          post.photo = data;

          this.setState({
            postController: {
              ...this.state.postController,
              photo: undefined,
              content: '',
            }
          });
          this.setState({ uploading: false });
          this.cancelEditPost();

        }).catch(err => {
          Debug.post({ err: err.response });

        });

      } else {
        this.setState({ uploading: false });
        this.cancelEditPost();
        Debug.post({ msg: 'Tudo Sucesso' });
      }
    }).catch(err => {
      Debug.post({ err: err.response.data.error });
    })
  }
  deletePost() {
    this.setState({
      postController: {
        ...this.state.postController,
        post: {
          ...this.state.postController.post,
          photo: undefined,
          content: '',
        },
      }
    });
  }

  render() {
    return (
      <View
        style={{
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height - 100,
          justifyContent: 'flex-start'
        }}
      >
        <EditOrNewPost
          newPost
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
          lastName=''
          nickname={this.props.account.user.name.nickname}
          pushTimes={0}
          assignedTo_id='-'
          clickImageProfile={() => null}
          pushPost={() => null}
        // FAKE
        />
        {this.state.uploading ? (
          <View
            style={{
              position: 'absolute',
              top: 0,
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
              backgroundColor: '#FFF',
              opacity: 1,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text
              style={{ color: '#08F', margin: 10 }}
            >Postando</Text>
            <ProgressBarAndroid
              styleAttr='Normal'
              undefined={true}
              color='#08F'
            />
          </View>
        ) : null}
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPost);