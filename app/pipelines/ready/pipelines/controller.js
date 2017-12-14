import Ember from 'ember';
export default Ember.Controller.extend({
  queryParams: ['sortBy', 'descending'],
  sortBy: 'Name',
  bulkActions: false,
  filtered: function() {
    let out = this.get('model');
    this.set('bulkActions', !!out.get('length'));
    return out;
  }.property('model.@each.status'),
});
