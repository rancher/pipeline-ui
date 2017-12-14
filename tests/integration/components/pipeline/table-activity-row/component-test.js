import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('pipeline/table-activity-row', 'Integration | Component | pipeline/table activity row', {
  integration: true
});

test('it renders', function(assert) {

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{pipeline/table-activity-row}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#pipeline/table-activity-row}}
      template block text
    {{/pipeline/table-activity-row}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
