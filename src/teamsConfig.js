const teamConfigs = {
  domCore: {
    label: 'DOM Core',
    owner: 'someone@mozilla.com',
    product: ['Core'],
    component: [
      'DOM', 'DOM: Core & HTML', 'DOM: Events', 'Drag and Drop',
      'Editor', 'Event Handling', 'HTML: Form Submission',
      'HTML: Parser', 'Keyboard: Navigation', 'Selection',
      'Serializers',
    ],
  },
  domFission: {
    label: 'DOM Fission',
    owner: 'manager@mozilla.com',
    product: ['Core', 'Toolkit'],
    component: [
      'Document Navigation', 'XBL', 'XML', 'XPConnect', 'XSLT',
    ],
  },
  workerStoreage: {
    label: 'Worker and Storage',
    owner: 'manager@mozilla.com',
    product: ['Core', 'Toolkit'],
    component: [
      'DOM: IndexedDB', 'DOM: Push Notifications', 'DOM: Quota Manager',
      'DOM: Service Workers', 'DOM: Web Payments', 'DOM: Web Storage',
      'DOM: Workers',
    ],
  },
};

export default teamConfigs;
