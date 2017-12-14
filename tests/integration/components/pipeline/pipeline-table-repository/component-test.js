import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/pipeline-table-repository', 'Integration | Component | pipeline/pipeline table repository', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/pipeline-table-repository}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/pipeline-table-repository}}
      template block text
    {{/pipeline/pipeline-table-repository}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
