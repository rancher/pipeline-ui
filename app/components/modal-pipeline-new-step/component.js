import Ember from 'ember';
import ModalBase from 'ui/mixins/modal-base';

var convertObjectToArry = function(obj) {
  var arry = [];
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      var value = obj[key];
      arry.push(key + '=' + value);
    }
  }
  return arry;
};

var validateConditions = function(step) {
  if (!step.expressions) {
    Ember.set(step, 'conditions', {});
  }
}

class StepType {
  constructor(type, val) {
    switch (type) {
      case 'scm':
        this.type = 'scm';
        this.sourceType = "github";
        this.repository = '';
        this.branch = 'master';
        this.webhook = true;
        break;
      case 'task':
        this.type = 'task';
        this.image = '';
        this.isService = false;
        this.alias = '';
        this.entrypoint = '';
        this.isShell = true;
        this.args = '';
        this.shellScript = '';
        this.env = {};
        break;
      case 'build':
        this.type = 'build';
        this.file = '';
        /*
        sourceType
        1.sc
        2.file
        */
        this.dockerFilePath = './Dockerfile';
        this.buildPath = '.'
        this.targetImage = '';
        this.sourceType = 'sc';
        this.push = false;
        this.username = '';
        this.password = '';
        break;
      case 'upgradeService':
        this.type = 'upgradeService';
        this.imageTag = '';
        this.serviceSelector = {};
        this.batchSize = 1;
        this.interval = 2;
        this.startFirst = false;
        this.deployEnv = 'local';
        this.endpoint = '';
        this.accesskey = '';
        this.secretkey = '';
        break;
      case 'upgradeCatalog':
        this.type = 'upgradeCatalog';
        this.repository = '';
        this.branch = '';
        this.username = '';
        this.password = '';
        this.externalId = '';
        this.filesAry = [{
          name: 'README.md',
          body: ''
        }, {
          name: 'docker-compose.yml',
          body: ''
        }, {
          name: 'rancher-compose.yml',
          body: ''
        }];
        this.templates = {};
        this.deploy = false;
        this.deployEnv = 'local';
        this.stackName = '';
        this.answerString = '';
        this.endpoint = '';
        this.accesskey = '';
        this.secretkey = '';
        break;
      case 'upgradeStack':
        this.type = 'upgradeStack';
        this.stackName = '';
        this.compose = '';
        this.deployEnv = 'local';
        this.endpoint = '';
        this.accesskey = '';
        this.secretkey = '';
        break;
      default:
        break;
    }
    // conditions
    this.expressions = false;
    this.conditions = {};
    if (val && typeof val === 'object') {
      for (var item in val) {
        if (val.hasOwnProperty(item)) {
          this[item] = val[item];
        }
      }
    }
  }
}

var validationErrors = (module, editing) => {
  var errors = [];
  switch (module.type) {
    case 'scm':
      if (module.repository.indexOf('.git') === -1) {
        errors.push('"Repository" is required');
      }
      if (!module.branch) {
        errors.push('"Branch" is required')
      }
      Ember.set(module, 'repository', module.repository.trim());
      break;
    case 'task':
      if (module.image.trim() === '') {
        errors.push('"Image" is required!');
      }
      if (module.isService && module.alias.trim() === '') {
        errors.push('"Name" is required!');
      }
      if (!module.isShell) {
        Ember.set(module, 'shellScript', '');
      }else{
        if(module.shellScript.trim() === ''){
          errors.push('"Command" is required!')
        }
        Ember.set(module, 'entrypoint', '');
        Ember.set(module, 'args', '');
      }
      break;
    case 'build':
      if (module.targetImage.trim() === '') {
        errors.push('"Image Tag" is required!');
      }
      if (module.sourceType === 'sc') {
        if (module.dockerFilePath.trim() === '') {
          errors.push('"Dockerfile Path" is required!');
        }
        Ember.set(module, 'dockerFileContent', "");
      } else {
        if (module.dockerFileContent.trim() === '') {
          errors.push('"Dockerfile" is required!');
        }
      }
      break;
    case 'upgradeService':
      if (module.imageTag.trim() === '') {
        errors.push('"Image Tag" is required!');
      }
      if (module.deployEnv === 'others') {
        if (module.endpoint.trim() === '') {
          errors.push('"Endpoint" is required!');
        }
        if (!module.accesskey) {
          errors.push('"Accesskey" is required!');
        }
        if (!module.secretkey && !editing) {
          errors.push('"Secretkey" is required!');
        }
      }else{
        Ember.set(module, 'endpoint',null);
        Ember.set(module, 'accesskey',null);
        Ember.set(module, 'secretkey',null);
      }
      if (Object.keys(module.serviceSelector).length < 1) {
        errors.push('"Service Selector is required!"')
      }
      Ember.set(module, 'batchSize', module.batchSize * 1);
      Ember.set(module, 'interval', module.interval * 1);
      break;
    case 'upgradeStack':
      if (!module.stackName) {
        errors.push('"Stack Name" is required!');
      }

      if (module.deployEnv === 'others') {
        if (module.endpoint.trim() === '') {
          errors.push('"Endpoint" is required!');
        }
        if (!module.accesskey) {
          errors.push('"Accesskey" is required!');
        }
        if (!module.secretkey && !editing) {
          errors.push('"Secretkey" is required!');
        }
      }else{
        Ember.set(module, 'endpoint',null);
        Ember.set(module, 'accesskey',null);
        Ember.set(module, 'secretkey',null);
      }
      break;
    case 'upgradeCatalog':
      if (module.deployEnv === 'others') {
        if (module.endpoint.trim() === '') {
          errors.push('"Endpoint" is required!');
        }
        if (!module.accesskey) {
          errors.push('"Accesskey" is required!');
        }
        if (!module.secretkey && !editing) {
          errors.push('"Secretkey" is required!');
        }
      }else{
        Ember.set(module, 'endpoint',null);
        Ember.set(module, 'accesskey',null);
        Ember.set(module, 'secretkey',null);
      }
      var templates = {};
      module.filesAry.forEach((ele) => {
        templates[ele.name] = ele.body
      });
      Ember.set(module, 'templates', templates);
      break;
    default:
      break;
  }
  validateConditions(module);
  module.timeout && (Ember.set(module, 'timeout', module.timeout * 1)) || (Ember.set(module, 'timeout', null));
  return errors
}
export default Ember.Component.extend(ModalBase, {
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  model: null,
  type: 'task',
  errors: null,
  editingModels: Ember.Object.create({}),
  init() {
    this._super(...arguments);
    var opts = this.get('modalOpts');
    var objectParameter = {};
    var type = this.get('type');
    if (opts.params) {
      if (opts.params.env) {
        for (var i = 0; i < opts.params.env.length; i++) {
          var value = opts.params.env[i].split('=');
          var k = value[0];
          var v = value[1];
          objectParameter[k] = v;
        }
      }
      if (opts.params.templates && opts.params.type === "upgradeCatalog") {
        opts.params.filesAry = [];
        var keys = Object.keys(opts.params.templates);
        for (var i = 0; i < keys.length; i++) {
          var key = keys[i]
          opts.params.filesAry.push({
            name: key,
            body: opts.params.templates[key]
          })
        }
      } else {

      }
      if (opts.params.conditions && Object.keys(opts.params.conditions).length) {
        opts.params.expressions = true;
      }
      if (opts.params.dockerFileContent) {
        opts.params.sourceType = 'file';
      }
      // initiate task shell Tab
      if (opts.params.type === "task" && (opts.params.shellScript === '' || !opts.params.shellScript)) {
        opts.params.isShell = false;
      }
      this.set('type', opts.params.type);
      var model = new StepType(opts.params.type, {
        ...opts.params,
        env: objectParameter
      });
      this.get('editingModels').set(opts.params.type, model);
    } else {
      if (opts.stepMode === 'scm') {
        this.set('type', 'scm');
      }
      this.set('editingModels', Ember.Object.create({}));
      this.get('editingModels').set(this.get('type'), new StepType(this.get('type')));
    }
  },
  observeTypeChange: function() {
    var type = this.get('type');
    var models = this.get('editingModels');
    models[type] || models.set(type, new StepType(type));
  }.observes('type'),

  editing: function() {
    return this.get('modalOpts.type') === 'edit' ? true : false;
  }.property('modalOpts.type'),

  doneSaving() {
    this.send('cancel');
  },
  actions: {
    add: function(success) {
      var model = this.get('editingModels')[this.get('type')];
      let modalOpts = this.get('modalOpts');
      var errors = validationErrors(model, modalOpts.type !== 'add');
      if (errors.length > 0) {
        this.set('errors', errors);
        success(false);
        return true;
      }
      var arryParameters = convertObjectToArry(model.env);
      modalOpts.cb({
        ...model,
        env: arryParameters
      });
      this.get('modalService').toggleModal();
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.get('modalService').toggleModal();
    },
    cancel: function() {
      var type = this.get('type');
      var repo = this.get('modalOpts.params.repository');
      this.get('modalService').toggleModal();
      if (type === "scm" && !repo) {
        this.get('router').transitionTo('pipelines.ready.pipelines');
      }
    }
  }
});
