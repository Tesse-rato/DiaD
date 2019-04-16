import React, { Component } from 'react';
import { View, Animated, Dimensions, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import {
  ProfileHeaderOfPost,
  FeedHeaderOfPost,
  ContentPost,
  FooterPost,
} from '../styles/postFeed';

import {
  ContainerComment,
  CommentHeader,
  CommentContent,
  CloseDoneToEditComment
} from '../styles/comment';

import { resizeImage } from '../funcs';
import Api from '../api';

import BlueFlameIco from '../assets/FlameBlueDiaD.svg';
import RedFlameIco from '../assets/FlameRedDiaD.svg';

import Debug from '../funcs/debug';
class Post extends Component {
  constructor() {
    super();

    this.config = {
      headers: {
        authorization: ''
      }
    }

    this.state = {
      post: {
        content: '',
        photo: undefined,
        pushes: {
          times: 0,
          users: [],
        },
        comments: [],
        assignedTo: {
          name: {
            first: '',
            last: '',
            nickname: '',
          },
          photo: {
            thumbnail: '',
            originalPhoto: '',
          },
        },
      },
      commentController: {
        edit: false,
        upload: false,
        commentId: '',
        newComment: false,
        tempCommentContent: '',
      },
      force: true,
      pushed: false,
      tamPostImage: 0,
      tamPostComment: 0,
      tamPostContent: 0,
      tamPostHeader: 0,
      tamPostFooter: 0,
      tamPostContainer: 0,
      maxtamPostComment: 0,
      animatedViewToNewComment: new Animated.Value(0),
      animatedValueToPostContainer: new Animated.Value(500),
      animatedValueToDoneDeleteContainer: new Animated.Value(0),
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state !== nextState || this.props !== nextProps;
  }
  componentWillMount() {
    //Debug.post({ index: this.props.index, length: this.props.length });

    this.config.headers.authorization = `Bearer ${this.props.account.token}`;
    const pushed = this.props.post.pushes.users.find(userId => userId.toString() == this.props.account.user._id) ? true : false;

    this.getComponentsSize().then(({ tamPostHeader, tamPostImage, tamPostContent, tamPostFooter, tamPostContainer, tamPostComment, maxtamPostComment }) => {
      this.setState({
        post: this.props.post,
        pushed,
        tamPostHeader,
        tamPostImage,
        tamPostContent,
        tamPostComment,
        tamPostFooter,
        tamPostContainer,
        maxtamPostComment
      }, () => this.animPostContainer(tamPostContainer));
    });
  }
  componentDidMount() {
    this.props.donePostRender(this.props.index);
  }
  getComponentsSize() {
    return new Promise(resolve => {

      let tamPostFooter = 40;
      let tamPostHeader = 0;
      let tamPostImage = 0;
      let tamPostContent = 0;
      let tamPostComment = 0;
      let maxtamPostComment = 0;

      if (this.props.post.photo) {
        const photo = resizeImage(this.props.post.photo)
        this.props.post.photo = photo;
        tamPostImage = photo.height;
      }
      if (this.props.post.content) {
        const screanWidthConst = (Dimensions.get('window').width - 30) / 7.75;
        tamPostContent = (Math.ceil(this.props.post.content.length / screanWidthConst) * 18) + 20;
      }

      const screanWidthConst = (Dimensions.get('window').width - 50) / 7.75;
      maxtamPostComment = (Math.ceil(200 / screanWidthConst) * 15) + 110;
      if (this.props.post.comments.length) {

        let biggestContent = 0;

        this.props.post.comments.map(comment => {
          if (comment.content.length > biggestContent) {
            biggestContent = comment.content.length
          }
        });

        tamPostComment = (Math.ceil(biggestContent / screanWidthConst) * 15) + 85;
      }

      if (this.props.environment == 'Feed') {
        tamPostHeader = 80;
      }
      else if (this.props.environment == 'Profile') {
        tamPostHeader = 44;

        const postDate = this.props.post.createdAt.split('T')[0].split('-').reverse();
        this.props.post.createdAt = postDate;

        let category;
        switch (this.props.post.category) {
          case 'general': {
            category = 'Geral'
            break;
          }
          case 'justice': {
            category = 'Justiça'
            break;
          }
          case 'business': {
            category = 'Negoçios'
            break;
          }
        }

        this.props.post.category = category;
      }
      else if (this.props.environment == 'SettingsProfile') {
        // Quando na configuracao do perfil, os dados do post como a data ja foi tratada quando estava em Profile
        tamPostHeader = 44;
      }

      resolve({
        tamPostHeader,
        tamPostImage,
        tamPostContent,
        tamPostFooter,
        tamPostComment,
        maxtamPostComment,
        tamPostContainer: tamPostImage + tamPostContent + tamPostComment + tamPostHeader + tamPostFooter
      });

    });
  }
  animPostContainer(tam, cb) {
    Animated.sequence([
      Animated.delay(500),
      Animated.timing(
        this.state.animatedValueToPostContainer,
        {
          toValue: tam,
          duration: 500,
        }
      )
    ]).start(() => cb ? cb() : null);
  }
  animNewCommentContainer(arg, cb) {
    const value = arg ? 1 : 0;

    Animated.timing(
      this.state.animatedViewToNewComment,
      {
        toValue: value,
        duration: 500
      }
    ).start(() => cb ? cb() : null);
  }
  animDoneDeleteContainer(arg) {
    const value = arg ? 1 : 0;

    Animated.timing(
      this.state.animatedValueToDoneDeleteContainer,
      {
        toValue: value,
        duration: 1000
      }
    ).start();
  }
  pushPost() {

    const { environment } = this.props;

    const payload = {
      assignedTo: this.props.account.user._id,
      postId: this.state.post._id
    }

    if (environment == 'Feed') {
      var callBack = () => {
        setTimeout(() => {
          this.animPostContainer(0, () => {
            this.props.updateAndSortPosts(this.state.post._id, this.state.post)
              .then(() => this.animPostContainer(this.state.tamPostContainer));
          });
        }, 1000);
      };
    }
    else if (environment == 'Profile') {
      var callBack = () => null;
    }

    if (!this.state.pushed) {

      Api.patch('/posts/push', payload, this.config).then(() => {

        const post = this.state.post;

        post.pushes.times++;
        post.pushes.users.push(this.props.account.user._id);

        this.setState({ post, pushed: true }, callBack);

      }).catch(err => Debug.post({ err, msg: 'Erro em push' }));

    } else {

      const config = {
        ...this.config,
        data: payload
      };

      Api.delete('/posts/push', config).then(() => {

        const post = this.state.post;

        if (post.pushes.times > 0) post.pushes.times--;

        let payload = [];

        payload = post.pushes.users.filter(userId => userId.toString() != this.props.account.user._id);

        post.pushes.users = payload;

        this.setState({ post, pushed: false }, callBack);

      }).catch(err => Debug.post({ err, msg: 'Erro em unpush' }));
    }
  }
  newComment() {
    const value = !this.state.commentController.newComment;
    const edit = this.state.commentController.edit;
    let callback = null;

    this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });

    if (edit && value) {
      callback = () => {
        this.animNewCommentContainer(value, () => {
          this.animDoneDeleteContainer(value);
        });
      };
    }
    else {
      callback = () => {
        this.updateTamPostToComment(() => {
          this.animNewCommentContainer(value, () => {
            this.animDoneDeleteContainer(value);
          });
        });
      };
    }

    this.setState(
      {
        commentController: {
          ...this.state.commentController,
          edit: value,
          newComment: value,
          commentId: '',
          tempCommentContent: '',
          content: 'temp'
        }
      },
      callback
    );
  }
  editComment(arg, commentId, newValue) {

    const {
      edit,
      newComment
    } = this.state.commentController;

    this.state.post.comments.forEach((comment, index) => {
      if (comment._id.toString() == commentId) {
        this.indexOfComment = index
      }
    });


    if (arg == 'edit') {

      if (!edit) {
        this.setState({
          commentController: {
            ...this.state.commentController,
            edit: true,
            commentId,
            tempCommentContent: this.state.post.comments[this.indexOfComment].content
          }
        }, () => {
          this.updateTamPostToComment(() => {
            this.animDoneDeleteContainer(true);
          });
        });

      } else if (newComment) {
        /**Se ja estiver editando e a condicao de novo comentario for verdadeiro, e cancelada a operacao */
        this.newComment(); // Tipo cancelar

      } else {
        /** Se tiver clicado em edit e a aplicaco já estiver em estado de edicao, a edicao é cancelda */
        this.setState({
          commentController: {
            ...this.state.commentController,
            edit: false,
          }
        }, () => {
          this.updateTamPostToComment(() => {
            this.animDoneDeleteContainer(false);
          })
        });
      }
    }
    else if (arg == 'editContent') {
      this.setState({
        commentController: {
          ...this.state.commentController,
          tempCommentContent: newValue
        }
      });
    }
    else if (arg == 'done') {

      const {
        newComment,
        tempCommentContent
      } = this.state.commentController

      if (newComment && !tempCommentContent) {
        return this.newComment() // Tipo cancelar

      } else if (newComment) {

        const data = {
          assignedTo: this.props.account.user._id,
          postId: this.state.post._id,
          content: this.state.commentController.tempCommentContent
        }

        return this.setState({
          commentController: {
            ...this.state.commentController,
            upload: true,
          }
        }, () => {
          Api.patch('/posts/comment', data, this.config).then(({ data: comment }) => {
            this.setState({
              post: {
                ...this.state.post,
                comments: [comment, ...this.state.post.comments]
              },
              commentController: {
                ...this.state.commentController,
                upload: false,
                edit: false,
                newComment: false,
              }
            }, () => {
              this.updateTamPostToComment(() => {
                this.animNewCommentContainer(false);
              });
            });
          }).catch(err => Debug.post({ err }));
        });
      }

      this.setState({
        commentController: {
          ...this.state.commentController,
          upload: true
        }
      }, () => {

        const data = {
          commentId,
          postId: this.state.post._id,
          content: this.state.commentController.tempCommentContent
        }

        Api.patch('/posts/editComment', data, this.config).then(() => {

          const post = this.state.post;
          post.comments[this.indexOfComment].content = this.state.commentController.tempCommentContent;

          this.setState({
            post,
            commentController: {
              ...this.state.commentController,
              edit: false,
              upload: false,
              tempCommentContent: '',
            }
          }, () => this.updateTamPostToComment());

        }).catch(err => {
          Debug.post({ err });
        })
      })
    }
    else if (arg == 'delete') {

      const { newComment } = this.state.commentController;

      if (newComment) {
        return this.newComment(); // ele sabe cancelar
      }

      const config = {
        ...this.config,
        data: {
          postId: this.state.post._id,
          commentId
        }
      };

      this.setState({
        commentController: {
          ...this.state.commentController,
          upload: true
        }
      }, () => {
        Api.delete('posts/comment', config).then(() => {

          const {
            tamPostContainer,
            maxtamPostComment,
          } = this.state;

          this.animPostContainer(tamPostContainer - maxtamPostComment, () => {

            let payload = [];

            payload = this.state.post.comments.filter(comment => comment._id.toString() != commentId);

            this.setState({
              post: {
                ...this.state.post,
                comments: payload
              },
              commentController: {
                ...this.state.commentController,
                edit: false,
                upload: false,
                tempCommentContent: '',
              }
            }, () => {
              this.updateTamPostToComment();
            });
          });

        }).catch(err => {
          Debug.post({ err });
          this.setState({
            commentController: {
              ...this.state.commentController,
              upload: false,
              edit: false,
              tempCommentContent: '',
            }
          });
        });
      });
    }

  }
  updateTamPostToComment(cb) {

    let {
      tamPostComment,
      tamPostContainer,
      maxtamPostComment,
      commentController: { edit },
    } = this.state;

    if (edit) {

      tamPostContainer = (tamPostContainer - tamPostComment) + maxtamPostComment;

      this.setState({ tamPostContainer }, () => {
        this.animPostContainer(tamPostContainer, () => cb ? cb() : null);
      });
    }
    else {

      let biggestContent = 0;

      this.state.post.comments.map(comment => {
        if (comment.content.length > biggestContent) {
          biggestContent = comment.content.length
        }
      });

      const screanWidthConst = (Dimensions.get('window').width - 50) / 7.75;

      if (biggestContent) {
        tamPostComment = (Math.ceil(biggestContent / screanWidthConst) * 15) + 85;
      } else {
        tamPostComment = 0;
      }

      tamPostContainer = (tamPostContainer - maxtamPostComment) + tamPostComment;

      this.setState({ tamPostContainer, tamPostComment }, () => {
        this.animPostContainer(tamPostContainer, () => cb ? cb() : null);
      });
    }
  }
  render() {
    return (
      <View>
        <Animated.View
          style={{
            backgroundColor: '#FDFDFD',
            opacity: this.state.animatedValueToPostContainer.interpolate({
              inputRange: [this.state.tamPostContainer / 2, this.state.tamPostContainer],
              outputRange: [0, 1],
              extrapolate: 'clamp'
            }),
            width: Dimensions.get('window').width,
            height: this.state.animatedValueToPostContainer
          }}
        >
          {this.props.environment == 'Feed' ? (
            <FeedHeaderOfPost
              clickImageProfile={() => this.props.clickImageProfile(this.state.post.assignedTo._id)}
              push_ico={this.state.pushed ? RedFlameIco : BlueFlameIco}
              thumbnail={this.state.post.assignedTo.photo.thumbnail}
              firstName={this.state.post.assignedTo.name.first}
              lastName={this.state.post.assignedTo.name.last}
              nickname={this.state.post.assignedTo.name.nickname}
              pushTimes={this.state.post.pushes.times}
              pushPost={this.pushPost.bind(this)}
            />
          ) : (
              <ProfileHeaderOfPost
                push_ico={this.state.pushed ? RedFlameIco : BlueFlameIco}
                pushTimes={this.state.post.pushes.times}
                postDate={this.props.post.createdAt}
                category={this.state.post.category}
                post_id={this.state.post._id}
                user_id={this.props.account.user._id}
                post_user_id={this.state.post.assignedTo._id}
                editPost={this.props.editPost}
                pushPost={this.pushPost.bind(this)}
              />
            )}

          <ContentPost
            content={this.state.post.content}
            postPhoto={this.state.post.photo}
          />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <ScrollView
              ref={ref => this.scrollViewRef = ref}
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled={true}
              stickyHeaderIndices={true}
              style={{ width: Dimensions.get('window').width - 40, padding: 2 }}
              snapToAlignment='center'
              snapToInterval={Dimensions.get('window').width - 47}
            >
              <Animated.View
                style={{
                  width: this.state.animatedViewToNewComment.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Dimensions.get('window').width - 50]
                  }),
                  opacity: this.state.animatedViewToNewComment.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [0, 0, 1]
                  }),
                  height: this.props.tamPostComment,
                }}
              >
                <ContainerComment>
                  <CommentHeader
                    user_id={this.props.account.user._id}
                    comment_id={this.state.commentController.commentId}
                    assignedTo={this.props.account.user._id}
                    thumbnail={this.props.account.user.photo.thumbnail}
                    firstName={this.props.account.user.name.first}
                    lastName={this.props.account.user.name.last}
                    nickname={this.props.account.user.name.nickname}
                    editComment={this.editComment.bind(this)}
                    clickImageProfile={() => null}
                  />
                </ContainerComment>

                <CommentContent
                  valueOnEditing={this.state.commentController.tempCommentContent}
                  content={this.state.post.comments.length ? this.state.post.comments[0].content : ''}
                  commentController={this.state.commentController}
                  comment_id={this.state.commentController.commentId}
                  editComment={this.editComment.bind(this)}
                />

                <Animated.View
                  style={{
                    position: 'absolute',
                    left: this.state.animatedValueToDoneDeleteContainer.interpolate({
                      inputRange: [0, .5, 1],
                      outputRange: [0, 0, Dimensions.get('window').width / 2 - 75]
                    }),
                    opacity: this.state.animatedValueToDoneDeleteContainer.interpolate({
                      inputRange: [0, .4, 1],
                      outputRange: [0, 0, 1]
                    }),
                    top: 5
                  }}
                >
                  <CloseDoneToEditComment
                    commentController={this.state.commentController}
                    editComment={this.editComment.bind(this)}
                    comment_id={'TEMPORARIO'}
                  />
                </Animated.View>
              </Animated.View>

              {this.state.post.comments.map(comment => {
                return (
                  <ContainerComment>
                    <CommentHeader
                      user_id={this.props.account.user._id}
                      comment_id={comment._id}
                      assignedTo={comment.assignedTo._id}
                      thumbnail={comment.assignedTo.photo.thumbnail}
                      firstName={comment.assignedTo.name.first}
                      lastName={comment.assignedTo.name.last}
                      nickname={comment.assignedTo.name.nickname}
                      editComment={this.editComment.bind(this)}
                      clickImageProfile={this.props.clickImageProfile}
                    />

                    <CommentContent
                      comment_id={comment._id}
                      content={comment.content}
                      commentController={this.state.commentController}
                      valueOnEditing={this.state.commentController.tempCommentContent}
                      editComment={this.editComment.bind(this)}
                    />
                    {this.state.commentController.edit && this.state.commentController.commentId == comment._id ? (
                      <Animated.View
                        style={{
                          position: 'absolute',
                          top: 5,
                          left: this.state.animatedValueToDoneDeleteContainer.interpolate({
                            inputRange: [0, .5, 1],
                            outputRange: [0, 0, Dimensions.get('window').width / 2 - 75]
                          }),
                          opacity: this.state.animatedValueToDoneDeleteContainer.interpolate({
                            inputRange: [0, .4, 1],
                            outputRange: [0, 0, 1]
                          })
                        }}
                      >
                        <CloseDoneToEditComment
                          commentController={this.state.commentController}
                          editComment={this.editComment.bind(this)}
                          comment_id={comment._id}
                        />
                      </Animated.View>
                    ) : null}
                  </ContainerComment>
                )
              })}
            </ScrollView>
          </View>

          <FooterPost
            commentsLength={this.state.post.comments.length}
            newComment={this.newComment.bind(this)}
            sharePost={() => null}
          />

        </Animated.View>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  account: state.account
});

export default connect(mapStateToProps)(Post);