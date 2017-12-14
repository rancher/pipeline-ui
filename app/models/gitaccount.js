import Ember from 'ember';
import Resource from 'ember-api-store/models/resource';

var Account = Resource.extend({
  type: 'gitaccount',
  modalService: Ember.inject.service('modal'),
  cb() {
    return this.doAction('remove');
  },
  displayName: function(){
    return this.get('login');
  }.property('login'),
  actions:{
    remove:function(){
      this.get('modalService').toggleModal('confirm-delete', {resources: [this]});
    },
  },
  profilePicture: function(){
    return this.get('avatar_url');
  }.property('avatar_url'),
  profileUrl:function(){
    return this.get('avatar_url');
  }.property('html_url')
});

export default Account;
