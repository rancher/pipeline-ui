import Ember from 'ember';

// Useful context/condition shortcuts
export const getProjectId = function() { return this.get('projectId'); };
export const getNamespaceId = function() { return this.get('namespaceId'); };
export const k8sReady = function() { return this.get('kubernetesReady'); };
export const k8sNotReady = function() { return !this.get('kubernetesReady'); };
export const isOwner = function() { return this.get('isOwner'); };

/* Tree item options
  {
    id: 'str' (identifier to allow removal... should be unique)
    localizedLabel: 'i18n key', (or function that returns one)
    label: 'Displayed unlocalized label', (or function that returns string)
    icon: 'icon icon-something',
    condition: function() {
      // return true if this item should be displayed
      // condition can depend on anything page-header/component.js shouldUpdateNavTree() depends on
    }
    alertRoute: 'target.route.path', // as in link-to
    alertCondition: function() {
      // return true if the alert (!) icon should be displayed
      // can depend on anything page-header/component.js shouldUpdateNavTree() depends on
    }
    target: '_blank', (for url only)
    route: 'target.route.path', // as in link-to
    ctx: ['values', 'asContextToRoute', orFunctionThatReturnsValue, anotherFunction]
    queryParams: {a: 'hello', b: 'world'],
    moreCurrentWhen: ['additional.routes','for.current-when'],

    submenu: [
      // Another tree item (only one level of submenu supported, no arbitrary depth nesting)
      {...},
      {...}
    ]
  },
*/
const navTree = [
  // CICD
  {
    id: 'pipelines',
    localizedLabel: 'nav.pipelines.tab',
    route: 'pipelines',
    ctx: [getProjectId],
    moreCurrentWhen: ['pipelines'],
    condition: function() {
      return this.get('hasPipeline'); 
    },
  }

];

export function addItem(opt) {
  navTree.pushObject(opt);
}

export function removeId(id) {
  for ( let i = navTree.length-1 ; i >= 0 ; i-- )
  {
    if ( navTree[i].id === id ) {
      navTree.removeAt(i);
    } else if ( navTree[i].submenu && Ember.isArray(navTree[i].submenu) ) {
      let sub = navTree[i].submenu;
      for ( var j = sub.length-1 ; j >= 0 ; j-- )
      {
        if ( sub[j].id === id ) {
          sub.removeAt(j);
        }
      }
    }
  }
}

export function get() {
  return Ember.copy(navTree,true);
}
