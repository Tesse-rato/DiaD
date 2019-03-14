import React from 'react';
import { createBottomTabNavigator } from "react-navigation";

import Geral from './Geral';
import Justice from './Justice';
import NewPost from './NewPost';
import Bussines from './Bussines';
import Favorites from './Favorites';

import FeedIco from '../assets/FeedDiaD.svg';
import JusticeIco from '../assets/JusticeDiaD.svg';
import NewPostIco from '../assets/NewPostDiaD.svg';
import BussinesIco from '../assets/BussinesDiaD.svg';
import FavoritesIco from '../assets/FavoritesDiaD.svg';

export default TabBarBottom = createBottomTabNavigator({
  Geral: {
    screen: Geral,
    navigationOptions: {
      tabBarLabel: 'Geral',
      tabBarIcon: () => (
        <FeedIco width={26} height={26} />
      ),
    }
  },
  NewPost: {
    screen: NewPost,
    navigationOptions: {
      tabBarLabel: 'Novo Post',
      tabBarIcon: () => (
        <NewPostIco width={26} height={26} />
      ),
    }
  },
  Justice: {
    screen: Justice,
    navigationOptions: {
      tabBarLabel: 'Justiça',
      tabBarIcon: () => (
        <JusticeIco width={26} height={26} />
      ),
    }
  },
  Favorites: {
    screen: Favorites,
    navigationOptions: {
      tabBarLabel: 'Favoritos',
      tabBarIcon: () => (
        <FavoritesIco width={26} height={26} />
      ),
    }
  },
  Bussines: {
    screen: Bussines,
    navigationOptions: {
      tabBarLabel: 'Negoçios',
      tabBarIcon: () => (
        <BussinesIco width={26} height={26} />
      ),

    }
  }
},
  {
    initialRouteName: 'Geral',
    order: ['Geral', 'Justice', 'NewPost', 'Bussines', 'Favorites'],
    navigationOptions: {
      header: null,

    },
    tabBarOptions: {
      activeTintColor: '#08F',
      height: 60
    }
  }
);
