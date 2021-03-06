require.config({
  baseUrl: '/',
  paths: {
    jquery: 'lib/jquery/jquery',
    text: 'lib/requirejs-text/text',
    base64: 'lib/base64/base64.min',
    hogan: 'lib/hogan/web/builds/2.0.0/hogan-2.0.0.amd',
    hgn: 'lib/requirejs-hogan-plugin/hgn',
    json: 'lib/requirejs-plugins/src/json',
    jasmine: 'lib/jasmine/lib/jasmine-core/jasmine',
    'jasmine-html': 'lib/jasmine/lib/jasmine-core/jasmine-html',
    'jasmine-jquery': 'lib/jasmine-jquery/lib/jasmine-jquery',
    inherits: 'lib/inherits/inherits',
    observer: 'lib/observer/src/observer',
    'event-emitter': 'lib/event-emitter/src/event-emitter',
    'debug': 'lib/debug/debug'
  },
  packages: [{
    name: "thread",
    location: "src"
  },{
    name: "streamhub-sdk",
    location: "lib/streamhub-sdk/src"
  },{
    name: "streamhub-sdk-tests",
    location: "lib/streamhub-sdk/tests"
  },{
    name: "streamhub-sdk/auth",
    location: 'lib/streamhub-sdk/src/auth'
  },{
    name: "streamhub-sdk/collection",
    location: 'lib/streamhub-sdk/src/collection'
  },{
    name: "streamhub-sdk/content",
    location: 'lib/streamhub-sdk/src/content'
  },{
    name: "streamhub-sdk/modal",
    location: "lib/streamhub-sdk/src/modal"
  },{
    name: "streamhub-editor",
    location: "lib/streamhub-editor/src/javascript",
    main: "editor"
  },{
    name: 'streamhub-editor/templates',
    location: 'lib/streamhub-editor/src/templates'
  },{
    name: "stream",
    location: "lib/stream/src"
  },{
    name: "view",
    location: "lib/view/src",
    main: "view"
  },{
    name: "auth",
    location: "lib/auth/src"
  },{
    name: "livefyre-auth",
    location: "lib/livefyre-auth/src"
  },{
    name: 'livefyre-bootstrap',
    location: 'lib/livefyre-bootstrap/src'
  },{
    name: "css",
    location: "lib/require-css",
    main: "css"
  },{
    name: "less",
    location: "lib/require-less",
    main: "less"
  }],
  shim: {
    jquery: {
        exports: '$'
    },
    jasmine: {
        exports: 'jasmine'
    },
    'jasmine-html': {
        deps: ['jasmine'],
        exports: 'jasmine'
    },
    'jasmine-jquery': {
        deps: ['jquery']
    }
  },
  css: {
    clearFileEachBuild: 'dist/thread.min.css',
    transformEach: []
  },
  less: {
    browserLoad: 'dist/thread.min',
    paths: ['lib'],
    relativeUrls: true,
    modifyVars: {
      '@icon-font-path': "\"http://cdn.livefyre.com/libs/livefyre-bootstrap/v1.1.0/fonts/\""
    }
  }
});
