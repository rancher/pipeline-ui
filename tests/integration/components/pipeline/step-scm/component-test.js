import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/step-scm', 'Integration | Component | pipeline/step scm', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/step-scm}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/step-scm}}
      template block text
    {{/pipeline/step-scm}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
