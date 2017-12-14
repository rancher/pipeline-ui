import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/pipeline-input-var-hint', 'Integration | Component | pipeline/pipeline input var hint', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/pipeline-input-var-hint}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/pipeline-input-var-hint}}
      template block text
    {{/pipeline/pipeline-input-var-hint}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
