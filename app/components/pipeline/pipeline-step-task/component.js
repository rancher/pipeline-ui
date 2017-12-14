import Ember from 'ember';

export default Ember.Component.extend({
  isShellObserves: function(){
    var isService = this.get('selectedModel.isService');
    if(isService){
      this.set('selectedModel.isShell',false);
    }else{
      this.set('selectedModel.isShell',true);
    }
  }.observes('selectedModel.isService'),
  actions: {
    changeTaskModel(state){
      this.set('selectedModel.isShell',state);
    }
  },
  parmStr: function(){
    var parm = this.get('selectedModel.parameters');
    var parmStr=[];
    for(var key in parm){
      if(parm.hasOwnProperty(key)){
        var val = parm[key];
        parmStr.push(key+'='+val)
      }
    }
    return parmStr.join('/\n');
  }.property('selectedModel.parameters')
});
