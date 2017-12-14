import Ember from 'ember';

export default Ember.Component.extend({
  catalog: Ember.inject.service(),
  projects: Ember.inject.service(),
  previewTab: 'dockerCompose',
  project: function() {
    return this.get('projects.current');
  }.property('projects'),
  catalogs: null,
  catalogId: null,
  templates: null,
  selectedTemplate: null,

  ary: null,
  global: null,
  editCatalog: false,
  toRemove: null,
  old: null,

  init() {
    this._super(...arguments);
    this.set('toRemove', []);

  },

  actions: {
    selectPreviewTab: function(tab) {
      this.set('previewTab', tab);
    },
  },

  validate() {
    var errors = [];
    var global = this.get('global');
    var ary = this.get('ary');

    ary.forEach((cat) => {

      if (trimAndCheck(cat.name)) {
        errors.push('Name is required on each catalog');
      }

      if (trimAndCheck(cat.url)) {
        errors.push('URL is required on each catalog');
      }

      if (trimAndCheck(cat.branch)) {
        errors.push('A Branch is required on each catalog');
      }

      if (global && global.filter((x) => (x.name || '').trim().toLowerCase() === cat.name.toLowerCase()).length > 1 ||
        ary.filter((x) => (x.name || '').trim().toLowerCase() === cat.name.toLowerCase()).length > 1) {
        errors.push('Each catalog must have a unique name');
      }
    });

    if (errors.length) {
      this.set('errors', errors.uniq());
      return false;
    } else {
      this.set('errors', null);
    }

    function trimAndCheck(str) {
      return (str || '').trim().length === 0 ? true : false;
    }

    return true;
  },
});
