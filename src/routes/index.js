import { createStackNavigator, createAppContainer } from "react-navigation";
import Login from '../components/Login';
import Register from '../components/Register';

const Routes = createStackNavigator({
  Login,
  Register,
},
  {
    initialRouteName: 'Login'
  }
);

export default createAppContainer(Routes);