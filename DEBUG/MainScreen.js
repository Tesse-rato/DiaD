import React from 'react';
import { createBottomTabNavigator } from "react-navigation";

import Geral from '../src/components/Geral';
import Justice from '../src/components/Justice';
import NewPost from '../src/components/NewPost';
import Bussines from '../src/components/Bussines';
import Favorites from '../src/components/Favorites';

import FeedIco from '../assets/GeneralDiaD.svg';
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
    }
  }
);
