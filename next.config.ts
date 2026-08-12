import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Only relevant for `output: 'standalone'` deployments: make sure the Markdown
  // sources travel with the server bundle. Add your own content directories here
  // if they live outside `content/`.
  outputFileTracingIncludes: {
    '/**': ['./content/**/*.md'],
  },
};

export default nextConfig;
