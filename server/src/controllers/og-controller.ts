import type { Core } from '@strapi/strapi';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  index(ctx) {
    ctx.body = { message: 'Welcome to the OG Pretty Link plugin!' };
  },
  async fetchUrl(ctx) {
    const { url } = ctx.request.body;

    if (!url) {
      return ctx.badRequest('URL is required.');
    }

    try {
      const metadata = await strapi
        .plugin('og-pretty-link')
        .service('ogService')
        .fetchUrl(url);

      if (metadata.error) {
        return ctx.badRequest(metadata.error);
      }

      ctx.body = metadata;
    } catch (error) {
      ctx.internalServerError('An error occurred while fetching the URL.');
    }
  },
});