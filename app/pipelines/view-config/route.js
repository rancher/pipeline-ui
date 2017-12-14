import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function(params) {
    var pipelineSvc = this.get('pipeline');
    if(!pipelineSvc.ready||!pipelineSvc.ready.ready){
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.find('pipeline',params.pipeline_id);
    return pipeline.then(pipelineObj => {
      return pipelineObj.doAction('export');
    });
  }
});