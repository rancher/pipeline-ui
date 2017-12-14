import Ember from 'ember';

export const headersAll =  [
  {
    name: 'isActivate',
    sort: ['isActivate'],
    searchField: 'isActivate',
    translationKey: 'generic.state',
  },
  {
    name: 'name',
    sort: ['name'],
    searchField: 'name',
    translationKey: 'generic.name',
  },
  {
    name: 'repository',
    sort: ['repository'],
    width: 500,
    searchField: 'repository',
    translationKey: 'generic.repository',
  },
  {
    name: 'lastRunId',
    sort: ['lastRunId'],
    width: '200px',
    searchField: 'activity',
    translationKey: 'pipelinesPage.lastActivity',
  },
  {
    name: 'nextRunTime',
    sort: ['nextRunTime'],
    searchField: 'nextRunTime',
    translationKey: 'pipelinesPage.nextRun',
  },
  
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),
});
