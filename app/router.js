import Ember from 'ember';
import config from './config/environment';
import {applyRoutes, clearRoutes} from 'ui/utils/additional-routes';

const Router = Ember.Router.extend({
  modalService: Ember.inject.service('modal'),
  location: config.locationType,
  willTransition(){
    if (this.get('modalService.modalVisible')) {
      this.get('modalService').toggleModal();
    }
  },
});

Router.map(function() {
  this.route('ie');
  this.route('index');
  this.route('failWhale', {path: '/fail'});
  this.route('not-found', {path: '*path'});

  this.route('signup', {path: '/signup'});
  this.route('verify', {path: '/verify/:verify_token'});
  this.route('verify-reset-password', {path: '/verify-reset-password/:verify_token'});
  this.route('login', function() {
    this.route('index', {path: '/'});
    this.route('shibboleth-auth');
  });
  this.route('logout');
  this.route('authenticated', {path: '/'}, function() {

    // this.route('style-guide', {path: '/style-guide'});
    // this.route('dummy-dev', {path: '/dev'});


    this.route('project', {path: '/env/:project_id'}, function() {
      this.route('index', {path: '/'});

      this.route('pipelines', {resetNamespace: true}, function() {
        this.route('index', {path: '/'});
        this.route('new-pipeline', {path: '/addPipeline'});
        this.route('import', {path: '/import'});
        this.route('view-config', {path: '/viewConfig/:pipeline_id'});
        this.route('ready', {path: '/r'},function(){
          this.route('activities',{path:'/activities'});
          this.route('pipelines',{path:'/pipelines'});
          this.route('settings',{path:'/settings'});
        });
        this.route('activity', {path: '/activities/:activity_id'});

        this.route('pipeline', {path: '/pipelines/:pipeline_id'});
      });

      // End: Authenticated
    });
  });


  // Load any custom routes from additional-routes
  var cb = applyRoutes("application");
  if( cb ) {
    cb.apply(this);
  }
  clearRoutes();
});


export default Router;
