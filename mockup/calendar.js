// renders a calendar


// go to the end of the last month
// find the day of the week
// create that week as a reference point

// example, in April 2011, the end of the last month is Thursday 31 March 2011
var d = new Date(2011, 2, 31);
d.setDate(d.getDate() - d.getDay());

console.log(d);

var weekday = d.getDay();
var calendar = [[], [], [], [], [], [], []];

// create a 6 row calendar
for (var row = 0; row < 6; row++) {
	// for each day of the week
	for (var day = 0; day < 7; day++) {
		calendar[row][day] = $.forces.dateCalc(d, { date: (row * 7) + day });
	}
}

$('body').append('<table>');

for (var i = 0; i < 6; i++) {
	var tr = $('<tr>')
	for (var j = 0; j < 7; j++) {
		$('<td>')
			.attr('title', $.forces.dateFormat(calendar[i][j], 'd %B %Y'))
			.text(calendar[i][j].getDate())
			.appendTo(tr)
		;
	}
	$('table').append(tr);
}


$('td').live('click', function(v) {
	// can get the date from @title
	// should use td@title or td/time@date ?
	console.log(new Date($(v.target).attr('title')));
});