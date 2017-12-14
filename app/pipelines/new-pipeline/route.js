import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function() {
    var pipelineSvc = this.get('pipeline');
    if(!pipelineSvc.ready||!pipelineSvc.ready.ready){
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var pipeline = pipelineStore.createRecord({type:'pipeline'});
    return Ember.RSVP.hash({accounts: pipelineStore.findAll('gitaccount')}).then(({accounts})=>{
      return Ember.Object.create({
        pipeline,
        accounts: accounts
      });
    })
  },
  resetController(controller,model){
    controller.set('errors', null);
  },
});