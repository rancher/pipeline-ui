import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/pipeline-step-catalog', 'Integration | Component | pipeline/pipeline step catalog', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/pipeline-step-catalog}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/pipeline-step-catalog}}
      template block text
    {{/pipeline/pipeline-step-catalog}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
