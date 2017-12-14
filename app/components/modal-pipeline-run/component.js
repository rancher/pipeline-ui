import Ember from 'ember';
import NewOrEdit from 'ui/mixins/new-or-edit';
import ModalBase from 'ui/mixins/modal-base';
export default Ember.Component.extend(ModalBase, NewOrEdit, {
  pipelineList: [],
  init() {
    this._super(...arguments)
    Ember.RSVP.hash({
      pipelines: this.get('pipelineStore').findAll('pipeline', null)
    }).then(({ pipelines }) => {
      this.set('pipelineList', pipelines.content)
    })
  },
  headers: [{
      name: 'name',
      sort: ['name'],
      searchField: 'name',
      label: 'Name'
    },
    {
      name: 'activity',
      sort: ['activity'],
      searchField: 'activity',
      label: 'Latest Activity'
    }
  ],
  selectedList: function() {
    return this.get('pipelineList').filter(ele => !!ele.selected)
  }.property('pipelineList.@each.selected'),
  actions: {
    pipelineSelect: function(item) {
      var index = this.get('pipelineList').findIndex(ele => ele.id === item.id)
      let selected = this.get('pipelineList')[index].selected;

      this.get('pipelineList')[index].set('selected', !selected);
    },
    save: function(success) {
      this.sendAction('cancel');
      this.get('pipelineList').map(ele => {
        if (ele.selected) {
          return ele.doAction('run');
        }
        return ele;
      })
      success(true);
      this.send('cancel');
    },
    toAddPipelinePage: function() {
      this.send('cancel');
      this.get('router').transitionTo('pipelines.new-pipeline');
    }
  }
});
