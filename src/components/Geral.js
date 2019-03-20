import React from 'react';

import Feed from './Feed';

export default props => (
  <Feed
    url='/posts/list'
    navigation={props.navigation}
  />
);
