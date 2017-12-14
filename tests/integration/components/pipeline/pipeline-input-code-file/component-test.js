import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/pipeline-input-code-file', 'Integration | Component | pipeline/pipeline input code file', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/pipeline-input-code-file}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/pipeline-input-code-file}}
      template block text
    {{/pipeline/pipeline-input-code-file}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
