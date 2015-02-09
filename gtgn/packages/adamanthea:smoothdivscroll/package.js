Package.describe({
  name: 'adamanthea:smoothdivscroll',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
    api.versionsFrom('1.0.3.1');
    api.use('jquery', 'client');
    api.addFiles(['js/jquery-ui-1.10.3.custom.min.js','js/jquery.mousewheel.min.js','js/jquery.kinetic.min.js','js/jquery.smoothdivscroll-1.3-min.js','css/smoothDivScroll.css'], 'client');
});
