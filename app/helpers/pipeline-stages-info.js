import Ember from 'ember';

function stagesInfo() {
  var arg = arguments[0];
  return arg[0][arg[1]].steps[arg[2]][arg[3]];
}
export default Ember.Helper.helper(stagesInfo);
