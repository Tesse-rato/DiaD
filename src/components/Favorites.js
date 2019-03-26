import React from 'react';
import Feed from './Feed';

import { connect } from 'react-redux';

const favorites = props => (
  <Feed
    url={`/posts/list/favorites/${props.account.user._id}`}
    navigation={props.navigation}
  />
);

const mapStateToProps = state => ({
  account: state.account
})

export default connect(mapStateToProps)(favorites);