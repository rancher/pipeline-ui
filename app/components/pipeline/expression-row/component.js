import Ember from 'ember';

export default Ember.Component.extend({
  rule: null,
  instance: null,
  init(){
    this._super();
    var pipelineStore = this.get('pipelineStore');
    var env = this.get('env');
    pipelineStore.find('envvars', null, {
      url: `${pipelineStore.baseUrl}/envvars`,
      forceReload: true
    }).then((res) => {
      this.set('envvarsLoading', false);
      var envars = JSON.parse(res);
      if(env){
        envars = envars.concat(Object.keys(env));
      }
      this.set('envvars', envars);
    });
    var rule = this.get('rule');
    rule.opt||this.set('rule.opt','=')
  },
  expressionsRelation: [{label: 'newPipelineStep.stepType.allThese', value: 'any', info:'newPipelineStep.stepType.allTheseInfo'}
  ,{label: 'newPipelineStep.stepType.anyThese', value: 'all', info:'newPipelineStep.stepType.anyTheseInfo'}],
  selectedInfo: function(){
    var relation = this.get('expressionsRelation').find(ele => ele.value===this.get('conditions.mode'));
    return relation?relation.info:'';
  }.property('conditions.mode'),
  comparations: [
    {label: '=', value:'='},
    {label: '!=', value:'!='},
  ],
  env: function(){
    var parameters = this.get('pipeline.parameters');
    var env={};
    if (parameters&&parameters.length) {
      for (var i = 0; i < parameters.length; i++) {
        var value = parameters[i].split('=');
        var k = value[0];
        var v = value[1];
        env[k] = v;
      }
    }
    return env
  }.property('pipeline.parameters'),
  selectedComparation: '0',
  envvars:[],
  envvarsLoading: true,
  selectedEnv: '',
  tagName: 'TR',
  classNames: 'main-row',

  isGlobal: null,
  kind: null,
  suffix: null,
  userKey: null,
  userValue: null,
  actions: {
    selecteEnv: function(env){
      this.set('rule.env', env);
    },
    setKey: function(key) {
      this.set('userKey', key);
    },

    setValue: function(value) {
      this.set('userValue', value);
    },

    remove: function() {
      this.sendAction('remove', this.get('rule'));
    }
  },
});
