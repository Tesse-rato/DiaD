import { createStackNavigator, createAppContainer } from "react-navigation";

import Login from '../components/Login';
import Register from '../components/Register';
import Register2 from '../components/Register2';
import Welcome from '../components/Welcome';
import MainScreen from '../components/MainScreen';
import Profile from '../components/Profile';
import SettingsProfile from '../components/SettingsProfile';

// import {
//   Login,
//   Register,
//   Register2,
// } from '../components';

const Routes = createStackNavigator({
  Login,
  Register,
  Register2,
  Welcome,
  MainScreen,
  Profile,
  SettingsProfile,
},
  {
    initialRouteName: 'SettingsProfile',
    navigationOptions: {
      header: null,
    }
  }
);

export default createAppContainer(Routes);