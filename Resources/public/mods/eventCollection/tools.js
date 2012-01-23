function formatDate(dateString) {
	// Will format a date according to norwegian standards
	var months = ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
	    days = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'],

	    dateComponent = dateString.split('-'),
	    year = parseInt(dateComponent[0], 10),
	    month = parseInt(dateComponent[1], 10) - 1,
	    day = parseInt(dateComponent[2], 10),
	    date = new Date();

	date.setFullYear(year);
	date.setMonth(month, day);
	//date.setDate(day);

	//console.log('year', year, dateComponent[0], 'month', month, dateComponent[1], 'day', day, dateComponent[2]);

	//console.log('date', date);

	return days[date.getDay()] + ' ' + day + '. ' + months[month] + ' ' + year;
}

function formatTime(timeString) {
	var timeCollection = timeString.split(':'),
	    hour = timeCollection[0],
	    minute = timeCollection[1];//,
	    //second = timeCollection[2];

	return hour + ':' + minute;
}

function getDateObject(dateString, timeString) {

	var dateParts = [1970, 1, 1],
	    timeParts = [0, 0, 0],
		dateObject;

	if (typeof dateString === 'string') {
		dateParts = dateString.split('-');
	}

	if (typeof timeString === 'string') {
		timeParts = timeString.split(':');
	}

	dateObject = new Date(
		parseInt(dateParts[0], 10),
		parseInt(dateParts[1], 10) - 1,
		parseInt(dateParts[2], 10),
		parseInt(timeParts[0], 10),
		parseInt(timeParts[1], 10),
		parseInt(timeParts[2], 10),
		0
	);

	return dateObject;
}

function groupEventsByDate(events) {

	var dates = {},
	    i;

	for (i = 0; i < events.length; i++) {
		var event = events[i],
		    date = getDateObject(event.startDate, event.startTime),
		    monthPadding = '',
		    dateString,
		    month;

		date.setTime(date.getTime() - (4 * 3600 * 1000));

		month = date.getMonth() + 1;

		if (month < 10) {
			monthPadding = ' ';
		}

		dateString = date.getFullYear() + '-' + monthPadding + month + '-' + date.getDate();

		if (typeof dates[dateString] === 'undefined') {
			dates[dateString] = [];
		}
		dates[dateString].push(i);
	}

	return dates;
}

function eventHappensNow(event) {
	var now = new Date(),
	    start = getDateObject(event.startDate, event.startTime),
	    end = getDateObject(event.endDate, event.endTime);

	console.log('eventHappensNow', 'now >= start:', (now >= start), 'now <= end:', (now <= end));

	if ((now >= start) && (now <= end)) {
		return true;
	} else {
		return false;
	}
}

