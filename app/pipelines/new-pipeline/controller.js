import Ember from 'ember';

export default Ember.Controller.extend({ 
  growl: Ember.inject.service(),
  stages: function(){
    var pipeline = this.get('model.pipeline');
    pipeline.set('stages',[{
      name: 'Source Code',
      steps: []
    }]);
    return pipeline.stages;
  }.property('model.pipeline'),
  errors: null,
  init(){
    this._super();
  },
  actions: {
    save: function(success){
      var model = this.get('model');
      var errors=model.pipeline.validationErrors();
      if(errors.length>0){
        this.set('errors',errors);
        success(false);
        return
      }
      model.pipeline.save().then(()=>{
        success(true);
        this.transitionToRoute('pipelines.ready.pipelines');
      }).catch((err)=>{
        this.get('growl').fromError(err.message);
      }).finally(()=>{
        success(false);
      })
    },
    cancel: function(){
      this.transitionToRoute('pipelines.ready.pipelines');
    }
  }
});
