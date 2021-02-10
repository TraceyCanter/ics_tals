/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js");

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "build.js",
    "revision": "1ea20ab64e42dd1c6f69fe042547a082"
  },
  {
    "url": "check-versions.js",
    "revision": "42bb4230ad50c1bf8a45503de2ebcebd"
  },
  {
    "url": "logo.png",
    "revision": "82b9c7a5a3f405032b1db71a25f67021"
  },
  {
    "url": "utils.js",
    "revision": "9a4ad3ffd6c6775b17728f9ac6a33398"
  },
  {
    "url": "vue-loader.conf.js",
    "revision": "5e416c7612303204a3fee93331a76872"
  },
  {
    "url": "webpack.base.conf.js",
    "revision": "2541e19f32358ba59d5a32af712fdabb"
  },
  {
    "url": "webpack.dev.conf.js",
    "revision": "042061e241a8efa1a6e7e98592d36607"
  },
  {
    "url": "webpack.prod.conf.js",
    "revision": "50a28b27995866866d771421659940b4"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
