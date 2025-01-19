/** @type {import('next').NextConfig} */

const path = require('path');
const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
    sassOptions: {
        includePaths: [path.join(__dirname, 'app/styles')],
    },
    typescript: {
        //true == Dangerously allow production builds to successfully complete even if  your project has type errors.
        ignoreBuildErrors: false,
    },
    images: {
        dangerouslyAllowSVG: true,
        // disableStaticImages: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
                port: '',
                pathname: '/a/**',
            },
            {
                protocol: 'https',
                hostname: 'framerusercontent.com',
                port: '',
                pathname: '**',
            }, {
                protocol: 'https',
                hostname: 'app.framerstatic.com',
                port: '',
                pathname: '**',
            },
            // firebasestorage.googleapis.com
            {
                protocol: 'https',
                hostname: 'firebasestorage.googleapis.com',
                port: '',
                pathname: '**',
            }
        ],
    },
    webpack(config) {
        config.externals.push({ sharp: 'commonjs sharp', canvas: 'commonjs canvas' });
        config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });
        return config;
    },
    reactStrictMode: false,
    swcMinify: true,      // Enable SWC minification for improved performance
    compiler: {
        removeConsole: process.env.NODE_ENV !== "development", // Remove console.log in production
    },
    transpilePackages: ['antd-mobile']
}

// Configuration object tells the next-pwa plugin 
const withPWA = require("next-pwa")({
    dest: "public", // Destination directory for the PWA files
    disable: process.env.NODE_ENV === "development", // Disable PWA in development mode
    register: true, // Register the PWA service worker
    skipWaiting: true, // Skip waiting for service worker activation
});
module.exports = withPWA(withNextIntl(nextConfig));

// /** @type {import('next').NextConfig} */
// const path = require('path');
// const runtimeCaching = require('next-pwa/cache');

// const withPWA = require('next-pwa')({
//     dest: 'public',
//     scope: '/',
//     runtimeCaching,
// })
// if (process.env.NODE_ENV === 'development') {
//     const withBundleAnalyzer = require('@next/bundle-analyzer')({
//         enabled: process.env.ANALYZE === 'true',
//     })

//     module.exports = withBundleAnalyzer({
//         sassOptions: {
//             includePaths: [path.join(__dirname, 'app/styles')],
//         },
//         typescript: {
//             //true == Dangerously allow production builds to successfully complete even if  your project has type errors.
//             ignoreBuildErrors: false,
//         },
//         images: {
//             disableStaticImages: true
//         },
//         webpack(config) {
//             config.externals.push({ sharp: 'commonjs sharp', canvas: 'commonjs canvas' });
//             config.module.rules.push({ test: /\.svg$/, use: ["@svgr/webpack"] });

//             return config;
//         },
//         reactStrictMode: false
//     })
// } else {
//     module.exports = withPWA({
//         // config
//         sassOptions: {
//             includePaths: [path.join(__dirname, 'styles')],
//         },
//         typescript: {
//             //true == Dangerously allow production builds to successfully complete even if  your project has type errors.
//             ignoreBuildErrors: false,
//         },
//         images: {
//             disableStaticImages: true
//         },
//         // experimental: {
//         //   appDir: true,
//         // },
//         // webpack(config) {
//         //   config.module.rules.push({
//         //     test: /\.svg$/,
//         //     use: ["@svgr/webpack"]
//         //   });

//         //   return config;
//         // },
//         reactStrictMode: false
//     })
// }