import Api from '../api';

export default class Degub {
  static post(obj) {
    Api.post('/users/debug', obj).then(() => null);
  }
}