import Ember from 'ember';

export const headersAll =  [
  {
    name: 'status',
    sort: ['status'],
    width: 200,
    searchField: 'status',
    translationKey: 'generic.state',
  },
  {
    name: 'name',
    sort: ['name'],
    searchField: 'pipelineSource.name',
    translationKey: 'nav.pipelines.tab',
    label: 'Pipeline'
  },
  {
    name: 'repository',
    sort: ['repository'],
    width: 500,
    searchField: 'repository',
    translationKey: 'generic.repository',
  },
  {
    name: 'start_ts',
    sort: ['start_ts'],
    searchField: 'start_ts',
    translationKey: 'pipelineHistories.time',
    label: 'Time'
  },
  
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),
  actions:{
    sendAction(inst,actionName){
      return inst.send(actionName)
    }
  }
});
