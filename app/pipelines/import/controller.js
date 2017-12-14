import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';

var validationErrors = function(pipeline){
  var errors = []
  if (!pipeline.templates) {
    return errors.push('"yml file" is required')
  }
  return errors
};

export default Ember.Controller.extend(NewOrEdit, {
  error:     null,
  editing:   false,
  compose:   null,
  files:     null,
  growl: Ember.inject.service(),

  init() {
    this._super(...arguments);
  },

  actions: {
    save: function(success){
      this.set('model.pipeline.templates',{
        "pipeline.yaml": this.get('compose')
      })
      var model = this.get('model')
      var errors=validationErrors(model.pipeline)
      if(errors.length>0){
        this.set('errors',errors)
        success(false)
        return
      }
      model.pipeline.save().then(()=>{
        success(true)
        this.transitionToRoute('pipelines.ready.pipelines')
      }).catch((err)=>{
        this.get('growl').fromError(err.message);
        return success(false)
      })
    },
    cancel: function(){
      this.transitionToRoute('pipelines.ready.pipelines')
    }
  },
});
