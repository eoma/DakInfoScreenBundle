function formatDate(dateString) {
  // Will format a date according to norwegian standards
  var months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'];
  var days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];

  var dateComponent = dateString.split('-');
  var year = parseInt(dateComponent[0], 10);
  var month = parseInt(dateComponent[1], 10) - 1;
  var day = parseInt(dateComponent[2], 10);

  var date = new Date();
  date.setFullYear(year);
  date.setMonth(month, day);
  //date.setDate(day);

  //console.log('year', year, dateComponent[0], 'month', month, dateComponent[1], 'day', day, dateComponent[2]);

  //console.log('date', date);

  return days[date.getDay()] + ' ' + day + '. '+ months[month] + ' ' + year;
}

function formatTime(timeString) {
  var timeCollection = timeString.split(':');

  var hour = timeCollection[0];
  var minute = timeCollection[1];
  var second = timeCollection[2];

  return hour + ':' + minute;
}

function eventHappensNow (event) {
	var now = new Date();

	var startDateParts = event.startDate.split('-');
	var startTimeParts = event.startTime.split(':');

	var endDateParts = event.endDate.split('-');
	var endTimeParts = event.endTime.split(':');

	var start = new Date(startDateParts[0], startDateParts[1], startDateParts[2], startTimeParts[0], startTimeParts[1], startTimeParts[2], 0);
	var end = new Date(endDateParts[0], endDateParts[1], endDateParts[2], endTimeParts[0], endTimeParts[1], endTimeParts[2], 0);

	console.log('eventHappensNow', 'now >= start:', (now >= start), 'now <= end:', (now <= end));

	if ((now >= start) && (now <= end)) {
		return true;
	} else {
		return false;
	}
}

var eventCollectionFormat = "<section class=\"eventCollection\"> \
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
	var home;
	var eventServer = "http://et.kvarteret.no/endre/kvarteret_events/web";

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
			if (clear == true) {
				$("#slides .eventCollection").empty().remove();
			}

			var dates = {};
			$.each(data.data, function(index) {
				if (typeof(dates[this.startDate]) == 'undefined') {
					dates[this.startDate] = new Array();
				}
				dates[this.startDate].push(index);
			});

			var dateEvents = [];

			$.each(dates, function(date) {
				var dateEvent = {}
				dateEvent.date = date;
				dateEvent.events = [];

				$.each(this, function (index, eventIndex) {
					dateEvent.events.push(data.data[eventIndex]);
				});

				dateEvents.push(dateEvent);
				dateEvent = null;
			});

			if ((typeof putAfterElement != 'undefined') && (putAfterElement != null)) {
				putAfterElement.after($.tmpl(eventCollectionFormat, dateEvents));
			}
			
			dates = null;
			dateEvents = null;
		},

		refresh : function (callback, async) {
			var t = this;

			if (typeof async != 'boolean') {
				async = true;
			}

			t.state.offset = 0;
			t.state.totalCount = 0;

			var elems = $('.eventSlideTrigger');
			
			if (elems.length == 0) {
				
			}
			
			for (var i = 0; i < elems.length; i++) {
				var queryParams = {};
				queryParams.limit = t.state.limit;
				queryParams.offset = t.state.offset;

				var elemData = elems.eq(i).data();
				
				if (typeof elemData.dayspan == 'number') {
					queryParams.dayspan = elemData.dayspan;
				}
				
				if ((typeof elemData.arranger == 'number') || (typeof elemData.arranger == 'string')) {
					queryParams.arranger_id = elemData.arranger;
				}
				
				if ((typeof elemData.location == 'number') || (typeof elemData.location == 'string')) {
					queryParams.location_id = elemData.location;
				}
				
				if ((typeof elemData.category == 'number') || (typeof elemData.category == 'string')) {
					queryParams.category_id = elemData.category;
				}
				
				if ((typeof elemData.festival == 'number') || (typeof elemData.festival == 'string')) {
					queryParams.category_id = elemData.festival;
				}

				jQuery.extend(queryParams, t.state.filter);

				console.log("queryParams", queryParams);

				t.loadEvents(queryParams, async, function (data, index) {
					t.addEventsToList(data, (index == 0) ? true : false, elems.eq(index));

					if ($.isFunction(callback)) {
						callback();
					}
				}, i);
			}
		},

		loading : function (loading, description) {
			var indicator = $('#progress');

			if (loading == true) {
				if (indicator.length == 0) {
					// It doesn't exist, we can add it
					if ((typeof description == 'undefined') || (typeof description != 'string') || (description == '')) {
						description = 'Laster...';
					}

					$('.current').append('<div id="progress">' + description + '</div>');
					indicator = $('#progress');
					indicator.css('top', ($(window).scrollTop() + parseInt(indicator.css('top'), 10)) + 'px' );
					console.log('showing process window at ' + ($(window).scrollTop() + parseInt(indicator.css('top'), 10)) + 'px');
				}
			} else {
				if (indicator.length != 0) {
					console.log('removes progress window');
					indicator.empty().remove();
				}
			}
		},
		
		loadEvents : function (queryParams, async, callback, callbackArguments) {
			var t = this;
			t.loading(true);

			if (typeof async != 'boolean') {
				async = true;
			}

			//alert(t.isOnline());

			$.ajax({
				url: eventServer + "/api/json/filteredEvents?callback=?",
				dataType: 'json',
				data: queryParams,
				success: function (json) {
					t.state.offset = json.offset;
					t.state.totalCount = json.totalCount;
					t.state.limit = json.limit;

					console.log('GOT RESPONSE! ' + json.count + ' elements');

					callback(json, callbackArguments);
					t.loading(false);
				},
				error: function (xhr, textStatus, errorThrown) {
					console.log('error loading events: ' + textStatus + ' msg: ' + errorThrown);
					t.loading(false);
				},
				timeout: 10000,
				async: async
			});
		}
	};
})(jQuery);
