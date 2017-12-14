import Ember from 'ember';

export function dateFromNow(params) {
  if(params[1]){
    return moment(params[0]).fromNow()[params[1]];
  }
  return moment(params[0]).fromNow();
}

export default Ember.Helper.helper(dateFromNow);
