import Ember from 'ember';
import ManageLabels from 'ui/mixins/manage-labels';

var expressionStrToObj = function(str) {
  var isNotEqual = str.indexOf('!=');
  var splitedStr;
  if (isNotEqual !== -1) {
    splitedStr = str.split('!=');
    return {
      env: splitedStr[0],
      opt: '!=',
      value: splitedStr[1]
    }
  } else {
    splitedStr = str.split('=');
    return {
      env: splitedStr[0],
      opt: '=',
      value: splitedStr[1]
    }
  }
};

var expressionsObjToStr = function(obj) {
  return obj.env + obj.opt + obj.value;
};
export default Ember.Component.extend(ManageLabels, {
  intl: Ember.inject.service(),

  // Initial labels and host to start with
  initialLabels: null,
  conditions: {
    mode: 'all'
  },
  editing: true,

  classNames: ['accordion-wrapper'],

  actions: {
    addSchedulingRule() {
      this.send('addAffinityLabel');
    },

    removeSchedulingRule(obj) {
      this.send('removeLabel', obj);
    },
  },

  init() {
    this.set('allHosts', this.get('store').all('host'));
    this._super(...arguments);
    this.initLabels(this.get('initialLabels'), 'affinity');
    var model = this.get('model');
    var keys = model.conditions ? Object.keys(model.conditions) : [];
    if (keys.length) {
      var key = keys[0];
      key && this.set('conditions.mode', key);
      if (model.conditions[key]) {
        var expressions = model.conditions[key];
        var expObj = expressions.map(ele => expressionStrToObj(ele));
        this.set('labelArray', expObj);
      }
    } else {
      this.set('labelArray', [])
    }
  },
  observesExpObj: function() {
    var mode = this.get('conditions.mode');
    var labelArray = this.get('labelArray');
    this.set('model.conditions', {
      [mode]: labelArray.filter(ele => ele.env).map(ele => expressionsObjToStr(ele))
    })
  }.observes('labelArray.@each.env', 'conditions.mode', 'labelArray.@each.value', 'labelArray.@each.opt'),
  didReceiveAttrs() {
    if (!this.get('expandFn')) {
      this.set('expandFn', function(item) {
        item.toggleProperty('expanded');
      });
    }
  },
});
