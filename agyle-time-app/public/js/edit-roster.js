/* =========================================================
 * bootstrap-datepicker.js
 * http://www.eyecon.ro/bootstrap-datepicker
 * =========================================================
 * Copyright 2012 Stefan Petre
 * Improvements by Andrew Rowls
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

!function( $ ) {

	function UTCDate(){
		return new Date(Date.UTC.apply(Date, arguments));
	}
	function UTCToday(){
		var today = new Date();
		return UTCDate(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());
	}

	// Picker object

	var Datepicker = function(element, options) {
		var that = this;

		this.element = $(element);
		this.language = options.language||this.element.data('date-language')||"en";
		this.language = this.language in dates ? this.language : this.language.split('-')[0]; //Check if "de-DE" style date is available, if not language should fallback to 2 letter code eg "de"
		this.language = this.language in dates ? this.language : "en";
		this.isRTL = dates[this.language].rtl||false;
		this.format = DPGlobal.parseFormat(options.format||this.element.data('date-format')||dates[this.language].format||'mm/dd/yyyy');
		this.isInline = false;
		this.isInput = this.element.is('input');
		this.component = this.element.is('.date') ? this.element.find('.add-on') : false;
		this.hasInput = this.component && this.element.find('input').length;
		if(this.component && this.component.length === 0)
			this.component = false;

		this._attachEvents();

		this.forceParse = true;
		if ('forceParse' in options) {
			this.forceParse = options.forceParse;
		} else if ('dateForceParse' in this.element.data()) {
			this.forceParse = this.element.data('date-force-parse');
		}


		this.picker = $(DPGlobal.template)
							.appendTo(this.isInline ? this.element : 'body')
							.on({
								click: $.proxy(this.click, this),
								mousedown: $.proxy(this.mousedown, this)
							});

		if(this.isInline) {
			this.picker.addClass('datepicker-inline');
		} else {
			this.picker.addClass('datepicker-dropdown dropdown-menu');
		}
		if (this.isRTL){
			this.picker.addClass('datepicker-rtl');
			this.picker.find('.prev i, .next i')
						.toggleClass('fa fa-arrow-left fa fa-arrow-right');
		}
		$(document).on('mousedown', function (e) {
			// Clicked outside the datepicker, hide it
			if ($(e.target).closest('.datepicker.datepicker-inline, .datepicker.datepicker-dropdown').length === 0) {
				that.hide();
			}
		});

		this.autoclose = false;
		if ('autoclose' in options) {
			this.autoclose = options.autoclose;
		} else if ('dateAutoclose' in this.element.data()) {
			this.autoclose = this.element.data('date-autoclose');
		}

		this.keyboardNavigation = true;
		if ('keyboardNavigation' in options) {
			this.keyboardNavigation = options.keyboardNavigation;
		} else if ('dateKeyboardNavigation' in this.element.data()) {
			this.keyboardNavigation = this.element.data('date-keyboard-navigation');
		}

		this.viewMode = this.startViewMode = 0;
		switch(options.startView || this.element.data('date-start-view')){
			case 2:
			case 'decade':
				this.viewMode = this.startViewMode = 2;
				break;
			case 1:
			case 'year':
				this.viewMode = this.startViewMode = 1;
				break;
		}

		this.todayBtn = (options.todayBtn||this.element.data('date-today-btn')||false);
		this.todayHighlight = (options.todayHighlight||this.element.data('date-today-highlight')||false);

		this.calendarWeeks = false;
		if ('calendarWeeks' in options) {
			this.calendarWeeks = options.calendarWeeks;
		} else if ('dateCalendarWeeks' in this.element.data()) {
			this.calendarWeeks = this.element.data('date-calendar-weeks');
		}
		if (this.calendarWeeks)
			this.picker.find('tfoot th.today')
						.attr('colspan', function(i, val){
							return parseInt(val) + 1;
						});

		this.weekStart = ((options.weekStart||this.element.data('date-weekstart')||dates[this.language].weekStart||0) % 7);
		this.weekEnd = ((this.weekStart + 6) % 7);
		this.startDate = -Infinity;
		this.endDate = Infinity;
		this.daysOfWeekDisabled = [];
		this.setStartDate(options.startDate||this.element.data('date-startdate'));
		this.setEndDate(options.endDate||this.element.data('date-enddate'));
		this.setDaysOfWeekDisabled(options.daysOfWeekDisabled||this.element.data('date-days-of-week-disabled'));
		this.fillDow();
		this.fillMonths();
		this.update();
		this.showMode();

		if(this.isInline) {
			this.show();
		}
	};

	Datepicker.prototype = {
		constructor: Datepicker,

		_events: [],
		_attachEvents: function(){
			this._detachEvents();
			if (this.isInput) { // single input
				this._events = [
					[this.element, {
						// focus: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this),
						click: $.proxy(this.show, this)
					}]
				];
			}
			else if (this.component && this.hasInput){ // component: input + button
				this._events = [
					// For components that are not readonly, allow keyboard nav
					[this.element.find('input'), {
						focus: $.proxy(this.show, this),
						keyup: $.proxy(this.update, this),
						keydown: $.proxy(this.keydown, this)
					}],
					[this.component, {
						click: $.proxy(this.show, this)
					}]
				];
			}
						else if (this.element.is('div')) {  // inline datepicker
							this.isInline = true;
						}
			else {
				this._events = [
					[this.element, {
						click: $.proxy(this.show, this)
					}]
				];
			}
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.on(ev);
			}
		},
		_detachEvents: function(){
			for (var i=0, el, ev; i<this._events.length; i++){
				el = this._events[i][0];
				ev = this._events[i][1];
				el.off(ev);
			}
			this._events = [];
		},

		show: function(e) {
			this.picker.show();
			this.height = this.component ? this.component.outerHeight() : this.element.outerHeight();
			this.update();
			this.place();
			$(window).on('resize', $.proxy(this.place, this));
			if (e ) {
				e.stopPropagation();
				e.preventDefault();
			}
			this.element.trigger({
				type: 'show',
				date: this.date
			});
		},

		hide: function(e){
			if(this.isInline) return;
			if (!this.picker.is(':visible')) return;
			this.picker.hide();
			$(window).off('resize', this.place);
			this.viewMode = this.startViewMode;
			this.showMode();
			if (!this.isInput) {
				$(document).off('mousedown', this.hide);
			}

			if (
				this.forceParse &&
				(
					this.isInput && this.element.val() ||
					this.hasInput && this.element.find('input').val()
				)
			)
				this.setValue();
			this.element.trigger({
				type: 'hide',
				date: this.date
			});
		},

		remove: function() {
			this._detachEvents();
			this.picker.remove();
			delete this.element.data().datepicker;
		},

		getDate: function() {
			var d = this.getUTCDate();
			return new Date(d.getTime() + (d.getTimezoneOffset()*60000));
		},

		getUTCDate: function() {
			return this.date;
		},

		setDate: function(d) {
			this.setUTCDate(new Date(d.getTime() - (d.getTimezoneOffset()*60000)));
		},

		setUTCDate: function(d) {
			this.date = d;
			this.setValue();
		},

		setValue: function() {
			var formatted = this.getFormattedDate();
			if (!this.isInput) {
				if (this.component){
					this.element.find('input').val(formatted);
				}
				this.element.data('date', formatted);
			} else {
				this.element.val(formatted);
			}
		},

		getFormattedDate: function(format) {
			if (format === undefined)
				format = this.format;
			return DPGlobal.formatDate(this.date, format, this.language);
		},

		setStartDate: function(startDate){
			this.startDate = startDate||-Infinity;
			if (this.startDate !== -Infinity) {
				this.startDate = DPGlobal.parseDate(this.startDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		setEndDate: function(endDate){
			this.endDate = endDate||Infinity;
			if (this.endDate !== Infinity) {
				this.endDate = DPGlobal.parseDate(this.endDate, this.format, this.language);
			}
			this.update();
			this.updateNavArrows();
		},

		setDaysOfWeekDisabled: function(daysOfWeekDisabled){
			this.daysOfWeekDisabled = daysOfWeekDisabled||[];
			if (!$.isArray(this.daysOfWeekDisabled)) {
				this.daysOfWeekDisabled = this.daysOfWeekDisabled.split(/,\s*/);
			}
			this.daysOfWeekDisabled = $.map(this.daysOfWeekDisabled, function (d) {
				return parseInt(d, 10);
			});
			this.update();
			this.updateNavArrows();
		},

		place: function(){
						if(this.isInline) return;
			var zIndex = parseInt(this.element.parents().filter(function() {
							return $(this).css('z-index') != 'auto';
						}).first().css('z-index'))+10;
			var offset = this.component ? this.component.offset() : this.element.offset();
			var height = this.component ? this.component.outerHeight(true) : this.element.outerHeight(true);
			this.picker.css({
				top: offset.top + height,
				left: offset.left,
				zIndex: zIndex
			});
		},

		update: function(){
			var date, fromArgs = false;
			if(arguments && arguments.length && (typeof arguments[0] === 'string' || arguments[0] instanceof Date)) {
				date = arguments[0];
				fromArgs = true;
			} else {
				date = this.isInput ? this.element.val() : this.element.data('date') || this.element.find('input').val();
			}

			this.date = DPGlobal.parseDate(date, this.format, this.language);

			if(fromArgs) this.setValue();

			if (this.date < this.startDate) {
				this.viewDate = new Date(this.startDate);
			} else if (this.date > this.endDate) {
				this.viewDate = new Date(this.endDate);
			} else {
				this.viewDate = new Date(this.date);
			}
			this.fill();
		},

		fillDow: function(){
			var dowCnt = this.weekStart,
			html = '<tr>';
			if(this.calendarWeeks){
				var cell = '<th class="cw">&nbsp;</th>';
				html += cell;
				this.picker.find('.datepicker-days thead tr:first-child').prepend(cell);
			}
			while (dowCnt < this.weekStart + 7) {
				html += '<th class="dow">'+dates[this.language].daysMin[(dowCnt++)%7]+'</th>';
			}
			html += '</tr>';
			this.picker.find('.datepicker-days thead').append(html);
		},

		fillMonths: function(){
			var html = '',
			i = 0;
			while (i < 12) {
				html += '<span class="month">'+dates[this.language].monthsShort[i++]+'</span>';
			}
			this.picker.find('.datepicker-months td').html(html);
		},

		fill: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth(),
				startYear = this.startDate !== -Infinity ? this.startDate.getUTCFullYear() : -Infinity,
				startMonth = this.startDate !== -Infinity ? this.startDate.getUTCMonth() : -Infinity,
				endYear = this.endDate !== Infinity ? this.endDate.getUTCFullYear() : Infinity,
				endMonth = this.endDate !== Infinity ? this.endDate.getUTCMonth() : Infinity,
				currentDate = this.date && this.date.valueOf(),
				today = new Date();
			this.picker.find('.datepicker-days thead th.switch')
						.text(dates[this.language].months[month]+' '+year);
			this.picker.find('tfoot th.today')
						.text(dates[this.language].today)
						.toggle(this.todayBtn !== false);
			this.updateNavArrows();
			this.fillMonths();
			var prevMonth = UTCDate(year, month-1, 28,0,0,0,0),
				day = DPGlobal.getDaysInMonth(prevMonth.getUTCFullYear(), prevMonth.getUTCMonth());
			prevMonth.setUTCDate(day);
			prevMonth.setUTCDate(day - (prevMonth.getUTCDay() - this.weekStart + 7)%7);
			var nextMonth = new Date(prevMonth);
			nextMonth.setUTCDate(nextMonth.getUTCDate() + 42);
			nextMonth = nextMonth.valueOf();
			var html = [];
			var clsName;
			while(prevMonth.valueOf() < nextMonth) {
				if (prevMonth.getUTCDay() == this.weekStart) {
					html.push('<tr>');
					if(this.calendarWeeks){
						// ISO 8601: First week contains first thursday.
						// ISO also states week starts on Monday, but we can be more abstract here.
						var
							// Start of current week: based on weekstart/current date
							ws = new Date(+prevMonth + (this.weekStart - prevMonth.getUTCDay() - 7) % 7 * 864e5),
							// Thursday of this week
							th = new Date(+ws + (7 + 4 - ws.getUTCDay()) % 7 * 864e5),
							// First Thursday of year, year from thursday
							yth = new Date(+(yth = UTCDate(th.getUTCFullYear(), 0, 1)) + (7 + 4 - yth.getUTCDay())%7*864e5),
							// Calendar week: ms between thursdays, div ms per day, div 7 days
							calWeek =  (th - yth) / 864e5 / 7 + 1;
						html.push('<td class="cw">'+ calWeek +'</td>');

					}
				}
				clsName = '';
				if (prevMonth.getUTCFullYear() < year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() < month)) {
					clsName += ' old';
				} else if (prevMonth.getUTCFullYear() > year || (prevMonth.getUTCFullYear() == year && prevMonth.getUTCMonth() > month)) {
					clsName += ' new';
				}
				// Compare internal UTC date with local today, not UTC today
				if (this.todayHighlight &&
					prevMonth.getUTCFullYear() == today.getFullYear() &&
					prevMonth.getUTCMonth() == today.getMonth() &&
					prevMonth.getUTCDate() == today.getDate()) {
					clsName += ' today';
				}
				if (currentDate && prevMonth.valueOf() == currentDate) {
					clsName += ' active';
				}
				if (prevMonth.valueOf() < this.startDate || prevMonth.valueOf() > this.endDate ||
					$.inArray(prevMonth.getUTCDay(), this.daysOfWeekDisabled) !== -1) {
					clsName += ' disabled';
				}
				html.push('<td class="day'+clsName+'">'+prevMonth.getUTCDate() + '</td>');
				if (prevMonth.getUTCDay() == this.weekEnd) {
					html.push('</tr>');
				}
				prevMonth.setUTCDate(prevMonth.getUTCDate()+1);
			}
			this.picker.find('.datepicker-days tbody').empty().append(html.join(''));
			var currentYear = this.date && this.date.getUTCFullYear();

			var months = this.picker.find('.datepicker-months')
						.find('th:eq(1)')
							.text(year)
							.end()
						.find('span').removeClass('active');
			if (currentYear && currentYear == year) {
				months.eq(this.date.getUTCMonth()).addClass('active');
			}
			if (year < startYear || year > endYear) {
				months.addClass('disabled');
			}
			if (year == startYear) {
				months.slice(0, startMonth).addClass('disabled');
			}
			if (year == endYear) {
				months.slice(endMonth+1).addClass('disabled');
			}

			html = '';
			year = parseInt(year/10, 10) * 10;
			var yearCont = this.picker.find('.datepicker-years')
								.find('th:eq(1)')
									.text(year + '-' + (year + 9))
									.end()
								.find('td');
			year -= 1;
			for (var i = -1; i < 11; i++) {
				html += '<span class="year'+(i == -1 || i == 10 ? ' old' : '')+(currentYear == year ? ' active' : '')+(year < startYear || year > endYear ? ' disabled' : '')+'">'+year+'</span>';
				year += 1;
			}
			yearCont.html(html);
		},

		updateNavArrows: function() {
			var d = new Date(this.viewDate),
				year = d.getUTCFullYear(),
				month = d.getUTCMonth();
			switch (this.viewMode) {
				case 0:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear() && month <= this.startDate.getUTCMonth()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear() && month >= this.endDate.getUTCMonth()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
				case 1:
				case 2:
					if (this.startDate !== -Infinity && year <= this.startDate.getUTCFullYear()) {
						this.picker.find('.prev').css({visibility: 'hidden'});
					} else {
						this.picker.find('.prev').css({visibility: 'visible'});
					}
					if (this.endDate !== Infinity && year >= this.endDate.getUTCFullYear()) {
						this.picker.find('.next').css({visibility: 'hidden'});
					} else {
						this.picker.find('.next').css({visibility: 'visible'});
					}
					break;
			}
		},

		click: function(e) {
			e.stopPropagation();
			e.preventDefault();
			var target = $(e.target).closest('span, td, th');
			if (target.length == 1) {
				switch(target[0].nodeName.toLowerCase()) {
					case 'th':
						switch(target[0].className) {
							case 'switch':
								this.showMode(1);
								break;
							case 'prev':
							case 'next':
								var dir = DPGlobal.modes[this.viewMode].navStep * (target[0].className == 'prev' ? -1 : 1);
								switch(this.viewMode){
									case 0:
										this.viewDate = this.moveMonth(this.viewDate, dir);
										break;
									case 1:
									case 2:
										this.viewDate = this.moveYear(this.viewDate, dir);
										break;
								}
								this.fill();
								break;
							case 'today':
								var date = new Date();
								date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

								this.showMode(-2);
								var which = this.todayBtn == 'linked' ? null : 'view';
								this._setDate(date, which);
								break;
						}
						break;
					case 'span':
						if (!target.is('.disabled')) {
							this.viewDate.setUTCDate(1);
							if (target.is('.month')) {
								var month = target.parent().find('span').index(target);
								this.viewDate.setUTCMonth(month);
								this.element.trigger({
									type: 'changeMonth',
									date: this.viewDate
								});
							} else {
								var year = parseInt(target.text(), 10)||0;
								this.viewDate.setUTCFullYear(year);
								this.element.trigger({
									type: 'changeYear',
									date: this.viewDate
								});
							}
							this.showMode(-1);
							this.fill();
						}
						break;
					case 'td':
						if (target.is('.day') && !target.is('.disabled')){
							var day = parseInt(target.text(), 10)||1;
							var year = this.viewDate.getUTCFullYear(),
								month = this.viewDate.getUTCMonth();
							if (target.is('.old')) {
								if (month === 0) {
									month = 11;
									year -= 1;
								} else {
									month -= 1;
								}
							} else if (target.is('.new')) {
								if (month == 11) {
									month = 0;
									year += 1;
								} else {
									month += 1;
								}
							}
							this._setDate(UTCDate(year, month, day,0,0,0,0));
						}
						break;
				}
			}
		},

		_setDate: function(date, which){
			if (!which || which == 'date')
				this.date = date;
			if (!which || which  == 'view')
				this.viewDate = date;
			this.fill();
			this.setValue();
			this.element.trigger({
				type: 'changeDate',
				date: this.date
			});
			var element;
			if (this.isInput) {
				element = this.element;
			} else if (this.component){
				element = this.element.find('input');
			}
			if (element) {
				element.change();
				if (this.autoclose && (!which || which == 'date')) {
					this.hide();
				}
			}
		},

		moveMonth: function(date, dir){
			if (!dir) return date;
			var new_date = new Date(date.valueOf()),
				day = new_date.getUTCDate(),
				month = new_date.getUTCMonth(),
				mag = Math.abs(dir),
				new_month, test;
			dir = dir > 0 ? 1 : -1;
			if (mag == 1){
				test = dir == -1
					// If going back one month, make sure month is not current month
					// (eg, Mar 31 -> Feb 31 == Feb 28, not Mar 02)
					? function(){ return new_date.getUTCMonth() == month; }
					// If going forward one month, make sure month is as expected
					// (eg, Jan 31 -> Feb 31 == Feb 28, not Mar 02)
					: function(){ return new_date.getUTCMonth() != new_month; };
				new_month = month + dir;
				new_date.setUTCMonth(new_month);
				// Dec -> Jan (12) or Jan -> Dec (-1) -- limit expected date to 0-11
				if (new_month < 0 || new_month > 11)
					new_month = (new_month + 12) % 12;
			} else {
				// For magnitudes >1, move one month at a time...
				for (var i=0; i<mag; i++)
					// ...which might decrease the day (eg, Jan 31 to Feb 28, etc)...
					new_date = this.moveMonth(new_date, dir);
				// ...then reset the day, keeping it in the new month
				new_month = new_date.getUTCMonth();
				new_date.setUTCDate(day);
				test = function(){ return new_month != new_date.getUTCMonth(); };
			}
			// Common date-resetting loop -- if date is beyond end of month, make it
			// end of month
			while (test()){
				new_date.setUTCDate(--day);
				new_date.setUTCMonth(new_month);
			}
			return new_date;
		},

		moveYear: function(date, dir){
			return this.moveMonth(date, dir*12);
		},

		dateWithinRange: function(date){
			return date >= this.startDate && date <= this.endDate;
		},

		keydown: function(e){
			if (this.picker.is(':not(:visible)')){
				if (e.keyCode == 27) // allow escape to hide and re-show picker
					this.show();
				return;
			}
			var dateChanged = false,
				dir, day, month,
				newDate, newViewDate;
			switch(e.keyCode){
				case 27: // escape
					this.hide();
					e.preventDefault();
					break;
				case 37: // left
				case 39: // right
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 37 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 38: // up
				case 40: // down
					if (!this.keyboardNavigation) break;
					dir = e.keyCode == 38 ? -1 : 1;
					if (e.ctrlKey){
						newDate = this.moveYear(this.date, dir);
						newViewDate = this.moveYear(this.viewDate, dir);
					} else if (e.shiftKey){
						newDate = this.moveMonth(this.date, dir);
						newViewDate = this.moveMonth(this.viewDate, dir);
					} else {
						newDate = new Date(this.date);
						newDate.setUTCDate(this.date.getUTCDate() + dir * 7);
						newViewDate = new Date(this.viewDate);
						newViewDate.setUTCDate(this.viewDate.getUTCDate() + dir * 7);
					}
					if (this.dateWithinRange(newDate)){
						this.date = newDate;
						this.viewDate = newViewDate;
						this.setValue();
						this.update();
						e.preventDefault();
						dateChanged = true;
					}
					break;
				case 13: // enter
					this.hide();
					e.preventDefault();
					break;
				case 9: // tab
					this.hide();
					break;
			}
			if (dateChanged){
				this.element.trigger({
					type: 'changeDate',
					date: this.date
				});
				var element;
				if (this.isInput) {
					element = this.element;
				} else if (this.component){
					element = this.element.find('input');
				}
				if (element) {
					element.change();
				}
			}
		},

		showMode: function(dir) {
			if (dir) {
				this.viewMode = Math.max(0, Math.min(2, this.viewMode + dir));
			}
			/*
				vitalets: fixing bug of very special conditions:
				jquery 1.7.1 + webkit + show inline datepicker in bootstrap popover.
				Method show() does not set display css correctly and datepicker is not shown.
				Changed to .css('display', 'block') solve the problem.
				See https://github.com/vitalets/x-editable/issues/37

				In jquery 1.7.2+ everything works fine.
			*/
			//this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).show();
			this.picker.find('>div').hide().filter('.datepicker-'+DPGlobal.modes[this.viewMode].clsName).css('display', 'block');
			this.updateNavArrows();
		}
	};

	$.fn.datepicker = function ( option ) {
		var args = Array.apply(null, arguments);
		args.shift();
		return this.each(function () {
			var $this = $(this),
				data = $this.data('datepicker'),
				options = typeof option == 'object' && option;
			if (!data) {
				$this.data('datepicker', (data = new Datepicker(this, $.extend({}, $.fn.datepicker.defaults,options))));
			}
			if (typeof option == 'string' && typeof data[option] == 'function') {
				data[option].apply(data, args);
			}
		});
	};

	$.fn.datepicker.defaults = {
	};
	$.fn.datepicker.Constructor = Datepicker;
	var dates = $.fn.datepicker.dates = {
		en: {
			days: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		    daysShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		    daysMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
		    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		    today: "Today"
		}
	};

	var DPGlobal = {
		modes: [
			{
				clsName: 'days',
				navFnc: 'Month',
				navStep: 1
			},
			{
				clsName: 'months',
				navFnc: 'FullYear',
				navStep: 1
			},
			{
				clsName: 'years',
				navFnc: 'FullYear',
				navStep: 10
		}],
		isLeapYear: function (year) {
			return (((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0));
		},
		getDaysInMonth: function (year, month) {
			return [31, (DPGlobal.isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
		},
		validParts: /dd?|DD?|mm?|MM?|yy(?:yy)?/g,
		nonpunctuation: /[^ -\/:-@\[\u3400-\u9fff-`{-~\t\n\r]+/g,
		parseFormat: function(format){
			// IE treats \0 as a string end in inputs (truncating the value),
			// so it's a bad format delimiter, anyway
			var separators = format.replace(this.validParts, '\0').split('\0'),
				parts = format.match(this.validParts);
			if (!separators || !separators.length || !parts || parts.length === 0){
				throw new Error("Invalid date format.");
			}
			return {separators: separators, parts: parts};
		},
		parseDate: function(date, format, language) {
			if (date instanceof Date) return date;
			if (/^[\-+]\d+[dmwy]([\s,]+[\-+]\d+[dmwy])*$/.test(date)) {
				var part_re = /([\-+]\d+)([dmwy])/,
					parts = date.match(/([\-+]\d+)([dmwy])/g),
					part, dir;
				date = new Date();
				for (var i=0; i<parts.length; i++) {
					part = part_re.exec(parts[i]);
					dir = parseInt(part[1]);
					switch(part[2]){
						case 'd':
							date.setUTCDate(date.getUTCDate() + dir);
							break;
						case 'm':
							date = Datepicker.prototype.moveMonth.call(Datepicker.prototype, date, dir);
							break;
						case 'w':
							date.setUTCDate(date.getUTCDate() + dir * 7);
							break;
						case 'y':
							date = Datepicker.prototype.moveYear.call(Datepicker.prototype, date, dir);
							break;
					}
				}
				return UTCDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0);
			}
			var parts = date && date.match(this.nonpunctuation) || [],
				date = new Date(),
				parsed = {},
				setters_order = ['yyyy', 'yy', 'M', 'MM', 'm', 'mm', 'd', 'dd'],
				setters_map = {
					yyyy: function(d,v){ return d.setUTCFullYear(v); },
					yy: function(d,v){ return d.setUTCFullYear(2000+v); },
					m: function(d,v){
						v -= 1;
						while (v<0) v += 12;
						v %= 12;
						d.setUTCMonth(v);
						while (d.getUTCMonth() != v)
							d.setUTCDate(d.getUTCDate()-1);
						return d;
					},
					d: function(d,v){ return d.setUTCDate(v); }
				},
				val, filtered, part;
			setters_map['M'] = setters_map['MM'] = setters_map['mm'] = setters_map['m'];
			setters_map['dd'] = setters_map['d'];
			date = UTCDate(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);
			var fparts = format.parts.slice();
			// Remove noop parts
			if (parts.length != fparts.length) {
				fparts = $(fparts).filter(function(i,p){
					return $.inArray(p, setters_order) !== -1;
				}).toArray();
			}
			// Process remainder
			if (parts.length == fparts.length) {
				for (var i=0, cnt = fparts.length; i < cnt; i++) {
					val = parseInt(parts[i], 10);
					part = fparts[i];
					if (isNaN(val)) {
						switch(part) {
							case 'MM':
								filtered = $(dates[language].months).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].months) + 1;
								break;
							case 'M':
								filtered = $(dates[language].monthsShort).filter(function(){
									var m = this.slice(0, parts[i].length),
										p = parts[i].slice(0, m.length);
									return m == p;
								});
								val = $.inArray(filtered[0], dates[language].monthsShort) + 1;
								break;
						}
					}
					parsed[part] = val;
				}
				for (var i=0, s; i<setters_order.length; i++){
					s = setters_order[i];
					if (s in parsed && !isNaN(parsed[s]))
						setters_map[s](date, parsed[s]);
				}
			}
			return date;
		},
		formatDate: function(date, format, language){
			var val = {
				d: date.getUTCDate(),
				D: dates[language].daysShort[date.getUTCDay()],
				DD: dates[language].days[date.getUTCDay()],
				m: date.getUTCMonth() + 1,
				M: dates[language].monthsShort[date.getUTCMonth()],
				MM: dates[language].months[date.getUTCMonth()],
				yy: date.getUTCFullYear().toString().substring(2),
				yyyy: date.getUTCFullYear()
			};
			val.dd = (val.d < 10 ? '0' : '') + val.d;
			val.mm = (val.m < 10 ? '0' : '') + val.m;
			var date = [],
				seps = $.extend([], format.separators);
			for (var i=0, cnt = format.parts.length; i < cnt; i++) {
				if (seps.length)
					date.push(seps.shift());
				date.push(val[format.parts[i]]);
			}
			return date.join('');
		},
		headTemplate: '<thead>'+
							'<tr>'+
								'<th class="prev"><i class="fa fa-arrow-left"/></th>'+
								'<th colspan="5" class="switch"></th>'+
								'<th class="next"><i class="fa fa-arrow-right"/></th>'+
							'</tr>'+
						'</thead>',
		contTemplate: '<tbody><tr><td colspan="7"></td></tr></tbody>',
		footTemplate: '<tfoot><tr><th colspan="7" class="today"></th></tr></tfoot>'
	};
	DPGlobal.template = '<div class="datepicker">'+
							'<div class="datepicker-days">'+
								'<table class=" table-condensed">'+
									DPGlobal.headTemplate+
									'<tbody></tbody>'+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-months">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
							'<div class="datepicker-years">'+
								'<table class="table-condensed">'+
									DPGlobal.headTemplate+
									DPGlobal.contTemplate+
									DPGlobal.footTemplate+
								'</table>'+
							'</div>'+
						'</div>';

	$.fn.datepicker.DPGlobal = DPGlobal;

}( window.jQuery );

(function(root, factory) {
    if(typeof exports === 'object') {
        module.exports = factory(require('moment'));
    }
    else if(typeof define === 'function' && define.amd) {
        define('moment-range', ['moment'], factory);
    }
    else {
        root.moment = factory(root.moment);
    }
}(this, function(moment) {
    var DateRange, INTERVALS;

    INTERVALS = {
        year: true,
        month: true,
        week: true,
        day: true,
        hour: true,
        minute: true,
        second: true
    };

    /**
     * DateRange class to store ranges and query dates.
     * @typedef {!Object}
     *
     */


    DateRange = (function() {
        /**
         * DateRange instance.
         * @param {(Moment|Date)} start Start of interval.
         * @param {(Moment|Date)} end   End of interval.
         * @constructor
         *
         */

        function DateRange(start, end) {
            this.start = moment(start);
            this.end = moment(end);
        }

        /**
         * Determine if the current interval contains a given moment/date/range.
         * @param {(Moment|Date|DateRange)} other Date to check.
         * @return {!boolean}
         *
         */


        DateRange.prototype.contains = function(other) {
            if (other instanceof DateRange) {
                return this.start <= other.start && this.end >= other.end;
            } else {
                return (this.start <= other && other <= this.end);
            }
        };

        /**
         * @private
         *
         */


        DateRange.prototype._by_string = function(interval, hollaback) {
            var current, _results;
            current = moment(this.start);
            _results = [];
            while (this.contains(current)) {
                hollaback.call(this, current.clone());
                _results.push(current.add(interval, 1));
            }
            return _results;
        };

        /**
         * @private
         *
         */


        DateRange.prototype._by_range = function(range_interval, hollaback) {
            var i, l, _i, _results;
            l = Math.round(this / range_interval);
            if (l === Infinity) {
                return this;
            }
            _results = [];
            for (i = _i = 0; 0 <= l ? _i <= l : _i >= l; i = 0 <= l ? ++_i : --_i) {
                _results.push(hollaback.call(this, moment(this.start.valueOf() + range_interval.valueOf() * i)));
            }
            return _results;
        };

        /**
         * Determine if the current date range overlaps a given date range.
         * @param {!DateRange} range Date range to check.
         * @return {!boolean}
         *
         */


        DateRange.prototype.overlaps = function(range) {
            return this.intersect(range) !== null;
        };

        /**
         * Determine the intersecting periods from one or more date ranges.
         * @param {!DateRange} other A date range to intersect with this one.
         * @return {!DateRange|null}
         *
         */


        DateRange.prototype.intersect = function(other) {
            var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            if (((this.start <= (_ref1 = other.start) && _ref1 < (_ref = this.end)) && _ref < other.end)) {
                return new DateRange(other.start, this.end);
            } else if (((other.start < (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 <= this.end)) {
                return new DateRange(this.start, other.end);
            } else if (((other.start < (_ref5 = this.start) && _ref5 < (_ref4 = this.end)) && _ref4 < other.end)) {
                return this;
            } else if (((this.start <= (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 <= this.end)) {
                return other;
            } else {
                return null;
            }
        };

        /**
         * Subtract one range from another.
         * @param {!DateRange} other A date range to substract from this one.
         * @return {!DateRange[]}
         *
         */


        DateRange.prototype.subtract = function(other) {
            var _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7;
            if (this.intersect(other) === null) {
                return [this];
            } else if (((other.start <= (_ref1 = this.start) && _ref1 < (_ref = this.end)) && _ref <= other.end)) {
                return [];
            } else if (((other.start <= (_ref3 = this.start) && _ref3 < (_ref2 = other.end)) && _ref2 < this.end)) {
                return [new DateRange(other.end, this.end)];
            } else if (((this.start < (_ref5 = other.start) && _ref5 < (_ref4 = this.end)) && _ref4 <= other.end)) {
                return [new DateRange(this.start, other.start)];
            } else if (((this.start < (_ref7 = other.start) && _ref7 < (_ref6 = other.end)) && _ref6 < this.end)) {
                return [new DateRange(this.start, other.start), new DateRange(other.end, this.end)];
            }
        };

        /**
         * Iterate over the date range by a given date range, executing a function
         * for each sub-range.
         * @param {!DateRange|String} range     Date range to be used for iteration
         *                                      or shorthand string (shorthands:
         *                                      http://momentjs.com/docs/#/manipulating/add/)
         * @param {!function(Moment)} hollaback Function to execute for each sub-range.
         * @return {!boolean}
         *
         */


        DateRange.prototype.by = function(range, hollaback) {
            if (typeof range === 'string') {
                this._by_string(range, hollaback);
            } else {
                this._by_range(range, hollaback);
            }
            return this;
        };

        /**
         * Date range in milliseconds. Allows basic coercion math of date ranges.
         * @return {!number}
         *
         */


        DateRange.prototype.valueOf = function() {
            return this.end - this.start;
        };

        /**
         * Date range toDate
         * @return  {!Array}
         *
         */


        DateRange.prototype.toDate = function() {
            return [this.start.toDate(), this.end.toDate()];
        };

        /**
         * Determine if this date range is the same as another.
         * @param {!DateRange} other Another date range to compare to.
         * @return {!boolean}
         *
         */


        DateRange.prototype.isSame = function(other) {
            return this.start.isSame(other.start) && this.end.isSame(other.end);
        };

        /**
         * Return the difference of the end vs start.
         *   - To get the difference in milliseconds, use range#diff
         *   - To get the difference in another unit of measurement, pass that measurement as the second argument.
         * @return milliseconds if no measure is passed in, otherwise an increment of measure
         *
         */


        DateRange.prototype.diff = function(unit) {
            if (unit == null) {
                unit = void 0;
            }
            return this.end.diff(this.start, unit);
        };

        /**
         * Clones the current DateRange
         * @returns {DateRange}
         */
        DateRange.prototype.clone = function() {
            return new DateRange(this.start.clone(), this.end.clone());
        };

        return DateRange;

    })();

    /**
     * Build a date range.
     * @param {(Moment|Date)} start Start of range.
     * @param {(Moment|Date)} end   End of range.
     * @this {Moment}
     * @return {!DateRange}
     *
     */


    moment.fn.range = function(start, end) {
        if (start in INTERVALS) {
            return new DateRange(moment(this).startOf(start), moment(this).endOf(start));
        } else {
            return new DateRange(start, end);
        }
    };

    /**
     * Build a date range.
     * @param {(Moment|Date)} start Start of range.
     * @param {(Moment|Date)} end   End of range.
     * @this {Moment}
     * @return {!DateRange}
     *
     */


    moment.range = function(start, end) {
        return new DateRange(start, end);
    };

    /**
     * Check if the current moment is within a given date range.
     * @param {!DateRange} range Date range to check.
     * @this {Moment}
     * @return {!boolean}
     *
     */


    moment.fn.within = function(range) {
        return range.contains(this._d);
    };

    return moment;
}));
function EditRosterViewModel() {
    //Data
    var self = this;

    self.selected_team = ko.observable(1);

    self.number_of_days = ko.observable(7);

    self.roster_requested = ko.observable(false);

    self.teams  = ko.observableArray([]);

    self.roster = ko.observable();

    self.team_members = ko.observableArray([]);

    self.roster_found = ko.observable(false);

    self.curr_date = ko.observable(moment().format('YYYY-MM-DD'));

    self.saved = ko.observable(true);

    self.published = ko.observable(false);

    self.saveText = ko.observable("Save Draft");

    self.is_saved = function (bool) {
        self.saved(bool);
    }.bind(self);

    self.roster_dates = function(offset) {
        return moment(self.curr_date(), 'YYYY-MM-DD').isoWeekday(offset).format('ddd, Do MMM');
    }.bind(self);

    self.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.team_members(), function(key, val) {
                    total += val().total_hours();
            });
            return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
        },
        owner: this
    });

    self.total_cost = ko.computed({
        read: function () {
            var total = 0;
            $.each(self.team_members(), function(key, val) {
                total += val().employee_cost();
            });
            return Math.round(total*Math.pow(10,0))/Math.pow(10,0);
        },
        owner: this
    });

    self.daily_hours = function(offset) {
        var total = 0;
        $.each(self.team_members(), function(key, val) {
            if(typeof val().shifts()[offset] !== undefined) {
                (val().shifts()[offset].shift_length() < 5) ? total += Number(val().shifts()[offset].shift_length()) : total += (Number(val().shifts()[offset].shift_length()) - 0.5);
            }
        });
        return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
    }.bind(self);

    self.daily_cost = function(offset) {
        var total = 0;
        $.each(self.team_members(), function(key, val) {
            if(typeof val().shifts()[offset] !== undefined) {

                (val().shifts()[offset].shift_length() < 5) ? total += val().shifts()[offset].shift_length()*val().pay_rate() : total += (val().shifts()[offset].shift_length() - 0.5)*val().pay_rate();
            }
        });
        if(offset == 5) {
            total*=1.25;
        }else if(offset == 6) {
            total*=1.5;
        }
        return Math.round(total*Math.pow(10,0))/Math.pow(10,0);
    }.bind(self);

    self.isPublished = ko.computed(function() {
            if(self.roster_found() == true) {
                if(self.roster().roster_stage() == "released") {
                    self.published(true);
                    self.saveText("Save Changes");
                }
            } else {
                self.published(false);
                self.saveText("Save Draft");
            }
        }
        , this
    );

    self.prevWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(-1, 'w').format("YYYY-MM-DD"));
        self.selectRoster();
    };

    self.nextWeek = function() {
        self.curr_date(moment(self.curr_date(), "YYYY-MM-DD").add(1, 'w').format("YYYY-MM-DD"));
        self.selectRoster();
    };

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.back_modal = {
        show: ko.observable(false), /* Set to true to show initially */
        onClose: function() {}
    };

    self.showBackModal = function() {
        self.back_modal.show(true);
    };

    self.showErrorModal = function(error_message, error_code) {
        self.error_modal.show(true);
        self.error_modal.error_message(error_message);
        self.error_modal.error_code(error_code);

        if(error_code < 500) {
            self.error_modal.header("Notice");
            self.error_modal.body("Please Note:");
        } else if(error_code < 1000) {
            self.error_modal.header("Warning");
            self.error_modal.body("Warning:");
        } else if(error_code < 1500) {
            self.error_modal.header("Error");
            self.error_modal.body("The application has encountered an error:");
        } else {
            self.error_modal.header("Fatal Error");
            self.error_modal.body("The application has encountered a fatal error:");
        }
    };

    //Sending/Receiving Data
    $.getJSON("team/available-teams", function(allData) {
        var mappedTeams = $.map(allData, function(val, key) { return new Team(val, key)});
        self.teams(mappedTeams);

        if($.urlParam('date') != null && $.urlParam('team_id') != null) {
            if(moment($.urlParam('date'), 'YYYY-MM-DD').isValid()) {
                $.each(self.teams(), function(key, val) {
                    if(val.team_id() === $.urlParam('team_id')) {
                        self.curr_date($.urlParam('date'));
                        self.selected_team(val);
                        self.getRoster();
                        return false;
                    }
                });
            }
        }
    });

    self.selectRoster = function() {
        if(self.saved() == false) {
            self.showBackModal();
        } else {
            self.roster_found(false);
            self.team_members.removeAll();
            self.getRoster();
        }
    };

    self.getRoster = function() {
        self.roster_requested(true);
        var data = { team_id: self.selected_team().team_id(), date: $('#roster_date').val() };
        self.team_members.removeAll();

        $.getJSON("roster/roster", data, function(allData) {
            if(allData['result'] == 0) {
                self.team_members.removeAll();
                self.roster(new Roster(allData.data.roster));
                self.roster_found(true);

                $.each(allData.data.team_members, function(user_key, user_value) {
                    var shifts = [];

                    $.each(allData.data.shifts, function(shift_key, shift_value) {
                        if(shift_value.user_id == user_value.id) {
                            shifts[shift_key] = shift_value;
                        }
                    });

                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster(), allData.data.organisation_open_hours)));
                });
                history.pushState({}, null, "edit_roster?team_id=" + self.selected_team().team_id() + "&date=" + $('#roster_date').val());
            } else if(allData['result'] == 520) {
                $.each(allData.data.team_members, function(user_key, user_value) {
                    var shifts = [];
                    self.team_members.push(ko.observable(new Employee(user_value, shifts, self.roster())));
                });

            } else {
                self.showErrorModal(allData['message'], allData['result']);
            }
            self.saved(true);
            self.roster_requested(false);
        });
    };

    self.saveRoster = function() {

        var jsonData = ko.toJSON(self);
        $.post(
            "roster/roster",
            {data: jsonData},
            function(returnedData) {
                if(returnedData.result == 0) {
                    self.is_saved(true);
                    self.team_members.removeAll();
                    self.getRoster();
                } else {
                    self.showErrorModal(returnedData['result'], returnedData['message']);
                }
        });
    };

    self.publishRoster = function() {
        var r = confirm("Are you sure you want to publish?");

        if(r == true) {
            self.roster().roster_stage("released");
            self.saveRoster();
        }

    };
}

function Team(val, key) {
    this.team_id = ko.observable(key);
    this.team_name = ko.observable(val);
}

function Roster(roster) {
    this.id = ko.observable(roster.id);
    this.date_start = ko.observable(roster.date_start);
    this.date_ending = ko.observable(roster.date_ending);
    this.roster_stage = ko.observable(roster.roster_stage);
}

function Employee(user, json_shifts, roster, opening_hours) {
    this.user_id = ko.observable(user.id);
    this.first_name = ko.observable(user.first_name);
    this.last_name = ko.observable(user.last_name);
    this.full_name = ko.observable(this.first_name() + " " + this.last_name());
    this.email = ko.observable(user.email);
    this.availabilities = ko.observableArray([new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability(), new Availability()]);
    this.shifts = ko.observableArray([new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this), new Shift(this)]);
    this.gravatar_address = ko.observable('//www.gravatar.com/avatar/' + md5(this.email()) + '?s=30&d=retro');

    if(user.payrate.length != 0){
        this.pay_rate = ko.observable(Math.round(user.payrate[0].pay_rate*100)/100);
    } else {
        this.pay_rate = ko.observable(0);
    }

    var parent = this;

    this.total_hours = ko.computed({
        read: function () {
            var total = 0;
            $.each(this.shifts(), function(key, val) {
                if(val.shift_length() >= 5) {
                    total += val.shift_length() - 0.5;
                } else if (val.shift_length() != "") {
                    total += val.shift_length();
                }
            });
            return Math.round(total*Math.pow(10,2))/Math.pow(10,2);
        },
        owner: this
    });

    this.employee_cost = ko.computed({
        read: function () {
            var saturday = 0.25*this.shifts()[5].shift_length()*this.pay_rate();
            var sunday = 0.5*this.shifts()[6].shift_length()*this.pay_rate();
            return Math.round((this.total_hours()*this.pay_rate()+saturday+sunday)*Math.pow(10,0))/Math.pow(10,0);
        }, owner: this
    });

    $.each(this.shifts(), function(key, val) {
        val.setDateFromArray(key+1, roster);
    });

    $.each(this.availabilities(), function(key, val) {
        val.setDateFromArray(key+1, roster);

        $.each(user.availgeneral, function(k,v) {
            if(v.day == val.weekday()) {
                val.general_start_time(moment(val.date().format("YYYY-MM-DD") + " " + v.start_time, "YYYY-MM-DD HH:mm:ss"));
                val.general_end_time(moment(val.date().format("YYYY-MM-DD") + " " + v.end_time, "YYYY-MM-DD HH:mm:ss"));
            }
        });
        $.each(opening_hours, function(k, v) {
            if(v.day == val.weekday()) {
                val.open_time(moment(val.date().format("YYYY-MM-DD") + " " + v.start_time, "YYYY-MM-DD HH:mm:ss"));
                val.close_time(moment(val.date().format("YYYY-MM-DD") + " " + v.end_time, "YYYY-MM-DD HH:mm:ss"));
            }
        });
    });

    $.each(user.availspecific, function(key, val) {
        if(val.all_day == true){
            var leave_dates = moment().range(moment(val.start_date, "YYYY-MM-DD"),moment(val.end_date, "YYYY-MM-DD"));

            $.each(parent.availabilities(), function(k, v) {
                if(v.date().within(leave_dates)) {
                    v.leave_all_day(true);
                }
            });
        } else {
            var avail = parent.availabilities()[moment(val.start_date, "YYYY-MM-DD").format("E")-1];
            avail.times.push(moment(avail.date()).range(moment(avail.date().format("YYYY-MM-DD") + "" + val.start_time, "YYYY-MM-DD HH:mm:ss"), moment(avail.date().format("YYYY-MM-DD") + "" + val.end_time, "YYYY-MM-DD HH:mm:ss")));
        }
    });

    $.each(json_shifts, function(key, val) {
        if(typeof val !== 'undefined'){
            parent.shifts()[moment(val.rostered_start_time).isoWeekday()-1].addShift(val);
        }
    });

}

Employee.prototype.toJSON = function() {
    return { user_id: this.user_id, first_name: this.first_name, last_name: this.last_name, email: this.email, shifts: this.shifts};
};

function Shift(parent_user) {
    this.shift_id = ko.observable("");
    this.roster_id = ko.observable("");
    this.date = ko.observable("");
    this.rostered_start_time = ko.observable("");
    this.rostered_end_time = ko.observable("");
    this.notes = ko.observable("");
    this.parent_user = parent_user;

    this.end_focused = ko.observable(false);
    this.start_focused = ko.observable(false);

    this.focus_left = function() {this.end_focused(true); this.start_focused(true);};
    this.focus_right = function() {this.start_focused(true); this.end_focused(true);};

    this.tabFocus = function(data, event, $root, $parentContext, $index) {
        var key = event.keyCode || event.which;

        if(key == 9 && !event.shiftKey) {
            if($index() != this.parent_user.shifts().length-1) {
                this.parent_user.shifts()[$index()+1].focus_left();
            } else if($parentContext.$index() != $root.team_members().length-1) {
                $root.team_members()[$parentContext.$index()+1]().shifts()[0].focus_left();
            }
            return false;
        } else if(key == 9 && event.shiftKey) {
            this.focus_left();
            return false;
        } else {
            return true;
        }
    };

    this.tabFocusBack = function(data, event, $root, $parentContext, $index) {
        var key = event.keyCode || event.which;

        if(key == 9 && event.shiftKey) {

            if($index() != 0) {
                this.parent_user.shifts()[$index()-1].focus_right();
            } else if($parentContext.$index() != 0) {
                $root.team_members()[$parentContext.$index()-1]().shifts()[6].focus_right();
            }
            return false;
        } else {
            return true;
        }
    };

    this.error_status = ko.observable("");

    this.start_time_forJSON = ko.computed({
        read: function() {
            return moment(this.rostered_start_time()).format('YYYY-MM-DD H:mm:ss');
        },
        owner: this
    });
    this.end_time_forJSON = ko.computed({
        read: function() {
            return moment(this.rostered_end_time()).format('YYYY-MM-DD H:mm:ss');
        },
        owner: this
    });

    this.shift_length = ko.computed({
        read: function () {
            if(this.rostered_start_time() == "" || this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time(), 'YYYY-MM-DD HH:mm:ss').diff(moment(this.rostered_start_time(), 'YYYY-MM-DD HH:mm:ss'), 'hours', true);
            }
        },
        owner: this
    });

    this.formatted_start_time = ko.computed({
        read: function () {
            if(this.rostered_start_time() == "") {
                return "";
            } else {
                return moment(this.rostered_start_time()).format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.rostered_start_time("");
                parent.error_status("");
            } else {
                var new_start_time = moment(parent.date() + " " + value, 'YYYY-MM-DD H:mm');
                var rostered_end_time = moment(parent.rostered_end_time(), 'YYYY-MM-DD HH:mm:ss');

                if(!new_start_time.isValid()) {
                    parent.rostered_start_time.notifySubscribers();
                } else if (new_start_time.diff(rostered_end_time) >= 0 && parent.rostered_end_time() != "") {
                    parent.rostered_start_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    if(parent.rostered_end_time() != ""){
                        var avails = parent.parent_user.availabilities()[moment(parent.date(), "YYYY-MM-DD").format("E")-1];
                        if(new_start_time.diff(avails.open_time()) >= 0 && rostered_end_time.diff(avails.close_time()) <= 0) {
                            if(new_start_time.diff(avails.general_start_time()) >= 0 && rostered_end_time.diff(avails.general_end_time()) <= 0) {
                                var error = false;
                                $.each(avails.times(), function(key, val) {
                                    if(moment().range(new_start_time, rostered_end_time).overlaps(val)) {
                                        error = true;
                                    }
                                });
                                if(error == true) {
                                    parent.error_status('has-error');
                                    parent.rostered_start_time(new_start_time);
                                    alert("Rostered times fall within approved leave");
                                } else {
                                    parent.error_status("");
                                    parent.rostered_start_time(new_start_time);
                                }
                            } else {
                                parent.error_status('has-error');
                                parent.rostered_start_time(new_start_time);
                                alert("Rostered times fall outside of employee availabilities");
                            }
                        } else {
                            parent.error_status('has-error');
                            parent.rostered_start_time(new_start_time);
                            alert("Rostered times fall outside of business hours");
                        }
                    } else {
                        parent.error_status("");
                        parent.rostered_start_time(new_start_time);
                    }
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });

    this.formatted_end_time = ko.computed({
        read: function () {
            if(this.rostered_end_time() == "") {
                return "";
            } else {
                return moment(this.rostered_end_time()).format('H:mm');
            }
        },
        write: function (value) {
            var parent = this;
            if(value == "") {
                parent.rostered_end_time("");
                parent.error_status("");
            } else {
                var new_end_time = moment(parent.date() + " " + value, 'YYYY-MM-DD H:mm');
                var rostered_start_time = moment(parent.rostered_start_time(), 'YYYY-MM-DD HH:mm:ss');

                if(!new_end_time.isValid()) {
                    parent.rostered_end_time.notifySubscribers();
                } else if (new_end_time.diff(rostered_start_time) <= 0 && parent.rostered_start_time() != "") {
                    parent.rostered_end_time.notifySubscribers();
                    alert("Shift start is after shift ending");
                } else {
                    if(parent.rostered_start_time() != ""){
                        var avails = parent.parent_user.availabilities()[moment(parent.date(), "YYYY-MM-DD").format("E")-1];
                        if(rostered_start_time.diff(avails.open_time()) >= 0 && new_end_time.diff(avails.close_time()) <= 0) {
                            if(rostered_start_time.diff(avails.general_start_time()) >= 0 && new_end_time.diff(avails.general_end_time()) <= 0) {
                                var error = false;
                                $.each(avails.times(), function(key, val) {
                                    if(moment().range(rostered_start_time, new_end_time).overlaps(val)) {
                                        error = true;
                                    }
                                });
                                if(error == true) {
                                    parent.error_status("has-error");
                                    parent.rostered_end_time(new_end_time);
                                    alert("Rostered times fall within approved leave");
                                } else {
                                    parent.error_status("");
                                    parent.rostered_end_time(new_end_time);
                                }
                            } else {
                                parent.error_status("has-error");
                                parent.rostered_end_time(new_end_time);
                                alert("Rostered times fall outside of employee availabilities");
                                return;
                            }
                        } else {
                            parent.error_status('has-error');
                            parent.rostered_end_time(new_end_time);
                            alert("Rostered times fall outside of business hours");
                        }
                    } else {
                        parent.error_status("");
                        parent.rostered_end_time(new_end_time);
                    }
                }
            }
        },
        owner: this
    }).extend({ notify: 'always' });
    return this;
}

Shift.prototype.toJSON = function() {
    if(this.shift_id == "" && this.rostered_start_time == "" && this.rostered_end_time  == "") {
        return;
    } else if(this.rostered_start_time == "" && this.rostered_end_time  == "") {
        return {shift_id: this.shift_id, destroy: true};
    } else {
        return {shift_id: this.shift_id, roster_id: this.roster_id, date: this.date, rostered_start_time: this.start_time_forJSON, rostered_end_time: this.end_time_forJSON, notes: this.notes};
    }
};

Shift.prototype.addShift = function(shift) {
    this.shift_id(shift.id);
    this.roster_id(shift.roster_id);
    this.date = ko.observable(shift.date);
    this.rostered_start_time(shift.rostered_start_time);
    this.rostered_end_time(shift.rostered_end_time);
    this.notes(shift.notes);

};

Shift.prototype.setDateFromArray = function(offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('YYYY-MM-DD'));
    this.availabilities = this.parent_user.availabilities()[moment(this.date(), "YYYY-MM-DD").format("E")-1];
};

function Availability() {
    this.leave_all_day = ko.observable(false);
    this.date = ko.observable("");
    this.weekday = ko.observable("");
    this.general_start_time = ko.observable("");
    this.general_end_time = ko.observable("");
    this.open_time = ko.observable("");
    this.close_time = ko.observable("");
    this.times = ko.observableArray([]);

    this.formatted_leave_times = ko.computed(
        function() {
            var string = "";
            $.each(this.times(), function(key, val) {
                string += "<p>" + val.start.format('H:mm') + "-" + val.end.format('H:mm') + "</p>";
            });
            if(string !== ""){
                return "<p>User has leave at:</p>" + string;
            } else {
                return string;
            }
        }, this);
}

Availability.prototype.setDateFromArray = function(offset, roster) {
    this.date(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset));
    this.weekday(moment(roster.date_start(), 'YYYY-MM-DD').isoWeekday(offset).format('dddd'));
    this.general_start_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "00:00:00", "YYYY-MM-DD HH:mm:ss"));
    this.general_end_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "23:59:59", "YYYY-MM-DD HH:mm:ss"));
    this.open_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "00:00:00", "YYYY-MM-DD HH:mm:ss"));
    this.close_time = ko.observable(moment(this.date().format("YYYY-MM-DD") + " " + "23:59:59", "YYYY-MM-DD HH:mm:ss"));

    this.formatted_open_times = ko.computed(
        function() {
            var times = moment(this.open_time()).format("H:mm") + "-" + moment(this.close_time()).format("H:mm");
            if(times == "0:00-23:59") {
                return "All Day";
            } else {
                return times;
            }
        }, this);
    this.formatted_general_avail_times = ko.computed(
        function() {
            var times = moment(this.general_start_time()).format("H:mm") + "-" + moment(this.general_end_time()).format("H:mm");
            if(times == "0:00-23:59") {
                return "All Day";
            } else {
                return times;
            }
        },this);



};

/* Custom binding for making back modal */
ko.bindingHandlers.backModal = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var props = valueAccessor(),
            vm = bindingContext.createChildContext(viewModel);
        ko.utils.extend(vm, props);
        vm.close = function() {
            vm.show(false);
            vm.onClose();
        };
        vm.backSave = function() {
            vm.show(false);
            viewModel.saveRoster();
            vm.onClose();
        };
        vm.backNotSave = function() {
            vm.show(false);
            viewModel.roster_found(false);
            viewModel.team_members.removeAll();
            viewModel.getRoster();
            vm.onClose();
        };
        ko.utils.toggleDomNodeCssClass(element, "modal fade", true);
        ko.renderTemplate("backModal", vm, null, element);
        var showHide = ko.computed(function() {
            $(element).modal(vm.show() ? 'show' : 'hide');
        });
        return {
            controlsDescendantBindings: true
        };
    }
};

$.urlParam = function(name){
    var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
        return null;
    }
    else{
        return results[1] || 0;
    }
};

// Activates knockout.js
var edit_roster_view_model = new EditRosterViewModel();
ko.applyBindings(edit_roster_view_model);

//# sourceMappingURL=edit-roster.js.map
