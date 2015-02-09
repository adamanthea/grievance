Package.describe({
  name: 'adamanthea:underscore.string',
  summary: "underscore.string: Additional string functions for Underscore (v 2.4.0 w/ backported replaceAll & makeString)",
  version: "1.0.0",
  git: "https://github.com/wizonesolutions/meteor-underscore-string.git"
});

Package.on_use(function (api) {
  api.versionsFrom("METEOR@0.9.0");
  api.use('meteor', {unordered: true});
	api.use('underscore', ['client', 'server']);

  api.add_files(['pre.js','lib/underscore.string/underscore.string.js','post.js']);

	api.export('_s');
});
