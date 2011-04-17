/**
 * jquery.forces.date.js
 * @see http://usetheforces.googlecode.com/
 * @license GNU GENERAL PUBLIC LICENSE Version 3 <http://www.gnu.org/licenses/gpl.html>
 * @requires jQuery
 */

;if(typeof(jQuery)!="undefined") {
(function($){


	// jquery.forces
	var $F = $.forces = $.forces || {};





	// constants (private)
	var MONTHS = 'January February March April May June July August September October November December'.split(/ /);
	var WEEKDAYS = 'Sunday Monday Tuesday Wednesday Thursday Friday Saturday'.split(/ /);
	var TODAY = new Date();





	// private: _pad a string
	var _pad = function(s, l, c) {
		s = String(s);
		while (s.length < l) s = String(c) + s;
		return s;
	};





	// format a date
	$F.dateFormat = function(date, format) {
		if (!date) return '';
		if (!format) return date.toString();
		return format
			.replace(/YYYY|yyyy|%Y/, date.getFullYear())
			.replace(/MM|%m/, _pad(date.getMonth()+1, 2, '0'))
			.replace(/dd|%d/, _pad(date.getDate(), 2, '0'))
			.replace(/%e/, _pad(date.getDate(), 2, ' '))
			.replace(/d/, date.getDate())
			.replace(/%B/, MONTHS[date.getMonth()])
			.replace(/%A/, WEEKDAYS[date.getDay()]);
	};





	// parse a date
	$F.dateParse = function(s, min, max) {
		var date = {};

		if (s.match(/^\d{4}-[01]\d-[0-3]\d$/)) {
			// W3CDTF
			s = s.split(/[^A-Za-z0-9]/);
			date.year = s[0];
			date.month = s[1];
			date.date = s[2];
			
		} else {
		
			s = s.split(/[^A-Za-z0-9]/);
	
			var base = min || max || TODAY;
	
			function setDate(property, value) {
				date[property] = date[property] || value;
			}
	
			for (var i = 0; i < s.length; i++) {
				if (s[i].match(/^\d{4}$/)) {
					setDate('year', s[i]);
				} else if (s[i].match(/^\d{1,2}$/)) {
					// precedence: date, month, year
					var property = date.date ? (date.month ? 'year' : 'month') : 'date';
					if (property == 'year' && !date.year) {
						s[i] = (base.getFullYear()+"").substring(0,2) + _pad(s[i], 2, '0');
						if (min && min.getFullYear() > s[i]) {
							s[i] += 100;
						} else if (max && max.getFullYear() < s[i]) {
							s[i] -= 100;
						} else if (!min && !max && s[i] > base.getFullYear()+20) {
							s[i] -= 100;
						}
					}
					setDate(property, s[i]);
				}
			}
		}

		if (date.date && date.month && date.year) {
			var d = new Date(date.year, date.month-1, date.date);
			if ($F.dateEquals(d, date.year, date.month, date.date)) {
				return d;
			}
		}

		return null;
	};





	// calculate a date
	// TODO negative values cause errors, as in new Date(-y, -m, -d)
	$F.dateCalc = function(date, delta) {
		delta = $.extend({ year: 0, month: 0, date: 0 }, delta);
		return new Date(
				date.getFullYear() + delta.year,
				date.getMonth() + delta.month,
				date.getDate() + delta.date
		);
	};





	// check date equality
	$F.dateEquals = function(date, y, m, d) {
		return (date.getMonth() == m-1 && date.getDate() == d && date.getFullYear() == y);
	};
	
	



	// return last day in month
	$F.dateEndOfMonth = function(date) {
		date = new Date(date.getFullYear(), date.getMonth(), 31);
		if (date.getDate() != 31) {
			date.setDate(31 - date.getDate());
			date = this.dateCalc(date, { month: -1 });
		}
		return date;
	};





	$F.DATE_TODAY = function() {
		return new Date(TODAY.getFullYear(), TODAY.getMonth(), TODAY.getDate());
	};





	$F.WEEKDAYS = function() {
		return WEEKDAYS.slice();
	};





})(jQuery);
}