import Ember from 'ember';
import C from 'ui/utils/constants';

const DEFAULT_REGISTRY = 'index.docker.io';
export default Ember.Component.extend({
  projectId: Ember.computed.alias(`tab-session.${C.TABSESSION.PROJECT}`),
  detectingPush: false,
  registries: null,
  matchedRegistry: null,
  pushDisabled: true,
  registriesRoute: '',
  init(){
    this._super();
    this.set('registriesRoute',`/env/${this.get('projectId')}/infra/registries/add`);
  },
  resolvedRegistry: function(){
    var images = this.get('selectedModel.targetImage');
    if(!images){
      return '';
    }
    var splited = images.split('/');
    if(splited.length < 2){
      return DEFAULT_REGISTRY;
    }
    if(splited[0].indexOf('.')!==-1){
      return splited[0]
    }
    return DEFAULT_REGISTRY;
  }.property('selectedModel.targetImage'),
  imageObserves: function(){
    if(this.get('selectedModel.targetImage')){
      this.pushObserves();
    }
    else{
      this.set('selectedModel.push',false);
    }
  }.observes('selectedModel.targetImage'),
  pushObserves: Ember.on('init', Ember.observer('selectedModel.push',function(){
    Ember.run.once(()=>{
      var selectedModel = this.get('selectedModel');
      var push = selectedModel.push;
      var resolvedRegistry = this.get('resolvedRegistry');
      if(push&&resolvedRegistry){
        this.set('detectingPush', true);
        this.set('matchedRegistry',null);
        this.get('store').findAll('registrycredential').then(() => {
          return this.get('store').findAll('registry');
        }).then((res)=>{
          var registries = res;
          var matchedRegistry = registries.find(ele=>ele.serverAddress===resolvedRegistry);
          this.set('matchedRegistry',matchedRegistry);
          this.set('detectingPush', false);
          this.set('registries',registries);
        }).catch(()=>{
          this.set('detectingPush', false);
        });
      }
    });
  })),
  // matchedRegistryObserves: function(){
  //   debugger
  //   var matchedRegistry = this.get('matchedRegistry');
  //   if(!matchedRegistry){
  //     this.set('selectedModel.push', false);
  //   }
  // }.observes('matchedRegistry')
});
