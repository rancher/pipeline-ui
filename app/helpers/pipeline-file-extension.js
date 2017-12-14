import Ember from 'ember';

const extensions = {
  'yml': 'yaml',
  'md': 'markdown'
};

export function pipelineFileExtension(params) {
  var extend = params[0].split('.')[1]
  return extensions[extend];
}

export default Ember.Helper.helper(pipelineFileExtension);
