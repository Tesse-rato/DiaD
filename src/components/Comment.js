// import React, { Component } from 'react';
// import { View, Text, Animated, Dimensions, ScrollView } from 'react-native';
// import { connect } from 'react-redux';

// import Api from '../api';

// import { ContainerComment, CommentHeader, CommentContent } from '../styles/comment';

// import Debug from '../funcs/debug';
// class CommentComp extends Component {
//   constructor() {
//     super();

//     this.state = {
//       comments: [],
//       commentController: {
//         edit: false,
//         upload: false,
//         commentId: '',
//         newComment: false,
//         tempCommentContent: '',
//       },
//       animatedViewToNewComment: new Animated.Value(0),
//     };
//   }

//   componentWillMount() {
//     this.setState({ comments: this.props.comments });
//   }
//   animNewCommentContainer() {
//     Animated.timing(
//       this.state.animatedViewToNewComment,
//       {
//         toValue: 1,
//         duration: 250
//       }
//     ).start();
//   }
//   newComment() {
//     this.setState({
//       commentController: {
//         ...this.state.commentController,
//         edit: true,
//         newComment: true,
//         commentId: 'TEMPORARIO'
//       }
//     }, () => {
//       this.props.updateTamPostComment(this.state.commentController, this.animNewCommentContainer.bind(this));
//     })
//   }

//   editComment(arg, commentId, newValue) {

//     this.state.comments.forEach((comment, index) => {
//       comment._id.toString() == commentId ? this.indexOfComment = index : null;
//     });

//     if (arg == 'edit') {
//       this.setState({
//         commentController: {
//           ...this.state.commentController,
//           commentId,
//           edit: true,
//           tempCommentContent: this.state.comments[this.indexOfComment].content
//         }
//       }, () => {
//         this.props.updateTamPostComment(this.state.commentController);
//       });
//     }

//     if (arg == 'edit' && this.state.commentController.edit) {
//       this.setState({
//         commentController: {
//           ...this.state.commentController,
//           edit: false,
//           tempCommentContent: ''
//         }
//       })
//     }

//     if (arg == 'editContent') {
//       this.setState({
//         commentController: {
//           ...this.state.commentController,
//           tempCommentContent: newValue
//         }
//       });
//     }
//   }

//   render() {
//     return (
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         pagingEnabled={true}
//         stickyHeaderIndices={true}
//         style={{ width: Dimensions.get('window').width - 40, padding: 2 }}
//         snapToAlignment='center'
//         snapToInterval={Dimensions.get('window').width - 47}
//       >
//         <Animated.View
//           style={{
//             width: this.state.animatedViewToNewComment.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0, Dimensions.get('window').width - 50]
//             }),
//             opacity: this.state.animatedViewToNewComment.interpolate({
//               inputRange: [0, 1],
//               outputRange: [0, 1]
//             }),
//             height: this.props.tamPostComment,
//           }}
//         >
//           <ContainerComment>
//             <CommentHeader
//               user_id={this.props.account.user._id}
//               comment_id={this.state.commentController.commentId}
//               assignedTo={this.props.account.user._id}
//               thumbnail={this.props.account.user.photo.thumbnail}
//               firstName={this.props.account.user.name.first}
//               lastName={this.props.account.user.name.last}
//               nickname={this.props.account.user.name.nickname}
//               editComment={() => null}
//               clickImageProfile={() => null}
//             />
//           </ContainerComment>

//           <CommentContent
//             valueOnEditing={this.state.commentController.tempCommentContent}
//             editComment={this.editComment.bind(this)}
//             commentController={this.state.commentController}
//             comment_id={this.state.commentController.commentId}
//           />
//         </Animated.View>

//         {this.state.comments.map(comment => {
//           return (
//             <View>
//               <ContainerComment>
//                 <CommentHeader
//                   user_id={this.props.account.user._id}
//                   comment_id={comment._id}
//                   assignedTo={comment.assignedTo._id}
//                   thumbnail={comment.assignedTo.photo.thumbnail}
//                   firstName={comment.assignedTo.name.first}
//                   lastName={comment.assignedTo.name.last}
//                   nickname={comment.assignedTo.name.nickname}
//                   editComment={this.editComment.bind(this)}
//                   clickImageProfile={() => null}
//                 />

//                 <CommentContent
//                   comment_id={comment._id}
//                   content={comment.content}
//                   commentController={this.state.commentController}
//                   valueOnEditing={this.state.commentController.tempCommentContent}
//                   editComment={this.editComment.bind(this)}
//                 />
//               </ContainerComment>

//             </View>
//           )
//         })}

//       </ScrollView>
//     );
//   }
// }

// const mapStateToProps = state => ({
//   account: state.account
// });

// export default connect(mapStateToProps)(CommentComp);