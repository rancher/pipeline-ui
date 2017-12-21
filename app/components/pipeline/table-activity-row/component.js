import Ember from 'ember';

export default Ember.Component.extend({
  init(){
    this._super();
    this.set('activityLogs', {});
  },
  runningObserves: function(){
    var stages = this.get('activity.activity_stages');
    var runningStage = stages.findIndex(ele=>ele.status==='Building');
    if(runningStage === -1){
      return
    }
    var runningStep = stages[runningStage].activity_steps.findIndex(ele=>ele.status==='Building');
    if(runningStep === -1) {
      return
    }
    this.get('logModel').setProperties({
      'stageIndex': runningStage,
      'stepIndex': runningStep
    });
  }.observes('activity.activity_stages.@each.status'),
  logModel: function(){
    return this.get('logStatus')[this.get('index')];
  }.property('logStatus.@each.{stageIndex,stepIndex,activityLogs}','index'),
  actions: {
    showLogsActivity: function(model,stageIndex,stepIndex){
      this.get('logModel').setProperties({
        'stageIndex': stageIndex,
        'stepIndex': stepIndex
      });
    },
  }
});
