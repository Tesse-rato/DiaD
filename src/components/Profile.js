import React, { PureComponent as Component } from 'react';
import { View, Text, StatusBar, FlatList, Dimensions, Animated, ProgressBarAndroid, AsyncStorage } from 'react-native';
//import { AnimatedCircularProgress } from 'react-native-circular-progress';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../redux/actions'

import Api from '../api';
import { editOrNewComment, newComment, pushPost } from '../funcs'

import { MinhaView } from "../styles/standard";
import { HeaderProfile } from "../styles/headerProfile";
import { PostProfile } from '../styles/postProfile';

import FlameBlueIco from '../assets/FlameBlueDiaD.svg';
import FlameRedIco from '../assets/FlameRedDiaD.svg';

class Profile extends Component {
  static navigationOptions = {
    header: null
  }
  constructor(props) {
    super(props);

    this.pushPost = pushPost.bind(this);
    this.newComment = newComment.bind(this);
    this.editOrNewComment = editOrNewComment.bind(this);

    this.state = {
      user: {},
      posts: [],
      force: true,
      loading: true,
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
      tamBio: 0,
      startScroll: 0,
      animatedValueToBioView: new Animated.Value(45),
      animatedValueToProfileImage: new Animated.Value(120),
    };
  }

  async componentWillMount() {

    const token = await AsyncStorage.getItem('token');
    const id = await AsyncStorage.getItem('_id');

    const config = {
      headers: {
        authorization: `Bearer ${token}`
      }
    }

    const url = `/users/profile/${id}`;

    Api.get(url, config).then(({ data: user }) => {

      this.props.setUser({ token, user });
      console.log(user);

      const tamBio = (Dimensions.get('window').height - 580) + (Math.ceil((Math.ceil(user.bio.length / 45) * 17.2) + 45));

      this.setState({
        user,
        tamBio,
        loading: false,
        posts: user.posts,
        animatedValueToBioView: new Animated.Value(tamBio)
      });

    }).catch(err => {
      console.log(err);
    });
  }

  debug(e) {
    console.log(e.nativeEvent.contentOffset.x);
  }

  momentumScroll(e) {
    const { y } = e.nativeEvent.contentOffset;
    this.setState({ startScroll: y })
    if (y < 1) {
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(
          this.state.animatedValueToBioView,
          {
            toValue: 0,
            duration: 500
          }
        ),
        Animated.timing(
          this.state.animatedValueToProfileImage,
          {
            toValue: 60,
            duration: 1000
          }
        )
      ]).start()
    }
  }
  compareOffset(currentValueScroll) {
    const { startScroll } = this.state;
    const differenceBettweenValues = Math.abs(startScroll - currentValueScroll);

    let valueToBioView = startScroll < currentValueScroll ? 0 : differenceBettweenValues > 400 || currentValueScroll <= 1 ? this.state.tamBio : null;
    let valueToProfileImage = startScroll < currentValueScroll ? 60 : differenceBettweenValues > 400 || currentValueScroll <= 1 ? 120 : 60;

    Animated.sequence([
      Animated.delay(300),
      Animated.timing(
        this.state.animatedValueToBioView,
        {
          toValue: valueToBioView,
          duration: 500
        }
      ),
      Animated.timing(this.state.animatedValueToProfileImage,
        {
          toValue: valueToProfileImage,
          duration: 1000
        }
      )
    ]).start();
  }
  clickImageProfile(_id) {
    console.log(_id);
  }
  sharePost(_id) {
    console.log(_id);
  }

  _pushPost(postId) {
    this.pushPost(postId, () => {
      this.setState({ force: !this.state.force });
    });
  }

  render() {
    console.disableYellowBox = true;
    console.log('render');
    return (
      <MinhaView style={{ justifyContent: 'flex-start' }}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFF' hidden />
        {
          !this.state.loading ? (
            <View style={{ backgroundColor: '#E8E8E8', flex: 1, alignItems: 'center' }}>
              <HeaderProfile bio={this.state.user.bio}
                firstName={this.state.user.name.first}
                lastName={this.state.user.name.last}
                nickname={this.state.user.name.nickname}
                thumbnail={this.state.user.photo.thumbnail}
                goBack={this.props.navigation.goBack}
                settings={this.props.navigation.navigate}
                animatedValueToBioView={this.state.animatedValueToBioView}
                animatedValueToProfileImage={this.state.animatedValueToProfileImage}
              />

              <FlatList
                onScrollBeginDrag={e => this.momentumScroll(e)}
                onMomentumScrollEnd={e => this.compareOffset(e.nativeEvent.contentOffset.y)}
                data={this.state.posts}
                showsVerticalScrollIndicator={false}
                keyExtractor={item => item._id}
                renderItem={({ item }) => {
                  let ico;
                  const pushed = item.pushes.users.find(id => id.toString() == this.props.account.user._id)
                  ico = pushed ? FlameRedIco : FlameBlueIco;
                  console.log('Atualizou a lista');

                  return (
                    <View style={{ backgroundColor: '#E8E8E8' }}>
                      <PostProfile
                        push_ico={ico}
                        post_id={item._id}
                        user_id={this.state.user._id}
                        comments={item.comments}
                        content={item.content}
                        commentController={this.state.commentController}
                        clickImageProfile={this.clickImageProfile}
                        editOrNewComment={this.editOrNewComment}
                        newComment={this.newComment}
                        pushPost={this._pushPost.bind(this)}
                        sharePost={this.sharePost.bind(this)}
                        debug={this.debug.bind(this)}
                      />
                    </View>
                  )
                }}
              />
            </View>
          ) : (
              <ProgressBarAndroid
                indeterminate={true}
                color={'#FFF'}
                styleAttr='Horizontal'
                style={{ width: Dimensions.get('window').width, height: 10 }} />
            )
        }
      </MinhaView>
    );
  }
}

const mapDispatchToProps = dispatch => bindActionCreators(Actions, dispatch);

const mapStateToProps = state => ({
  account: state.account,
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile);