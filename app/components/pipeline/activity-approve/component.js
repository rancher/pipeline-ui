import Ember from 'ember';

export default Ember.Component.extend({
  actions:{
    sendAction: function (model, action) {
      return model.send(action)
    }
  }
});
