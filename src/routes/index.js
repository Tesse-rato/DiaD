import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from '../components/Login';
import Register from '../components/Register';
import Register2 from '../components/Register2';

// import {
//   Login,
//   Register,
//   Register2,
// } from '../components';

const Routes = createStackNavigator({
  Login,
  Register,
  Register2,
},
  {
    initialRouteName: 'Login'
  }
);

export default createAppContainer(Routes);