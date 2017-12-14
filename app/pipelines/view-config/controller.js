import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';

export default Ember.Controller.extend(NewOrEdit, {
  model: null,
  compose: function(){
    return this.get('model');
  }.property('model'),
  actions: {
    cancel: function(){
      this.transitionToRoute('pipelines.ready.pipelines')
    }
  },
});
