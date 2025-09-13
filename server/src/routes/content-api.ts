export default [
  {
    method: 'GET',
    path: '/',
    handler: 'ogController.index',
    config: {
      policies: [],
    },
  },
  {
    method: 'POST',
    path: '/fetch-url',
    handler: 'ogController.fetchUrl',
    config: {
      policies: [],
    },
  },
];
