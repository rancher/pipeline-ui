import Ember from 'ember';
import C from 'ui/utils/constants';
import Util from 'ui/utils/util';

export default Ember.Service.extend({
  access: Ember.inject.service(),
  cookies  : Ember.inject.service(),
  session  : Ember.inject.service(),
  userStore: Ember.inject.service(),
  redirect: null,
  // Set by app/services/access
  hostname : null,
  scheme   : null,
  clientId : null,

  generateState: function() {
    var state = Math.random()+'';
    this.get('session').set('githubState', state);
    return state;
  },

  getToken: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.get('userStore').rawRequest({
        url: 'token', 
      })
      .then((xhr) => {
        resolve(xhr.body.data[0]);
        return ;
      })
      .catch((err) => {
        reject(err);
      });
    });
  },

  stateMatches: function(actual) {
    var expected = this.get('session.githubState');
    return actual && expected === actual;
  },

  getAuthorizeUrl: function(githubAuthUrl,test) {
    var redirect = this.get('session').get(C.SESSION.BACK_TO) || window.location.href;
    redirect = redirect.split('#')[0];
    if ( test )
    {
      redirect = Util.addQueryParam(redirect, 'isTest', 1);
    }
    var url = Util.addQueryParams(githubAuthUrl, {
      state: this.generateState(),
      redirect_uri: redirect
    });
    this.set('redirect', redirect);
    return url;
  },

  authorizeRedirect: function() {
    window.location.href = this.getAuthorizeUrl();
  },

  authorizeTest: function(githubAuthUrl,cb) {
    var responded = false;
    window.onGithubTest = function(err,code) {
      if ( !responded ) {
        responded = true;
        cb(err,code);
      }
    };

    var popup = window.open(this.getAuthorizeUrl(githubAuthUrl,true), 'rancherAuth', Util.popupWindowOptions());
    var timer = setInterval(function() {
      if ( !popup || popup.closed ) {
        clearInterval(timer);
        if( !responded ) {
          responded = true;
          cb({type: 'error', message: 'Access was not authorized'});
        }
      }
    }, 500);
  },
});
