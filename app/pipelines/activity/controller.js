import Ember from 'ember';

export default Ember.Controller.extend({
  model: null,
  activeTab: 'history',
  filters: {
    activity: ['Waitting', 'Running'],
    history: ['Success', 'Error']
  },
  disableRerun: false,
  disableStop: false,
  rerunObserves: function(){
    var status = this.get('model.activity.status');
    if(status==='Waiting'||status==='Building'||status==='Pending'){
      this.set('disableRerun', true)
      return
    }
    this.set('disableRerun', false)
  }.observes('model.activity.status'), 
  init() {
    this._super();
    Ember.run.later(() => {
      this.set('model.activity.expanded', true);
    });
  },
  filteredPipelineHistory: function() {
    return [ this.get('model').activity ];
  }.property('model.activity.activity_stages.@each.status'),
  isHistory: function() {
    return this.get('activeTab') === 'history'
  }.property('activeTab'),
  originalModel: function(){
    return {
      activity: this.get('model.activity'),
      step: [this.get('model.stageIndex'),this.get('model.stepIndex')],
      activityLogs: this.get('model.activityLogs'),
    }
  }.property('model.stageIndex','model.stepIndex'),
  actions: {
    run: function() {
      var disabled = this.get('disableRerun');
      if(disabled){
        return
      }
      this.set('disableRerun', true);
      this.get('model.activity')
        .doAction('rerun')
          .finally(()=>{
            this.set('disableRerun', false);
          })
    },
    stop: function(){
      var disabled = this.get('disableStop');
      if(disabled){
        return
      }
      this.set('disableStop', true);
      this.get('model.activity')
        .doAction('stop')
          .finally(()=>{
            this.set('disableStop', false);
          })
    },
    showLogsActivity: function(stageIndex,stepIndex){
      this.set('model.stageIndex',stageIndex);
      this.set('model.stepIndex',stepIndex);
    },
  },
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
});
