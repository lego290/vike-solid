import type { Config, ConfigEffect, PageContext } from "vike/types";
import type { Component } from "./types.js";

// Depending on the value of `config.meta.ssr`, set other config options' `env`
// accordingly.
// See https://vike.dev/meta#modify-existing-configurations
const toggleSsrRelatedConfig: ConfigEffect = ({
  configDefinedAt,
  configValue,
}) => {
  if (typeof configValue !== "boolean") {
    throw new Error(`${configDefinedAt} should be a boolean`);
  }

  return {
    meta: {
      // When the SSR flag is false, we want to render the page only in the
      // browser. We achieve this by then making the `Page` implementation
      // accessible only in the client's renderer.
      Page: {
        env: configValue
          ? { server: true, client: true } // default
          : { client: true },
      },
    },
  };
};

export default {
  onRenderHtml: "import:vike-solid/renderer/onRenderHtml:onRenderHtml",
  onRenderClient: "import:vike-solid/renderer/onRenderClient:onRenderClient",

  // TODO/next-major-release: remove pageProps (i.e. tell users to use data() instead of onBeforeRender() to fetch data)
  // TODO/next-major-release: remove support for setting title over onBeforeRender()
  // A page can define an onBeforeRender() hook to be run on the server, which
  // can fetch data and return it as additional page context. Typically it will
  // return the page's root Solid component's props and additional data that can
  // be used by the renderers.
  // It is a cumulative config option, so a web app using vike-solid can extend
  // this list.
  passToClient: ["pageProps", "title", "lang"],

  clientRouting: true,
  hydrationCanBeAborted: true,
  meta: {
    Head: {
      env: { server: true },
    },
    Layout: {
      env: { server: true, client: true },
    },
    title: {
      env: { server: true, client: true },
    },
    description: {
      env: { server: true },
    },
    favicon: {
      env: { server: true },
    },
    lang: {
      env: { server: true, client: true },
    },
    ssr: {
      env: { config: true },
      effect: toggleSsrRelatedConfig,
    },
    stream: {
      env: { server: true },
    },
  },
} satisfies Config;

// We purposely define the ConfigVikeSolid interface in this file: that way we ensure it's always applied whenever the user `import vikeSolid from 'vike-solid'`
declare global {
  namespace VikePackages {
    interface ConfigVikeSolid {
      /** The page's root Solid component */
      Page?: Component;
      /** Solid element renderer and appended into <head></head> */
      Head?: Component;
      /** A component, usually common to several pages, that wraps the root component `Page` */
      Layout?: Component;
      title?: string | ((pageContext: PageContext) => string);
      description?: string;
      favicon?: string;
      /**
       * @default 'en'
       */
      lang?: string;
      /**
       * If true, render mode is SSR or pre-rendering (aka SSG). In other words, the
       * page's HTML will be rendered at build-time or request-time.
       * If false, render mode is SPA. In other words, the page will only be
       * rendered in the browser.
       *
       * See https://vike.dev/render-modes
       *
       * @default true
       *
       */
      ssr?: boolean;
      /**
       * Whether to stream the page's HTML. Requires Server-Side Rendering (`ssr: true`).
       *
       * @default false
       *
       */
      stream?: boolean;
    }
  }
}
