import Ember from 'ember';

const stepOneChoice = [{
  id: 'scm',
}];

const stepsChoices = [{
    id: 'task',
  },{
    id: 'build',
  },{
    id: 'upgradeService'
  },{
    id: 'upgradeStack'
  }
  ,{
    id: 'upgradeCatalog'
  }
];

export default Ember.Component.extend({
  selectedModel: function(){
    return this.get('model')[this.get('type')]
  }.property('model','type'),
  stepsTypeChoices: null,
  type: null,
  model: null,
  init(){
    this._super(...arguments);
    var stepMode = this.get('modalOpts.stepMode');
    if(stepMode === 'scm'){
      this.set('stepsTypeChoices', stepOneChoice);
    }else{
      this.set('stepsTypeChoices', stepsChoices);
    }
  }
});
