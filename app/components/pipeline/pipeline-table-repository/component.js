import Ember from 'ember';

export const headersAll =  [
  {
    name: 'Username',
    sort: ['name'],
    searchField: 'name',
    label: 'Username'
  },
  {
    name: 'Organization',
    sort: ['lastRunId'],
    width: '200px',
    searchField: 'activity',
    label: 'Organization'
  },
  {
    name: 'Repository',
    sort: ['lastRunId'],
    width: '200px',
    searchField: 'activity',
    label: 'Repository'
  }
];

export default Ember.Component.extend({
  prefs: Ember.inject.service(),

  stickyHeader: true,

  sortBy: 'name',

  headers: function() {
    return headersAll;
  }.property(),
});
