import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
  logStatus:[],
  init(){
    this._super();
    this.setLogStatus();
  },
  setLogStatus: function(){
    let logStatus = [];
    var activity_stages = this.get('filteredPipelineHistory');
    activity_stages.forEach(ele=>{
      let initialStepIndex = 0;
      let initialStageIndex = 0;
      if(ele.status === 'Waiting'){
        initialStepIndex = -1;
        initialStageIndex = -1;
      }
      logStatus.addObject(Ember.Object.create({
        activity: ele,
        stepIndex: initialStepIndex,
        stageIndex: initialStageIndex,
        activityLogs: Ember.Object.create({}),
      }));
    });
    this.set('logStatus', logStatus);
  },
  activityStatusObserve: function(){
    debugger
    var activity_stages = this.get('filteredPipelineHistory');
    for (var i = 0; i < activity_stages.length; i++) {
      var item = activity_stages[i];
      if(item.status === 'Waiting'){
        this.get('logStatus').objectAt(i).setProperties({
          stepIndex: -1,
          stageIndex: -1,
          'activityLogs': Ember.Object.create({})
        });
      }
    }
  }.observes('filteredPipelineHistory.@each.status'),
});
