import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement(){
    this._super(...arguments);
    var type = this.get('modalOpts.type');
    if(type === 'review'){
      this.$('input').prop('disabled',true);
    }
  }
});
