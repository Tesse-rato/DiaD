import React, { Component } from 'react'
import { View, StatusBar, FlatList, ProgressBarAndroid, Dimensions } from 'react-native'
import { generateSecureRandom } from 'react-native-securerandom';

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
        newComment: false,
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
    /**
     * NewComment apenas inicia um comentario falso
     * Colocando o minimo para a funcao EditOrNewPost 
     * Fazer o que foi feita para fazer
     * Recebe um _id falso para ser identificado nos components
     * E tambem colocado no state real da aplicacao
     * Isso porque ele precisa ser reconhecido no component FlatList
     */
    let posts = this.state.posts;
    let _id = 'NOVO POST';

    let comment = {
      _id,
      content: '',
      assignedTo: {
        _id: this.props.account._id,
        name: this.props.account.name,
        photo: this.props.account.photo
      },
    };

    posts.map((post, index) => post._id.toString() == postId ? this.indexOfPost = index : null);

    let comments = [comment, ...this.state.posts[this.indexOfPost].comments];

    posts[this.indexOfPost].comments = comments;

    this.setState({ posts, editContentComment: { newComment: true } }, () => {
      this.editOrNewComment('editContent', _id, postId);
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

    if (!this.state.editContentComment.edit && arg === 'edit') {
      /**
       * Se ainda nao estiver no ESTADO_EDIT entra nesse corpo
       * É setado o atributo edit do STATE
       * É iterado pelo STATE para pegar os index referente ao POST && COMMENT
       * Entao é setado um atributo na classe <this.indexOfPost, this,indexOfComment>
       * Esses indexs sao reaproveitado ao longo da funcao
       * A funcao desse bloco é apenas encontrar o index
       */
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
      /**
       * EditContent poe o estado da aplicação para editar o conteudo do comentario
       * OBS o conteudo alterado nao é o original do comentario
       * É um campo temporario no state da aplicacao
       */
      this.setState({
        editContentComment: {
          ...this.state.editContentComment,
          commentId,
          edit: true,
          contentComment: newContent
        }
      });
    }
    else if (arg === 'edit' && this.state.editContentComment.edit) {
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
        editContentComment: {
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
       * 3º No estado EditContentComment tem um campo NewComment
       * Se ele estiver setado entra no campo responsavel pelo tal
       * 
       * 4ª Campo NewComment = false 
       * Entra no corpo que vai realizar payload na Api com o conteudo temporario
       */

      if (this.state.editContentComment.contentComment == '') return this.editOrNewComment('delete', commentId, postId);
      if (this.state.posts[this.indexOfPost].comments[0].content == '') return this.editOrNewComment('delete', commentId, postId);

      const config = {
        headers: {
          authorization: `Bearer ${this.props.account.token}`
        }
      }

      if (this.state.editContentComment.newComment) {
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
          assignedTo: this.props.account._id,
          content: this.state.editContentComment.contentComment,
        }

        this.setState({
          editContentComment: {
            ...this.state.editContentComment,
            upload: true
          }
        }, () => {

          Api.patch('/posts/comment', data, config).then(({ data: comment }) => {

            let payload = this.state.posts;
            payload[this.indexOfPost].comments[0] = comment;

            this.setState({
              posts: payload,
              editContentComment: {
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
        payload[this.indexOfPost].comments[this.indexOfComment].content = this.state.editContentComment.contentComment;


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
                  editOrNewComment={this.editOrNewComment.bind(this)}
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
