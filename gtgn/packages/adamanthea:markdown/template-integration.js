if (Package.ui) {
	var Template = Package.templating.Template;
	var UI = Package.ui.UI;
	var HTML = Package.htmljs.HTML;
	var Blaze = Package.blaze.Blaze; // implied by `ui`

	UI.registerHelper('markdown', new Template('markdown', function () {
		var self = this;
		var text = "";
		if(self.templateContentBlock) {
			text = Blaze._toText(self.templateContentBlock, HTML.TEXTMODE.STRING);
		}

		return HTML.Raw(emojione.toImage(Markdown(text)));
	}));

	UI.registerHelper('emoji', new Template('emoji', function () {
		var view = this,
		content = '';

		if (view.templateContentBlock) {
			// this is for the block usage eg: {{#emoji}}:smile:{{/emoji}}
			content = Blaze._toText(view.templateContentBlock, HTML.TEXTMODE.STRING);
		}
		return HTML.Raw(emojione.toImage(content));
	}));
}
