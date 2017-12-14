import Ember from 'ember';

export default Ember.Component.extend({
  model: null,
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
  logStatus:[],
  init(){
    this._super();
    let logStatus = [];
    var activity_stages = this.get('filteredPipelineHistory');
    activity_stages.forEach(ele=>{
      logStatus.addObject(Ember.Object.create({
        activity: ele,
        stepIndex: 0,
        stageIndex: 0,
        step: [0,0],
        activityLogs: Ember.Object.create({}),
      }));
    });
    this.set('logStatus', logStatus);
  },
});
