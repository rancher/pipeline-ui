import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ShellQuote from 'npm:shell-quote';
import C from 'ui/utils/constants';
import Util from 'ui/utils/util';
import { compare as compareVersion } from 'ui/utils/parse-version';
import { task } from 'ember-concurrency';


export default Ember.Component.extend(NewOrEdit, {
  intl: Ember.inject.service(),
  catalog: Ember.inject.service(),
  projects: Ember.inject.service(),
  settings: Ember.inject.service(),
  selectTemplateFromOldVersion: false,
  allTemplates: null,
  templateResource: null,
  // stackResource: null,
  versionsArray: null,
  versionsLinks: null,
  actuallySave: true,
  showHeader: true,
  showPreview: true,
  showName: true,
  titleAdd: 'newCatalog.titleAdd',
  titleUpgrade: 'newCatalog.titleUpgrade',
  selectVersionAdd: 'newCatalog.selectVersionAdd',
  selectVersionUpgrade: 'newCatalog.selectVersionUpgrade',
  saveUpgrade: 'newCatalog.saveUpgrade',
  saveNew: 'newCatalog.saveNew',
  sectionClass: 'box mb-20',
  showDefaultVersionOption: false,
  previewTabCI: '',
  classNames: ['launch-catalog'],

  // primaryResource: Ember.computed.alias('stackResource'),
  templateBase: Ember.computed.alias('templateResource.templateBase'),
  // editing: Ember.computed.notEmpty('stackResource.id'),

  previewOpen: false,
  previewTab: null,
  questionsArray: null,
  selectedTemplateUrl: null,
  selectedTemplateModel: null,
  readmeContent: '',
  deploy: false,
  init(){
    this._super(...arguments);
    var files = this.get('selectedModel.filesAry');
    if(files){
      this.set('previewTabCI',files[0].name);
    }
  },
  actions: {
    setTemplate(){
      var files = this.get('selectedModel.filesAry');
      var templateFiles = this.get('selectedTemplateModel.filesAsArray');
      for (var i = 0; i < templateFiles.length; i++) {
        var item = templateFiles[i];
        var matchedFile = files.find(ele=>{
          if(item.name.split('.')[0]===ele.name.split('.')[0]){
            return true
          }
          return false
        })
        if(matchedFile){
          Ember.set(matchedFile,'name', item.name);
          Ember.set(matchedFile,'body', item.body);
        }
      }
      this.set('selectedModel.filesAry',files);
      this.set('selectTemplateFromOldVersion',false);
    },
    setState: function(state, val){
      this.set(state,val);
      // sync two Tab
      if(state === 'selectTemplateFromOldVersion'){
        if(val){
          this.set('previewTab', this.get('previewTabCI'));
        }else{
          this.set('previewTabCI', this.get('previewTab'));
        }
      }
    },
    cancel: function() {
      this.sendAction('cancel');
    },

    togglePreview: function() {
      this.toggleProperty('previewOpen');
    },

    selectPreviewTab: function(tab) {
      this.set('previewTab', tab);
      this.set('previewTabCI', tab);
    },
    selectPreviewTabCI: function(tab) {
      this.set('previewTabCI', tab);
      this.set('previewTab', tab);
    },
    changeTemplate: function(tpl) {
      this.get('application').transitionToRoute('catalog-tab.launch', tpl.id);
    },
  },

  didReceiveAttrs: function() {
    this._super(...arguments);
    this.set('selectedTemplateModel', null);

    Ember.run.scheduleOnce('afterRender', () => {
      if ( this.get('selectedTemplateUrl') ) {
        this.templateChanged();
      } else {
        var def = this.get('templateResource.defaultVersion');
        var links = this.get('versionLinks');
        if (links&&links[def]) {
          this.set('selectedTemplateUrl', links[def]);
        } else {
          links&&this.set('selectedTemplateUrl', links[Object.keys(links)[0]]);
        }
      }
    });
  },
  updateSelectedtemplateUrl: function(){
    var def = this.get('templateResource.defaultVersion');
    var links = this.get('versionLinks');
    if (links&&links[def]) {
      this.set('selectedTemplateUrl', links[def]);
    } else {
      links&&this.set('selectedTemplateUrl', links[Object.keys(links)[0]]);
    }
  }.observes('versionLinks'),
  updateReadme: function() {
    let model = this.get('selectedTemplateModel');
    this.set('readmeContent', '');
    if ( model && model.hasLink('readme') ) {
      model.followLink('readme').then((response) => {
        this.set('readmeContent', response);
      });
    }
  },

  sortedVersions: function() {
    let out = this.get('versionsArray').sort((a,b) => {
      if ( a.sortVersion && b.sortVersion ) {
        return compareVersion(a.sortVersion, b.sortVersion);
      } else {
        return compareVersion(a.version, b.version);
      }
    });

    let def = this.get('templateResource.defaultVersion');
    if ( this.get('showDefaultVersionOption') && this.get('defaultUrl') ) {
      out.unshift({version:  this.get('intl').t('newCatalog.version.default', {version: def}), link: 'default'});
    }

    return out;
  }.property('versionsArray','templateResource.defaultVersion'),

  defaultUrl: function() {
    var defaultVersion = this.get('templateResource.defaultVersion');
    var versionLinks = this.get('versionLinks');

    if ( defaultVersion && versionLinks && versionLinks[defaultVersion] ) {
      return versionLinks[defaultVersion];
    }

    return null;
  }.property('templateResource.defaultVersion','versionLinks'),

  getTemplate: task(function * () {
    var url = this.get('selectedTemplateUrl');

    if ( url === 'default' ) {
      let defaultUrl = this.get('defaultUrl');
      if ( defaultUrl ) {
        url = defaultUrl;
      } else {
        url = null;
      }
    }

    if (url) {
      var version = this.get('settings.rancherVersion');

      if ( version ) {
        url = Util.addQueryParam(url, 'rancherVersion', version);
      }

      // var current = this.get('stackResource.environment');

      // if ( !current ) {
      //   current = {};
      //   this.set('stackResource.environment', current);
      // }

      var selectedTemplateModel = yield this.get('catalog').fetchByUrl(url).then((response) => {
        if (response.questions) {
          response.questions.forEach((item) => {
            // This will be the component that is rendered to edit this answer
            item.inputComponent = 'schema/input-'+item.type;

            // Only types marked supported will show the component, Ember will explode if the component doesn't exist
            item.supported = C.SUPPORTED_SCHEMA_INPUTS.indexOf(item.type) >= 0;

            // if (typeof current[item.variable] !== 'undefined') {
            //   // If there's an existing value, use it (for upgrade)
            //   item.answer = current[item.variable];
            // } else 
            if (item.type === 'service' || item.type === 'certificate') {
                // Loaded async and then the component picks the default
            } else if ( item.type === 'boolean' ) {
              // Coerce booleans
              item.answer = (item.default === 'true' || item.default === true);
            } else {
              // Everything else
              item.answer = item.default;
            }
          });
        }
        return response;
      });
      this.set('selectedTemplateModel', selectedTemplateModel);
      this.set('previewTab', Object.keys(selectedTemplateModel.get('files')||[])[0]);
    } else {
      this.set('selectedTemplateModel', null);
      this.set('readmeContent', '');
    }

    this.updateReadme();
  }),

  templateChanged: function() {
    var selectTemplateFromOldVersion = this.get('selectTemplateFromOldVersion');
    if(selectTemplateFromOldVersion){
      this.get('getTemplate').perform();
    }
    
  }.observes('selectedTemplateUrl','templateResource.defaultVersion','selectTemplateFromOldVersion'),

  answers: function() {
    var out = {};
    (this.get('selectedTemplateModel.questions') || []).forEach((item) => {
      out[item.variable] = item.answer;
    });

    return out;
  }.property('selectedTemplateModel.questions.@each.{variable,answer}'),

  answersArray: Ember.computed.alias('selectedTemplateModel.questions'),

  answersString: function() {
    var str = (this.get('answersArray')||[]).map((obj) => {
      if (obj.answer === null || obj.answer === undefined) {
        return obj.variable + '=';
      } else {
        return obj.variable + '=' + ShellQuote.quote([obj.answer]);
      }
    }).join("\n");
    this.set('selectedModel.answerString',str);
    return str;
  }.observes('answersArray.@each.{variable,answer}'),

  validate() {
    var errors = [];

    if (!this.get('editing') && !this.get('stackResource.name')) {
      errors.push('Name is required');
    }

    if (this.get('selectedTemplateModel.questions')) {
      this.get('selectedTemplateModel.questions').forEach((item) => {
        if (item.required && item.type !== 'boolean' && !item.answer) {
          errors.push(`${item.label} is required`);
        }
      });
    }

    if (errors.length) {
      this.set('errors', errors.uniq());
      return false;
    }

    return true;
  },

  newExternalId: function() {
    var templateId = this.get('selectedTemplateModel.id');
    this.set('selectedModel.externalId', templateId);
  }.observes('selectedTemplateModel.id'),

  willSave() {
    this.set('errors', null);
    var ok = this.validate();
    if (!ok) {
      // Validation failed
      return false;
    }

    // let stack = this.get('stackResource');

    if ( this.get('actuallySave') ) {
      // stack.setProperties({
      //   environment: this.get('answers'),
      //   externalId: this.get('newExternalId'),
      // });

      return true;
    } else {
      let versionId = null;
      if ( this.get('selectedTemplateUrl') !== 'default' && this.get('selectedTemplateModel') ) {
        versionId = this.get('selectedTemplateModel.id');
      }

      this.sendAction('doSave', {
        templateId: this.get('templateResource.id'),
        templateVersionId: versionId,
        answers: this.get('answers'),
      });
      return false;
    }
  },

  doneSaving() {
    var projectId = this.get('projects.current.id');
    return this.get('router').transitionTo('apps-tab.index', projectId);
  }
});
