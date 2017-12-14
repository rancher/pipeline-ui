import Ember from 'ember';
import { timezones } from 'ui/utils/timezones';
export default Ember.Component.extend({
  timezones: timezones,
  selected: '',
  edit: true,
  init() {
    this._super();
    var triggerTimezone = this.get('pipeline.cronTrigger.timezone');
    var t = new Date();
    var timeZone = -t.getTimezoneOffset() / 60;
    selected = timezones.find(ele => (ele.offset === timeZone)&&ele.utc);
    this.set('selected', selected)
    if (triggerTimezone) {
      var selected = timezones.find(ele => {
        if (!ele.utc) {
          return false
        }
        return ele.utc[0] === triggerTimezone
      });
      if (selected) {
        this.set('selected', selected)
      }
    }else{
      this.set('pipeline.cronTrigger.timezone', selected.utc[0]);
    }
    if (this.get('initial')) {
      this.set('pipeline.isActivate', true);
    }
    if(!this.get('edit')){
      this.set('schduleInputDisabled', true);
    }
  },
  selectedObeserves: function() {
    var selected = this.get('selected');
    var pipeline = this.get('model.pipeline');
    pipeline.cronTrigger || (Ember.set(pipeline, 'cronTrigger', {}));
    this.set('pipeline.cronTrigger.timezone', selected.utc[0]);
  }.observes('selected'),
  schedulePatternObserves: function() {
    var schdulePattern = this.get('schdulePattern');
    switch (schdulePattern) {
      case 'custom':
        this.set('schduleInputDisabled', false);
        return;
      case 'day':
        this.set('pipeline.cronTrigger.spec', '0 4 * * *');
        break;
    }
    this.set('schduleInputDisabled', true);
  }.observes('schdulePattern'),
  expandFn: function(item) {
    item.toggleProperty('expanded');
  },
  schduleInputDisabled: false,
  schdulePattern: 'custom',
  pipeline: function() {
    var pipeline = this.get('model.pipeline');
    pipeline.cronTrigger || (Ember.set(pipeline, 'cronTrigger', {}));
    return pipeline;
  }.property('model.pipeline'),
});
