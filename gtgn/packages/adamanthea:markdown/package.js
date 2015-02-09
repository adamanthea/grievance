// Source: https://github.com/chjj/marked

Package.describe({
	summary: "GitHub flavored markdown parser for Meteor based on marked.js",
	version: "1.0.4",
	git: "https://github.com/perak/markdown.git"
});

// Before Meteor 0.9?
if(!Package.onUse) Package.onUse = Package.on_use;

Package.onUse(function (api) {
	if(api.versionsFrom) api.versionsFrom('METEOR@0.9.0');
	api.addFiles('assets/css/emojione.css', 'client');

	api.use('templating', 'client');

	api.add_files('marked.js', ['server', 'client']);
	api.add_files('markdown.js', ['server', 'client']);
	api.addFiles('lib/js/emojione.js', ['client']);
	api.addFiles('qnub:emojione.js', ['client']);
	api.export('Markdown', ['server', 'client']);

	api.use("ui", "client", {weak: true});
	api.add_files("template-integration.js", "client");
});

Package.onTest(function(api) {
	api.use('tinytest');
	api.use('qnub:emojione');
	api.addFiles('qnub:emojione-tests.js');
});
