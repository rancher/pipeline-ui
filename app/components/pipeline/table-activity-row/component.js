import Ember from 'ember';

export default Ember.Component.extend({
  stageIndex: 0,
  stepIndex: 0,
  activityLogs: null,
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
    this.get('logModel').set('stageIndex',runningStage);
    this.get('logModel').set('stepIndex',runningStep);
  }.observes('activity.activity_stages.@each.status'),
  logModel: function(){
    return this.get('logStatus')[this.get('index')];
  }.property('logStatus.{stageIndex,stepIndex}','index'),
  actions: {
    showLogsActivity: function(model,stageIndex,stepIndex){
      this.get('logModel').set('stageIndex',stageIndex);
      this.get('logModel').set('stepIndex',stepIndex);
    },
  }
});
