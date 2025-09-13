import type { Core } from '@strapi/strapi';

const metascraper = require('metascraper')([
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
]);

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async fetchUrl(url: string) {
    if (!url) {
      return { error: 'URL is required.' };
    }
    try {
      const { gotScraping } = await import('got-scraping');
      const { body: html, url: responseUrl } = await gotScraping(url);
      const metadata = await metascraper({ html, url: responseUrl });
      return metadata;
    } catch (error) {
      console.error('Error fetching URL:', error);
      return { error: 'Could not fetch the URL. It may be invalid or the server is unreachable.' };
    }
  },
});
