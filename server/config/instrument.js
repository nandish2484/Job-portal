// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://9123d4e5703129ac2e008dcf097efbb4@o4509146897317888.ingest.us.sentry.io/4509146901250048",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration(),
  ],
  // tracesSampleRate:1.0,
});