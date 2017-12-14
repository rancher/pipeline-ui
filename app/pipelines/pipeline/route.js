import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  queryParams: {
    mode: {
      refreshModel: true
    },
  },
  model: function(params) {
    var pipelineSvc = this.get('pipeline');
    if(!pipelineSvc.ready||!pipelineSvc.ready.ready){
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.find('pipeline',params.pipeline_id);
    var pipelineHistory = null;
    if(params.mode === 'review'){
      pipelineHistory = pipelineStore.find('activity');
    }
    return Ember.RSVP.hash({
        pipeline: pipeline
        ,accounts: pipelineStore.find('gitaccount')
        ,pipelineHistory
      }).then(({pipeline,accounts,pipelineHistory})=>{
        var piplineObj;
        if(params.mode === 'duplicate'){
          piplineObj = pipelineStore.createRecord({
            ...pipeline.serialize(),
            id: '',
            name: ''
          })
        }else if(params.mode === 'review'){
          piplineObj = pipeline;
        }else{
          piplineObj = pipelineStore.createRecord(
            pipeline.serialize()
          );
        }
        return {
          pipeline: piplineObj,
          accounts,
          pipelineHistory
        }
      });
  }
});
