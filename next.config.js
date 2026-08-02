/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION`
 * to skip environment validation.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default config;
