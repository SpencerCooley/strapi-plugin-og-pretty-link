# Strapi Plugin: Open Graph Pretty Link

A custom field for Strapi that allows content editors to fetch Open Graph data from a URL and save it as structured JSON. This enables you to easily create beautiful, data-rich preview cards in your frontend application.

![Preview of the OG Pretty Link custom field in the Strapi admin panel](https://github.com/SpencerCooley/strapi-plugin-og-pretty-link/raw/master/screen-shot.png)


## Features

- **Easy to Use:** Simply paste a URL and click "Fetch".
- **Rich Data:** Fetches OG title, description, image, and more.
- **Live Preview:** Shows a preview of the card directly in the Content Manager.
- **Developer Friendly:** Saves clean JSON data to your content type.

## Requirements

- Strapi v5.12.5 or higher
- Node.js v18 or higher

---

## 1. Installation

In your Strapi project, install the plugin from npm:

```bash
npm install @spencercooley/strapi-plugin-og-pretty-link
```

---

## 2. Plugin Configuration

Enable the plugin in your Strapi project by creating or editing the file `config/plugins.ts`:

```typescript
// file: config/plugins.ts
export default {
  'og-pretty-link': {
    enabled: true,
  },
};
```

---

## 3. Security Middleware Configuration

For the image previews in the admin panel to work correctly, you **must** update your application's Content Security Policy (CSP). This is because the OG images can come from any website.

In `config/middlewares.ts`, modify the `strapi::security` middleware to allow images from any `http:` or `https:` source:

```typescript
// file: config/middlewares.ts
export default [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          // Allow images from any source for previews
          'img-src': ["'self'", 'data:', 'blob:', 'https://market-assets.strapi.io', 'http:', 'https:'],
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

After configuring the plugin and middleware, rebuild your admin panel and restart the server:

```bash
npm run build
npm run develop
```

---

## 4. Usage (Schema Definition)

While you can add the field via the Content-Type Builder UI, it is recommended to define it directly in your schemas for version control and consistency.

### Option A: Add as a Component in a Dynamic Zone (Recommended)

This is the most flexible approach, allowing you to add link previews anywhere in your content.

**Step 1: Create the Component Schema**

Create a new file at `src/components/shared/og-link.json`.

**Important:** Strapi components are organized into categories based on the folder structure inside `src/components`. In this case, `shared` is the category name. This allows you to organize your components logically (e.g., `shared`, `page_sections`, `marketing`).

```json
// file: src/components/shared/og-link.json
{
  "collectionName": "components_shared_og_links",
  "info": {
    "displayName": "OG Link",
    "icon": "link",
    "description": "A component to fetch and display Open Graph link previews."
  },
  "options": {},
  "attributes": {
    "data": {
      "type": "customField",
      "customField": "plugin::og-pretty-link.og-link"
    }
  }
}
```

**Step 2: Add the Component to a Dynamic Zone**

In your Content Type's schema (e.g., `src/api/article/content-types/article/schema.json`), add the newly created component to your `dynamiczone`'s `components` array.

Notice how `"shared.og-link"` directly maps to the folder and file you created (`shared/og-link.json`).

```json
// file: src/api/article/content-types/article/schema.json
{
  // ... other schema properties
  "attributes": {
    // ... other attributes
    "blocks": {
      "type": "dynamiczone",
      "components": [
        "shared.media",
        "shared.quote",
        "shared.rich-text",
        "shared.og-link" // <-- Add this line
      ]
    }
  }
}
```

### Option B: Add as a Standalone Field

If you don't need a dynamic zone, you can add the field directly to any content type's `schema.json`:

```json
// file: src/api/my-content-type/content-types/my-content-type/schema.json
{
  // ... other schema properties
  "attributes": {
    // ... other attributes
    "my_link_preview": {
      "type": "customField",
      "customField": "plugin::og-pretty-link.og-link"
    }
  }
}
```

After defining your schemas, restart your Strapi server. The "OG Link" field will now be available in your content editor.


