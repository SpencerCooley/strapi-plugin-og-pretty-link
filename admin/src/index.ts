import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';

export default {
  register(app: any) {
    app.customFields.register({
      name: 'og-link',
      pluginId: PLUGIN_ID,
      type: 'json',
      intlLabel: {
        id: `${PLUGIN_ID}.custom-field.label`,
        defaultMessage: 'OG Link',
      },
      intlDescription: {
        id: `${PLUGIN_ID}.custom-field.description`,
        defaultMessage: 'Fetch and save Open Graph data from a URL.',
      },
      components: {
        Input: async () => import('./components/Input'),
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  async registerTrads({ locales }: { locales: string[] }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      })
    );
  },
};
