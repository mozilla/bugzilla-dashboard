import loadable from '../utils/loadable';

export default [
  {
    component: loadable(() => import('../views/Main/index')),
    path: '/',
    exact: true,
  },
];
