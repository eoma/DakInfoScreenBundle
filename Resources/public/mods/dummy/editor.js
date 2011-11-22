var dummyEditor = function (slide, elem) {

	if (slide.content == "") {
		slide.content = "<section class=\"dummy\">\n <h1>Dummy</h1>\n</section>";
	}

	elem.find('.title').eq(0).text('Dummy slide');
	var canvas = elem.find('.canvas').eq(0);
	
	var textareaHtml = $('<textarea class="html" rows="10" cols="50">').val(slide.content);
	//var textareaCss = $('<textarea class="css" rows="10" cols="50">').val(slide.css);

	canvas.append(textareaHtml);
	//canvas.append(textareaCss);

	var getRawContent = function() {
		return canvas.find('textarea.html').val();
	}

	var getRawCss = function() {
		return ""; //canvas.find('textarea.css').val();
	}

	return {
		getRawContent : getRawContent,
		getRawCss : getRawCss
	};
};

dummyEditor.identifySlide = function (slide) {
	console.log(slide);

	var data = jQuery(slide.content);

	return data.hasClass('dummy');
}

dummyEditor.staticButtonSetup = function () {
	return {
		name : "Add dummy slide",
		callback : dummyEditor,
	};
}

dakSlideshowEditor.registerModule(dummyEditor);
