import Ember from 'ember';
import { STATUS, STATUS_INTL_KEY, classForStatus } from 'ui/components/accordion-list-item/component';
import C from 'ui/utils/constants';

function oauthURIGenerator(clientId){
  return {
    'gitlab': '/oauth/authorize?client_id=' + clientId + '&response_type=code',
    'github': '/login/oauth/authorize?client_id=' + clientId + '&response_type=code&scope=repo+admin%3Arepo_hook'
  }
}
export default Ember.Component.extend({
  accountId: function() {
    return this.get('session.' + C.SESSION.ACCOUNT_ID)
  }.property('session.' + C.SESSION.ACCOUNT_ID),
  classNames: ['accordion-wrapper'],
  github: Ember.inject.service('pipeline-github'),
  selectedOauthType: 'github',
  oauthModel: {},
  homePageURL: function() {
    var redirect = window.location.origin;
    return redirect;
  }.property(''),
  destinationUrl: function() {
    var redirect = this.get('session').get(C.SESSION.BACK_TO) || window.location.href;
    redirect = redirect.split('#')[0];
    return redirect;
  }.property('session.'+ C.SESSION.BACK_TO),
  init() {
    this._super();
    // set default oauth
    var scmSettings = this.get('scmSettings');
    var gitlabOauthed = scmSettings.find(ele => ele.scmType === 'gitlab' && ele.isAuth);
    var githubOauthed = scmSettings.find(ele => ele.scmType === 'github' && ele.isAuth);
    var pipelineStore = this.get('pipelineStore');
    if (!gitlabOauthed) {
      gitlabOauthed = pipelineStore.createRecord({ type: 'scmSetting', scmType: 'gitlab', id: 'gitlab' });
      scmSettings.addObject(gitlabOauthed);
    }
    if (!githubOauthed) {
      githubOauthed = pipelineStore.createRecord({ type: 'scmSetting', scmType: 'github', id: 'github' });
      scmSettings.addObject(githubOauthed);
    }
    if (!githubOauthed && gitlabOauthed) {
      gitlabOauthed && this.set('selectedOauthType', 'gitlab');
      this.set('oauthModel', gitlabOauthed);
    } else {
      githubOauthed && this.set('oauthModel', githubOauthed);
    }
  },
  scmSettingsObserves: function() {
    var scmSettings = this.get('scmSettings');
    var type = this.get('selectedOauthType');
    var pipelineStore = this.get('pipelineStore');
    var oauthModel = scmSettings.find(ele => ele.scmType === type);
    if (!oauthModel || oauthModel.status === 'removed') {
      oauthModel = pipelineStore.createRecord({ type: 'scmSetting', scmType: type, id: type });
    }
    this.set('oauthModel', oauthModel);
  }.observes('scmSettings.[]'),
  didReceiveAttrs() {
    if (!this.get('expandFn')) {
      this.set('expandFn', function(item) {
        item.toggleProperty('expanded');
      });
    }
  },
  errors: null,
  testing: false,
  statusClass: null,
  status: '',
  secure: false,
  isEnterprise: false,
  confirmDisable: false,
  githubAccounts: function() {
    var accounts = this.get('accounts');
    var accountId = this.get('accountId');
    return accounts.filter(ele => ele.accountType === 'github');
  }.property('accounts.[]'),
  gitlabAccounts: function() {
    var accounts = this.get('accounts');
    var accountId = this.get('accountId');
    return accounts.filter(ele => ele.accountType === 'gitlab');
  }.property('accounts.[]'),
  updateEnterprise: function() {
    if (this.get('isEnterprise')) {
      var hostname = this.get('oauthModel.hostName') || '';
      var match = hostname.match(/^http(s)?:\/\//i);

      if (match) {
        this.set('secure', ((match[1] || '').toLowerCase() === 's'));
        hostname = hostname.substr(match[0].length).replace(/\/.*$/, '');
        this.set('oauthModel.hostName', hostname);
      }
    } else {
      this.set('oauthModel.hostName', null);
      this.set('secure', true);
    }

    this.set('oauthModel.scheme', this.get('secure') ? 'https://' : 'http://');
  },

  enterpriseDidChange: function() {
    if(this.get('oauthModel.isAuth')){
      return
    }
    Ember.run.once(this, 'updateEnterprise');
  }.observes('isEnterprise', 'oauthModel.hostName', 'secure'),

  actions: {
    changeOauthType: function(type) {
      this.set('selectedOauthType', type);
      var pipelineStore = this.get('pipelineStore');
      var oauthModel = this.get('scmSettings').filter(ele => ele.scmType === type);
      oauthModel = oauthModel[oauthModel.length - 1];
      if (!oauthModel || oauthModel.status === 'removed') {
        oauthModel = pipelineStore.createRecord({ type: 'scmSetting', scmType: type, id: type });
      }
      oauthModel && this.set('oauthModel', oauthModel);
    },
    shareAccount: function(item) {
      if (item.actionLinks.share) {
        item.doAction('share')
      } else {
        item.doAction('unshare')
      }
    },
    removeAccount: function(item) {
      item.send('remove', () => {})
    },
    disable: function() {
      var model = this.get('oauthModel');
      var scmType = model.scmType;
      var pipelineStore = this.get('pipelineStore');
      model.doAction('remove').then((res) => {
      });
    },
    promptDisable: function() {
      this.set('confirmDisable', true);
      Ember.run.later(this, function() {
        this.set('confirmDisable', false);
      }, 10000);
    },
    authenticate: function(mode) {
      var clientId = this.get('oauthModel.clientID');
      var hostname = this.get('oauthModel.hostName');
      var scheme = this.get('oauthModel.scheme');
      var authorizeURL;
      let oauthURI = oauthURIGenerator(clientId);
      if(mode === 'add'){
        hostname||(hostname = this.get('selectedOauthType') + '.com')
        authorizeURL = scheme + hostname + oauthURI[this.get('selectedOauthType')];
      }
      else{
        var oauthHostName = 'gitlab.com';
        if(!scheme){
          scheme = 'https://';
        }
        if(this.get('isEnterprise')){
          if(!this.get('oauthModel.hostName')){
            this.send('showError', "'Enterprise Host' is required!");
            return
          }
        }
        this.send('clearError');
        this.set('testing', true);

        if (this.get('isEnterprise')) {
          if (hostname) {
            oauthHostName = hostname;
          }
        }
        authorizeURL = scheme + oauthHostName + oauthURI['gitlab'];
        if (this.get('selectedOauthType') === 'github') {
          oauthHostName = 'github.com';
          if (this.get('isEnterprise')) {
            if (hostname) {
              oauthHostName = hostname;
            }
          }
          authorizeURL = scheme + oauthHostName + oauthURI['github'];
        }
      }
      
      this.get('github').authorizeTest(
        authorizeURL,
        (err, code) => {
          if (err) {
            this.send('gotError', err);
            this.set('testing', false);
          } else {
            this.send('gotCode', code, () => {
              this.set('testing', false);
            });
          }
        }
      );
    },
    gotCode: function(code, cb) {
      var model = this.get('model');
      var oauthModel = this.get('oauthModel');
      model.doAction('oauth', {
        ...oauthModel,
        code,
        scmType: this.get('selectedOauthType'),
        redirectURL: this.get('github.redirect')
      }).then(res => {
        cb();
        this.send('authenticationSucceeded', res);
      }).catch(res => {
        // Github auth succeeded but didn't get back a token
        this.send('gotError', res);
      });
    },
    authenticationSucceeded: function(res) {
      var pipelineStore = this.get('pipelineStore');
      this.set('oauthModel', res);
      pipelineStore.findAll('scmSetting').then((res) => {
        this.set('scmSetting', res);
      })
    },
    gotError: function(err) {
      if (err.message) {
        this.send('showError', err.message + (err.detail ? '(' + err.detail + ')' : ''));
      } else {
        this.send('showError', 'Error (' + err.status + ' - ' + err.code + ')');
      }

      this.set('testing', false);
    },

    showError: function(msg) {
      this.set('errors', [msg]);
      window.scrollY = 10000;
    },

    clearError: function() {
      this.set('errors', null);
    },
  }
});
