import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  isLocal: null,

  tagName: 'TR',
  classNames: 'main-row',
  actions: {
    pipelineSelect: function(item) {
      var model = this.get('model');
      model.set('selected', !model.selected);
    },
  }
});
