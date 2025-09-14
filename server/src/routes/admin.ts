export default [
  {
    method: 'POST',
    path: '/fetch-url',
    handler: 'ogController.fetchUrl',
    config: {
      policies: [],
    },
  },
];
