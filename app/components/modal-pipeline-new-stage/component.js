import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';

const showKinds = ['user','admin'];

export default Ember.Component.extend(ModalBase, NewOrEdit, {
  intl: Ember.inject.service(),
  parallelChoice: function(){
    let intl = this.get('intl');
    return [{
      label: this.get('intl').t('newPipelineStage.modeParallel'),
      value: 'true'
    },{
      label: this.get('intl').t('newPipelineStage.modeSerial'),
      value: 'false'
    }];
  }.property('intl.locale'),
  parallel: 'true',
  access: Ember.inject.service(),
  classNames: ['large-modal', 'alert'],
  modalOpts: Ember.computed.alias('modalService.modalOpts'),
  settings: Ember.inject.service(),
  model: null,
  clone: null,
  primaryResource: Ember.computed.alias('originalModel'),
  sortBy: 'name',
  userList: [],
  errors: [],
  syncParallel:  Ember.on('init',Ember.observer('parallel',function(){
    var parallel = this.get('parallel');
    if(parallel === 'true'){
      this.set('model.parallel', true);
    }else{
      this.set('model.parallel', false);
    }
  })),
  selectedList: function() {
    var selectedList = this.get('userList').filter(ele => !!ele.selected);
    return selectedList;
  }.property('userList.@each.selected'),
  headers: Ember.computed('isLocal', function() {
    let out = [
      {
        translationKey: 'generic.state',
        name: 'state',
        sort: ['state'],
        width: '125'
      },
      {
        translationKey: 'generic.id',
        name: 'id',
        sort: ['id'],
        width: '120'
      },
      {
        translationKey: 'accountsPage.index.table.kind',
        name: 'kind',
        sort: ['kind'],
        width: '120'
      },
    ];

    if ( this.get('isLocal') ) {
      out.push({
        translationKey: 'accountsPage.index.table.username',
        name: 'name',
        sort: ['name'],
      });
    }
    else{
      out.push({
        translationKey: 'accountsPage.index.table.identity',
        name: 'name',
        sort: ['name'],
      });
    }

    return out;
  }),
  isLocal: function() {
    return this.get('access.provider') === 'localauthconfig';
  }.property('access.provider'),
  init() {
    this._super(...arguments);
    var opts = this.get('modalOpts');
    if (opts.mode === "edit" || opts.mode === 'review') {
      this.set('model', opts.stage);
      this.set('editing', true);
      var approvers = opts.stage.approvers;
      // init parallel
      if(opts.stage.parallel){
        this.set('parallel', 'true');
      }else{
        this.set('parallel', 'false');
      }
    } else {
      this.set('model', {
        id: null,
        name: null,
        needApprove: false,
        steps: []
      })
    }
    if (opts.stage&&opts.stage.conditions && Object.keys(opts.stage.conditions).length) {
      this.set('model.expressions', true);
    }
    this.get('userStore')
      .find('account', null, {filter: {'kind_ne': ['service','agent']}, forceReload: true})
        .then((user)=>{
          var userList = user.content.filter((row) => {
            var kind = (row.kind||'').toLowerCase();
            return showKinds.indexOf(kind) !== -1;
          });
          if(approvers&&approvers.length){
            for (var i = 0; i < userList.length; i++) {
              var item = userList[i];
              if(approvers.indexOf(item.id)!==-1){
                item.set('selected',true)
              }
            }
          }
          this.set('userList',userList);
        });
  },
  editing: false,
  doneSaving() {
    this.send('cancel');
  },
  getApprovals(){
    var selectedList = this.get('selectedList');
    return selectedList.map(ele=>ele.id);
  },
  actions: {
    add: function(success) {
      var model = this.get('model');
      var approvers = [];
      if(!model.name){
        this.set('errors',['"Name" is required!']);
        return success(false);
      }
      if(model.needApprove){
        approvers = this.getApprovals();
      }
      var added = this.get('modalOpts').cb({
        ...model,
        id: Date.now(),
        approvers: approvers
      });
      if(!added){
        this.set('errors',['The same stage name is not allowed!']);
        return success(false);
      }
      success(true);
      this.send('cancel');
    },
    remove: function() {
      this.get('modalOpts').rmCb();
      this.send('cancel');
    },
    userSelect: function(item){
      var index = this.get('userList').findIndex(ele => ele.id === item.id)
      let selected = this.get('userList')[index].selected;

      this.get('userList')[index].set('selected', !selected);
    }
  }
});
