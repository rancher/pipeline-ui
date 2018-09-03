import Ember from 'ember';
import ThrottledResize from 'ui/mixins/throttled-resize';
import Util from 'ui/utils/util';
import { alternateLabel } from 'ui/utils/platform';
import AnsiUp from 'npm:ansi_up';

export default Ember.Component.extend(ThrottledResize, {
  instance: null,
  alternateLabel: alternateLabel,
  showProtip: true,
  status: 'connecting',
  socket: null,
  pipeline: Ember.inject.service(),
  logHeight: 300,

  onlyCombinedLog: true,
  which: 'combined',
  isCombined: Ember.computed.equal('which', 'combined'),
  isStdOut: Ember.computed.equal('which', 'stdout'),
  isStdErr: Ember.computed.equal('which', 'stderr'),

  stdErrVisible: true,
  stdOutVisible: true,

  actions: {

    cancel: function() {
      this.disconnect();
      this.sendAction('dismiss');
    },

    clear: function() {
      var body = this.$('.log-body')[0];
      body.innerHTML = '';
      body.scrollTop = 0;
    },

    scrollToTop: function() {
      this.$('.log-body').animate({ scrollTop: '0px' });
    },

    scrollToBottom: function() {
      var body = this.$('.log-body');
      body.stop().animate({ scrollTop: (body[0].scrollHeight + 1000) + 'px' });
    },

    changeShow: function(which) {
      this.set('which', which);
      this.set('stdErrVisible', (which === 'combined' || which === 'stderr'));
      this.set('stdOutVisible', (which === 'combined' || which === 'stdout'));
      Ember.run.next(this, function() {
        this.send('scrollToBottom');
      });
    },
  },
  showLogs: function() {
    var inst = this.get('instance');
    var key = inst.stageIndex + '-' + inst.stepIndex;
    Ember.run.next(() => {
      this.send('scrollToBottom');
    });
    if(!inst.activityLogs[key]){
      this.observeInstance();
      return
    }
    return inst.activityLogs[key];
  }.property('instance.{stageIndex,stepIndex,activityLogs}', 'showLogsTrigger'),
  showLogsTrigger: '',
  observeInstance: function() {
    let status = this.get('status');
    let socket = this.get('socket');
    if(status === 'connected' && socket){
      this.disconnect();
      Ember.run.next(this, 'exec');
    }else{
      this.exec();
    }
  }.observes('instance.{stageIndex,stepIndex}'),
  didInsertElement: function() {
    this._super();
    // Ember.run.next(this, 'exec');
  },

  exec: function() {
    let status = this.get('status');
    if(status === 'connecting' || status === 'disconnected' || status === 'closed'){
      this.connect();
    }
  },

  connect: function() {
    this.set('status', 'initializing');
    var body = this.$('.log-body')[0];
    var $body = $(body);
    // inst should be get from outside of the onmessage, cause inst may have changed when onmessage callback 
    var inst = this.get('instance');
    var onmessage = (message) => {
      this.set('status', 'connected');

      var isFollow = ($body.scrollTop() + $body.outerHeight() + 10) >= body.scrollHeight;

      // this.set('showLogs', '');
      var logs = '';
      message.trim().split(/\n/).forEach((line) => {
        var match = line.match(/^\[?([^ \]]+)\]?\s?/);
        var dateStr, msg;
        if (match) {
          msg = line.substr(match[0].length);
          var date = new Date(match[1] * 1);
          dateStr = '<span class="log-date">' + Util.escapeHtml(date.toLocaleDateString()) + ' ' + Util.escapeHtml(date.toLocaleTimeString()) + ' </span>';
        } else {
          msg = line;
          dateStr = '<span class="log-date">Unknown Date</span>';
        }

        // body.insertAdjacentHTML('beforeend',
        //   '<div class="log-msg">' +
        //   dateStr +
        //   AnsiUp.ansi_to_html(Util.escapeHtml(msg)) +
        //   '</div>'
        // );
        logs += '<div class="log-msg">' +
          dateStr +
          AnsiUp.ansi_to_html(Util.escapeHtml(msg)) +
          '</div>';
      });
      
      var logsAry = inst.activityLogs;
      var key = inst.stageIndex + '-' + inst.stepIndex;
      Ember.set(logsAry, key, logs);
      this.set('showLogsTrigger', logs);
      // logs&&this.set('showLogs', logs);
      // if (isFollow) {
      //   Ember.run.next(() => {
      //     this.send('scrollToBottom');
      //   });
      // }
    };

    var activity = inst.activity;
    var params = `?activityId=${activity.id}&stageOrdinal=${inst.stageIndex}&stepOrdinal=${inst.stepIndex}`;
    const scheme = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
    var url = (scheme + window.location.host + this.get('pipeline.pipelinesEndpoint') + '/ws/log' + params);
    var socket = new WebSocket(url);
    this.set('socket', socket);
    socket.onopen = () => {
      //  resolve async destroyed component problem
      var status = this.get('status');
      if (status === 'closed') {
        return
      }
      this.set('status', 'connected');
    };
    socket.onmessage = (message) => {
      //  resolve async destroyed component problem   
      var status = this.get('status');
      if (status === 'closed') {
        return
      }
      this.set('status', 'connected');
      var msg = JSON.parse(message.data);
      if (msg.data) {
        onmessage(msg.data);
      }
    }
    socket.onclose = () => {
      if (this.isDestroyed || this.isDestroying) {
        return;
      }
      this.set('status', 'disconnected');
    };
  },

  disconnect: function() {
    this.set('status', 'closed');
    var socket = this.get('socket');
    if (socket) {
      socket.close();
      this.set('socket', null);
    }
  },

  onResize: function() {
    var amount = this.get('instance.activity.amount')
    // this.$('.log-body').css('min-height', Math.max(($(window).height() - this.get('logHeight'))) + 'px');
    this.$('.log-body').css('height', (amount.countStep + amount.countStage) * 82 + 'px');
  },

  willDestroyElement: function() {
    this.disconnect();
    this._super();
  }
});
