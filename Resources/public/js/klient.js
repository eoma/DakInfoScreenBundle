
var dakSlideshowEditor = function () {
	var _slides;

	var _contentContainer;

	var _defaultData = {
		defaultSlideDuration: 5000,
		slides: [],
	};

	var _modules = [];

	var _form = null;

	var config = {
		form : "form",
		content : "content",
	};

	function clickMinimiseMaximise (event) {
		var elem = $(event.target);

		if (elem.hasClass('toggled')) {
			elem.text('Minimise');
		} else {
			elem.text('Maximise');
		}

		elem.toggleClass('toggled');
		elem.closest('#contentContainer > li').find('.canvas').toggle();
	}

	function clickMinimiseMaximiseAll (event) {
		var elem = $(event.target);

		if (elem.hasClass('toggled')) {
			elem.text('Minimise all');
			_contentContainer.find('.toolbar .minimise.toggled').click();
		} else {
			elem.text('Maximise all');
			_contentContainer.find('.toolbar .minimise').not('.toggled').click();
		}

		elem.toggleClass('toggled');
	}

	function deleteSlide (event) {
		var ancestor = $(event.target).closest('#contentContainer > li');

		var slideIndex = ancestor.index();
		_slides[slideIndex].module = null;

		//delete _slides[slideIndex];

		_slides.splice(slideIndex, 1);

		ancestor.empty().remove();
	}
	
	function addRawSlide () {
		var index = _slides.length;

		_slides[index] = {
			content : "<section>\n\n</section>",
			css : "",
		};

		_slides[index].module = dakSlideShowRawEditor(_slides[index], t.addSlide());
	}

	return {
		t : null,
		sortStartPosition : null,
		sortStopPosition : null,

		init : function (data, customConfig) {
			t = this;

			jQuery.extend(config, customConfig);

			console.log(config);

			_form = jQuery('#' + config.form);
			_contentContainer = jQuery('#contentContainer');

			_modules = [];

			if (jQuery.isArray(data.slides)) {
				_slides = data.slides;
			} else {
				_slides = [];
			}

			_form.submit(t.submit);

			jQuery('#defaultSlideDuration').val(data.defaultSlideDuration);

			jQuery('#contentContainer').sortable({
				placeholder : "ui-state-highlight",
				
				start : function (event, ui) {
					var elem = ui.item;
					t.sortStartPosition = elem.index();
				},
				
				update : function (event, ui) {
					var elem = ui.item;
					t.sortStopPosition = elem.index();
					
					var diff = t.sortStopPosition - t.sortStartPosition;

					var tmp = _slides[t.sortStartPosition];

					if (diff > 0) {
						for (var i = t.sortStartPosition; i < t.sortStopPosition; i++) {
							_slides[i] = _slides[i+1];
						}
					} else {
						for (var i = t.sortStartPosition; i > t.sortStopPosition; i--) {
							_slides[i] = _slides[i-1];
						}
					}
					_slides[t.sortStopPosition] = tmp;
					
					t.sortStartPosition = null;
					t.sortStopPosition = null;
				},

				delay : 200,
			});

			jQuery('#addSlide').click(addRawSlide);

			_contentContainer.find('.toolbar .delete').live('click', deleteSlide);
			_contentContainer.find('.toolbar .minimise').live('click', clickMinimiseMaximise);

			jQuery('#minimiseMaximiseAll').live('click', clickMinimiseMaximiseAll);

			for (var i = 0; i < _slides.length; i++) {
				var elem = t.addSlide();

				t.identifySlide(i, elem);
			}
		},

		submit : function (e) {
			//e.preventDefault();
			var slides = _defaultData;

			console.log(_slides);

			slides.defaultSlideDuration = parseInt(jQuery('#defaultSlideDuration').val(), 10);

			for (var i = 0; i < _slides.length; i++) {
				slides.slides[i] = {
					content : "",
					css : ""
				};

				slides.slides[i].content = _slides[i].module.getRawContent();
				slides.slides[i].css = _slides[i].module.getRawCss();
			}

			var jsonSlide = JSON.stringify(slides);
			console.log(jsonSlide);

			_form.find('#' + config.content).val(jsonSlide);
		},

		getSlideTemplate : function () {
			var elem = $("<li />")
				.append($("<span />")
					.addClass("title")
				)
				.append($("<div />")
					.addClass("toolbar cf")
					.append($("<ul />")
						.addClass("left")
						.append($("<li />")
							.addClass("minimise")
							.text("Minimise")
						)
					)
					.append($("<ul />")
						.addClass("right")

						.append($("<li />")
							.addClass("delete")
							.text("Delete")
						)
					)
				)
				.append($("<div>")
					.addClass("canvas")
				)
			;

			return elem;
		},

		addSlide : function () {
			var elem = t.getSlideTemplate();

			_contentContainer.append(elem);

			return elem;
		},

		identifySlide : function (slideIndex, elem) {
			for (var i = 0; i < _modules.length; i++) {
				if (_modules[i].identifySlide(_slides[slideIndex])) {
					_slides[slideIndex].module = _modules[i](_slides[slideIndex], elem);
				}
			}

			if (!("module" in _slides[slideIndex])) {
				_slides[slideIndex].module = new dakSlideShowRawEditor(_slides[slideIndex], elem);
			}
		},

		registerModule : function (instantiatorFunction) {
			_modules.append(instantiatorFunction);
		}
	};

}();

var dakSlideShowRawEditor = function (slide, elem) {

	var _elem = elem;
	_elem.find('.title').eq(0).text('Raw slide');
	var _canvas = _elem.find('.canvas').eq(0);
	
	var textareaHtml = $('<textarea class="html" rows="10" cols="50">').val(slide.content);
	var textareaCss = $('<textarea class="css" rows="10" cols="50">').val(slide.css);

	_canvas.append(textareaHtml);
	_canvas.append(textareaCss);

	return {
		getRawContent : function () {
			return _canvas.find('textarea.html').val();
		},

		getRawCss : function () {
			return _canvas.find('textarea.css').val();
		}
	}
};
