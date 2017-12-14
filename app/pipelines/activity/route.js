import Ember from 'ember';

export default Ember.Route.extend({
  pipeline: Ember.inject.service(),
  model: function(params) {
    var pipeline = this.get('pipeline');
    if(!pipeline.ready||!pipeline.ready.ready){
      return null
    }
    var pipelineStore = this.get('pipelineStore');
    var activity = pipelineStore.find('activity',params.activity_id);
    return Ember.RSVP.hash({
      activity
    }).then(({activity})=>{
      return {activity}
    });
  },
});