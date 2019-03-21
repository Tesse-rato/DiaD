import Api from '../api';

export default class Degub {
  post(obj) {
    Api.post('/users/debug', obj).then(() => null);
  }
}