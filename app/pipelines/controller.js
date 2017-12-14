import Ember from 'ember';

export default Ember.Controller.extend({
  init(){
    this._super(...arguments);
  },
  readyObserves: function(){
    var model = this.get('model');
    if(model.ready.ready){
      model.cancelTimer();
    }
  }.observes('model.ready.ready')
});