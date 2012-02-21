"use strict";

/**
 * This object is responsible for initialising
 * and maintaining the slideshow editing process.
 *
 * Singleton, revealing module pattern.
 */
var dakSlideshowEditor = function () {
	var slides;

	var contentContainer;
	var buttonList;

	var defaultData = {
		defaultSlideDuration: 5000,
		slides: [],
	};

	var modules = [];

	var sortStartPosition = null;
	var sortStopPosition = null;

	var form = null;

	var config = {
		form : "form",
		content : "content",
	};


	var addButton = function (name, callback) {
		var button = $('<button />')
			.attr('type', 'button')
			.text(name);

		if (jQuery.isFunction(callback)) {
			button.click(callback);
		}

		return button;
	}

	var clickMinimiseMaximise = function (event) {
		var button = $(event.target);

		if (button.hasClass('toggled')) {
			button.text('Minimise');
		} else {
			button.text('Maximise');
		}

		button.toggleClass('toggled');
		button.closest('#contentContainer > li').find('.canvas').toggle();
	}

	var clickMinimiseMaximiseAll = function (event) {
		var button = $(event.target);

		if (button.hasClass('toggled')) {
			button.text('Minimise all');
			contentContainer.find('.toolbar .minimise.toggled').click();
		} else {
			button.text('Maximise all');
			contentContainer.find('.toolbar .minimise').not('.toggled').click();
		}

		button.toggleClass('toggled');
	}

	var deleteSlide = function (event) {
		var ancestor = $(event.target).closest('#contentContainer > li');

		var slideIndex = ancestor.index();
		slides[slideIndex].module = null;

		//delete slides[slideIndex];

		slides.splice(slideIndex, 1);

		ancestor.empty().remove();
	}

	var submit = function (e) {
		if ($('#doNotUpdate').is('checked')) {
			e.preventDefault();
		}
		var newSlides = defaultData;

		console.log(slides);

		newSlides.defaultSlideDuration = parseInt(jQuery('#defaultSlideDuration').val(), 10);

		for (var i = 0; i < slides.length; i++) {
			newSlides.slides[i] = {
				content : "",
				css : ""
			};

			newSlides.slides[i].content = slides[i].module.getRawContent();
			newSlides.slides[i].css = slides[i].module.getRawCss();
		}

		var jsonSlide = JSON.stringify(newSlides);
		console.log(jsonSlide);

		form.find('#' + config.content).val(jsonSlide);
	};

	var getSlideTemplate = function() {
		var domainElem = $("<li />")
			.append($("<span />")
				.addClass("title")
			)
			.append($("<div />")
				.addClass("toolbar cf")
				.append($("<ul />")
					.addClass("left")
					.append($("<li />")
						.append(
							addButton("Minimise").addClass("minimise")
						)
					)
				)
				.append($("<ul />")
					.addClass("right")

					.append($("<li />")
						.append(
							addButton("Delete").addClass("delete")
						)
					)
				)
			)
			.append($("<div>")
				.addClass("canvas")
			)
		;

		return domainElem;
	};

	var addSlideTemplate = function () {
		var domainElem = getSlideTemplate();

		contentContainer.append(domainElem);

		return domainElem;
	};

	var identifySlide = function(slideIndex, domainElem) {
		var slide = slides[slideIndex];

		for (var i = 0; i < modules.length; i++) {
			var m = modules[i];
			//console.log("identifySlide loop", _modules[i]);
			if (jQuery.isFunction(m.identifySlide) && m.identifySlide(slide)) {
				slide.module = m(slide, domainElem);
			}
		}

		if (!("module" in slide)) {
			slide.module = new dakSlideShowRawEditor(slide, domainElem);
		}

		slides[slideIndex] = slide;
	};

	var addSlide = function (callback) {
		var index = slides.length;

		slides[index] = {
			content : "",
			css : "",
		};

		slides[index].module = callback(slides[index], addSlideTemplate());
	};

	/**
	 * Registers a slideshow editor module
	 * functionObject should be a function that has
	 * publicly accessible, static methods identifySlide() (optional, recommended)
	 * and staticButtonSetup() (optional, recommended)
	 */
	var registerModule = function(functionObject) {
		modules.push(functionObject);
	};

	var init = function(data, customConfig) {
		jQuery.extend(config, customConfig);

		console.log(config);

		form = jQuery('#' + config.form);
		contentContainer = jQuery('#contentContainer');
		buttonList = jQuery('#newSlideButtons');

		function addSlideButton (name, callback) {
			var button = addButton(
				name,
				function () {
					addSlide(callback);
				}
			);

			return button;
		}

		if (modules.length > 0) {

			for (var i = 0; i < modules.length; i++) {
				var m = modules[i];

				if (jQuery.isFunction(m.staticButtonSetup)) {
					var button = m.staticButtonSetup();

					console.log("button", button);

					if (jQuery.isArray(button)) {

					} else {

						buttonList.append($('<li />')
							.append(
								addSlideButton(button.name, button.callback)
							)
						);
					}

					button = null;
				}

				m = null;
			}
		}

		if (jQuery.isArray(data.slides)) {
			slides = data.slides;
		} else {
			slides = [];
		}

		form.submit(submit);

		jQuery('#defaultSlideDuration').val(data.defaultSlideDuration);

		jQuery('#contentContainer').sortable({
			placeholder : "ui-state-highlight",
				
			start : function (event, ui) {
				var domainElem = ui.item;
				sortStartPosition = domainElem.index();
			},
				
			update : function (event, ui) {
				var domainElem = ui.item;
				sortStopPosition = domainElem.index();
					
				var diff = sortStopPosition - sortStartPosition;

				var tmp = slides[sortStartPosition];

				if (diff > 0) {
					for (var i = sortStartPosition; i < sortStopPosition; i++) {
						slides[i] = slides[i+1];
					}
				} else {
					for (var i = sortStartPosition; i > sortStopPosition; i--) {
						slides[i] = slides[i-1];
					}
				}
				slides[sortStopPosition] = tmp;
					
				sortStartPosition = null;
				sortStopPosition = null;
			},

			delay : 200,
		});

		contentContainer.find('.toolbar .delete').live('click', deleteSlide);
		contentContainer.find('.toolbar .minimise').live('click', clickMinimiseMaximise);

		jQuery('#minimiseMaximiseAll').live('click', clickMinimiseMaximiseAll);

		for (var i = 0; i < slides.length; i++) {
			var slideTemplate = addSlideTemplate();

			identifySlide(i, slideTemplate);
		}
	};

	return {
		init : init,
		//submit : submit,
		//getSlideTemplate : getSlideTemplate,
		//addSlideTemplate : addSlideTemplate,

		//identifySlide : identifySlide,

		registerModule : registerModule,

		//addSlide : addSlide,
		addButton : addButton
	};

}();

var dakSlideShowRawEditor = function (slide, elem) {

	if (slide.content == "") {
		slide.content = "<section>\n\n</section>";
	}

	elem.find('.title').eq(0).text('Raw slide');
	var canvas = elem.find('.canvas').eq(0);
	
	var textareaHtml = $('<textarea class="html" rows="10" cols="50">').val(slide.content);
	var textareaCss = $('<textarea class="css" rows="10" cols="50">').val(slide.css);

	canvas.append(textareaHtml);
	canvas.append(textareaCss);

	var getRawContent = function () {
			return canvas.find('textarea.html').val();
	}

	var getRawCss = function () {
			return canvas.find('textarea.css').val();
	}

	return {
		getRawContent : getRawContent,
		getRawCss : getRawCss
	}
};

dakSlideShowRawEditor.staticButtonSetup = function () {
	return {
		name : "Add raw slide",
		callback : dakSlideShowRawEditor,
	};
}

dakSlideshowEditor.registerModule(dakSlideShowRawEditor);
