import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
export default Ember.Component.extend(NewOrEdit, {
  userList: null,
  model: Ember.Object.create({
    selectedApprovers: [],
    validationErrors: function(){
      return 'error'
    }
  }),
  init() {
    this._super(...arguments);
  },
  selectedApprovers: function() {
    return this.get('userList').filter(ele => !!ele.selected)
  }.property('userList.@each.selected'),
  actions: {
    cancel: function() {
      // TODO: set default done() go back to pipelines.index.active
      this.done();
    },
    approverSelect: function(index) {
      let selected = this.get('userList')[index].selected;
      this.get('userList')[index].set('selected', !selected);
    }
  },
  doneSaving() {
    this.sendAction('cancel');
  },
});
