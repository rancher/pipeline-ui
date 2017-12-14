import Ember from 'ember';

export default Ember.Component.extend({
  endpointService: Ember.inject.service('endpoint'),
  serviceSubtitle: function(){
    var env = this.get('model.endpoint');
    if (!env) {
      return this.get('model.imageTag') + ' - ' + this.get('endpointService.api.display.environment.current')
    }
    return this.get('model.imageTag') + ' - ' + this.get('model.endpoint')
  }.property('model.endpoint'),
  stackSubtitle: function(){
    var env = this.get('model.endpoint');
    if (!env) {
      return this.get('model.stackName') + ' - ' + this.get('endpointService.api.display.environment.current')
    }
    return this.get('model.stackName') + ' - ' + this.get('model.endpoint')
  }.property('model.endpoint'),
  catalogSubtitle: function(){
    var env = this.get('model.endpoint');
    var name = this.get('model.externalId');
    if(!name){
      return this.get('endpointService.api.display.environment.current')
    }
    name = name.split(':')[0];
    if (!env) {
      return name + ' - ' + this.get('endpointService.api.display.environment.current')
    }
    return name + ' - ' + this.get('model.endpoint')
  }.property('model.endpoint')
});
