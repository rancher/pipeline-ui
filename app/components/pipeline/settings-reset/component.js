import Ember from 'ember';
import { STATUS, STATUS_INTL_KEY, classForStatus } from 'ui/components/accordion-list-item/component';
import C from 'ui/utils/constants';

export default Ember.Component.extend({
  accountId: function(){
    return this.get('session.'+C.SESSION.ACCOUNT_ID)
  }.property('session.'+C.SESSION.ACCOUNT_ID),
  classNames: ['accordion-wrapper'],
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
  confirmDisable          : false,
  clearing: false,
  actions:{
    disable: function(){
      let clearing = this.get('clearing');
      if(clearing){
        return
      }
      this.set('clearing', true);
      this.get('model.settings').doAction('reset').then((res)=>{
        this.set('model.settings',res);
        window.location.reload();
      })
    },
    promptDisable: function() {
      let clearing = this.get('clearing');
      if(clearing){
        return
      }
      this.set('confirmDisable', true);
      Ember.run.later(this, function() {
        this.set('confirmDisable', false);
      }, 10000);
    },
    gotError: function(err) {
      if ( err.message )
      {
        this.send('showError', err.message + (err.detail? '('+err.detail+')' : ''));
      }
      else
      {
        this.send('showError', 'Error ('+err.status + ' - ' + err.code+')');
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
