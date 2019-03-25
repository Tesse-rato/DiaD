import Api from '../api';
import { Dimensions } from 'react-native';
import Debug from './debug';

export function editOrNewComment(arg, commentId, postId, newContent) {
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
export function newComment(postId) {
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
export function pushPost(_id) {
  /**
   * PushPost tenta fazer um request de push na api
   * Lá é validado se o usuario ja fez esse push
   * Caso nao é retorndo ok e o estado da aplicação é alterado
   * Case recusado e retornado 400 é intendido que o usuario quer retirar seu push
   * Entao é alterado novamente o estado da alteracao
   */
  return new Promise((resolve, reject) => {

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

      resolve(posts);

    }).catch(err => {

      Api.delete('/posts/push', { data: payload, headers: { authorization: `Bearer ${this.props.account.token}` } }).then(() => {
        const posts = this.state.posts;

        posts.map(post => {
          if (post._id == _id) {
            post.pushes.times > 0 ? post.pushes.times-- : null;
            post.pushes.users = post.pushes.users.filter(user => user != this.props.account.user._id);
          }
        });

        resolve(posts);

      }).catch(err => reject(err));
    });
  });
}
export function decreasePostsUserName(posts) {

  return new Promise((resolve, reject) => {
    let newPosts = posts;

    try {
      newPosts.map((post) => {

        let { assignedTo: { name: { first, last } } } = post

        if (first.length >= 16) {

          newName = [];

          for (let i = 0; first.length < 13; i++) {
            newName.push(first[i]);
          }

          post.assignedTo.name.last = ''
          post.assignedTo.name.first = newName.reduce((acm, cur) => acm + cur) + '...';

        }
        else if (first.length + last.length > 16) {
          let newName = [];

          for (let i = 0; first.length + newName.length < 13; i++) {
            newName.push(last[i]);
          }

          post.assignedTo.name.last = newName.reduce((acm, cur) => acm + cur) + '...';

        }

        post.comments.map(comment => {
          let { assignedTo: { name: { first, last } } } = comment


          if (first.length >= 21) {

            newName = [];

            for (let i = 0; first.length < 18; i++) {
              newName.push(first[i]);
            }

            comment.assignedTo.name.last = ''
            comment.assignedTo.name.first = newName.reduce((acm, cur) => acm + cur) + '...';

          }
          else if (first.length + last.length > 21) {

            let newName = [];

            for (let i = 0; first.length + newName.length < 18; i++) {
              newName.push(last[i]);
            }

            comment.assignedTo.name.last = newName.reduce((acm, cur) => acm + cur) + '...';

          }
        })
      });

      resolve(newPosts);

    } catch (err) {
      reject(err);
    }
  });
}
export function resizeImage(photo) {
  const width = parseInt(photo.width);
  const height = parseInt(photo.height);
  const porcent = ((width - Dimensions.get('window').width) / width) * 100;
  photo.width = Dimensions.get('window').width;
  photo.height = height - ((porcent * height) / 100);

  return photo;
}
export function decreaseUserName(user) {
  return new Promise((resolve, reject) => {
    try {
      if (user.name.first.length > 18) {
        let first = [];
        for (let i = 0; i < 15; i++) {
          first.push(user.name.first[i]);
        }
        user.name.first = first.reduce((acm, crr) => acm + crr) + '...';
        resolve(user);
      }
      else if (user.name.first.length + user.name.last.length > 18) {
        let last = [];
        for (let i = 0; user.name.first.length + i < 15; i++) {
          last.push(user.name.last[i]);
        }
        user.name.last = last.reduce((acm, crr) => acm + crr) + '...';
        resolve(user);
      }
      else {
        resolve(user);
      }
    } catch (error) {
      Debug.post({ error });
      reject(error)
    }
  })
}