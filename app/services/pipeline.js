import Ember from 'ember';
import C from 'ui/utils/constants';

export default Ember.Service.extend({
  'tab-session': Ember.inject.service(),
  store: Ember.inject.service(),
  pipelineStore: Ember.inject.service('pipeline-store'),
  selectedGitUser: null,
  pipelinesEndpoint: function() {
    return this.get('app.pipelinesEndpoint').replace(this.get('app.projectToken'), this.get(`tab-session.${C.TABSESSION.PROJECT}`));
  }.property(`tab-session.${C.TABSESSION.PROJECT}`, 'app.pipelinesEndpoint'),

  ready: null,
  isReady() {
    let store = this.get('store');
    return store.find('stack').then((stacks) => {
      let stack = this.filterSystemStack(stacks);
      if (stack) {
        return store.rawRequest({
          url: `${this.get('pipelinesEndpoint')}`
        }).then(() => {
          // console.log('isReady: true');
          this.set('ready', { has: true, ready: true })
          return { has: true, ready: true };
        }).catch(() => {
          // console.log('isReady: false');
          this.set('ready', { has: true, ready: false })
          return { has: true, ready: false };
        });
      }
      this.set('ready', { has: false, ready: false })
      // console.log('isReady: false2');
      return { has: false, ready: false };
    }).catch(() => {
      // console.log('isReady: false3');
      this.set('ready', { has: false, ready: false })
      return Ember.RSVP.resolve({ has: false, ready: false });
    });
  },
  filterSystemStack(stacks) {
    return (stacks || []).find((stack) => {
      let info = stack.get('externalIdInfo');
      return (info.kind === C.EXTERNAL_ID.KIND_CATALOG || info.kind === C.EXTERNAL_ID.KIND_SYSTEM_CATALOG) &&
        info.base === C.EXTERNAL_ID.KIND_INFRA &&
        info.name === 'pipeline';
    });
  },
  loadRepository(pipeline, accounts, fn1, fn2) {
    var pipelineStore = this.get('pipelineStore');
    var selectedGitUser = accounts.find(ele => ele.id === pipeline.stages[0].steps[0].gitUser);
    return pipelineStore.find('scmSetting', null, { forceReload: true }).then((res) => {
      fn1(res);
      if (res.find(ele => ele.isAuth)) {
        return selectedGitUser.followLink('repos');
      } else {
        return null
      }
    }).then(fn2)
  },
});
