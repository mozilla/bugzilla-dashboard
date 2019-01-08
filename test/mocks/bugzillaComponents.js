const bugzillaComponents = [
  {
    label: 'Core::DOM: IndexedDB',
    bugzillaEmail: 'someone@mozilla.com',
    component: 'DOM: IndexedDB',
    product: 'Core',
  },
  {
    label: 'Core::JavaScript Engine',
    bugzillaEmail: 'someone@mozilla.com',
    component: 'JavaScript Engine',
    product: 'Core',
  },
  {
    label: 'Core::DOM: Core & HTML',
    bugzillaEmail: 'someone@mozilla.com',
    component: 'DOM: Core & HTML',
    product: 'Core',
    metrics: {
      untriaged: {
        count: 944,
        link: 'https://bugzilla.mozilla.org/buglist.cgi?component=DOM%3A%20Core%20%26%20HTML&f1=bug_severity&f2=keywords&f3=resolution&limit=0&o1=notequals&o2=notsubstring&o3=isempty&product=Core&v1=enhancement&v2=meta',
      },
    },
  },
  {
    label: 'Toolkit::Async Tooling',
    bugzillaEmail: 'manager@mozilla.com',
    component: 'Async Tooling',
    product: 'Toolkit',
  },
];

export default bugzillaComponents;
