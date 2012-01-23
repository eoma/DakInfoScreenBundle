var eventCollectionFormat = "<section class=\"eventCollection eventStyle\"> \
 <h1>${formatDate(date)}</h1> \
 <div class=\"eventsInCollection\"> \
  {{tmpl(events) eventFormat}} \
 </div> \
 <ul class=\"eventRibbon\"> \
  {{tmpl(events) eventRibbonFormat}} \
 </ul> \
</section>";

var eventFormat = "<article> \
 <h1>${title}</h1> \
\
 <span class=\"time\"></span> \
 <span class=\"location\"></span> \
\
  <span class=\"small_subinfo\"> \
   {{each categories}} \
    ${$value.name}{{if $index < categories.length-1}}, {{/if}} \
   {{/each}} \
   i {{if location_id > 0}} ${commonLocation.name} {{else}} ${customLocation} {{/if}} \
   <br>${arranger.name} \
  </span> \
\
  <span class=\"small_subinfo with_date\"> \
   ${formatTime(startTime)}\
  </span> \
\
 <p>{{html leadParagraph}}</p> \
</article>";

var eventRibbonFormat = "<li> \
 <span class=\"title\">${title}</span><br /> \
 <span class=\"time\">${formatTime(startTime)} {{if eventHappensNow($data)}}<em>pågår nå</em>{{/if}}</span><br /> \
 <span class=\"location\"> \
  {{if location_id > 0}} ${commonLocation.name} {{else}} ${customLocation} {{/if}} \
 </span> \
</li>";

var eventApp;

(function ($) {
	var eventServer = "http://events.kvarteret.no";

	eventApp = {

		state : {},

		init : function () {
			var t = this;

			t.state.limit = 1000;
			t.state.offset = 0;
			t.state.totalCount = 0;

			t.state.filter = {};
		},

		addEventsToList : function (data, clear, putAfterElement) {
			if (clear === true) {
				$("#slides .eventCollection").empty().remove();
			}

			var dates = groupEventsByDate(data.data),
			    dateEvents = [];

			$.each(dates, function (date) {
				var dateEvent = {};
				dateEvent.date = date;
				dateEvent.events = [];

				$.each(this, function (index, eventIndex) {
					dateEvent.events.push(data.data[eventIndex]);
				});

				dateEvents.push(dateEvent);
				dateEvent = null;
			});

			if ((typeof putAfterElement !== 'undefined') && (putAfterElement !== null)) {
				if (putAfterElement.data('eventFormatId')) {
					var formatId = putAfterElement.data('eventFormatId');
					//console.log("eventFormatId", formatId, $('#' + formatId).html());
					//putAfterElement.after($.tmpl($('#' + formatId).html(), dateEvents));

					$('#' + formatId).tmpl(dateEvents).insertAfter(putAfterElement);
				} else {
					$.tmpl(eventCollectionFormat, dateEvents).insertAfter(putAfterElement);
				}
			}

			dates = null;
			dateEvents = null;
		},

		refresh : function (callback, async) {
			var t = this,
			    elems,
			    i,
			    queryParams,
		        elemData;

			if (typeof async !== 'boolean') {
				async = true;
			}

			t.state.offset = 0;
			t.state.totalCount = 0;

			elems = $('.eventSlideTrigger');

			//if (elems.length == 0) {

			//}

			for (i = 0; i < elems.length; i++) {
				queryParams = {};
				queryParams.limit = t.state.limit;
				queryParams.offset = t.state.offset;

				elemData = elems.eq(i).data();

				if (typeof elemData.dayspan === 'number') {
					queryParams.dayspan = elemData.dayspan;
				}

				if ((typeof elemData.arranger === 'number') || (typeof elemData.arranger === 'string')) {
					queryParams.arranger_id = elemData.arranger;
				}

				if ((typeof elemData.location === 'number') || (typeof elemData.location === 'string')) {
					queryParams.location_id = elemData.location;
				}

				if ((typeof elemData.category === 'number') || (typeof elemData.category === 'string')) {
					queryParams.category_id = elemData.category;
				}

				if ((typeof elemData.festival === 'number') || (typeof elemData.festival === 'string')) {
					queryParams.category_id = elemData.festival;
				}

				jQuery.extend(queryParams, t.state.filter);

				console.log("queryParams", queryParams);

				t.loadEvents(queryParams, async, function (data, index) {
					t.addEventsToList(data, (index === 0) ? true : false, elems.eq(index));

					if ($.isFunction(callback)) {
						callback();
					}
				}, i);
			}
		},

		loadEvents : function (queryParams, async, callback, callbackArguments) {
			var t = this,
			    eventSuccess,
			    eventError;

			if (typeof async !== 'boolean') {
				async = true;
			}

			eventSuccess = function (json) {
				t.state.offset = json.offset;
				t.state.totalCount = json.totalCount;
				t.state.limit = json.limit;

				console.log('GOT RESPONSE! ' + json.count + ' elements');

				callback(json, callbackArguments);
			};

			eventError = function (xhr, textStatus, errorThrown) {
				console.log('error loading events: ' + textStatus + ' msg: ' + errorThrown);
			};

			//alert(t.isOnline());
			$.ajax({
				url: eventServer + "/api/json/filteredEvents?callback=?",
				dataType: 'json',
				data: queryParams,
				success: eventSuccess,
				error: eventError,
				timeout: 10000,
				async: async
			});
		}
	};
})(jQuery);
