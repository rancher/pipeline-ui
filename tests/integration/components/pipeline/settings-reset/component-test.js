import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/settings-reset', 'Integration | Component | pipeline/settings reset', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/settings-reset}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/settings-reset}}
      template block text
    {{/pipeline/settings-reset}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
