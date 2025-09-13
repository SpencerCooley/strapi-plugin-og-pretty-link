import type { Core } from '@strapi/strapi';

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  console.log('Successfully registered the og-pretty-link plugin.');
};

export default register;
