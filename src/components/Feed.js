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

class Feed extends Component {
  static navigationOptions = {
    header: null
  }

  constructor() {
    super();

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
    this.setState({ posts: this.props.data });
  }
  componentDidMount() {
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

    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    Api.get(`/users/profile/${_id}`, config).then(({ data: user }) => {
      alert(user.name.first);
    }).catch(err => {
      console.log(err.response.data.error);
    })
  }

  pushPost(_id) {
    /**
     * PushPost tenta fazer um request de push na api
     * Lá é validado se o usuario ja fez esse push
     * Caso nao é retorndo ok e o estado da aplicação é alterado
     * Case recusado e retornado 400 é intendido que o usuario quer retirar seu push
     * Entao é alterado novamente o estado da alteracao
     */
    const config = {
      headers: {
        authorization: `Bearer ${this.props.account.token}`
      }
    }

    const payload = {
      assignedTo: this.props.account.user._id,
      postId: _id
    }

    Api.patch('/posts/push', payload, config).then(() => {

      const posts = this.state.posts;

      posts.map(post => {
        if (post._id == _id) {
          post.pushes.times++
          post.pushes.users.push(this.props.account.user._id);
        }
      });

      this.setState({ posts });

    }).catch(err => {

      Api.delete('/posts/push', { data: payload, headers: { authorization: `Bearer ${this.props.account.token}` } }).then(() => {
        const posts = this.state.posts;

        posts.map(post => {
          if (post._id == _id) {
            post.pushes.times--
            post.pushes.users = post.pushes.users.filter(user => user != this.props.account.user._id);
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
    /**
     * NewComment apenas inicia um comentario falso
     * Colocando o minimo para a funcao EditOrNewPost 
     * Fazer o que foi feita para fazer
     * Recebe um _id falso para ser identificado nos components
     * E tambem colocado no state real da aplicacao
     * Isso porque ele precisa ser reconhecido no component FlatList
     */
    let posts = this.state.posts;
    let commentId = 'NOVO POST';

    let comment = {
      _id: commentId,
      content: '',
      assignedTo: {
        _id: this.props.account.user._id,
        name: this.props.account.user.name,
        photo: this.props.account.user.photo
      },
    };

    posts.map((post, index) => post._id.toString() == postId ? this.indexOfPost = index : null);

    let comments = [comment, ...this.state.posts[this.indexOfPost].comments];

    posts[this.indexOfPost].comments = comments;

    this.setState({ posts, commentController: { newComment: true } }, () => {
      this.editOrNewComment('editContent', commentId, postId);
    });
  }
  editOrNewComment(arg, commentId, postId, newContent) {
    /**
     * EditOrNewComment é responsavel por toda a logica de comunicação com a api
     * E de fato é ela quem faz todo o trabalho duro
     * StartNewComment so inicia um comentario falso no state
     * Apos isso EditOrNewComment pega o comentario falso e sobe para api
     * A api retorna o novo comentario e entao o comentario falso é substituido pelo retorno da api
     */
    let posts = this.state.posts;

    if (!this.state.commentController.edit && arg === 'edit') {
      /**
       * Se ainda nao estiver no ESTADO_EDIT entra nesse corpo
       * É setado o atributo edit do STATE
       * É iterado pelo STATE para pegar os index referente ao POST && COMMENT
       * Entao é setado um atributo na classe <this.indexOfPost, this,indexOfComment>
       * Esses indexs sao reaproveitado ao longo da funcao
       * A funcao desse bloco é apenas encontrar o index
       */
      this.setState({ commentController: { edit: true, commentId } });

      posts.forEach((post, index) => {
        post._id.toString() == postId ? this.indexOfPost = index : null
      });

      posts[this.indexOfPost].comments.forEach((comment, index) => {
        comment._id.toString() == commentId ? this.indexOfComment = index : null
      });

      const tempCommentContent = this.state.posts[this.indexOfPost].comments[this.indexOfComment].content;

      this.setState({
        commentController: {
          commentId,
          edit: true,
          tempCommentContent
        }
      });
    }
    else if (arg === 'editContent') {
      /**
       * EditContent poe o estado da aplicação para editar o conteudo do comentario
       * OBS o conteudo alterado nao é o original do comentario
       * É um campo temporario no state da aplicacao
       */
      console.log(newContent);
      this.setState({
        commentController: {
          ...this.state.commentController,
          commentId,
          edit: true,
          tempCommentContent: newContent
        }
      });
    }
    else if (arg === 'edit' && this.state.commentController.edit) {
      /**
       * Esse bloco é se caso o usuario clicar no EDIT
       * Indica que o usuario cancelou a operacao
       * Assim nao é alterado nada no conteudo original do comentario
       * 
       * Se o usuario tiver cancelado a operacao de novo post
       * E o novo post estiver vazio é feito uma chamada recursiva com parametro 'delete'
       */
      this.state.posts[this.indexOfPost].comments[0].content == '' ? this.editOrNewComment('delete', commentId, postId) : null

      this.setState({
        commentController: {
          edit: false
        }
      });
    }
    else if (arg === 'done') {
      /**
       * Done tem quatro tarefas
       * 1º se o conteudo temporario do comentario estiver vazio 
       * É intendido que nao existe comentario
       * Entao é feito uma chamada recursiva passando 'delete' no parametro da funcao
       * 
       * 2º É no caso do usuario criar um novo comentario com conteudo vazio
       * Clicando em done a aplicacao vai conferir no index do post sendo editado
       * Se o primeiro comentario (novo) estiver vazio
       * É feito uma chamada recursiva com parametro de 'delete'
       * 
       * 3º No estado commentController tem um campo NewComment
       * Se ele estiver setado entra no campo responsavel pelo tal
       * 
       * 4ª Campo NewComment = false 
       * Entra no corpo que vai realizar payload na Api com o conteudo temporario
       */
      if (!this.state.commentController.tempCommentContent) return this.editOrNewComment('delete', commentId, postId);

      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      if (this.state.commentController.newComment) {
        /**
         * Esse é o corpo pro caso do campo NewComment estiver setado
         * Áte aqui os atributos do comentario sao falsos
         * É upado apenas o conteudo temporario para api
         * PostId e AssignedTo referente a situacao real
         * Apos o patch a api retorna todos dados daquele novo comentario
         * Entao é usado aquele atributo da classe indexOfPost
         * Naquele index o comentario{0} da primeira posicao é o comentario com atributos falsos
         * Entao naquele index do post no primeiro comentario recebe o comentario real retornado da api
         */
        let data = {
          postId,
          assignedTo: this.props.account.user._id,
          content: this.state.commentController.tempCommentContent,
        }

        this.setState({
          commentController: {
            ...this.state.commentController,
            upload: true
          }
        }, () => {

          Api.patch('/posts/comment', data, config).then(({ data: comment }) => {

            let payload = this.state.posts;
            payload[this.indexOfPost].comments[0] = comment;

            this.setState({
              posts: payload,
              commentController: {
                newPost: false,
                upload: false,
                edit: false,
              },
            });
          }).catch(err => {
            console.log(err.response);
          });
        });
      }
      else {
        /**
         * Esse campo é para o caso do comentario ja existir na api e estar sofrendo alteracao
         * É feito um patch na api com o conteudo temporario no state da aplicacao
         * Apos o retorno de ok da api
         * Aquele comentario que ja tem dados reais da api no state recebe o conteudo temporario
         * Isso porque informacoes como _id nao sao alteradas, apenas o conteudo
         */
        const payload = this.state.posts;
        payload[this.indexOfPost].comments[this.indexOfComment].content = this.state.commentController.tempCommentContent;


        let data = {
          postId,
          commentId,
          content: this.state.commentController.tempCommentContent
        }

        this.setState({ commentController: { ...this.state.commentController, upload: true } }, () => {
          Api.patch('/posts/editComment', data, config).then(() => {
            this.setState({
              posts: payload
            }, () => {
              this.setState({
                commentController: {
                  edit: false,
                  upload: false
                }
              });
            });
          }).catch(err => {
            console.log(err);
          });
        });
      }
    }
    else if (arg === 'delete') {
      /**
       * Esse corpo 'delete' primeiro faz a request na api
       * Se retornado ok é carregado numa variavel temporaria payload
       * Todo restante do conteudo de comments daquele post no index
       * É atualizada o state posts da aplicacao desconsiderando o comentario que foi excluido na api
       */
      if (this.state.commentController.tempCommentContent == '') return this.editOrNewComment('delete', commentId, postId);

      let config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        },
        data: {
          commentId,
          postId
        }
      }
      this.setState({ commentController: { ...this.state.commentController, upload: true } });
      Api.delete('/posts/comment', config).then(() => {

        let payload = [];

        payload = this.state.posts[this.indexOfPost].comments.filter(comment => comment._id.toString() != commentId);

        let posts = this.state.posts;

        posts[this.indexOfPost].comments = payload;

        this.setState({ posts, commentController: { edit: false, upload: false } });


      }).catch(err => {
        console.log(err);
      });
    }
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

  render() {
    console.disableYellowBox = true;
    console.log(this.props);
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
                let ico;
                const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                ico = pushed ? FlameRedIco : FlameBlueIco;

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
                    pushPost={this.pushPost.bind(this)}
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
