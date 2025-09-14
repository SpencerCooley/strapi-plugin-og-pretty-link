import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  strapi.customFields.register({
    name: 'og-link',
    plugin: 'og-pretty-link',
    type: 'json',
  });
};

export default register;
