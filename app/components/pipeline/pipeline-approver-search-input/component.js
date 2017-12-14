import Ember from 'ember';

export default Ember.Component.extend({
  state: Ember.Object.create({
    selecting: false,
    inputVal: ''
  }),
  selectedEle: Ember.Object.create({}),
  model: null,
  filteredModel: function() {
    var model = this.get('model');
    return model.filter(el => {
      var val = this.get('state.inputVal');
      if (!el.name) {
        return false
      }
      return el.name.indexOf(val) !== -1;
    })
  }.property('state.inputVal', 'model'),
  actions: {
    select: function(item) {
      this.sendAction('approverSelect', item);
    },
    showSelectList: function() {
      this.get('state').set('selecting', true);
    },
    hideSelectList: function() {
      setTimeout(() => {
        this.get('state').set('selecting', false);
      }, 0)
    },
  },
  willDestroyElement: function(){
    this.get('state').set('selecting', false);
  }
});
