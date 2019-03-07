import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from '../components/Login';
import Register from '../components/Register';
import Register2 from '../components/Register2';
import Home from '../components/Home';

// import {
//   Login,
//   Register,
//   Register2,
// } from '../components';

const Routes = createStackNavigator({
  Login,
  Register,
  Register2,
  Home,
},
  {
    initialRouteName: 'Register2'
  }
);

export default createAppContainer(Routes);