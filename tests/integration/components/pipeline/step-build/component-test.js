import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/step-build', 'Integration | Component | pipeline/step build', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/step-build}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/step-build}}
      template block text
    {{/pipeline/step-build}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
