/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@hive/ui',
    '@hive/types',
    '@hive/config',
    '@hive/utilities',
    '@hive/validation',
    '@hive/auth',
    '@hive/events',
  ],
};

export default nextConfig;
