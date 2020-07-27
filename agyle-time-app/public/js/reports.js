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
/*
 Highstock JS v2.0.0 (2014-04-22)

 (c) 2009-2014 Torstein Honsi

 License: www.highcharts.com/license
*/
(function(){function v(a,b){var c;a||(a={});for(c in b)a[c]=b[c];return a}function y(){var a,b=arguments,c,d={},e=function(a,b){var c,d;typeof a!=="object"&&(a={});for(d in b)b.hasOwnProperty(d)&&(c=b[d],a[d]=c&&typeof c==="object"&&Object.prototype.toString.call(c)!=="[object Array]"&&d!=="renderTo"&&typeof c.nodeType!=="number"?e(a[d]||{},c):b[d]);return a};b[0]===!0&&(d=b[1],b=Array.prototype.slice.call(b,2));c=b.length;for(a=0;a<c;a++)d=e(d,b[a]);return d}function Kb(){for(var a=0,b=arguments,
c=b.length,d={};a<c;a++)d[b[a++]]=b[a];return d}function J(a,b){return parseInt(a,b||10)}function Oa(a){return typeof a==="string"}function ea(a){return typeof a==="object"}function Pa(a){return Object.prototype.toString.call(a)==="[object Array]"}function ka(a){return typeof a==="number"}function Ga(a){return U.log(a)/U.LN10}function na(a){return U.pow(10,a)}function oa(a,b){for(var c=a.length;c--;)if(a[c]===b){a.splice(c,1);break}}function t(a){return a!==r&&a!==null}function V(a,b,c){var d,e;if(Oa(b))t(c)?
a.setAttribute(b,c):a&&a.getAttribute&&(e=a.getAttribute(b));else if(t(b)&&ea(b))for(d in b)a.setAttribute(d,b[d]);return e}function la(a){return Pa(a)?a:[a]}function o(){var a=arguments,b,c,d=a.length;for(b=0;b<d;b++)if(c=a[b],typeof c!=="undefined"&&c!==null)return c}function E(a,b){if(Ha&&!ba&&b&&b.opacity!==r)b.filter="alpha(opacity="+b.opacity*100+")";v(a.style,b)}function Y(a,b,c,d,e){a=B.createElement(a);b&&v(a,b);e&&E(a,{padding:0,border:X,margin:0});c&&E(a,c);d&&d.appendChild(a);return a}
function fa(a,b){var c=function(){};c.prototype=new a;v(c.prototype,b);return c}function Ia(a,b,c,d){var e=I.lang,a=+a||0,f=b===-1?(a.toString().split(".")[1]||"").length:isNaN(b=N(b))?2:b,b=c===void 0?e.decimalPoint:c,d=d===void 0?e.thousandsSep:d,e=a<0?"-":"",c=String(J(a=N(a).toFixed(f))),g=c.length>3?c.length%3:0;return e+(g?c.substr(0,g)+d:"")+c.substr(g).replace(/(\d{3})(?=\d)/g,"$1"+d)+(f?b+N(a-c).toFixed(f).slice(2):"")}function Qa(a,b){return Array((b||2)+1-String(a).length).join(0)+a}function O(a,
b,c){var d=a[b];a[b]=function(){var a=Array.prototype.slice.call(arguments);a.unshift(d);return c.apply(this,a)}}function Ja(a,b){for(var c="{",d=!1,e,f,g,h,i,k=[];(c=a.indexOf(c))!==-1;){e=a.slice(0,c);if(d){f=e.split(":");g=f.shift().split(".");i=g.length;e=b;for(h=0;h<i;h++)e=e[g[h]];if(f.length)f=f.join(":"),g=/\.([0-9])/,h=I.lang,i=void 0,/f$/.test(f)?(i=(i=f.match(g))?i[1]:-1,e!==null&&(e=Ia(e,i,h.decimalPoint,f.indexOf(",")>-1?h.thousandsSep:""))):e=ua(f,e)}k.push(e);a=a.slice(c+1);c=(d=!d)?
"}":"{"}k.push(a);return k.join("")}function rb(a){return U.pow(10,S(U.log(a)/U.LN10))}function sb(a,b,c,d){var e,c=o(c,1);e=a/c;b||(b=[1,2,2.5,5,10],d&&d.allowDecimals===!1&&(c===1?b=[1,2,5,10]:c<=0.1&&(b=[1/c])));for(d=0;d<b.length;d++)if(a=b[d],e<=(b[d]+(b[d+1]||b[d]))/2)break;a*=c;return a}function Lb(){this.symbol=this.color=0}function tb(a,b){var c=a.length,d,e;for(e=0;e<c;e++)a[e].ss_i=e;a.sort(function(a,c){d=b(a,c);return d===0?a.ss_i-c.ss_i:d});for(e=0;e<c;e++)delete a[e].ss_i}function Ra(a){for(var b=
a.length,c=a[0];b--;)a[b]<c&&(c=a[b]);return c}function Ba(a){for(var b=a.length,c=a[0];b--;)a[b]>c&&(c=a[b]);return c}function Ka(a,b){for(var c in a)a[c]&&a[c]!==b&&a[c].destroy&&a[c].destroy(),delete a[c]}function Sa(a){hb||(hb=Y(Ta));a&&hb.appendChild(a);hb.innerHTML=""}function pa(a,b){var c="Highcharts error #"+a+": www.highcharts.com/errors/"+a;if(b)throw c;else W.console&&console.log(c)}function ga(a){return parseFloat(a.toPrecision(14))}function Ya(a,b){Ca=o(a,b.animation)}function Mb(){var a=
I.global.useUTC,b=a?"getUTC":"get",c=a?"setUTC":"set";La=(a&&I.global.timezoneOffset||0)*6E4;ib=a?Date.UTC:function(a,b,c,g,h,i){return(new Date(a,b,o(c,1),o(g,0),o(h,0),o(i,0))).getTime()};ub=b+"Minutes";vb=b+"Hours";wb=b+"Day";Ua=b+"Date";jb=b+"Month";kb=b+"FullYear";Nb=c+"Minutes";Ob=c+"Hours";xb=c+"Date";Pb=c+"Month";Qb=c+"FullYear"}function Z(){}function Za(a,b,c,d){this.axis=a;this.pos=b;this.type=c||"";this.isNew=!0;!c&&!d&&this.addLabel()}function F(){this.init.apply(this,arguments)}function va(){this.init.apply(this,
arguments)}function Rb(a,b,c,d,e){var f=a.chart.inverted;this.axis=a;this.isNegative=c;this.options=b;this.x=d;this.total=null;this.points={};this.stack=e;this.alignOptions={align:b.align||(f?c?"left":"right":"center"),verticalAlign:b.verticalAlign||(f?"middle":c?"bottom":"top"),y:o(b.y,f?4:c?14:-6),x:o(b.x,f?c?-6:6:0)};this.textAlign=b.textAlign||(f?c?"right":"left":"center")}function yb(a){var b=a.options,c=b.navigator,d=c.enabled,b=b.scrollbar,e=b.enabled,f=d?c.height:0,g=e?b.height:0;this.handles=
[];this.scrollbarButtons=[];this.elementsToDestroy=[];this.chart=a;this.setBaseSeries();this.height=f;this.scrollbarHeight=g;this.scrollbarEnabled=e;this.navigatorEnabled=d;this.navigatorOptions=c;this.scrollbarOptions=b;this.outlineHeight=f+g;this.init()}function zb(a){this.init(a)}var r,B=document,W=window,U=Math,s=U.round,S=U.floor,Va=U.ceil,w=U.max,z=U.min,N=U.abs,ca=U.cos,ha=U.sin,qa=U.PI,Ma=qa*2/360,Da=navigator.userAgent,Sb=W.opera,Ha=/msie/i.test(Da)&&!Sb,lb=B.documentMode===8,mb=/AppleWebKit/.test(Da),
$a=/Firefox/.test(Da),db=/(Mobile|Android|Windows Phone)/.test(Da),Ea="http://www.w3.org/2000/svg",ba=!!B.createElementNS&&!!B.createElementNS(Ea,"svg").createSVGRect,Yb=$a&&parseInt(Da.split("Firefox/")[1],10)<4,ia=!ba&&!Ha&&!!B.createElement("canvas").getContext,Wa,ab,Tb={},Ab=0,hb,I,ua,Ca,Bb,H,ma=function(){},$=[],eb=0,Ta="div",X="none",Zb=/^[0-9]+$/,$b="stroke-width",ib,La,ub,vb,wb,Ua,jb,kb,Nb,Ob,xb,Pb,Qb,C={},P=W.Highcharts=W.Highcharts?pa(16,!0):{};ua=function(a,b,c){if(!t(b)||isNaN(b))return"Invalid date";
var a=o(a,"%Y-%m-%d %H:%M:%S"),d=new Date(b-La),e,f=d[vb](),g=d[wb](),h=d[Ua](),i=d[jb](),k=d[kb](),j=I.lang,l=j.weekdays,d=v({a:l[g].substr(0,3),A:l[g],d:Qa(h),e:h,b:j.shortMonths[i],B:j.months[i],m:Qa(i+1),y:k.toString().substr(2,2),Y:k,H:Qa(f),I:Qa(f%12||12),l:f%12||12,M:Qa(d[ub]()),p:f<12?"AM":"PM",P:f<12?"am":"pm",S:Qa(d.getSeconds()),L:Qa(s(b%1E3),3)},P.dateFormats);for(e in d)for(;a.indexOf("%"+e)!==-1;)a=a.replace("%"+e,typeof d[e]==="function"?d[e](b):d[e]);return c?a.substr(0,1).toUpperCase()+
a.substr(1):a};Lb.prototype={wrapColor:function(a){if(this.color>=a)this.color=0},wrapSymbol:function(a){if(this.symbol>=a)this.symbol=0}};H=Kb("millisecond",1,"second",1E3,"minute",6E4,"hour",36E5,"day",864E5,"week",6048E5,"month",26784E5,"year",31556952E3);Bb={init:function(a,b,c){var b=b||"",d=a.shift,e=b.indexOf("C")>-1,f=e?7:3,g,b=b.split(" "),c=[].concat(c),h,i,k=function(a){for(g=a.length;g--;)a[g]==="M"&&a.splice(g+1,0,a[g+1],a[g+2],a[g+1],a[g+2])};e&&(k(b),k(c));a.isArea&&(h=b.splice(b.length-
6,6),i=c.splice(c.length-6,6));if(d<=c.length/f&&b.length===c.length)for(;d--;)c=[].concat(c).splice(0,f).concat(c);a.shift=0;if(b.length)for(a=c.length;b.length<a;)d=[].concat(b).splice(b.length-f,f),e&&(d[f-6]=d[f-2],d[f-5]=d[f-1]),b=b.concat(d);h&&(b=b.concat(h),c=c.concat(i));return[b,c]},step:function(a,b,c,d){var e=[],f=a.length;if(c===1)e=d;else if(f===b.length&&c<1)for(;f--;)d=parseFloat(a[f]),e[f]=isNaN(d)?a[f]:c*parseFloat(b[f]-d)+d;else e=b;return e}};(function(a){W.HighchartsAdapter=W.HighchartsAdapter||
a&&{init:function(b){var c=a.fx,d=c.step,e,f=a.Tween,g=f&&f.propHooks;e=a.cssHooks.opacity;a.extend(a.easing,{easeOutQuad:function(a,b,c,d,e){return-d*(b/=e)*(b-2)+c}});a.each(["cur","_default","width","height","opacity"],function(a,b){var e=d,j;b==="cur"?e=c.prototype:b==="_default"&&f&&(e=g[b],b="set");(j=e[b])&&(e[b]=function(c){var d,c=a?c:this;if(c.prop!=="align")return d=c.elem,d.attr?d.attr(c.prop,b==="cur"?r:c.now):j.apply(this,arguments)})});O(e,"get",function(a,b,c){return b.attr?b.opacity||
0:a.call(this,b,c)});e=function(a){var c=a.elem,d;if(!a.started)d=b.init(c,c.d,c.toD),a.start=d[0],a.end=d[1],a.started=!0;c.attr("d",b.step(a.start,a.end,a.pos,c.toD))};f?g.d={set:e}:d.d=e;this.each=Array.prototype.forEach?function(a,b){return Array.prototype.forEach.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(b.call(a[c],a[c],c,a)===!1)return c};a.fn.highcharts=function(){var a="Chart",b=arguments,c,d;if(this[0]){Oa(b[0])&&(a=b[0],b=Array.prototype.slice.call(b,1));c=b[0];if(c!==
r)c.chart=c.chart||{},c.chart.renderTo=this[0],new P[a](c,b[1]),d=this;c===r&&(d=$[V(this[0],"data-highcharts-chart")])}return d}},getScript:a.getScript,inArray:a.inArray,adapterRun:function(b,c){return a(b)[c]()},grep:a.grep,map:function(a,c){for(var d=[],e=0,f=a.length;e<f;e++)d[e]=c.call(a[e],a[e],e,a);return d},offset:function(b){return a(b).offset()},addEvent:function(b,c,d){a(b).bind(c,d)},removeEvent:function(b,c,d){var e=B.removeEventListener?"removeEventListener":"detachEvent";B[e]&&b&&!b[e]&&
(b[e]=function(){});a(b).unbind(c,d)},fireEvent:function(b,c,d,e){var f=a.Event(c),g="detached"+c,h;!Ha&&d&&(delete d.layerX,delete d.layerY,delete d.returnValue);v(f,d);b[c]&&(b[g]=b[c],b[c]=null);a.each(["preventDefault","stopPropagation"],function(a,b){var c=f[b];f[b]=function(){try{c.call(f)}catch(a){b==="preventDefault"&&(h=!0)}}});a(b).trigger(f);b[g]&&(b[c]=b[g],b[g]=null);e&&!f.isDefaultPrevented()&&!h&&e(f)},washMouseEvent:function(a){var c=a.originalEvent||a;if(c.pageX===r)c.pageX=a.pageX,
c.pageY=a.pageY;return c},animate:function(b,c,d){var e=a(b);if(!b.style)b.style={};if(c.d)b.toD=c.d,c.d=1;e.stop();c.opacity!==r&&b.attr&&(c.opacity+="px");e.animate(c,d)},stop:function(b){a(b).stop()}}})(W.jQuery);var M=W.HighchartsAdapter,Q=M||{};M&&M.init.call(M,Bb);var nb=Q.adapterRun,ac=Q.getScript,wa=Q.inArray,q=Q.each,Cb=Q.grep,bc=Q.offset,xa=Q.map,A=Q.addEvent,R=Q.removeEvent,K=Q.fireEvent,cc=Q.washMouseEvent,ob=Q.animate,fb=Q.stop,Q={enabled:!0,x:0,y:15,style:{color:"#606060",cursor:"default",
fontSize:"11px"}};I={colors:"#7cb5ec,#434348,#90ed7d,#f7a35c,#8085e9,#f15c80,#e4d354,#8085e8,#8d4653,#91e8e1".split(","),symbols:["circle","diamond","square","triangle","triangle-down"],lang:{loading:"Loading...",months:"January,February,March,April,May,June,July,August,September,October,November,December".split(","),shortMonths:"Jan,Feb,Mar,Apr,May,Jun,Jul,Aug,Sep,Oct,Nov,Dec".split(","),weekdays:"Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday".split(","),decimalPoint:".",numericSymbols:"k,M,G,T,P,E".split(","),
resetZoom:"Reset zoom",resetZoomTitle:"Reset zoom level 1:1",thousandsSep:","},global:{useUTC:!0,canvasToolsURL:"http://code.highcharts.com/stock/2.0.0/modules/canvas-tools.js",VMLRadialGradientURL:"http://code.highcharts.com/stock/2.0.0/gfx/vml-radial-gradient.png"},chart:{borderColor:"#4572A7",borderRadius:0,defaultSeriesType:"line",ignoreHiddenSeries:!0,spacing:[10,10,15,10],backgroundColor:"#FFFFFF",plotBorderColor:"#C0C0C0",resetZoomButton:{theme:{zIndex:20},position:{align:"right",x:-10,y:10}}},
title:{text:"Chart title",align:"center",margin:15,style:{color:"#333333",fontSize:"18px"}},subtitle:{text:"",align:"center",style:{color:"#555555"}},plotOptions:{line:{allowPointSelect:!1,showCheckbox:!1,animation:{duration:1E3},events:{},lineWidth:2,marker:{lineWidth:0,radius:4,lineColor:"#FFFFFF",states:{hover:{enabled:!0},select:{fillColor:"#FFFFFF",lineColor:"#000000",lineWidth:2}}},point:{events:{}},dataLabels:y(Q,{align:"center",enabled:!1,formatter:function(){return this.y===null?"":Ia(this.y,
-1)},verticalAlign:"bottom",y:0}),cropThreshold:300,pointRange:0,states:{hover:{marker:{},halo:{size:10,opacity:0.25}},select:{marker:{}}},stickyTracking:!0,turboThreshold:1E3}},labels:{style:{position:"absolute",color:"#3E576F"}},legend:{enabled:!0,align:"center",layout:"horizontal",labelFormatter:function(){return this.name},borderColor:"#909090",borderRadius:0,navigation:{activeColor:"#274b6d",inactiveColor:"#CCC"},shadow:!1,itemStyle:{color:"#333333",fontSize:"12px",fontWeight:"bold"},itemHoverStyle:{color:"#000"},
itemHiddenStyle:{color:"#CCC"},itemCheckboxStyle:{position:"absolute",width:"13px",height:"13px"},symbolPadding:5,verticalAlign:"bottom",x:0,y:0,title:{style:{fontWeight:"bold"}}},loading:{labelStyle:{fontWeight:"bold",position:"relative",top:"1em"},style:{position:"absolute",backgroundColor:"white",opacity:0.5,textAlign:"center"}},tooltip:{enabled:!0,animation:ba,backgroundColor:"rgba(249, 249, 249, .85)",borderWidth:1,borderRadius:3,dateTimeLabelFormats:{millisecond:"%A, %b %e, %H:%M:%S.%L",second:"%A, %b %e, %H:%M:%S",
minute:"%A, %b %e, %H:%M",hour:"%A, %b %e, %H:%M",day:"%A, %b %e, %Y",week:"Week from %A, %b %e, %Y",month:"%B %Y",year:"%Y"},headerFormat:'<span style="font-size: 10px">{point.key}</span><br/>',pointFormat:'<span style="color:{series.color}">●</span> {series.name}: <b>{point.y}</b><br/>',shadow:!0,snap:db?25:10,style:{color:"#333333",cursor:"default",fontSize:"12px",padding:"8px",whiteSpace:"nowrap"}},credits:{enabled:!0,text:"Highcharts.com",href:"http://www.highcharts.com",position:{align:"right",
x:-10,verticalAlign:"bottom",y:-5},style:{cursor:"pointer",color:"#909090",fontSize:"9px"}}};var T=I.plotOptions,M=T.line;Mb();var dc=/rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]?(?:\.[0-9]+)?)\s*\)/,ec=/#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/,fc=/rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/,Fa=function(a){var b=[],c,d;(function(a){a&&a.stops?d=xa(a.stops,function(a){return Fa(a[1])}):(c=dc.exec(a))?b=[J(c[1]),J(c[2]),J(c[3]),parseFloat(c[4],
10)]:(c=ec.exec(a))?b=[J(c[1],16),J(c[2],16),J(c[3],16),1]:(c=fc.exec(a))&&(b=[J(c[1]),J(c[2]),J(c[3]),1])})(a);return{get:function(c){var f;d?(f=y(a),f.stops=[].concat(f.stops),q(d,function(a,b){f.stops[b]=[f.stops[b][0],a.get(c)]})):f=b&&!isNaN(b[0])?c==="rgb"?"rgb("+b[0]+","+b[1]+","+b[2]+")":c==="a"?b[3]:"rgba("+b.join(",")+")":a;return f},brighten:function(a){if(d)q(d,function(b){b.brighten(a)});else if(ka(a)&&a!==0){var c;for(c=0;c<3;c++)b[c]+=J(a*255),b[c]<0&&(b[c]=0),b[c]>255&&(b[c]=255)}return this},
rgba:b,setOpacity:function(a){b[3]=a;return this}}};Z.prototype={init:function(a,b){this.element=b==="span"?Y(b):B.createElementNS(Ea,b);this.renderer=a},opacity:1,animate:function(a,b,c){b=o(b,Ca,!0);fb(this);if(b){b=y(b,{});if(c)b.complete=c;ob(this,a,b)}else this.attr(a),c&&c()},colorGradient:function(a,b,c){var d=this.renderer,e,f,g,h,i,k,j,l,m,n,p=[];a.linearGradient?f="linearGradient":a.radialGradient&&(f="radialGradient");if(f){g=a[f];h=d.gradients;k=a.stops;m=c.radialReference;Pa(g)&&(a[f]=
g={x1:g[0],y1:g[1],x2:g[2],y2:g[3],gradientUnits:"userSpaceOnUse"});f==="radialGradient"&&m&&!t(g.gradientUnits)&&(g=y(g,{cx:m[0]-m[2]/2+g.cx*m[2],cy:m[1]-m[2]/2+g.cy*m[2],r:g.r*m[2],gradientUnits:"userSpaceOnUse"}));for(n in g)n!=="id"&&p.push(n,g[n]);for(n in k)p.push(k[n]);p=p.join(",");h[p]?a=h[p].attr("id"):(g.id=a="highcharts-"+Ab++,h[p]=i=d.createElement(f).attr(g).add(d.defs),i.stops=[],q(k,function(a){a[1].indexOf("rgba")===0?(e=Fa(a[1]),j=e.get("rgb"),l=e.get("a")):(j=a[1],l=1);a=d.createElement("stop").attr({offset:a[0],
"stop-color":j,"stop-opacity":l}).add(i);i.stops.push(a)}));c.setAttribute(b,"url("+d.url+"#"+a+")")}},attr:function(a,b){var c,d,e=this.element,f,g=this,h;typeof a==="string"&&b!==r&&(c=a,a={},a[c]=b);if(typeof a==="string")g=(this[a+"Getter"]||this._defaultGetter).call(this,a,e);else{for(c in a){d=a[c];h=!1;this.symbolName&&/^(x|y|width|height|r|start|end|innerR|anchorX|anchorY)/.test(c)&&(f||(this.symbolAttr(a),f=!0),h=!0);if(this.rotation&&(c==="x"||c==="y"))this.doTransform=!0;h||(this[c+"Setter"]||
this._defaultSetter).call(this,d,c,e);this.shadows&&/^(width|height|visibility|x|y|d|transform|cx|cy|r)$/.test(c)&&this.updateShadows(c,d)}if(this.doTransform)this.updateTransform(),this.doTransform=!1}return g},updateShadows:function(a,b){for(var c=this.shadows,d=c.length;d--;)c[d].setAttribute(a,a==="height"?w(b-(c[d].cutHeight||0),0):a==="d"?this.d:b)},addClass:function(a){var b=this.element,c=V(b,"class")||"";c.indexOf(a)===-1&&V(b,"class",c+" "+a);return this},symbolAttr:function(a){var b=this;
q("x,y,r,start,end,width,height,innerR,anchorX,anchorY".split(","),function(c){b[c]=o(a[c],b[c])});b.attr({d:b.renderer.symbols[b.symbolName](b.x,b.y,b.width,b.height,b)})},clip:function(a){return this.attr("clip-path",a?"url("+this.renderer.url+"#"+a.id+")":X)},crisp:function(a){var b,c={},d,e=a.strokeWidth||this.strokeWidth||this.attr&&this.attr("stroke-width")||0;d=s(e)%2/2;a.x=S(a.x||this.x||0)+d;a.y=S(a.y||this.y||0)+d;a.width=S((a.width||this.width||0)-2*d);a.height=S((a.height||this.height||
0)-2*d);a.strokeWidth=e;for(b in a)this[b]!==a[b]&&(this[b]=c[b]=a[b]);return c},css:function(a){var b=this.styles,c={},d=this.element,e,f,g="";e=!b;if(a&&a.color)a.fill=a.color;if(b)for(f in a)a[f]!==b[f]&&(c[f]=a[f],e=!0);if(e){e=this.textWidth=a&&a.width&&d.nodeName.toLowerCase()==="text"&&J(a.width);b&&(a=v(b,c));this.styles=a;e&&(ia||!ba&&this.renderer.forExport)&&delete a.width;if(Ha&&!ba)E(this.element,a);else{b=function(a,b){return"-"+b.toLowerCase()};for(f in a)g+=f.replace(/([A-Z])/g,b)+
":"+a[f]+";";V(d,"style",g)}e&&this.added&&this.renderer.buildText(this)}return this},on:function(a,b){var c=this,d=c.element;ab&&a==="click"?(d.ontouchstart=function(a){c.touchEventFired=Date.now();a.preventDefault();b.call(d,a)},d.onclick=function(a){(Da.indexOf("Android")===-1||Date.now()-(c.touchEventFired||0)>1100)&&b.call(d,a)}):d["on"+a]=b;return this},setRadialReference:function(a){this.element.radialReference=a;return this},translate:function(a,b){return this.attr({translateX:a,translateY:b})},
invert:function(){this.inverted=!0;this.updateTransform();return this},updateTransform:function(){var a=this.translateX||0,b=this.translateY||0,c=this.scaleX,d=this.scaleY,e=this.inverted,f=this.rotation,g=this.element;e&&(a+=this.attr("width"),b+=this.attr("height"));a=["translate("+a+","+b+")"];e?a.push("rotate(90) scale(-1,1)"):f&&a.push("rotate("+f+" "+(g.getAttribute("x")||0)+" "+(g.getAttribute("y")||0)+")");(t(c)||t(d))&&a.push("scale("+o(c,1)+" "+o(d,1)+")");a.length&&g.setAttribute("transform",
a.join(" "))},toFront:function(){var a=this.element;a.parentNode.appendChild(a);return this},align:function(a,b,c){var d,e,f,g,h={};e=this.renderer;f=e.alignedObjects;if(a){if(this.alignOptions=a,this.alignByTranslate=b,!c||Oa(c))this.alignTo=d=c||"renderer",oa(f,this),f.push(this),c=null}else a=this.alignOptions,b=this.alignByTranslate,d=this.alignTo;c=o(c,e[d],e);d=a.align;e=a.verticalAlign;f=(c.x||0)+(a.x||0);g=(c.y||0)+(a.y||0);if(d==="right"||d==="center")f+=(c.width-(a.width||0))/{right:1,center:2}[d];
h[b?"translateX":"x"]=s(f);if(e==="bottom"||e==="middle")g+=(c.height-(a.height||0))/({bottom:1,middle:2}[e]||1);h[b?"translateY":"y"]=s(g);this[this.placed?"animate":"attr"](h);this.placed=!0;this.alignAttr=h;return this},getBBox:function(){var a=this.bBox,b=this.renderer,c,d,e=this.rotation;c=this.element;var f=this.styles,g=e*Ma;d=this.textStr;var h;if(d===""||Zb.test(d))h="num."+d.toString().length+(f?"|"+f.fontSize+"|"+f.fontFamily:"");h&&(a=b.cache[h]);if(!a){if(c.namespaceURI===Ea||b.forExport){try{a=
c.getBBox?v({},c.getBBox()):{width:c.offsetWidth,height:c.offsetHeight}}catch(i){}if(!a||a.width<0)a={width:0,height:0}}else a=this.htmlGetBBox();if(b.isSVG){c=a.width;d=a.height;if(Ha&&f&&f.fontSize==="11px"&&d.toPrecision(3)==="16.9")a.height=d=14;if(e)a.width=N(d*ha(g))+N(c*ca(g)),a.height=N(d*ca(g))+N(c*ha(g))}this.bBox=a;h&&(b.cache[h]=a)}return a},show:function(a){return a&&this.element.namespaceURI===Ea?(this.element.removeAttribute("visibility"),this):this.attr({visibility:a?"inherit":"visible"})},
hide:function(){return this.attr({visibility:"hidden"})},fadeOut:function(a){var b=this;b.animate({opacity:0},{duration:a||150,complete:function(){b.hide()}})},add:function(a){var b=this.renderer,c=a||b,d=c.element||b.box,e=this.element,f=this.zIndex,g,h;if(a)this.parentGroup=a;this.parentInverted=a&&a.inverted;this.textStr!==void 0&&b.buildText(this);if(f)c.handleZ=!0,f=J(f);if(c.handleZ){a=d.childNodes;for(g=0;g<a.length;g++)if(b=a[g],c=V(b,"zIndex"),b!==e&&(J(c)>f||!t(f)&&t(c))){d.insertBefore(e,
b);h=!0;break}}h||d.appendChild(e);this.added=!0;if(this.onAdd)this.onAdd();return this},safeRemoveChild:function(a){var b=a.parentNode;b&&b.removeChild(a)},destroy:function(){var a=this,b=a.element||{},c=a.shadows,d=a.renderer.isSVG&&b.nodeName==="SPAN"&&a.parentGroup,e,f;b.onclick=b.onmouseout=b.onmouseover=b.onmousemove=b.point=null;fb(a);if(a.clipPath)a.clipPath=a.clipPath.destroy();if(a.stops){for(f=0;f<a.stops.length;f++)a.stops[f]=a.stops[f].destroy();a.stops=null}a.safeRemoveChild(b);for(c&&
q(c,function(b){a.safeRemoveChild(b)});d&&d.div.childNodes.length===0;)b=d.parentGroup,a.safeRemoveChild(d.div),delete d.div,d=b;a.alignTo&&oa(a.renderer.alignedObjects,a);for(e in a)delete a[e];return null},shadow:function(a,b,c){var d=[],e,f,g=this.element,h,i,k,j;if(a){i=o(a.width,3);k=(a.opacity||0.15)/i;j=this.parentInverted?"(-1,-1)":"("+o(a.offsetX,1)+", "+o(a.offsetY,1)+")";for(e=1;e<=i;e++){f=g.cloneNode(0);h=i*2+1-2*e;V(f,{isShadow:"true",stroke:a.color||"black","stroke-opacity":k*e,"stroke-width":h,
transform:"translate"+j,fill:X});if(c)V(f,"height",w(V(f,"height")-h,0)),f.cutHeight=h;b?b.element.appendChild(f):g.parentNode.insertBefore(f,g);d.push(f)}this.shadows=d}return this},xGetter:function(a){this.element.nodeName==="circle"&&(a={x:"cx",y:"cy"}[a]||a);return this._defaultGetter(a)},_defaultGetter:function(a){a=o(this[a],this.element?this.element.getAttribute(a):null,0);/^[0-9\.]+$/.test(a)&&(a=parseFloat(a));return a},dSetter:function(a,b,c){a&&a.join&&(a=a.join(" "));/(NaN| {2}|^$)/.test(a)&&
(a="M 0 0");c.setAttribute(b,a);this[b]=a},dashstyleSetter:function(a){var b;if(a=a&&a.toLowerCase()){a=a.replace("shortdashdotdot","3,1,1,1,1,1,").replace("shortdashdot","3,1,1,1").replace("shortdot","1,1,").replace("shortdash","3,1,").replace("longdash","8,3,").replace(/dot/g,"1,3,").replace("dash","4,3,").replace(/,$/,"").split(",");for(b=a.length;b--;)a[b]=J(a[b])*this.element.getAttribute("stroke-width");a=a.join(",");this.element.setAttribute("stroke-dasharray",a)}},alignSetter:function(a){this.element.setAttribute("text-anchor",
{left:"start",center:"middle",right:"end"}[a])},opacitySetter:function(a,b,c){this[b]=a;c.setAttribute(b,a)},"stroke-widthSetter":function(a,b,c){a===0&&(a=1.0E-5);this.strokeWidth=a;c.setAttribute(b,a)},titleSetter:function(a){var b=this.element.getElementsByTagName("title")[0];b||(b=B.createElementNS(Ea,"title"),this.element.appendChild(b));b.textContent=a},textSetter:function(a){if(a!==this.textStr)delete this.bBox,this.textStr=a,this.added&&this.renderer.buildText(this)},fillSetter:function(a,
b,c){typeof a==="string"?c.setAttribute(b,a):a&&this.colorGradient(a,b,c)},zIndexSetter:function(a,b,c){c.setAttribute(b,a);this[b]=a},_defaultSetter:function(a,b,c){c.setAttribute(b,a)}};Z.prototype.yGetter=Z.prototype.xGetter;Z.prototype.translateXSetter=Z.prototype.translateYSetter=Z.prototype.rotationSetter=Z.prototype.verticalAlignSetter=Z.prototype.scaleXSetter=Z.prototype.scaleYSetter=function(a,b){this[b]=a;this.doTransform=!0};var ja=function(){this.init.apply(this,arguments)};ja.prototype=
{Element:Z,init:function(a,b,c,d,e){var f=location,g,d=this.createElement("svg").attr({version:"1.1"}).css(this.getStyle(d));g=d.element;a.appendChild(g);a.innerHTML.indexOf("xmlns")===-1&&V(g,"xmlns",Ea);this.isSVG=!0;this.box=g;this.boxWrapper=d;this.alignedObjects=[];this.url=($a||mb)&&B.getElementsByTagName("base").length?f.href.replace(/#.*?$/,"").replace(/([\('\)])/g,"\\$1").replace(/ /g,"%20"):"";this.createElement("desc").add().element.appendChild(B.createTextNode("Created with Highstock 2.0.0"));
this.defs=this.createElement("defs").add();this.forExport=e;this.gradients={};this.cache={};this.setSize(b,c,!1);var h;if($a&&a.getBoundingClientRect)this.subPixelFix=b=function(){E(a,{left:0,top:0});h=a.getBoundingClientRect();E(a,{left:Va(h.left)-h.left+"px",top:Va(h.top)-h.top+"px"})},b(),A(W,"resize",b)},getStyle:function(a){return this.style=v({fontFamily:'"Lucida Grande", "Lucida Sans Unicode", Arial, Helvetica, sans-serif',fontSize:"12px"},a)},isHidden:function(){return!this.boxWrapper.getBBox().width},
destroy:function(){var a=this.defs;this.box=null;this.boxWrapper=this.boxWrapper.destroy();Ka(this.gradients||{});this.gradients=null;if(a)this.defs=a.destroy();this.subPixelFix&&R(W,"resize",this.subPixelFix);return this.alignedObjects=null},createElement:function(a){var b=new this.Element;b.init(this,a);return b},draw:function(){},buildText:function(a){for(var b=a.element,c=this,d=c.forExport,e=o(a.textStr,"").toString(),f=e.indexOf("<")!==-1,g=b.childNodes,h,i,k=V(b,"x"),j=a.styles,l=a.textWidth,
m=j&&j.lineHeight,n=g.length,p=function(a){return m?J(m):c.fontMetrics(/(px|em)$/.test(a&&a.style.fontSize)?a.style.fontSize:j&&j.fontSize||c.style.fontSize||12).h};n--;)b.removeChild(g[n]);!f&&e.indexOf(" ")===-1?b.appendChild(B.createTextNode(e)):(h=/<.*style="([^"]+)".*>/,i=/<.*href="(http[^"]+)".*>/,l&&!a.added&&this.box.appendChild(b),e=f?e.replace(/<(b|strong)>/g,'<span style="font-weight:bold">').replace(/<(i|em)>/g,'<span style="font-style:italic">').replace(/<a/g,"<span").replace(/<\/(b|strong|i|em|a)>/g,
"</span>").split(/<br.*?>/g):[e],e[e.length-1]===""&&e.pop(),q(e,function(e,f){var g,m=0,e=e.replace(/<span/g,"|||<span").replace(/<\/span>/g,"</span>|||");g=e.split("|||");q(g,function(e){if(e!==""||g.length===1){var n={},u=B.createElementNS(Ea,"tspan"),o;h.test(e)&&(o=e.match(h)[1].replace(/(;| |^)color([ :])/,"$1fill$2"),V(u,"style",o));i.test(e)&&!d&&(V(u,"onclick",'location.href="'+e.match(i)[1]+'"'),E(u,{cursor:"pointer"}));e=(e.replace(/<(.|\n)*?>/g,"")||" ").replace(/&lt;/g,"<").replace(/&gt;/g,
">");if(e!==" "){u.appendChild(B.createTextNode(e));if(m)n.dx=0;else if(f&&k!==null)n.x=k;V(u,n);!m&&f&&(!ba&&d&&E(u,{display:"block"}),V(u,"dy",p(u),mb&&u.offsetHeight));b.appendChild(u);m++;if(l)for(var e=e.replace(/([^\^])-/g,"$1- ").split(" "),n=e.length>1&&j.whiteSpace!=="nowrap",q,r,D=a._clipHeight,t=[],s=p(),w=1;n&&(e.length||t.length);)delete a.bBox,q=a.getBBox(),r=q.width,!ba&&c.forExport&&(r=c.measureSpanWidth(u.firstChild.data,a.styles)),q=r>l,!q||e.length===1?(e=t,t=[],e.length&&(w++,
D&&w*s>D?(e=["..."],a.attr("title",a.textStr)):(u=B.createElementNS(Ea,"tspan"),V(u,{dy:s,x:k}),o&&V(u,"style",o),b.appendChild(u),r>l&&(l=r)))):(u.removeChild(u.firstChild),t.unshift(e.pop())),e.length&&u.appendChild(B.createTextNode(e.join(" ").replace(/- /g,"-")))}}})}))},button:function(a,b,c,d,e,f,g,h,i){var k=this.label(a,b,c,i,null,null,null,null,"button"),j=0,l,m,n,p,u,o,a={x1:0,y1:0,x2:0,y2:1},e=y({"stroke-width":1,stroke:"#CCCCCC",fill:{linearGradient:a,stops:[[0,"#FEFEFE"],[1,"#F6F6F6"]]},
r:2,padding:5,style:{color:"black"}},e);n=e.style;delete e.style;f=y(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#FFF"],[1,"#ACF"]]}},f);p=f.style;delete f.style;g=y(e,{stroke:"#68A",fill:{linearGradient:a,stops:[[0,"#9BD"],[1,"#CDF"]]}},g);u=g.style;delete g.style;h=y(e,{style:{color:"#CCC"}},h);o=h.style;delete h.style;A(k.element,Ha?"mouseover":"mouseenter",function(){j!==3&&k.attr(f).css(p)});A(k.element,Ha?"mouseout":"mouseleave",function(){j!==3&&(l=[e,f,g][j],m=[n,p,u][j],k.attr(l).css(m))});
k.setState=function(a){(k.state=j=a)?a===2?k.attr(g).css(u):a===3&&k.attr(h).css(o):k.attr(e).css(n)};return k.on("click",function(){j!==3&&d.call(k)}).attr(e).css(v({cursor:"default"},n))},crispLine:function(a,b){a[1]===a[4]&&(a[1]=a[4]=s(a[1])-b%2/2);a[2]===a[5]&&(a[2]=a[5]=s(a[2])+b%2/2);return a},path:function(a){var b={fill:X};Pa(a)?b.d=a:ea(a)&&v(b,a);return this.createElement("path").attr(b)},circle:function(a,b,c){a=ea(a)?a:{x:a,y:b,r:c};b=this.createElement("circle");b.xSetter=function(a){this.element.setAttribute("cx",
a)};b.ySetter=function(a){this.element.setAttribute("cy",a)};return b.attr(a)},arc:function(a,b,c,d,e,f){if(ea(a))b=a.y,c=a.r,d=a.innerR,e=a.start,f=a.end,a=a.x;a=this.symbol("arc",a||0,b||0,c||0,c||0,{innerR:d||0,start:e||0,end:f||0});a.r=c;return a},rect:function(a,b,c,d,e,f){var e=ea(a)?a.r:e,g=this.createElement("rect"),a=ea(a)?a:a===r?{}:{x:a,y:b,width:w(c,0),height:w(d,0)};if(f!==r)a.strokeWidth=f,a=g.crisp(a);if(e)a.r=e;g.rSetter=function(a){V(this.element,{rx:a,ry:a})};return g.attr(a)},setSize:function(a,
b,c){var d=this.alignedObjects,e=d.length;this.width=a;this.height=b;for(this.boxWrapper[o(c,!0)?"animate":"attr"]({width:a,height:b});e--;)d[e].align()},g:function(a){var b=this.createElement("g");return t(a)?b.attr({"class":"highcharts-"+a}):b},image:function(a,b,c,d,e){var f={preserveAspectRatio:X};arguments.length>1&&v(f,{x:b,y:c,width:d,height:e});f=this.createElement("image").attr(f);f.element.setAttributeNS?f.element.setAttributeNS("http://www.w3.org/1999/xlink","href",a):f.element.setAttribute("hc-svg-href",
a);return f},symbol:function(a,b,c,d,e,f){var g,h=this.symbols[a],h=h&&h(s(b),s(c),d,e,f),i=/^url\((.*?)\)$/,k,j;if(h)g=this.path(h),v(g,{symbolName:a,x:b,y:c,width:d,height:e}),f&&v(g,f);else if(i.test(a))j=function(a,b){a.element&&(a.attr({width:b[0],height:b[1]}),a.alignByTranslate||a.translate(s((d-b[0])/2),s((e-b[1])/2)))},k=a.match(i)[1],a=Tb[k],g=this.image(k).attr({x:b,y:c}),g.isImg=!0,a?j(g,a):(g.attr({width:0,height:0}),Y("img",{onload:function(){j(g,Tb[k]=[this.width,this.height])},src:k}));
return g},symbols:{circle:function(a,b,c,d){var e=0.166*c;return["M",a+c/2,b,"C",a+c+e,b,a+c+e,b+d,a+c/2,b+d,"C",a-e,b+d,a-e,b,a+c/2,b,"Z"]},square:function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c,b+d,a,b+d,"Z"]},triangle:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d,a,b+d,"Z"]},"triangle-down":function(a,b,c,d){return["M",a,b,"L",a+c,b,a+c/2,b+d,"Z"]},diamond:function(a,b,c,d){return["M",a+c/2,b,"L",a+c,b+d/2,a+c/2,b+d,a,b+d/2,"Z"]},arc:function(a,b,c,d,e){var f=e.start,c=e.r||c||d,g=e.end-0.001,
d=e.innerR,h=e.open,i=ca(f),k=ha(f),j=ca(g),g=ha(g),e=e.end-f<qa?0:1;return["M",a+c*i,b+c*k,"A",c,c,0,e,1,a+c*j,b+c*g,h?"M":"L",a+d*j,b+d*g,"A",d,d,0,e,0,a+d*i,b+d*k,h?"":"Z"]},callout:function(a,b,c,d,e){var f=z(e&&e.r||0,c,d),g=f+6,h=e&&e.anchorX,i=e&&e.anchorY,e=s(e.strokeWidth||0)%2/2;a+=e;b+=e;e=["M",a+f,b,"L",a+c-f,b,"C",a+c,b,a+c,b,a+c,b+f,"L",a+c,b+d-f,"C",a+c,b+d,a+c,b+d,a+c-f,b+d,"L",a+f,b+d,"C",a,b+d,a,b+d,a,b+d-f,"L",a,b+f,"C",a,b,a,b,a+f,b];h&&h>c&&i>b+g&&i<b+d-g?e.splice(13,3,"L",a+
c,i-6,a+c+6,i,a+c,i+6,a+c,b+d-f):h&&h<0&&i>b+g&&i<b+d-g?e.splice(33,3,"L",a,i+6,a-6,i,a,i-6,a,b+f):i&&i>d&&h>a+g&&h<a+c-g?e.splice(23,3,"L",h+6,b+d,h,b+d+6,h-6,b+d,a+f,b+d):i&&i<0&&h>a+g&&h<a+c-g&&e.splice(3,3,"L",h-6,b,h,b-6,h+6,b,c-f,b);return e}},clipRect:function(a,b,c,d){var e="highcharts-"+Ab++,f=this.createElement("clipPath").attr({id:e}).add(this.defs),a=this.rect(a,b,c,d,0).add(f);a.id=e;a.clipPath=f;return a},text:function(a,b,c,d){var e=ia||!ba&&this.forExport,f={};if(d&&!this.forExport)return this.html(a,
b,c);f.x=Math.round(b||0);if(c)f.y=Math.round(c);if(a||a===0)f.text=a;a=this.createElement("text").attr(f);e&&a.css({position:"absolute"});if(!d)a.xSetter=function(a,b,c){var d=c.childNodes,e,f;for(f=1;f<d.length;f++)e=d[f],e.getAttribute("x")===c.getAttribute("x")&&e.setAttribute("x",a);c.setAttribute(b,a)};return a},fontMetrics:function(a){var a=a||this.style.fontSize,a=/px/.test(a)?J(a):/em/.test(a)?parseFloat(a)*12:12,a=a<24?a+4:s(a*1.2),b=s(a*0.8);return{h:a,b:b}},label:function(a,b,c,d,e,f,
g,h,i){function k(){var a,b;a=p.element.style;o=(bb===void 0||Eb===void 0||n.styles.textAlign)&&p.textStr&&p.getBBox();n.width=(bb||o.width||0)+2*x+w;n.height=(Eb||o.height||0)+2*x;ra=x+m.fontMetrics(a&&a.fontSize).b;if(z){if(!u)a=s(-G*x),b=h?-ra:0,n.box=u=d?m.symbol(d,a,b,n.width,n.height,D):m.rect(a,b,n.width,n.height,0,D[$b]),u.attr("fill",X).add(n);u.isImg||u.attr(v({width:s(n.width),height:s(n.height)},D));D=null}}function j(){var a=n.styles,a=a&&a.textAlign,b=w+x*(1-G),c;c=h?0:ra;if(t(bb)&&
o&&(a==="center"||a==="right"))b+={center:0.5,right:1}[a]*(bb-o.width);if(b!==p.x||c!==p.y)p.attr("x",b),c!==r&&p.attr("y",c);p.x=b;p.y=c}function l(a,b){u?u.attr(a,b):D[a]=b}var m=this,n=m.g(i),p=m.text("",0,0,g).attr({zIndex:1}),u,o,G=0,x=3,w=0,bb,Eb,Fb,Gb,Ub=0,D={},ra,z;n.onAdd=function(){p.add(n);n.attr({text:a||"",x:b,y:c});u&&t(e)&&n.attr({anchorX:e,anchorY:f})};n.widthSetter=function(a){bb=a};n.heightSetter=function(a){Eb=a};n.paddingSetter=function(a){t(a)&&a!==x&&(x=a,j())};n.paddingLeftSetter=
function(a){t(a)&&a!==w&&(w=a,j())};n.alignSetter=function(a){G={left:0,center:0.5,right:1}[a]};n.textSetter=function(a){a!==r&&p.textSetter(a);k();j()};n["stroke-widthSetter"]=function(a,b){a&&(z=!0);Ub=a%2/2;l(b,a)};n.strokeSetter=n.fillSetter=n.rSetter=function(a,b){b==="fill"&&a&&(z=!0);l(b,a)};n.anchorXSetter=function(a,b){e=a;l(b,a+Ub-Fb)};n.anchorYSetter=function(a,b){f=a;l(b,a-Gb)};n.xSetter=function(a){n.x=a;G&&(a-=G*((bb||o.width)+x));Fb=s(a);n.attr("translateX",Fb)};n.ySetter=function(a){Gb=
n.y=s(a);n.attr("translateY",Gb)};var A=n.css;return v(n,{css:function(a){if(a){var b={},a=y(a);q("fontSize,fontWeight,fontFamily,color,lineHeight,width,textDecoration,textShadow".split(","),function(c){a[c]!==r&&(b[c]=a[c],delete a[c])});p.css(b)}return A.call(n,a)},getBBox:function(){return{width:o.width+2*x,height:o.height+2*x,x:o.x-x,y:o.y-x}},shadow:function(a){u&&u.shadow(a);return n},destroy:function(){R(n.element,"mouseenter");R(n.element,"mouseleave");p&&(p=p.destroy());u&&(u=u.destroy());
Z.prototype.destroy.call(n);n=m=k=j=l=null}})}};Wa=ja;v(Z.prototype,{htmlCss:function(a){var b=this.element;if(b=a&&b.tagName==="SPAN"&&a.width)delete a.width,this.textWidth=b,this.updateTransform();this.styles=v(this.styles,a);E(this.element,a);return this},htmlGetBBox:function(){var a=this.element,b=this.bBox;if(!b){if(a.nodeName==="text")a.style.position="absolute";b=this.bBox={x:a.offsetLeft,y:a.offsetTop,width:a.offsetWidth,height:a.offsetHeight}}return b},htmlUpdateTransform:function(){if(this.added){var a=
this.renderer,b=this.element,c=this.translateX||0,d=this.translateY||0,e=this.x||0,f=this.y||0,g=this.textAlign||"left",h={left:0,center:0.5,right:1}[g],i=this.shadows;E(b,{marginLeft:c,marginTop:d});i&&q(i,function(a){E(a,{marginLeft:c+1,marginTop:d+1})});this.inverted&&q(b.childNodes,function(c){a.invertChild(c,b)});if(b.tagName==="SPAN"){var k=this.rotation,j,l=J(this.textWidth),m=[k,g,b.innerHTML,this.textWidth].join(",");if(m!==this.cTT){j=a.fontMetrics(b.style.fontSize).b;t(k)&&this.setSpanRotation(k,
h,j);i=o(this.elemWidth,b.offsetWidth);if(i>l&&/[ \-]/.test(b.textContent||b.innerText))E(b,{width:l+"px",display:"block",whiteSpace:"normal"}),i=l;this.getSpanCorrection(i,j,h,k,g)}E(b,{left:e+(this.xCorr||0)+"px",top:f+(this.yCorr||0)+"px"});if(mb)j=b.offsetHeight;this.cTT=m}}else this.alignOnAdd=!0},setSpanRotation:function(a,b,c){var d={},e=Ha?"-ms-transform":mb?"-webkit-transform":$a?"MozTransform":Sb?"-o-transform":"";d[e]=d.transform="rotate("+a+"deg)";d[e+($a?"Origin":"-origin")]=d.transformOrigin=
b*100+"% "+c+"px";E(this.element,d)},getSpanCorrection:function(a,b,c){this.xCorr=-a*c;this.yCorr=-b}});v(ja.prototype,{html:function(a,b,c){var d=this.createElement("span"),e=d.element,f=d.renderer;d.textSetter=function(a){a!==e.innerHTML&&delete this.bBox;e.innerHTML=this.textStr=a};d.xSetter=d.ySetter=d.alignSetter=d.rotationSetter=function(a,b){b==="align"&&(b="textAlign");d[b]=a;d.htmlUpdateTransform()};d.attr({text:a,x:s(b),y:s(c)}).css({position:"absolute",whiteSpace:"nowrap",fontFamily:this.style.fontFamily,
fontSize:this.style.fontSize});d.css=d.htmlCss;if(f.isSVG)d.add=function(a){var b,c=f.box.parentNode,k=[];if(this.parentGroup=a){if(b=a.div,!b){for(;a;)k.push(a),a=a.parentGroup;q(k.reverse(),function(a){var d;b=a.div=a.div||Y(Ta,{className:V(a.element,"class")},{position:"absolute",left:(a.translateX||0)+"px",top:(a.translateY||0)+"px"},b||c);d=b.style;v(a,{translateXSetter:function(b,c){d.left=b+"px";a[c]=b;a.doTransform=!0},translateYSetter:function(b,c){d.top=b+"px";a[c]=b;a.doTransform=!0},visibilitySetter:function(a,
b){d[b]=a}})})}}else b=c;b.appendChild(e);d.added=!0;d.alignOnAdd&&d.htmlUpdateTransform();return d};return d}});var gb,da;if(!ba&&!ia)P.VMLElement=da={init:function(a,b){var c=["<",b,' filled="f" stroked="f"'],d=["position: ","absolute",";"],e=b===Ta;(b==="shape"||e)&&d.push("left:0;top:0;width:1px;height:1px;");d.push("visibility: ",e?"hidden":"visible");c.push(' style="',d.join(""),'"/>');if(b)c=e||b==="span"||b==="img"?c.join(""):a.prepVML(c),this.element=Y(c);this.renderer=a},add:function(a){var b=
this.renderer,c=this.element,d=b.box,d=a?a.element||a:d;a&&a.inverted&&b.invertChild(c,d);d.appendChild(c);this.added=!0;this.alignOnAdd&&!this.deferUpdateTransform&&this.updateTransform();if(this.onAdd)this.onAdd();return this},updateTransform:Z.prototype.htmlUpdateTransform,setSpanRotation:function(){var a=this.rotation,b=ca(a*Ma),c=ha(a*Ma);E(this.element,{filter:a?["progid:DXImageTransform.Microsoft.Matrix(M11=",b,", M12=",-c,", M21=",c,", M22=",b,", sizingMethod='auto expand')"].join(""):X})},
getSpanCorrection:function(a,b,c,d,e){var f=d?ca(d*Ma):1,g=d?ha(d*Ma):0,h=o(this.elemHeight,this.element.offsetHeight),i;this.xCorr=f<0&&-a;this.yCorr=g<0&&-h;i=f*g<0;this.xCorr+=g*b*(i?1-c:c);this.yCorr-=f*b*(d?i?c:1-c:1);e&&e!=="left"&&(this.xCorr-=a*c*(f<0?-1:1),d&&(this.yCorr-=h*c*(g<0?-1:1)),E(this.element,{textAlign:e}))},pathToVML:function(a){for(var b=a.length,c=[];b--;)if(ka(a[b]))c[b]=s(a[b]*10)-5;else if(a[b]==="Z")c[b]="x";else if(c[b]=a[b],a.isArc&&(a[b]==="wa"||a[b]==="at"))c[b+5]===
c[b+7]&&(c[b+7]+=a[b+7]>a[b+5]?1:-1),c[b+6]===c[b+8]&&(c[b+8]+=a[b+8]>a[b+6]?1:-1);return c.join(" ")||"x"},clip:function(a){var b=this,c;a?(c=a.members,oa(c,b),c.push(b),b.destroyClip=function(){oa(c,b)},a=a.getCSS(b)):(b.destroyClip&&b.destroyClip(),a={clip:lb?"inherit":"rect(auto)"});return b.css(a)},css:Z.prototype.htmlCss,safeRemoveChild:function(a){a.parentNode&&Sa(a)},destroy:function(){this.destroyClip&&this.destroyClip();return Z.prototype.destroy.apply(this)},on:function(a,b){this.element["on"+
a]=function(){var a=W.event;a.target=a.srcElement;b(a)};return this},cutOffPath:function(a,b){var c,a=a.split(/[ ,]/);c=a.length;if(c===9||c===11)a[c-4]=a[c-2]=J(a[c-2])-10*b;return a.join(" ")},shadow:function(a,b,c){var d=[],e,f=this.element,g=this.renderer,h,i=f.style,k,j=f.path,l,m,n,p;j&&typeof j.value!=="string"&&(j="x");m=j;if(a){n=o(a.width,3);p=(a.opacity||0.15)/n;for(e=1;e<=3;e++){l=n*2+1-2*e;c&&(m=this.cutOffPath(j.value,l+0.5));k=['<shape isShadow="true" strokeweight="',l,'" filled="false" path="',
m,'" coordsize="10 10" style="',f.style.cssText,'" />'];h=Y(g.prepVML(k),null,{left:J(i.left)+o(a.offsetX,1),top:J(i.top)+o(a.offsetY,1)});if(c)h.cutOff=l+1;k=['<stroke color="',a.color||"black",'" opacity="',p*e,'"/>'];Y(g.prepVML(k),null,null,h);b?b.element.appendChild(h):f.parentNode.insertBefore(h,f);d.push(h)}this.shadows=d}return this},updateShadows:ma,setAttr:function(a,b){lb?this.element[a]=b:this.element.setAttribute(a,b)},classSetter:function(a){this.element.className=a},dashstyleSetter:function(a,
b,c){(c.getElementsByTagName("stroke")[0]||Y(this.renderer.prepVML(["<stroke/>"]),null,null,c))[b]=a||"solid";this[b]=a},dSetter:function(a,b,c){var d=this.shadows,a=a||[];this.d=a.join(" ");c.path=a=this.pathToVML(a);if(d)for(c=d.length;c--;)d[c].path=d[c].cutOff?this.cutOffPath(a,d[c].cutOff):a;this.setAttr(b,a)},fillSetter:function(a,b,c){var d=c.nodeName;if(d==="SPAN")c.style.color=a;else if(d!=="IMG")c.filled=a!==X,this.setAttr("fillcolor",this.renderer.color(a,c,b,this))},opacitySetter:ma,rotationSetter:function(a,
b,c){c=c.style;this[b]=c[b]=a;c.left=-s(ha(a*Ma)+1)+"px";c.top=s(ca(a*Ma))+"px"},strokeSetter:function(a,b,c){this.setAttr("strokecolor",this.renderer.color(a,c,b))},"stroke-widthSetter":function(a,b,c){c.stroked=!!a;this[b]=a;ka(a)&&(a+="px");this.setAttr("strokeweight",a)},titleSetter:function(a,b){this.setAttr(b,a)},visibilitySetter:function(a,b,c){a==="inherit"&&(a="visible");this.shadows&&q(this.shadows,function(c){c.style[b]=a});c.nodeName==="DIV"&&(a=a==="hidden"?"-999em":0,lb||(c.style[b]=
a?"visible":"hidden"),b="top");c.style[b]=a},xSetter:function(a,b,c){this[b]=a;b==="x"?b="left":b==="y"&&(b="top");this.updateClipping?(this[b]=a,this.updateClipping()):c.style[b]=a},zIndexSetter:function(a,b,c){c.style[b]=a}},da=fa(Z,da),da.prototype.ySetter=da.prototype.widthSetter=da.prototype.heightSetter=da.prototype.xSetter,da={Element:da,isIE8:Da.indexOf("MSIE 8.0")>-1,init:function(a,b,c,d){var e;this.alignedObjects=[];d=this.createElement(Ta).css(v(this.getStyle(d),{position:"relative"}));
e=d.element;a.appendChild(d.element);this.isVML=!0;this.box=e;this.boxWrapper=d;this.cache={};this.setSize(b,c,!1);if(!B.namespaces.hcv){B.namespaces.add("hcv","urn:schemas-microsoft-com:vml");try{B.createStyleSheet().cssText="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}catch(f){B.styleSheets[0].cssText+="hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke{ behavior:url(#default#VML); display: inline-block; } "}}},isHidden:function(){return!this.box.offsetWidth},
clipRect:function(a,b,c,d){var e=this.createElement(),f=ea(a);return v(e,{members:[],left:(f?a.x:a)+1,top:(f?a.y:b)+1,width:(f?a.width:c)-1,height:(f?a.height:d)-1,getCSS:function(a){var b=a.element,c=b.nodeName,a=a.inverted,d=this.top-(c==="shape"?b.offsetTop:0),e=this.left,b=e+this.width,f=d+this.height,d={clip:"rect("+s(a?e:d)+"px,"+s(a?f:b)+"px,"+s(a?b:f)+"px,"+s(a?d:e)+"px)"};!a&&lb&&c==="DIV"&&v(d,{width:b+"px",height:f+"px"});return d},updateClipping:function(){q(e.members,function(a){a.element&&
a.css(e.getCSS(a))})}})},color:function(a,b,c,d){var e=this,f,g=/^rgba/,h,i,k=X;a&&a.linearGradient?i="gradient":a&&a.radialGradient&&(i="pattern");if(i){var j,l,m=a.linearGradient||a.radialGradient,n,p,u,o,G,x="",a=a.stops,r,t=[],s=function(){h=['<fill colors="'+t.join(",")+'" opacity="',u,'" o:opacity2="',p,'" type="',i,'" ',x,'focus="100%" method="any" />'];Y(e.prepVML(h),null,null,b)};n=a[0];r=a[a.length-1];n[0]>0&&a.unshift([0,n[1]]);r[0]<1&&a.push([1,r[1]]);q(a,function(a,b){g.test(a[1])?(f=
Fa(a[1]),j=f.get("rgb"),l=f.get("a")):(j=a[1],l=1);t.push(a[0]*100+"% "+j);b?(u=l,o=j):(p=l,G=j)});if(c==="fill")if(i==="gradient")c=m.x1||m[0]||0,a=m.y1||m[1]||0,n=m.x2||m[2]||0,m=m.y2||m[3]||0,x='angle="'+(90-U.atan((m-a)/(n-c))*180/qa)+'"',s();else{var k=m.r,w=k*2,v=k*2,y=m.cx,D=m.cy,ra=b.radialReference,z,k=function(){ra&&(z=d.getBBox(),y+=(ra[0]-z.x)/z.width-0.5,D+=(ra[1]-z.y)/z.height-0.5,w*=ra[2]/z.width,v*=ra[2]/z.height);x='src="'+I.global.VMLRadialGradientURL+'" size="'+w+","+v+'" origin="0.5,0.5" position="'+
y+","+D+'" color2="'+G+'" ';s()};d.added?k():d.onAdd=k;k=o}else k=j}else if(g.test(a)&&b.tagName!=="IMG")f=Fa(a),h=["<",c,' opacity="',f.get("a"),'"/>'],Y(this.prepVML(h),null,null,b),k=f.get("rgb");else{k=b.getElementsByTagName(c);if(k.length)k[0].opacity=1,k[0].type="solid";k=a}return k},prepVML:function(a){var b=this.isIE8,a=a.join("");b?(a=a.replace("/>",' xmlns="urn:schemas-microsoft-com:vml" />'),a=a.indexOf('style="')===-1?a.replace("/>",' style="display:inline-block;behavior:url(#default#VML);" />'):
a.replace('style="','style="display:inline-block;behavior:url(#default#VML);')):a=a.replace("<","<hcv:");return a},text:ja.prototype.html,path:function(a){var b={coordsize:"10 10"};Pa(a)?b.d=a:ea(a)&&v(b,a);return this.createElement("shape").attr(b)},circle:function(a,b,c){var d=this.symbol("circle");if(ea(a))c=a.r,b=a.y,a=a.x;d.isCircle=!0;d.r=c;return d.attr({x:a,y:b})},g:function(a){var b;a&&(b={className:"highcharts-"+a,"class":"highcharts-"+a});return this.createElement(Ta).attr(b)},image:function(a,
b,c,d,e){var f=this.createElement("img").attr({src:a});arguments.length>1&&f.attr({x:b,y:c,width:d,height:e});return f},createElement:function(a){return a==="rect"?this.symbol(a):ja.prototype.createElement.call(this,a)},invertChild:function(a,b){var c=this,d=b.style,e=a.tagName==="IMG"&&a.style;E(a,{flip:"x",left:J(d.width)-(e?J(e.top):1),top:J(d.height)-(e?J(e.left):1),rotation:-90});q(a.childNodes,function(b){c.invertChild(b,a)})},symbols:{arc:function(a,b,c,d,e){var f=e.start,g=e.end,h=e.r||c||
d,c=e.innerR,d=ca(f),i=ha(f),k=ca(g),j=ha(g);if(g-f===0)return["x"];f=["wa",a-h,b-h,a+h,b+h,a+h*d,b+h*i,a+h*k,b+h*j];e.open&&!c&&f.push("e","M",a,b);f.push("at",a-c,b-c,a+c,b+c,a+c*k,b+c*j,a+c*d,b+c*i,"x","e");f.isArc=!0;return f},circle:function(a,b,c,d,e){e&&(c=d=2*e.r);e&&e.isCircle&&(a-=c/2,b-=d/2);return["wa",a,b,a+c,b+d,a+c,b+d/2,a+c,b+d/2,"e"]},rect:function(a,b,c,d,e){return ja.prototype.symbols[!t(e)||!e.r?"square":"callout"].call(0,a,b,c,d,e)}}},P.VMLRenderer=gb=function(){this.init.apply(this,
arguments)},gb.prototype=y(ja.prototype,da),Wa=gb;ja.prototype.measureSpanWidth=function(a,b){var c=B.createElement("span"),d;d=B.createTextNode(a);c.appendChild(d);E(c,b);this.box.appendChild(c);d=c.offsetWidth;Sa(c);return d};var Vb;if(ia)P.CanVGRenderer=da=function(){Ea="http://www.w3.org/1999/xhtml"},da.prototype.symbols={},Vb=function(){function a(){var a=b.length,d;for(d=0;d<a;d++)b[d]();b=[]}var b=[];return{push:function(c,d){b.length===0&&ac(d,a);b.push(c)}}}(),Wa=da;Za.prototype={addLabel:function(){var a=
this.axis,b=a.options,c=a.chart,d=a.horiz,e=a.categories,f=a.names,g=this.pos,h=b.labels,i=a.tickPositions,d=d&&e&&!h.step&&!h.staggerLines&&!h.rotation&&c.plotWidth/i.length||!d&&(c.margin[3]||c.chartWidth*0.33),k=g===i[0],j=g===i[i.length-1],l,f=e?o(e[g],f[g],g):g,e=this.label,m=i.info;a.isDatetimeAxis&&m&&(l=b.dateTimeLabelFormats[m.higherRanks[g]||m.unitName]);this.isFirst=k;this.isLast=j;b=a.labelFormatter.call({axis:a,chart:c,isFirst:k,isLast:j,dateTimeLabelFormat:l,value:a.isLog?ga(na(f)):
f});g=d&&{width:w(1,s(d-2*(h.padding||10)))+"px"};g=v(g,h.style);if(t(e))e&&e.attr({text:b}).css(g);else{l={align:a.labelAlign};if(ka(h.rotation))l.rotation=h.rotation;if(d&&h.ellipsis)l._clipHeight=a.len/i.length;this.label=t(b)&&h.enabled?c.renderer.text(b,0,0,h.useHTML).attr(l).css(g).add(a.labelGroup):null}},getLabelSize:function(){var a=this.label,b=this.axis;return a?a.getBBox()[b.horiz?"height":"width"]:0},getLabelSides:function(){var a=this.label.getBBox(),b=this.axis,c=b.horiz,d=b.options.labels,
a=c?a.width:a.height,b=c?d.x-a*{left:0,center:0.5,right:1}[b.labelAlign]:0;return[b,c?a+b:a]},handleOverflow:function(a,b){var c=!0,d=this.axis,e=this.isFirst,f=this.isLast,g=d.horiz?b.x:b.y,h=d.reversed,i=d.tickPositions,k=this.getLabelSides(),j=k[0],k=k[1],l,m,n,p=this.label.line||0;l=d.labelEdge;m=d.justifyLabels&&(e||f);l[p]===r||g+j>l[p]?l[p]=g+k:m||(c=!1);if(m){l=(m=d.justifyToPlot)?d.pos:0;m=m?l+d.len:d.chart.chartWidth;do a+=e?1:-1,n=d.ticks[i[a]];while(i[a]&&(!n||n.label.line!==p));d=n&&
n.label.xy&&n.label.xy.x+n.getLabelSides()[e?0:1];e&&!h||f&&h?g+j<l&&(g=l-j,n&&g+k>d&&(c=!1)):g+k>m&&(g=m-k,n&&g+j<d&&(c=!1));b.x=g}return c},getPosition:function(a,b,c,d){var e=this.axis,f=e.chart,g=d&&f.oldChartHeight||f.chartHeight;return{x:a?e.translate(b+c,null,null,d)+e.transB:e.left+e.offset+(e.opposite?(d&&f.oldChartWidth||f.chartWidth)-e.right-e.left:0),y:a?g-e.bottom+e.offset-(e.opposite?e.height:0):g-e.translate(b+c,null,null,d)-e.transB}},getLabelPosition:function(a,b,c,d,e,f,g,h){var i=
this.axis,k=i.transA,j=i.reversed,l=i.staggerLines,m=i.chart.renderer.fontMetrics(e.style.fontSize).b,n=e.rotation,a=a+e.x-(f&&d?f*k*(j?-1:1):0),b=b+e.y-(f&&!d?f*k*(j?1:-1):0);n&&i.side===2&&(b-=m-m*ca(n*Ma));!t(e.y)&&!n&&(b+=m-c.getBBox().height/2);if(l)c.line=g/(h||1)%l,b+=c.line*(i.labelOffset/l);return{x:a,y:b}},getMarkPath:function(a,b,c,d,e,f){return f.crispLine(["M",a,b,"L",a+(e?0:-c),b+(e?c:0)],d)},render:function(a,b,c){var d=this.axis,e=d.options,f=d.chart.renderer,g=d.horiz,h=this.type,
i=this.label,k=this.pos,j=e.labels,l=this.gridLine,m=h?h+"Grid":"grid",n=h?h+"Tick":"tick",p=e[m+"LineWidth"],u=e[m+"LineColor"],q=e[m+"LineDashStyle"],G=e[n+"Length"],m=e[n+"Width"]||0,x=e[n+"Color"],t=e[n+"Position"],n=this.mark,s=j.step,w=!0,v=d.tickmarkOffset,y=this.getPosition(g,k,v,b),z=y.x,y=y.y,D=g&&z===d.pos+d.len||!g&&y===d.pos?-1:1;this.isActive=!0;if(p){k=d.getPlotLinePath(k+v,p*D,b,!0);if(l===r){l={stroke:u,"stroke-width":p};if(q)l.dashstyle=q;if(!h)l.zIndex=1;if(b)l.opacity=0;this.gridLine=
l=p?f.path(k).attr(l).add(d.gridGroup):null}if(!b&&l&&k)l[this.isNew?"attr":"animate"]({d:k,opacity:c})}if(m&&G)t==="inside"&&(G=-G),d.opposite&&(G=-G),h=this.getMarkPath(z,y,G,m*D,g,f),n?n.animate({d:h,opacity:c}):this.mark=f.path(h).attr({stroke:x,"stroke-width":m,opacity:c}).add(d.axisGroup);if(i&&!isNaN(z))i.xy=y=this.getLabelPosition(z,y,i,g,j,v,a,s),this.isFirst&&!this.isLast&&!o(e.showFirstLabel,1)||this.isLast&&!this.isFirst&&!o(e.showLastLabel,1)?w=!1:!d.isRadial&&!j.step&&!j.rotation&&!b&&
c!==0&&(w=this.handleOverflow(a,y)),s&&a%s&&(w=!1),w&&!isNaN(y.y)?(y.opacity=c,i[this.isNew?"attr":"animate"](y),this.isNew=!1):i.attr("y",-9999)},destroy:function(){Ka(this,this.axis)}};P.PlotLineOrBand=function(a,b){this.axis=a;if(b)this.options=b,this.id=b.id};P.PlotLineOrBand.prototype={render:function(){var a=this,b=a.axis,c=b.horiz,d=(b.pointRange||0)/2,e=a.options,f=e.label,g=a.label,h=e.width,i=e.to,k=e.from,j=t(k)&&t(i),l=e.value,m=e.dashStyle,n=a.svgElem,p=[],u,q=e.color,G=e.zIndex,x=e.events,
r={},s=b.chart.renderer;b.isLog&&(k=Ga(k),i=Ga(i),l=Ga(l));if(h){if(p=b.getPlotLinePath(l,h),r={stroke:q,"stroke-width":h},m)r.dashstyle=m}else if(j){k=w(k,b.min-d);i=z(i,b.max+d);p=b.getPlotBandPath(k,i,e);if(q)r.fill=q;if(e.borderWidth)r.stroke=e.borderColor,r["stroke-width"]=e.borderWidth}else return;if(t(G))r.zIndex=G;if(n)if(p)n.animate({d:p},null,n.onGetPath);else{if(n.hide(),n.onGetPath=function(){n.show()},g)a.label=g=g.destroy()}else if(p&&p.length&&(a.svgElem=n=s.path(p).attr(r).add(),x))for(u in d=
function(b){n.on(b,function(c){x[b].apply(a,[c])})},x)d(u);if(f&&t(f.text)&&p&&p.length&&b.width>0&&b.height>0){f=y({align:c&&j&&"center",x:c?!j&&4:10,verticalAlign:!c&&j&&"middle",y:c?j?16:10:j?6:-4,rotation:c&&!j&&90},f);if(!g){r={align:f.textAlign||f.align,rotation:f.rotation};if(t(G))r.zIndex=G;a.label=g=s.text(f.text,0,0,f.useHTML).attr(r).css(f.style).add()}b=[p[1],p[4],o(p[6],p[1])];p=[p[2],p[5],o(p[7],p[2])];c=Ra(b);j=Ra(p);g.align(f,!1,{x:c,y:j,width:Ba(b)-c,height:Ba(p)-j});g.show()}else g&&
g.hide();return a},destroy:function(){oa(this.axis.plotLinesAndBands,this);delete this.axis;Ka(this)}};F.prototype={defaultOptions:{dateTimeLabelFormats:{millisecond:"%H:%M:%S.%L",second:"%H:%M:%S",minute:"%H:%M",hour:"%H:%M",day:"%e. %b",week:"%e. %b",month:"%b '%y",year:"%Y"},endOnTick:!1,gridLineColor:"#C0C0C0",labels:Q,lineColor:"#C0D0E0",lineWidth:1,minPadding:0.01,maxPadding:0.01,minorGridLineColor:"#E0E0E0",minorGridLineWidth:1,minorTickColor:"#A0A0A0",minorTickLength:2,minorTickPosition:"outside",
startOfWeek:1,startOnTick:!1,tickColor:"#C0D0E0",tickLength:10,tickmarkPlacement:"between",tickPixelInterval:100,tickPosition:"outside",tickWidth:1,title:{align:"middle",style:{color:"#707070"}},type:"linear"},defaultYAxisOptions:{endOnTick:!0,gridLineWidth:1,tickPixelInterval:72,showLastLabel:!0,labels:{x:-8,y:3},lineWidth:0,maxPadding:0.05,minPadding:0.05,startOnTick:!0,tickWidth:0,title:{rotation:270,text:"Values"},stackLabels:{enabled:!1,formatter:function(){return Ia(this.total,-1)},style:Q.style}},
defaultLeftAxisOptions:{labels:{x:-15,y:null},title:{rotation:270}},defaultRightAxisOptions:{labels:{x:15,y:null},title:{rotation:90}},defaultBottomAxisOptions:{labels:{x:0,y:20},title:{rotation:0}},defaultTopAxisOptions:{labels:{x:0,y:-15},title:{rotation:0}},init:function(a,b){var c=b.isX;this.horiz=a.inverted?!c:c;this.coll=(this.isXAxis=c)?"xAxis":"yAxis";this.opposite=b.opposite;this.side=b.side||(this.horiz?this.opposite?0:2:this.opposite?1:3);this.setOptions(b);var d=this.options,e=d.type;
this.labelFormatter=d.labels.formatter||this.defaultLabelFormatter;this.userOptions=b;this.minPixelPadding=0;this.chart=a;this.reversed=d.reversed;this.zoomEnabled=d.zoomEnabled!==!1;this.categories=d.categories||e==="category";this.names=[];this.isLog=e==="logarithmic";this.isDatetimeAxis=e==="datetime";this.isLinked=t(d.linkedTo);this.tickmarkOffset=this.categories&&d.tickmarkPlacement==="between"?0.5:0;this.ticks={};this.labelEdge=[];this.minorTicks={};this.plotLinesAndBands=[];this.alternateBands=
{};this.len=0;this.minRange=this.userMinRange=d.minRange||d.maxZoom;this.range=d.range;this.offset=d.offset||0;this.stacks={};this.oldStacks={};this.min=this.max=null;this.crosshair=o(d.crosshair,la(a.options.tooltip.crosshairs)[c?0:1],!1);var f,d=this.options.events;wa(this,a.axes)===-1&&(c&&!this.isColorAxis?a.axes.splice(a.xAxis.length,0,this):a.axes.push(this),a[this.coll].push(this));this.series=this.series||[];if(a.inverted&&c&&this.reversed===r)this.reversed=!0;this.removePlotLine=this.removePlotBand=
this.removePlotBandOrLine;for(f in d)A(this,f,d[f]);if(this.isLog)this.val2lin=Ga,this.lin2val=na},setOptions:function(a){this.options=y(this.defaultOptions,this.isXAxis?{}:this.defaultYAxisOptions,[this.defaultTopAxisOptions,this.defaultRightAxisOptions,this.defaultBottomAxisOptions,this.defaultLeftAxisOptions][this.side],y(I[this.coll],a))},defaultLabelFormatter:function(){var a=this.axis,b=this.value,c=a.categories,d=this.dateTimeLabelFormat,e=I.lang.numericSymbols,f=e&&e.length,g,h=a.options.labels.format,
a=a.isLog?b:a.tickInterval;if(h)g=Ja(h,this);else if(c)g=b;else if(d)g=ua(d,b);else if(f&&a>=1E3)for(;f--&&g===r;)c=Math.pow(1E3,f+1),a>=c&&e[f]!==null&&(g=Ia(b/c,-1)+e[f]);g===r&&(g=b>=1E4?Ia(b,0):Ia(b,-1,r,""));return g},getSeriesExtremes:function(){var a=this,b=a.chart;a.hasVisibleSeries=!1;a.dataMin=a.dataMax=null;a.buildStacks&&a.buildStacks();q(a.series,function(c){if(c.visible||!b.options.chart.ignoreHiddenSeries){var d;d=c.options.threshold;var e;a.hasVisibleSeries=!0;a.isLog&&d<=0&&(d=null);
if(a.isXAxis){if(d=c.xData,d.length)a.dataMin=z(o(a.dataMin,d[0]),Ra(d)),a.dataMax=w(o(a.dataMax,d[0]),Ba(d))}else{c.getExtremes();e=c.dataMax;c=c.dataMin;if(t(c)&&t(e))a.dataMin=z(o(a.dataMin,c),c),a.dataMax=w(o(a.dataMax,e),e);if(t(d))if(a.dataMin>=d)a.dataMin=d,a.ignoreMinPadding=!0;else if(a.dataMax<d)a.dataMax=d,a.ignoreMaxPadding=!0}}})},translate:function(a,b,c,d,e,f){var g=1,h=0,i=d?this.oldTransA:this.transA,d=d?this.oldMin:this.min,k=this.minPixelPadding,e=(this.options.ordinal||this.isLog&&
e)&&this.lin2val;if(!i)i=this.transA;if(c)g*=-1,h=this.len;this.reversed&&(g*=-1,h-=g*(this.sector||this.len));b?(a=a*g+h,a-=k,a=a/i+d,e&&(a=this.lin2val(a))):(e&&(a=this.val2lin(a)),f==="between"&&(f=0.5),a=g*(a-d)*i+h+g*k+(ka(f)?i*f*this.pointRange:0));return a},toPixels:function(a,b){return this.translate(a,!1,!this.horiz,null,!0)+(b?0:this.pos)},toValue:function(a,b){return this.translate(a-(b?0:this.pos),!0,!this.horiz,null,!0)},getPlotLinePath:function(a,b,c,d,e){var f=this.chart,g=this.left,
h=this.top,i,k,j=c&&f.oldChartHeight||f.chartHeight,l=c&&f.oldChartWidth||f.chartWidth,m;i=this.transB;e=o(e,this.translate(a,null,null,c));a=c=s(e+i);i=k=s(j-e-i);if(isNaN(e))m=!0;else if(this.horiz){if(i=h,k=j-this.bottom,a<g||a>g+this.width)m=!0}else if(a=g,c=l-this.right,i<h||i>h+this.height)m=!0;return m&&!d?null:f.renderer.crispLine(["M",a,i,"L",c,k],b||1)},getLinearTickPositions:function(a,b,c){var d,e=ga(S(b/a)*a),f=ga(Va(c/a)*a),g=[];if(b===c&&ka(b))return[b];for(b=e;b<=f;){g.push(b);b=ga(b+
a);if(b===d)break;d=b}return g},getMinorTickPositions:function(){var a=this.options,b=this.tickPositions,c=this.minorTickInterval,d=[],e;if(this.isLog){e=b.length;for(a=1;a<e;a++)d=d.concat(this.getLogTickPositions(c,b[a-1],b[a],!0))}else if(this.isDatetimeAxis&&a.minorTickInterval==="auto")d=d.concat(this.getTimeTicks(this.normalizeTimeTickInterval(c),this.min,this.max,a.startOfWeek)),d[0]<this.min&&d.shift();else for(b=this.min+(b[0]-this.min)%c;b<=this.max;b+=c)d.push(b);return d},adjustForMinRange:function(){var a=
this.options,b=this.min,c=this.max,d,e=this.dataMax-this.dataMin>=this.minRange,f,g,h,i,k;if(this.isXAxis&&this.minRange===r&&!this.isLog)t(a.min)||t(a.max)?this.minRange=null:(q(this.series,function(a){i=a.xData;for(g=k=a.xIncrement?1:i.length-1;g>0;g--)if(h=i[g]-i[g-1],f===r||h<f)f=h}),this.minRange=z(f*5,this.dataMax-this.dataMin));if(c-b<this.minRange){var j=this.minRange;d=(j-c+b)/2;d=[b-d,o(a.min,b-d)];if(e)d[2]=this.dataMin;b=Ba(d);c=[b+j,o(a.max,b+j)];if(e)c[2]=this.dataMax;c=Ra(c);c-b<j&&
(d[0]=c-j,d[1]=o(a.min,c-j),b=Ba(d))}this.min=b;this.max=c},setAxisTranslation:function(a){var b=this,c=b.max-b.min,d=b.axisPointRange||0,e,f=0,g=0,h=b.linkedParent,i=!!b.categories,k=b.transA;if(b.isXAxis||i||d)h?(f=h.minPointOffset,g=h.pointRangePadding):q(b.series,function(a){var h=i?1:b.isXAxis?a.pointRange:b.axisPointRange||0,k=a.options.pointPlacement,n=a.closestPointRange;h>c&&(h=0);d=w(d,h);f=w(f,Oa(k)?0:h/2);g=w(g,k==="on"?0:h);!a.noSharedTooltip&&t(n)&&(e=t(e)?z(e,n):n)}),h=b.ordinalSlope&&
e?b.ordinalSlope/e:1,b.minPointOffset=f*=h,b.pointRangePadding=g*=h,b.pointRange=z(d,c),b.closestPointRange=e;if(a)b.oldTransA=k;b.translationSlope=b.transA=k=b.len/(c+g||1);b.transB=b.horiz?b.left:b.bottom;b.minPixelPadding=k*f},setTickPositions:function(a){var b=this,c=b.chart,d=b.options,e=b.isLog,f=b.isDatetimeAxis,g=b.isXAxis,h=b.isLinked,i=b.options.tickPositioner,k=d.maxPadding,j=d.minPadding,l=d.tickInterval,m=d.minTickInterval,n=d.tickPixelInterval,p,u=b.categories;h?(b.linkedParent=c[b.coll][d.linkedTo],
c=b.linkedParent.getExtremes(),b.min=o(c.min,c.dataMin),b.max=o(c.max,c.dataMax),d.type!==b.linkedParent.options.type&&pa(11,1)):(b.min=o(b.userMin,d.min,b.dataMin),b.max=o(b.userMax,d.max,b.dataMax));if(e)!a&&z(b.min,o(b.dataMin,b.min))<=0&&pa(10,1),b.min=ga(Ga(b.min)),b.max=ga(Ga(b.max));if(b.range&&t(b.max))b.userMin=b.min=w(b.min,b.max-b.range),b.userMax=b.max,b.range=null;b.beforePadding&&b.beforePadding();b.adjustForMinRange();if(!u&&!b.axisPointRange&&!b.usePercentage&&!h&&t(b.min)&&t(b.max)&&
(c=b.max-b.min)){if(!t(d.min)&&!t(b.userMin)&&j&&(b.dataMin<0||!b.ignoreMinPadding))b.min-=c*j;if(!t(d.max)&&!t(b.userMax)&&k&&(b.dataMax>0||!b.ignoreMaxPadding))b.max+=c*k}if(ka(d.floor))b.min=w(b.min,d.floor);if(ka(d.ceiling))b.max=z(b.max,d.ceiling);b.min===b.max||b.min===void 0||b.max===void 0?b.tickInterval=1:h&&!l&&n===b.linkedParent.options.tickPixelInterval?b.tickInterval=b.linkedParent.tickInterval:(b.tickInterval=o(l,u?1:(b.max-b.min)*n/w(b.len,n)),!t(l)&&b.len<n&&!this.isRadial&&!this.isLog&&
!u&&d.startOnTick&&d.endOnTick&&(p=!0,b.tickInterval/=4));g&&!a&&q(b.series,function(a){a.processData(b.min!==b.oldMin||b.max!==b.oldMax)});b.setAxisTranslation(!0);b.beforeSetTickPositions&&b.beforeSetTickPositions();if(b.postProcessTickInterval)b.tickInterval=b.postProcessTickInterval(b.tickInterval);if(b.pointRange)b.tickInterval=w(b.pointRange,b.tickInterval);if(!l&&b.tickInterval<m)b.tickInterval=m;if(!f&&!e&&!l)b.tickInterval=sb(b.tickInterval,null,rb(b.tickInterval),d);b.minorTickInterval=
d.minorTickInterval==="auto"&&b.tickInterval?b.tickInterval/5:d.minorTickInterval;b.tickPositions=a=d.tickPositions?[].concat(d.tickPositions):i&&i.apply(b,[b.min,b.max]);if(!a)!b.ordinalPositions&&(b.max-b.min)/b.tickInterval>w(2*b.len,200)&&pa(19,!0),a=f?b.getTimeTicks(b.normalizeTimeTickInterval(b.tickInterval,d.units),b.min,b.max,d.startOfWeek,b.ordinalPositions,b.closestPointRange,!0):e?b.getLogTickPositions(b.tickInterval,b.min,b.max):b.getLinearTickPositions(b.tickInterval,b.min,b.max),p&&
a.splice(1,a.length-2),b.tickPositions=a;if(!h)e=a[0],f=a[a.length-1],h=b.minPointOffset||0,d.startOnTick?b.min=e:b.min-h>e&&a.shift(),d.endOnTick?b.max=f:b.max+h<f&&a.pop(),a.length===1&&(d=N(b.max)>1E13?1:0.001,b.min-=d,b.max+=d)},setMaxTicks:function(){var a=this.chart,b=a.maxTicks||{},c=this.tickPositions,d=this._maxTicksKey=[this.coll,this.pos,this.len].join("-");if(!this.isLinked&&!this.isDatetimeAxis&&c&&c.length>(b[d]||0)&&this.options.alignTicks!==!1)b[d]=c.length;a.maxTicks=b},adjustTickAmount:function(){var a=
this._maxTicksKey,b=this.tickPositions,c=this.chart.maxTicks;if(c&&c[a]&&!this.isDatetimeAxis&&!this.categories&&!this.isLinked&&this.options.alignTicks!==!1&&this.min!==r){var d=this.tickAmount,e=b.length;this.tickAmount=a=c[a];if(e<a){for(;b.length<a;)b.push(ga(b[b.length-1]+this.tickInterval));this.transA*=(e-1)/(a-1);this.max=b[b.length-1]}if(t(d)&&a!==d)this.isDirty=!0}},setScale:function(){var a=this.stacks,b,c,d,e;this.oldMin=this.min;this.oldMax=this.max;this.oldAxisLength=this.len;this.setAxisSize();
e=this.len!==this.oldAxisLength;q(this.series,function(a){if(a.isDirtyData||a.isDirty||a.xAxis.isDirty)d=!0});if(e||d||this.isLinked||this.forceRedraw||this.userMin!==this.oldUserMin||this.userMax!==this.oldUserMax){if(!this.isXAxis)for(b in a)for(c in a[b])a[b][c].total=null,a[b][c].cum=0;this.forceRedraw=!1;this.getSeriesExtremes();this.setTickPositions();this.oldUserMin=this.userMin;this.oldUserMax=this.userMax;if(!this.isDirty)this.isDirty=e||this.min!==this.oldMin||this.max!==this.oldMax}else if(!this.isXAxis){if(this.oldStacks)a=
this.stacks=this.oldStacks;for(b in a)for(c in a[b])a[b][c].cum=a[b][c].total}this.setMaxTicks()},setExtremes:function(a,b,c,d,e){var f=this,g=f.chart,c=o(c,!0),e=v(e,{min:a,max:b});K(f,"setExtremes",e,function(){f.userMin=a;f.userMax=b;f.eventArgs=e;f.isDirtyExtremes=!0;c&&g.redraw(d)})},zoom:function(a,b){var c=this.dataMin,d=this.dataMax,e=this.options;this.allowZoomOutside||(t(c)&&a<=z(c,o(e.min,c))&&(a=r),t(d)&&b>=w(d,o(e.max,d))&&(b=r));this.displayBtn=a!==r||b!==r;this.setExtremes(a,b,!1,r,
{trigger:"zoom"});return!0},setAxisSize:function(){var a=this.chart,b=this.options,c=b.offsetLeft||0,d=this.horiz,e=o(b.width,a.plotWidth-c+(b.offsetRight||0)),f=o(b.height,a.plotHeight),g=o(b.top,a.plotTop),b=o(b.left,a.plotLeft+c),c=/%$/;c.test(f)&&(f=parseInt(f,10)/100*a.plotHeight);c.test(g)&&(g=parseInt(g,10)/100*a.plotHeight+a.plotTop);this.left=b;this.top=g;this.width=e;this.height=f;this.bottom=a.chartHeight-f-g;this.right=a.chartWidth-e-b;this.len=w(d?e:f,0);this.pos=d?b:g},getExtremes:function(){var a=
this.isLog;return{min:a?ga(na(this.min)):this.min,max:a?ga(na(this.max)):this.max,dataMin:this.dataMin,dataMax:this.dataMax,userMin:this.userMin,userMax:this.userMax}},getThreshold:function(a){var b=this.isLog,c=b?na(this.min):this.min,b=b?na(this.max):this.max;c>a||a===null?a=c:b<a&&(a=b);return this.translate(a,0,1,0,1)},autoLabelAlign:function(a){a=(o(a,0)-this.side*90+720)%360;return a>15&&a<165?"right":a>195&&a<345?"left":"center"},getOffset:function(){var a=this,b=a.chart,c=b.renderer,d=a.options,
e=a.tickPositions,f=a.ticks,g=a.horiz,h=a.side,i=b.inverted?[1,0,3,2][h]:h,k,j=0,l,m=0,n=d.title,p=d.labels,u=0,Db=b.axisOffset,G=b.clipOffset,x=[-1,1,1,-1][h],s,v=1,y=o(p.maxStaggerLines,5),z,A,B,D,ra=h===2?c.fontMetrics(p.style.fontSize).b:0;a.hasData=k=a.hasVisibleSeries||t(a.min)&&t(a.max)&&!!e;a.showAxis=b=k||o(d.showEmpty,!0);a.staggerLines=a.horiz&&p.staggerLines;if(!a.axisGroup)a.gridGroup=c.g("grid").attr({zIndex:d.gridZIndex||1}).add(),a.axisGroup=c.g("axis").attr({zIndex:d.zIndex||2}).add(),
a.labelGroup=c.g("axis-labels").attr({zIndex:p.zIndex||7}).addClass("highcharts-"+a.coll.toLowerCase()+"-labels").add();if(k||a.isLinked){a.labelAlign=o(p.align||a.autoLabelAlign(p.rotation));q(e,function(b){f[b]?f[b].addLabel():f[b]=new Za(a,b)});if(a.horiz&&!a.staggerLines&&y&&!p.rotation){for(s=a.reversed?[].concat(e).reverse():e;v<y;){k=[];z=!1;for(p=0;p<s.length;p++)A=s[p],B=(B=f[A].label&&f[A].label.getBBox())?B.width:0,D=p%v,B&&(A=a.translate(A),k[D]!==r&&A<k[D]&&(z=!0),k[D]=A+B);if(z)v++;
else break}if(v>1)a.staggerLines=v}q(e,function(b){if(h===0||h===2||{1:"left",3:"right"}[h]===a.labelAlign)u=w(f[b].getLabelSize(),u)});if(a.staggerLines)u*=a.staggerLines,a.labelOffset=u}else for(s in f)f[s].destroy(),delete f[s];if(n&&n.text&&n.enabled!==!1){if(!a.axisTitle)a.axisTitle=c.text(n.text,0,0,n.useHTML).attr({zIndex:7,rotation:n.rotation||0,align:n.textAlign||{low:"left",middle:"center",high:"right"}[n.align]}).addClass("highcharts-"+this.coll.toLowerCase()+"-title").css(n.style).add(a.axisGroup),
a.axisTitle.isNew=!0;if(b)j=a.axisTitle.getBBox()[g?"height":"width"],m=o(n.margin,g?5:10),l=n.offset;a.axisTitle[b?"show":"hide"]()}a.offset=x*o(d.offset,Db[h]);a.axisTitleMargin=o(l,u+m+(u&&x*d.labels[g?"y":"x"]-ra));Db[h]=w(Db[h],a.axisTitleMargin+j+x*a.offset);G[i]=w(G[i],S(d.lineWidth/2)*2)},getLinePath:function(a){var b=this.chart,c=this.opposite,d=this.offset,e=this.horiz,f=this.left+(c?this.width:0)+d,d=b.chartHeight-this.bottom-(c?this.height:0)+d;c&&(a*=-1);return b.renderer.crispLine(["M",
e?this.left:f,e?d:this.top,"L",e?b.chartWidth-this.right:f,e?d:b.chartHeight-this.bottom],a)},getTitlePosition:function(){var a=this.horiz,b=this.left,c=this.top,d=this.len,e=this.options.title,f=a?b:c,g=this.opposite,h=this.offset,i=J(e.style.fontSize||12),d={low:f+(a?0:d),middle:f+d/2,high:f+(a?d:0)}[e.align],b=(a?c+this.height:b)+(a?1:-1)*(g?-1:1)*this.axisTitleMargin+(this.side===2?i:0);return{x:a?d:b+(g?this.width:0)+h+(e.x||0),y:a?b-(g?this.height:0)+h:d+(e.y||0)}},render:function(){var a=this,
b=a.horiz,c=a.reversed,d=a.chart,e=d.renderer,f=a.options,g=a.isLog,h=a.isLinked,i=a.tickPositions,k,j=a.axisTitle,l=a.ticks,m=a.minorTicks,n=a.alternateBands,p=f.stackLabels,u=f.alternateGridColor,o=a.tickmarkOffset,G=f.lineWidth,x=d.hasRendered&&t(a.oldMin)&&!isNaN(a.oldMin),s=a.hasData,w=a.showAxis,v,y=f.labels.overflow,z=a.justifyLabels=b&&y!==!1,A;a.labelEdge.length=0;a.justifyToPlot=y==="justify";q([l,m,n],function(a){for(var b in a)a[b].isActive=!1});if(s||h)if(a.minorTickInterval&&!a.categories&&
q(a.getMinorTickPositions(),function(b){m[b]||(m[b]=new Za(a,b,"minor"));x&&m[b].isNew&&m[b].render(null,!0);m[b].render(null,!1,1)}),i.length&&(k=i.slice(),(b&&c||!b&&!c)&&k.reverse(),z&&(k=k.slice(1).concat([k[0]])),q(k,function(b,c){z&&(c=c===k.length-1?0:c+1);if(!h||b>=a.min&&b<=a.max)l[b]||(l[b]=new Za(a,b)),x&&l[b].isNew&&l[b].render(c,!0,0.1),l[b].render(c,!1,1)}),o&&a.min===0&&(l[-1]||(l[-1]=new Za(a,-1,null,!0)),l[-1].render(-1))),u&&q(i,function(b,c){if(c%2===0&&b<a.max)n[b]||(n[b]=new P.PlotLineOrBand(a)),
v=b+o,A=i[c+1]!==r?i[c+1]+o:a.max,n[b].options={from:g?na(v):v,to:g?na(A):A,color:u},n[b].render(),n[b].isActive=!0}),!a._addedPlotLB)q((f.plotLines||[]).concat(f.plotBands||[]),function(b){a.addPlotBandOrLine(b)}),a._addedPlotLB=!0;q([l,m,n],function(a){var b,c,e=[],f=Ca?Ca.duration||500:0,g=function(){for(c=e.length;c--;)a[e[c]]&&!a[e[c]].isActive&&(a[e[c]].destroy(),delete a[e[c]])};for(b in a)if(!a[b].isActive)a[b].render(b,!1,0),a[b].isActive=!1,e.push(b);a===n||!d.hasRendered||!f?g():f&&setTimeout(g,
f)});if(G)b=a.getLinePath(G),a.axisLine?a.axisLine.animate({d:b}):a.axisLine=e.path(b).attr({stroke:f.lineColor,"stroke-width":G,zIndex:7}).add(a.axisGroup),a.axisLine[w?"show":"hide"]();if(j&&w)j[j.isNew?"attr":"animate"](a.getTitlePosition()),j.isNew=!1;p&&p.enabled&&a.renderStackTotals();a.isDirty=!1},redraw:function(){var a=this.chart.pointer;a&&a.reset(!0);this.render();q(this.plotLinesAndBands,function(a){a.render()});q(this.series,function(a){a.isDirty=!0})},destroy:function(a){var b=this,
c=b.stacks,d,e=b.plotLinesAndBands;a||R(b);for(d in c)Ka(c[d]),c[d]=null;q([b.ticks,b.minorTicks,b.alternateBands],function(a){Ka(a)});for(a=e.length;a--;)e[a].destroy();q("stackTotalGroup,axisLine,axisTitle,axisGroup,cross,gridGroup,labelGroup".split(","),function(a){b[a]&&(b[a]=b[a].destroy())});this.cross&&this.cross.destroy()},drawCrosshair:function(a,b){if(this.crosshair)if((t(b)||!o(this.crosshair.snap,!0))===!1)this.hideCrosshair();else{var c,d=this.crosshair,e=d.animation;o(d.snap,!0)?t(b)&&
(c=this.chart.inverted!=this.horiz?b.plotX:this.len-b.plotY):c=this.horiz?a.chartX-this.pos:this.len-a.chartY+this.pos;c=this.isRadial?this.getPlotLinePath(this.isXAxis?b.x:o(b.stackY,b.y)):this.getPlotLinePath(null,null,null,null,c);if(c===null)this.hideCrosshair();else if(this.cross)this.cross.attr({visibility:"visible"})[e?"animate":"attr"]({d:c},e);else{e={"stroke-width":d.width||1,stroke:d.color||"#C0C0C0",zIndex:d.zIndex||2};if(d.dashStyle)e.dashstyle=d.dashStyle;this.cross=this.chart.renderer.path(c).attr(e).add()}}},
hideCrosshair:function(){this.cross&&this.cross.hide()}};v(F.prototype,{getPlotBandPath:function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a);d&&c?d.push(c[4],c[5],c[1],c[2]):d=null;return d},addPlotBand:function(a){this.addPlotBandOrLine(a,"plotBands")},addPlotLine:function(a){this.addPlotBandOrLine(a,"plotLines")},addPlotBandOrLine:function(a,b){var c=(new P.PlotLineOrBand(this,a)).render(),d=this.userOptions;c&&(b&&(d[b]=d[b]||[],d[b].push(a)),this.plotLinesAndBands.push(c));return c},
removePlotBandOrLine:function(a){for(var b=this.plotLinesAndBands,c=this.options,d=this.userOptions,e=b.length;e--;)b[e].id===a&&b[e].destroy();q([c.plotLines||[],d.plotLines||[],c.plotBands||[],d.plotBands||[]],function(b){for(e=b.length;e--;)b[e].id===a&&oa(b,b[e])})}});F.prototype.getTimeTicks=function(a,b,c,d){var e=[],f={},g=I.global.useUTC,h,i=new Date(b-La),k=a.unitRange,j=a.count;if(t(b)){k>=H.second&&(i.setMilliseconds(0),i.setSeconds(k>=H.minute?0:j*S(i.getSeconds()/j)));if(k>=H.minute)i[Nb](k>=
H.hour?0:j*S(i[ub]()/j));if(k>=H.hour)i[Ob](k>=H.day?0:j*S(i[vb]()/j));if(k>=H.day)i[xb](k>=H.month?1:j*S(i[Ua]()/j));k>=H.month&&(i[Pb](k>=H.year?0:j*S(i[jb]()/j)),h=i[kb]());k>=H.year&&(h-=h%j,i[Qb](h));if(k===H.week)i[xb](i[Ua]()-i[wb]()+o(d,1));b=1;La&&(i=new Date(i.getTime()+La));h=i[kb]();for(var d=i.getTime(),l=i[jb](),m=i[Ua](),n=g?La:(864E5+i.getTimezoneOffset()*6E4)%864E5;d<c;)e.push(d),k===H.year?d=ib(h+b*j,0):k===H.month?d=ib(h,l+b*j):!g&&(k===H.day||k===H.week)?d=ib(h,l,m+b*j*(k===H.day?
1:7)):d+=k*j,b++;e.push(d);q(Cb(e,function(a){return k<=H.hour&&a%H.day===n}),function(a){f[a]="day"})}e.info=v(a,{higherRanks:f,totalRange:k*j});return e};F.prototype.normalizeTimeTickInterval=function(a,b){var c=b||[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1,2]],["week",[1,2]],["month",[1,2,3,4,6]],["year",null]],d=c[c.length-1],e=H[d[0]],f=d[1],g;for(g=0;g<c.length;g++)if(d=c[g],e=H[d[0]],f=d[1],c[g+
1]&&a<=(e*f[f.length-1]+H[c[g+1][0]])/2)break;e===H.year&&a<5*e&&(f=[1,2,5]);c=sb(a/e,f,d[0]==="year"?w(rb(a/e),1):1);return{unitRange:e,count:c,unitName:d[0]}};F.prototype.getLogTickPositions=function(a,b,c,d){var e=this.options,f=this.len,g=[];if(!d)this._minorAutoInterval=null;if(a>=0.5)a=s(a),g=this.getLinearTickPositions(a,b,c);else if(a>=0.08)for(var f=S(b),h,i,k,j,l,e=a>0.3?[1,2,4]:a>0.15?[1,2,4,6,8]:[1,2,3,4,5,6,7,8,9];f<c+1&&!l;f++){i=e.length;for(h=0;h<i&&!l;h++)k=Ga(na(f)*e[h]),k>b&&(!d||
j<=c)&&g.push(j),j>c&&(l=!0),j=k}else if(b=na(b),c=na(c),a=e[d?"minorTickInterval":"tickInterval"],a=o(a==="auto"?null:a,this._minorAutoInterval,(c-b)*(e.tickPixelInterval/(d?5:1))/((d?f/this.tickPositions.length:f)||1)),a=sb(a,null,rb(a)),g=xa(this.getLinearTickPositions(a,b,c),Ga),!d)this._minorAutoInterval=a/5;if(!d)this.tickInterval=a;return g};var Hb=P.Tooltip=function(){this.init.apply(this,arguments)};Hb.prototype={init:function(a,b){var c=b.borderWidth,d=b.style,e=J(d.padding);this.chart=
a;this.options=b;this.crosshairs=[];this.now={x:0,y:0};this.isHidden=!0;this.label=a.renderer.label("",0,0,b.shape||"callout",null,null,b.useHTML,null,"tooltip").attr({padding:e,fill:b.backgroundColor,"stroke-width":c,r:b.borderRadius,zIndex:8}).css(d).css({padding:0}).add().attr({y:-9999});ia||this.label.shadow(b.shadow);this.shared=b.shared},destroy:function(){if(this.label)this.label=this.label.destroy();clearTimeout(this.hideTimer);clearTimeout(this.tooltipTimeout)},move:function(a,b,c,d){var e=
this,f=e.now,g=e.options.animation!==!1&&!e.isHidden,h=e.followPointer||e.len>1;v(f,{x:g?(2*f.x+a)/3:a,y:g?(f.y+b)/2:b,anchorX:h?r:g?(2*f.anchorX+c)/3:c,anchorY:h?r:g?(f.anchorY+d)/2:d});e.label.attr(f);if(g&&(N(a-f.x)>1||N(b-f.y)>1))clearTimeout(this.tooltipTimeout),this.tooltipTimeout=setTimeout(function(){e&&e.move(a,b,c,d)},32)},hide:function(){var a=this,b;clearTimeout(this.hideTimer);if(!this.isHidden)b=this.chart.hoverPoints,this.hideTimer=setTimeout(function(){a.label.fadeOut();a.isHidden=
!0},o(this.options.hideDelay,500)),b&&q(b,function(a){a.setState()}),this.chart.hoverPoints=null},getAnchor:function(a,b){var c,d=this.chart,e=d.inverted,f=d.plotTop,g=0,h=0,i,a=la(a);c=a[0].tooltipPos;this.followPointer&&b&&(b.chartX===r&&(b=d.pointer.normalize(b)),c=[b.chartX-d.plotLeft,b.chartY-f]);c||(q(a,function(a){i=a.series.yAxis;g+=a.plotX;h+=(a.plotLow?(a.plotLow+a.plotHigh)/2:a.plotY)+(!e&&i?i.top-f:0)}),g/=a.length,h/=a.length,c=[e?d.plotWidth-h:g,this.shared&&!e&&a.length>1&&b?b.chartY-
f:e?d.plotHeight-g:h]);return xa(c,s)},getPosition:function(a,b,c){var d=this.chart,e=this.distance,f={},g,h=["y",d.chartHeight,b,c.plotY+d.plotTop],i=["x",d.chartWidth,a,c.plotX+d.plotLeft],k=c.ttBelow||d.inverted&&!c.negative||!d.inverted&&c.negative,j=function(a,b,c,d){var g=c<d-e,b=d+e+c<b,c=d-e-c;d+=e;if(k&&b)f[a]=d;else if(!k&&g)f[a]=c;else if(g)f[a]=c;else if(b)f[a]=d;else return!1},l=function(a,b,c,d){if(d<e||d>b-e)return!1;else f[a]=d<c/2?1:d>b-c/2?b-c-2:d-c/2},m=function(a){var b=h;h=i;
i=b;g=a},n=function(){j.apply(0,h)!==!1?l.apply(0,i)===!1&&!g&&(m(!0),n()):g?f.x=f.y=0:(m(!0),n())};(d.inverted||this.len>1)&&m();n();return f},defaultFormatter:function(a){var b=this.points||la(this),c=b[0].series,d;d=[a.tooltipHeaderFormatter(b[0])];q(b,function(a){c=a.series;d.push(c.tooltipFormatter&&c.tooltipFormatter(a)||a.point.tooltipFormatter(c.tooltipOptions.pointFormat))});d.push(a.options.footerFormat||"");return d.join("")},refresh:function(a,b){var c=this.chart,d=this.label,e=this.options,
f,g,h={},i,k=[];i=e.formatter||this.defaultFormatter;var h=c.hoverPoints,j,l=this.shared;clearTimeout(this.hideTimer);this.followPointer=la(a)[0].series.tooltipOptions.followPointer;g=this.getAnchor(a,b);f=g[0];g=g[1];l&&(!a.series||!a.series.noSharedTooltip)?(c.hoverPoints=a,h&&q(h,function(a){a.setState()}),q(a,function(a){a.setState("hover");k.push(a.getLabelConfig())}),h={x:a[0].category,y:a[0].y},h.points=k,this.len=k.length,a=a[0]):h=a.getLabelConfig();i=i.call(h,this);h=a.series;this.distance=
o(h.tooltipOptions.distance,16);i===!1?this.hide():(this.isHidden&&(fb(d),d.attr("opacity",1).show()),d.attr({text:i}),j=e.borderColor||a.color||h.color||"#606060",d.attr({stroke:j}),this.updatePosition({plotX:f,plotY:g,negative:a.negative,ttBelow:a.ttBelow}),this.isHidden=!1);K(c,"tooltipRefresh",{text:i,x:f+c.plotLeft,y:g+c.plotTop,borderColor:j})},updatePosition:function(a){var b=this.chart,c=this.label,c=(this.options.positioner||this.getPosition).call(this,c.width,c.height,a);this.move(s(c.x),
s(c.y),a.plotX+b.plotLeft,a.plotY+b.plotTop)},tooltipHeaderFormatter:function(a){var b=a.series,c=b.tooltipOptions,d=c.dateTimeLabelFormats,e=c.xDateFormat,f=b.xAxis,g=f&&f.options.type==="datetime"&&ka(a.key),c=c.headerFormat,f=f&&f.closestPointRange,h;if(g&&!e){if(f)for(h in H){if(H[h]>=f||H[h]<=H.day&&a.key%H[h]>0){e=d[h];break}}else e=d.day;e=e||d.year}g&&e&&(c=c.replace("{point.key}","{point.key:"+e+"}"));return Ja(c,{point:a,series:b})}};var sa;ab=B.documentElement.ontouchstart!==r;var Xa=P.Pointer=
function(a,b){this.init(a,b)};Xa.prototype={init:function(a,b){var c=b.chart,d=c.events,e=ia?"":c.zoomType,c=a.inverted,f;this.options=b;this.chart=a;this.zoomX=f=/x/.test(e);this.zoomY=e=/y/.test(e);this.zoomHor=f&&!c||e&&c;this.zoomVert=e&&!c||f&&c;this.hasZoom=f||e;this.runChartClick=d&&!!d.click;this.pinchDown=[];this.lastValidTouch={};if(P.Tooltip&&b.tooltip.enabled)a.tooltip=new Hb(a,b.tooltip),this.followTouchMove=b.tooltip.followTouchMove;this.setDOMEvents()},normalize:function(a,b){var c,
d,a=a||window.event,a=cc(a);if(!a.target)a.target=a.srcElement;d=a.touches?a.touches.length?a.touches.item(0):a.changedTouches[0]:a;if(!b)this.chartPosition=b=bc(this.chart.container);d.pageX===r?(c=w(a.x,a.clientX-b.left),d=a.y):(c=d.pageX-b.left,d=d.pageY-b.top);return v(a,{chartX:s(c),chartY:s(d)})},getCoordinates:function(a){var b={xAxis:[],yAxis:[]};q(this.chart.axes,function(c){b[c.isXAxis?"xAxis":"yAxis"].push({axis:c,value:c.toValue(a[c.horiz?"chartX":"chartY"])})});return b},getIndex:function(a){var b=
this.chart;return b.inverted?b.plotHeight+b.plotTop-a.chartY:a.chartX-b.plotLeft},runPointActions:function(a){var b=this.chart,c=b.series,d=b.tooltip,e,f,g=b.hoverPoint,h=b.hoverSeries,i,k,j=b.chartWidth,l=this.getIndex(a);if(d&&this.options.tooltip.shared&&(!h||!h.noSharedTooltip)){f=[];i=c.length;for(k=0;k<i;k++)if(c[k].visible&&c[k].options.enableMouseTracking!==!1&&!c[k].noSharedTooltip&&c[k].singularTooltips!==!0&&c[k].tooltipPoints.length&&(e=c[k].tooltipPoints[l])&&e.series)e._dist=N(l-e.clientX),
j=z(j,e._dist),f.push(e);for(i=f.length;i--;)f[i]._dist>j&&f.splice(i,1);if(f.length&&f[0].clientX!==this.hoverX)d.refresh(f,a),this.hoverX=f[0].clientX}c=h&&h.tooltipOptions.followPointer;if(h&&h.tracker&&!c){if((e=h.tooltipPoints[l])&&e!==g)e.onMouseOver(a)}else d&&c&&!d.isHidden&&(h=d.getAnchor([{}],a),d.updatePosition({plotX:h[0],plotY:h[1]}));if(d&&!this._onDocumentMouseMove)this._onDocumentMouseMove=function(a){if($[sa])$[sa].pointer.onDocumentMouseMove(a)},A(B,"mousemove",this._onDocumentMouseMove);
q(b.axes,function(b){b.drawCrosshair(a,o(e,g))})},reset:function(a){var b=this.chart,c=b.hoverSeries,d=b.hoverPoint,e=b.tooltip,f=e&&e.shared?b.hoverPoints:d;(a=a&&e&&f)&&la(f)[0].plotX===r&&(a=!1);if(a)e.refresh(f),d&&d.setState(d.state,!0);else{if(d)d.onMouseOut();if(c)c.onMouseOut();e&&e.hide();if(this._onDocumentMouseMove)R(B,"mousemove",this._onDocumentMouseMove),this._onDocumentMouseMove=null;q(b.axes,function(a){a.hideCrosshair()});this.hoverX=null}},scaleGroups:function(a,b){var c=this.chart,
d;q(c.series,function(e){d=a||e.getPlotBox();e.xAxis&&e.xAxis.zoomEnabled&&(e.group.attr(d),e.markerGroup&&(e.markerGroup.attr(d),e.markerGroup.clip(b?c.clipRect:null)),e.dataLabelsGroup&&e.dataLabelsGroup.attr(d))});c.clipRect.attr(b||c.clipBox)},dragStart:function(a){var b=this.chart;b.mouseIsDown=a.type;b.cancelClick=!1;b.mouseDownX=this.mouseDownX=a.chartX;b.mouseDownY=this.mouseDownY=a.chartY},drag:function(a){var b=this.chart,c=b.options.chart,d=a.chartX,e=a.chartY,f=this.zoomHor,g=this.zoomVert,
h=b.plotLeft,i=b.plotTop,k=b.plotWidth,j=b.plotHeight,l,m=this.mouseDownX,n=this.mouseDownY;d<h?d=h:d>h+k&&(d=h+k);e<i?e=i:e>i+j&&(e=i+j);this.hasDragged=Math.sqrt(Math.pow(m-d,2)+Math.pow(n-e,2));if(this.hasDragged>10){l=b.isInsidePlot(m-h,n-i);if(b.hasCartesianSeries&&(this.zoomX||this.zoomY)&&l&&!this.selectionMarker)this.selectionMarker=b.renderer.rect(h,i,f?1:k,g?1:j,0).attr({fill:c.selectionMarkerFill||"rgba(69,114,167,0.25)",zIndex:7}).add();this.selectionMarker&&f&&(d-=m,this.selectionMarker.attr({width:N(d),
x:(d>0?0:d)+m}));this.selectionMarker&&g&&(d=e-n,this.selectionMarker.attr({height:N(d),y:(d>0?0:d)+n}));l&&!this.selectionMarker&&c.panning&&b.pan(a,c.panning)}},drop:function(a){var b=this.chart,c=this.hasPinched;if(this.selectionMarker){var d={xAxis:[],yAxis:[],originalEvent:a.originalEvent||a},a=this.selectionMarker,e=a.attr?a.attr("x"):a.x,f=a.attr?a.attr("y"):a.y,g=a.attr?a.attr("width"):a.width,h=a.attr?a.attr("height"):a.height,i;if(this.hasDragged||c)q(b.axes,function(a){if(a.zoomEnabled){var b=
a.horiz,c=a.toValue(b?e:f),b=a.toValue(b?e+g:f+h);!isNaN(c)&&!isNaN(b)&&(d[a.coll].push({axis:a,min:z(c,b),max:w(c,b)}),i=!0)}}),i&&K(b,"selection",d,function(a){b.zoom(v(a,c?{animation:!1}:null))});this.selectionMarker=this.selectionMarker.destroy();c&&this.scaleGroups()}if(b)E(b.container,{cursor:b._cursor}),b.cancelClick=this.hasDragged>10,b.mouseIsDown=this.hasDragged=this.hasPinched=!1,this.pinchDown=[]},onContainerMouseDown:function(a){a=this.normalize(a);a.preventDefault&&a.preventDefault();
this.dragStart(a)},onDocumentMouseUp:function(a){$[sa]&&$[sa].pointer.drop(a)},onDocumentMouseMove:function(a){var b=this.chart,c=this.chartPosition,d=b.hoverSeries,a=this.normalize(a,c);c&&d&&!this.inClass(a.target,"highcharts-tracker")&&!b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)&&this.reset()},onContainerMouseLeave:function(){var a=$[sa];if(a)a.pointer.reset(),a.pointer.chartPosition=null},onContainerMouseMove:function(a){var b=this.chart;sa=b.index;a=this.normalize(a);b.mouseIsDown===
"mousedown"&&this.drag(a);(this.inClass(a.target,"highcharts-tracker")||b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop))&&!b.openMenu&&this.runPointActions(a)},inClass:function(a,b){for(var c;a;){if(c=V(a,"class"))if(c.indexOf(b)!==-1)return!0;else if(c.indexOf("highcharts-container")!==-1)return!1;a=a.parentNode}},onTrackerMouseOut:function(a){var b=this.chart.hoverSeries,c=(a=a.relatedTarget||a.toElement)&&a.point&&a.point.series;if(b&&!b.options.stickyTracking&&!this.inClass(a,"highcharts-tooltip")&&
c!==b)b.onMouseOut()},onContainerClick:function(a){var b=this.chart,c=b.hoverPoint,d=b.plotLeft,e=b.plotTop,f=b.inverted,g,h,i,a=this.normalize(a);a.cancelBubble=!0;if(!b.cancelClick)c&&this.inClass(a.target,"highcharts-tracker")?(g=this.chartPosition,h=c.plotX,i=c.plotY,v(c,{pageX:g.left+d+(f?b.plotWidth-i:h),pageY:g.top+e+(f?b.plotHeight-h:i)}),K(c.series,"click",v(a,{point:c})),b.hoverPoint&&c.firePointEvent("click",a)):(v(a,this.getCoordinates(a)),b.isInsidePlot(a.chartX-d,a.chartY-e)&&K(b,"click",
a))},setDOMEvents:function(){var a=this,b=a.chart.container;b.onmousedown=function(b){a.onContainerMouseDown(b)};b.onmousemove=function(b){a.onContainerMouseMove(b)};b.onclick=function(b){a.onContainerClick(b)};A(b,"mouseleave",a.onContainerMouseLeave);eb===1&&A(B,"mouseup",a.onDocumentMouseUp);if(ab)b.ontouchstart=function(b){a.onContainerTouchStart(b)},b.ontouchmove=function(b){a.onContainerTouchMove(b)},eb===1&&A(B,"touchend",a.onDocumentTouchEnd)},destroy:function(){var a;R(this.chart.container,
"mouseleave",this.onContainerMouseLeave);eb||(R(B,"mouseup",this.onDocumentMouseUp),R(B,"touchend",this.onDocumentTouchEnd));clearInterval(this.tooltipTimeout);for(a in this)this[a]=null}};v(P.Pointer.prototype,{pinchTranslate:function(a,b,c,d,e,f){(this.zoomHor||this.pinchHor)&&this.pinchTranslateDirection(!0,a,b,c,d,e,f);(this.zoomVert||this.pinchVert)&&this.pinchTranslateDirection(!1,a,b,c,d,e,f)},pinchTranslateDirection:function(a,b,c,d,e,f,g,h){var i=this.chart,k=a?"x":"y",j=a?"X":"Y",l="chart"+
j,m=a?"width":"height",n=i["plot"+(a?"Left":"Top")],p,u,o=h||1,q=i.inverted,x=i.bounds[a?"h":"v"],r=b.length===1,s=b[0][l],t=c[0][l],w=!r&&b[1][l],v=!r&&c[1][l],y,c=function(){!r&&N(s-w)>20&&(o=h||N(t-v)/N(s-w));u=(n-t)/o+s;p=i["plot"+(a?"Width":"Height")]/o};c();b=u;b<x.min?(b=x.min,y=!0):b+p>x.max&&(b=x.max-p,y=!0);y?(t-=0.8*(t-g[k][0]),r||(v-=0.8*(v-g[k][1])),c()):g[k]=[t,v];q||(f[k]=u-n,f[m]=p);f=q?1/o:o;e[m]=p;e[k]=b;d[q?a?"scaleY":"scaleX":"scale"+j]=o;d["translate"+j]=f*n+(t-f*s)},pinch:function(a){var b=
this,c=b.chart,d=b.pinchDown,e=b.followTouchMove,f=a.touches,g=f.length,h=b.lastValidTouch,i=b.hasZoom,k=b.selectionMarker,j={},l=g===1&&(b.inClass(a.target,"highcharts-tracker")&&c.runTrackerClick||c.runChartClick),m={};(i||e)&&!l&&a.preventDefault();xa(f,function(a){return b.normalize(a)});if(a.type==="touchstart")q(f,function(a,b){d[b]={chartX:a.chartX,chartY:a.chartY}}),h.x=[d[0].chartX,d[1]&&d[1].chartX],h.y=[d[0].chartY,d[1]&&d[1].chartY],q(c.axes,function(a){if(a.zoomEnabled){var b=c.bounds[a.horiz?
"h":"v"],d=a.minPixelPadding,e=a.toPixels(a.dataMin),f=a.toPixels(a.dataMax),g=z(e,f),e=w(e,f);b.min=z(a.pos,g-d);b.max=w(a.pos+a.len,e+d)}});else if(d.length){if(!k)b.selectionMarker=k=v({destroy:ma},c.plotBox);b.pinchTranslate(d,f,j,k,m,h);b.hasPinched=i;b.scaleGroups(j,m);!i&&e&&g===1&&this.runPointActions(b.normalize(a))}},onContainerTouchStart:function(a){var b=this.chart;sa=b.index;a.touches.length===1?(a=this.normalize(a),b.isInsidePlot(a.chartX-b.plotLeft,a.chartY-b.plotTop)?(this.runPointActions(a),
this.pinch(a)):this.reset()):a.touches.length===2&&this.pinch(a)},onContainerTouchMove:function(a){(a.touches.length===1||a.touches.length===2)&&this.pinch(a)},onDocumentTouchEnd:function(a){$[sa]&&$[sa].pointer.drop(a)}});if(W.PointerEvent||W.MSPointerEvent){var ya={},Ib=!!W.PointerEvent,gc=function(){var a,b=[];b.item=function(a){return this[a]};for(a in ya)ya.hasOwnProperty(a)&&b.push({pageX:ya[a].pageX,pageY:ya[a].pageY,target:ya[a].target});return b},Jb=function(a,b,c,d){a=a.originalEvent||a;
if((a.pointerType==="touch"||a.pointerType===a.MSPOINTER_TYPE_TOUCH)&&$[sa])d(a),d=$[sa].pointer,d[b]({type:c,target:a.currentTarget,preventDefault:ma,touches:gc()})};v(Xa.prototype,{onContainerPointerDown:function(a){Jb(a,"onContainerTouchStart","touchstart",function(a){ya[a.pointerId]={pageX:a.pageX,pageY:a.pageY,target:a.currentTarget}})},onContainerPointerMove:function(a){Jb(a,"onContainerTouchMove","touchmove",function(a){ya[a.pointerId]={pageX:a.pageX,pageY:a.pageY};if(!ya[a.pointerId].target)ya[a.pointerId].target=
a.currentTarget})},onDocumentPointerUp:function(a){Jb(a,"onContainerTouchEnd","touchend",function(a){delete ya[a.pointerId]})},batchMSEvents:function(a){a(this.chart.container,Ib?"pointerdown":"MSPointerDown",this.onContainerPointerDown);a(this.chart.container,Ib?"pointermove":"MSPointerMove",this.onContainerPointerMove);a(B,Ib?"pointerup":"MSPointerUp",this.onDocumentPointerUp)}});O(Xa.prototype,"init",function(a,b,c){a.call(this,b,c);(this.hasZoom||this.followTouchMove)&&E(b.container,{"-ms-touch-action":X,
"touch-action":X})});O(Xa.prototype,"setDOMEvents",function(a){a.apply(this);(this.hasZoom||this.followTouchMove)&&this.batchMSEvents(A)});O(Xa.prototype,"destroy",function(a){this.batchMSEvents(R);a.call(this)})}var pb=P.Legend=function(a,b){this.init(a,b)};pb.prototype={init:function(a,b){var c=this,d=b.itemStyle,e=o(b.padding,8),f=b.itemMarginTop||0;this.options=b;if(b.enabled)c.baseline=J(d.fontSize)+3+f,c.itemStyle=d,c.itemHiddenStyle=y(d,b.itemHiddenStyle),c.itemMarginTop=f,c.padding=e,c.initialItemX=
e,c.initialItemY=e-5,c.maxItemWidth=0,c.chart=a,c.itemHeight=0,c.lastLineHeight=0,c.symbolWidth=o(b.symbolWidth,16),c.pages=[],c.render(),A(c.chart,"endResize",function(){c.positionCheckboxes()})},colorizeItem:function(a,b){var c=this.options,d=a.legendItem,e=a.legendLine,f=a.legendSymbol,g=this.itemHiddenStyle.color,c=b?c.itemStyle.color:g,h=b?a.legendColor||a.color||"#CCC":g,g=a.options&&a.options.marker,i={fill:h},k;d&&d.css({fill:c,color:c});e&&e.attr({stroke:h});if(f){if(g&&f.isMarker)for(k in i.stroke=
h,g=a.convertAttribs(g),g)d=g[k],d!==r&&(i[k]=d);f.attr(i)}},positionItem:function(a){var b=this.options,c=b.symbolPadding,b=!b.rtl,d=a._legendItemPos,e=d[0],d=d[1],f=a.checkbox;a.legendGroup&&a.legendGroup.translate(b?e:this.legendWidth-e-2*c-4,d);if(f)f.x=e,f.y=d},destroyItem:function(a){var b=a.checkbox;q(["legendItem","legendLine","legendSymbol","legendGroup"],function(b){a[b]&&(a[b]=a[b].destroy())});b&&Sa(a.checkbox)},destroy:function(){var a=this.group,b=this.box;if(b)this.box=b.destroy();
if(a)this.group=a.destroy()},positionCheckboxes:function(a){var b=this.group.alignAttr,c,d=this.clipHeight||this.legendHeight;if(b)c=b.translateY,q(this.allItems,function(e){var f=e.checkbox,g;f&&(g=c+f.y+(a||0)+3,E(f,{left:b.translateX+e.legendItemWidth+f.x-20+"px",top:g+"px",display:g>c-6&&g<c+d-6?"":X}))})},renderTitle:function(){var a=this.padding,b=this.options.title,c=0;if(b.text){if(!this.title)this.title=this.chart.renderer.label(b.text,a-3,a-4,null,null,null,null,null,"legend-title").attr({zIndex:1}).css(b.style).add(this.group);
a=this.title.getBBox();c=a.height;this.offsetWidth=a.width;this.contentGroup.attr({translateY:c})}this.titleHeight=c},renderItem:function(a){var b=this.chart,c=b.renderer,d=this.options,e=d.layout==="horizontal",f=this.symbolWidth,g=d.symbolPadding,h=this.itemStyle,i=this.itemHiddenStyle,k=this.padding,j=e?o(d.itemDistance,20):0,l=!d.rtl,m=d.width,n=d.itemMarginBottom||0,p=this.itemMarginTop,u=this.initialItemX,q=a.legendItem,G=a.series&&a.series.drawLegendSymbol?a.series:a,x=G.options,x=this.createCheckboxForItem&&
x&&x.showCheckbox,r=d.useHTML;if(!q)a.legendGroup=c.g("legend-item").attr({zIndex:1}).add(this.scrollGroup),G.drawLegendSymbol(this,a),a.legendItem=q=c.text(d.labelFormat?Ja(d.labelFormat,a):d.labelFormatter.call(a),l?f+g:-g,this.baseline,r).css(y(a.visible?h:i)).attr({align:l?"left":"right",zIndex:2}).add(a.legendGroup),this.setItemEvents&&this.setItemEvents(a,q,r,h,i),this.colorizeItem(a,a.visible),x&&this.createCheckboxForItem(a);c=q.getBBox();f=a.legendItemWidth=d.itemWidth||a.legendItemWidth||
f+g+c.width+j+(x?20:0);this.itemHeight=g=s(a.legendItemHeight||c.height);if(e&&this.itemX-u+f>(m||b.chartWidth-2*k-u-d.x))this.itemX=u,this.itemY+=p+this.lastLineHeight+n,this.lastLineHeight=0;this.maxItemWidth=w(this.maxItemWidth,f);this.lastItemY=p+this.itemY+n;this.lastLineHeight=w(g,this.lastLineHeight);a._legendItemPos=[this.itemX,this.itemY];e?this.itemX+=f:(this.itemY+=p+g+n,this.lastLineHeight=g);this.offsetWidth=m||w((e?this.itemX-u-j:f)+k,this.offsetWidth)},getAllItems:function(){var a=
[];q(this.chart.series,function(b){var c=b.options;if(o(c.showInLegend,!t(c.linkedTo)?r:!1,!0))a=a.concat(b.legendItems||(c.legendType==="point"?b.data:b))});return a},render:function(){var a=this,b=a.chart,c=b.renderer,d=a.group,e,f,g,h,i=a.box,k=a.options,j=a.padding,l=k.borderWidth,m=k.backgroundColor;a.itemX=a.initialItemX;a.itemY=a.initialItemY;a.offsetWidth=0;a.lastItemY=0;if(!d)a.group=d=c.g("legend").attr({zIndex:7}).add(),a.contentGroup=c.g().attr({zIndex:1}).add(d),a.scrollGroup=c.g().add(a.contentGroup);
a.renderTitle();e=a.getAllItems();tb(e,function(a,b){return(a.options&&a.options.legendIndex||0)-(b.options&&b.options.legendIndex||0)});k.reversed&&e.reverse();a.allItems=e;a.display=f=!!e.length;q(e,function(b){a.renderItem(b)});g=k.width||a.offsetWidth;h=a.lastItemY+a.lastLineHeight+a.titleHeight;h=a.handleOverflow(h);if(l||m){g+=j;h+=j;if(i){if(g>0&&h>0)i[i.isNew?"attr":"animate"](i.crisp({width:g,height:h})),i.isNew=!1}else a.box=i=c.rect(0,0,g,h,k.borderRadius,l||0).attr({stroke:k.borderColor,
"stroke-width":l||0,fill:m||X}).add(d).shadow(k.shadow),i.isNew=!0;i[f?"show":"hide"]()}a.legendWidth=g;a.legendHeight=h;q(e,function(b){a.positionItem(b)});f&&d.align(v({width:g,height:h},k),!0,"spacingBox");b.isResizing||this.positionCheckboxes()},handleOverflow:function(a){var b=this,c=this.chart,d=c.renderer,e=this.options,f=e.y,f=c.spacingBox.height+(e.verticalAlign==="top"?-f:f)-this.padding,g=e.maxHeight,h,i=this.clipRect,k=e.navigation,j=o(k.animation,!0),l=k.arrowSize||12,m=this.nav,n=this.pages,
p,u=this.allItems;e.layout==="horizontal"&&(f/=2);g&&(f=z(f,g));n.length=0;if(a>f&&!e.useHTML){this.clipHeight=h=f-20-this.titleHeight-this.padding;this.currentPage=o(this.currentPage,1);this.fullHeight=a;q(u,function(a,b){var c=a._legendItemPos[1],d=s(a.legendItem.getBBox().height),e=n.length;if(!e||c-n[e-1]>h&&(p||c)!==n[e-1])n.push(p||c),e++;b===u.length-1&&c+d-n[e-1]>h&&n.push(c);c!==p&&(p=c)});if(!i)i=b.clipRect=d.clipRect(0,this.padding,9999,0),b.contentGroup.clip(i);i.attr({height:h});if(!m)this.nav=
m=d.g().attr({zIndex:1}).add(this.group),this.up=d.symbol("triangle",0,0,l,l).on("click",function(){b.scroll(-1,j)}).add(m),this.pager=d.text("",15,10).css(k.style).add(m),this.down=d.symbol("triangle-down",0,0,l,l).on("click",function(){b.scroll(1,j)}).add(m);b.scroll(0);a=f}else if(m)i.attr({height:c.chartHeight}),m.hide(),this.scrollGroup.attr({translateY:1}),this.clipHeight=0;return a},scroll:function(a,b){var c=this.pages,d=c.length,e=this.currentPage+a,f=this.clipHeight,g=this.options.navigation,
h=g.activeColor,g=g.inactiveColor,i=this.pager,k=this.padding;e>d&&(e=d);if(e>0)b!==r&&Ya(b,this.chart),this.nav.attr({translateX:k,translateY:f+this.padding+7+this.titleHeight,visibility:"visible"}),this.up.attr({fill:e===1?g:h}).css({cursor:e===1?"default":"pointer"}),i.attr({text:e+"/"+d}),this.down.attr({x:18+this.pager.getBBox().width,fill:e===d?g:h}).css({cursor:e===d?"default":"pointer"}),c=-c[e-1]+this.initialItemY,this.scrollGroup.animate({translateY:c}),this.currentPage=e,this.positionCheckboxes(c)}};
Q=P.LegendSymbolMixin={drawRectangle:function(a,b){var c=a.options.symbolHeight||12;b.legendSymbol=this.chart.renderer.rect(0,a.baseline-5-c/2,a.symbolWidth,c,a.options.symbolRadius||0).attr({zIndex:3}).add(b.legendGroup)},drawLineMarker:function(a){var b=this.options,c=b.marker,d;d=a.symbolWidth;var e=this.chart.renderer,f=this.legendGroup,a=a.baseline-s(e.fontMetrics(a.options.itemStyle.fontSize).b*0.3),g;if(b.lineWidth){g={"stroke-width":b.lineWidth};if(b.dashStyle)g.dashstyle=b.dashStyle;this.legendLine=
e.path(["M",0,a,"L",d,a]).attr(g).add(f)}if(c&&c.enabled!==!1)b=c.radius,this.legendSymbol=d=e.symbol(this.symbol,d/2-b,a-b,2*b,2*b).add(f),d.isMarker=!0}};(/Trident\/7\.0/.test(Da)||$a)&&O(pb.prototype,"positionItem",function(a,b){var c=this,d=function(){b._legendItemPos&&a.call(c,b)};d();setTimeout(d)});va.prototype={init:function(a,b){var c,d=a.series;a.series=null;c=y(I,a);c.series=a.series=d;this.userOptions=a;d=c.chart;this.margin=this.splashArray("margin",d);this.spacing=this.splashArray("spacing",
d);var e=d.events;this.bounds={h:{},v:{}};this.callback=b;this.isResizing=0;this.options=c;this.axes=[];this.series=[];this.hasCartesianSeries=d.showAxes;var f=this,g;f.index=$.length;$.push(f);eb++;d.reflow!==!1&&A(f,"load",function(){f.initReflow()});if(e)for(g in e)A(f,g,e[g]);f.xAxis=[];f.yAxis=[];f.animation=ia?!1:o(d.animation,!0);f.pointCount=0;f.counters=new Lb;f.firstRender()},initSeries:function(a){var b=this.options.chart;(b=C[a.type||b.type||b.defaultSeriesType])||pa(17,!0);b=new b;b.init(this,
a);return b},isInsidePlot:function(a,b,c){var d=c?b:a,a=c?a:b;return d>=0&&d<=this.plotWidth&&a>=0&&a<=this.plotHeight},adjustTickAmounts:function(){this.options.chart.alignTicks!==!1&&q(this.axes,function(a){a.adjustTickAmount()});this.maxTicks=null},redraw:function(a){var b=this.axes,c=this.series,d=this.pointer,e=this.legend,f=this.isDirtyLegend,g,h,i=this.isDirtyBox,k=c.length,j=k,l=this.renderer,m=l.isHidden(),n=[];Ya(a,this);m&&this.cloneRenderTo();for(this.layOutTitles();j--;)if(a=c[j],a.options.stacking&&
(g=!0,a.isDirty)){h=!0;break}if(h)for(j=k;j--;)if(a=c[j],a.options.stacking)a.isDirty=!0;q(c,function(a){a.isDirty&&a.options.legendType==="point"&&(f=!0)});if(f&&e.options.enabled)e.render(),this.isDirtyLegend=!1;g&&this.getStacks();if(this.hasCartesianSeries){if(!this.isResizing)this.maxTicks=null,q(b,function(a){a.setScale()});this.adjustTickAmounts();this.getMargins();q(b,function(a){a.isDirty&&(i=!0)});q(b,function(a){if(a.isDirtyExtremes)a.isDirtyExtremes=!1,n.push(function(){K(a,"afterSetExtremes",
v(a.eventArgs,a.getExtremes()));delete a.eventArgs});(i||g)&&a.redraw()})}i&&this.drawChartBox();q(c,function(a){a.isDirty&&a.visible&&(!a.isCartesian||a.xAxis)&&a.redraw()});d&&d.reset(!0);l.draw();K(this,"redraw");m&&this.cloneRenderTo(!0);q(n,function(a){a.call()})},get:function(a){var b=this.axes,c=this.series,d,e;for(d=0;d<b.length;d++)if(b[d].options.id===a)return b[d];for(d=0;d<c.length;d++)if(c[d].options.id===a)return c[d];for(d=0;d<c.length;d++){e=c[d].points||[];for(b=0;b<e.length;b++)if(e[b].id===
a)return e[b]}return null},getAxes:function(){var a=this,b=this.options,c=b.xAxis=la(b.xAxis||{}),b=b.yAxis=la(b.yAxis||{});q(c,function(a,b){a.index=b;a.isX=!0});q(b,function(a,b){a.index=b});c=c.concat(b);q(c,function(b){new F(a,b)});a.adjustTickAmounts()},getSelectedPoints:function(){var a=[];q(this.series,function(b){a=a.concat(Cb(b.points||[],function(a){return a.selected}))});return a},getSelectedSeries:function(){return Cb(this.series,function(a){return a.selected})},getStacks:function(){var a=
this;q(a.yAxis,function(a){if(a.stacks&&a.hasVisibleSeries)a.oldStacks=a.stacks});q(a.series,function(b){if(b.options.stacking&&(b.visible===!0||a.options.chart.ignoreHiddenSeries===!1))b.stackKey=b.type+o(b.options.stack,"")})},setTitle:function(a,b,c){var g;var d=this,e=d.options,f;f=e.title=y(e.title,a);g=e.subtitle=y(e.subtitle,b),e=g;q([["title",a,f],["subtitle",b,e]],function(a){var b=a[0],c=d[b],e=a[1],a=a[2];c&&e&&(d[b]=c=c.destroy());a&&a.text&&!c&&(d[b]=d.renderer.text(a.text,0,0,a.useHTML).attr({align:a.align,
"class":"highcharts-"+b,zIndex:a.zIndex||4}).css(a.style).add())});d.layOutTitles(c)},layOutTitles:function(a){var b=0,c=this.title,d=this.subtitle,e=this.options,f=e.title,e=e.subtitle,g=this.spacingBox.width-44;if(c&&(c.css({width:(f.width||g)+"px"}).align(v({y:15},f),!1,"spacingBox"),!f.floating&&!f.verticalAlign))b=c.getBBox().height;d&&(d.css({width:(e.width||g)+"px"}).align(v({y:b+f.margin},e),!1,"spacingBox"),!e.floating&&!e.verticalAlign&&(b=Va(b+d.getBBox().height)));c=this.titleOffset!==
b;this.titleOffset=b;if(!this.isDirtyBox&&c)this.isDirtyBox=c,this.hasRendered&&o(a,!0)&&this.isDirtyBox&&this.redraw()},getChartSize:function(){var a=this.options.chart,b=a.width,a=a.height,c=this.renderToClone||this.renderTo;if(!t(b))this.containerWidth=nb(c,"width");if(!t(a))this.containerHeight=nb(c,"height");this.chartWidth=w(0,b||this.containerWidth||600);this.chartHeight=w(0,o(a,this.containerHeight>19?this.containerHeight:400))},cloneRenderTo:function(a){var b=this.renderToClone,c=this.container;
a?b&&(this.renderTo.appendChild(c),Sa(b),delete this.renderToClone):(c&&c.parentNode===this.renderTo&&this.renderTo.removeChild(c),this.renderToClone=b=this.renderTo.cloneNode(0),E(b,{position:"absolute",top:"-9999px",display:"block"}),b.style.setProperty&&b.style.setProperty("display","block","important"),B.body.appendChild(b),c&&b.appendChild(c))},getContainer:function(){var a,b=this.options.chart,c,d,e;this.renderTo=a=b.renderTo;e="highcharts-"+Ab++;if(Oa(a))this.renderTo=a=B.getElementById(a);
a||pa(13,!0);c=J(V(a,"data-highcharts-chart"));!isNaN(c)&&$[c]&&$[c].hasRendered&&$[c].destroy();V(a,"data-highcharts-chart",this.index);a.innerHTML="";!b.skipClone&&!a.offsetWidth&&this.cloneRenderTo();this.getChartSize();c=this.chartWidth;d=this.chartHeight;this.container=a=Y(Ta,{className:"highcharts-container"+(b.className?" "+b.className:""),id:e},v({position:"relative",overflow:"hidden",width:c+"px",height:d+"px",textAlign:"left",lineHeight:"normal",zIndex:0,"-webkit-tap-highlight-color":"rgba(0,0,0,0)"},
b.style),this.renderToClone||a);this._cursor=a.style.cursor;this.renderer=b.forExport?new ja(a,c,d,b.style,!0):new Wa(a,c,d,b.style);ia&&this.renderer.create(this,a,c,d)},getMargins:function(){var a=this.spacing,b,c=this.legend,d=this.margin,e=this.options.legend,f=o(e.margin,20),g=e.x,h=e.y,i=e.align,k=e.verticalAlign,j=this.titleOffset;this.resetMargins();b=this.axisOffset;if(j&&!t(d[0]))this.plotTop=w(this.plotTop,j+this.options.title.margin+a[0]);if(c.display&&!e.floating)if(i==="right"){if(!t(d[1]))this.marginRight=
w(this.marginRight,c.legendWidth-g+f+a[1])}else if(i==="left"){if(!t(d[3]))this.plotLeft=w(this.plotLeft,c.legendWidth+g+f+a[3])}else if(k==="top"){if(!t(d[0]))this.plotTop=w(this.plotTop,c.legendHeight+h+f+a[0])}else if(k==="bottom"&&!t(d[2]))this.marginBottom=w(this.marginBottom,c.legendHeight-h+f+a[2]);this.extraBottomMargin&&(this.marginBottom+=this.extraBottomMargin);this.extraTopMargin&&(this.plotTop+=this.extraTopMargin);this.hasCartesianSeries&&q(this.axes,function(a){a.getOffset()});t(d[3])||
(this.plotLeft+=b[3]);t(d[0])||(this.plotTop+=b[0]);t(d[2])||(this.marginBottom+=b[2]);t(d[1])||(this.marginRight+=b[1]);this.setChartSize()},reflow:function(a){var b=this,c=b.options.chart,d=b.renderTo,e=c.width||nb(d,"width"),f=c.height||nb(d,"height"),c=a?a.target:W,d=function(){if(b.container)b.setSize(e,f,!1),b.hasUserSize=null};if(!b.hasUserSize&&e&&f&&(c===W||c===B)){if(e!==b.containerWidth||f!==b.containerHeight)clearTimeout(b.reflowTimeout),a?b.reflowTimeout=setTimeout(d,100):d();b.containerWidth=
e;b.containerHeight=f}},initReflow:function(){var a=this,b=function(b){a.reflow(b)};A(W,"resize",b);A(a,"destroy",function(){R(W,"resize",b)})},setSize:function(a,b,c){var d=this,e,f,g;d.isResizing+=1;g=function(){d&&K(d,"endResize",null,function(){d.isResizing-=1})};Ya(c,d);d.oldChartHeight=d.chartHeight;d.oldChartWidth=d.chartWidth;if(t(a))d.chartWidth=e=w(0,s(a)),d.hasUserSize=!!e;if(t(b))d.chartHeight=f=w(0,s(b));(Ca?ob:E)(d.container,{width:e+"px",height:f+"px"},Ca);d.setChartSize(!0);d.renderer.setSize(e,
f,c);d.maxTicks=null;q(d.axes,function(a){a.isDirty=!0;a.setScale()});q(d.series,function(a){a.isDirty=!0});d.isDirtyLegend=!0;d.isDirtyBox=!0;d.layOutTitles();d.getMargins();d.redraw(c);d.oldChartHeight=null;K(d,"resize");Ca===!1?g():setTimeout(g,Ca&&Ca.duration||500)},setChartSize:function(a){var b=this.inverted,c=this.renderer,d=this.chartWidth,e=this.chartHeight,f=this.options.chart,g=this.spacing,h=this.clipOffset,i,k,j,l;this.plotLeft=i=s(this.plotLeft);this.plotTop=k=s(this.plotTop);this.plotWidth=
j=w(0,s(d-i-this.marginRight));this.plotHeight=l=w(0,s(e-k-this.marginBottom));this.plotSizeX=b?l:j;this.plotSizeY=b?j:l;this.plotBorderWidth=f.plotBorderWidth||0;this.spacingBox=c.spacingBox={x:g[3],y:g[0],width:d-g[3]-g[1],height:e-g[0]-g[2]};this.plotBox=c.plotBox={x:i,y:k,width:j,height:l};d=2*S(this.plotBorderWidth/2);b=Va(w(d,h[3])/2);c=Va(w(d,h[0])/2);this.clipBox={x:b,y:c,width:S(this.plotSizeX-w(d,h[1])/2-b),height:S(this.plotSizeY-w(d,h[2])/2-c)};a||q(this.axes,function(a){a.setAxisSize();
a.setAxisTranslation()})},resetMargins:function(){var a=this.spacing,b=this.margin;this.plotTop=o(b[0],a[0]);this.marginRight=o(b[1],a[1]);this.marginBottom=o(b[2],a[2]);this.plotLeft=o(b[3],a[3]);this.axisOffset=[0,0,0,0];this.clipOffset=[0,0,0,0]},drawChartBox:function(){var a=this.options.chart,b=this.renderer,c=this.chartWidth,d=this.chartHeight,e=this.chartBackground,f=this.plotBackground,g=this.plotBorder,h=this.plotBGImage,i=a.borderWidth||0,k=a.backgroundColor,j=a.plotBackgroundColor,l=a.plotBackgroundImage,
m=a.plotBorderWidth||0,n,p=this.plotLeft,u=this.plotTop,o=this.plotWidth,q=this.plotHeight,x=this.plotBox,r=this.clipRect,s=this.clipBox;n=i+(a.shadow?8:0);if(i||k)if(e)e.animate(e.crisp({width:c-n,height:d-n}));else{e={fill:k||X};if(i)e.stroke=a.borderColor,e["stroke-width"]=i;this.chartBackground=b.rect(n/2,n/2,c-n,d-n,a.borderRadius,i).attr(e).addClass("highcharts-background").add().shadow(a.shadow)}if(j)f?f.animate(x):this.plotBackground=b.rect(p,u,o,q,0).attr({fill:j}).add().shadow(a.plotShadow);
if(l)h?h.animate(x):this.plotBGImage=b.image(l,p,u,o,q).add();r?r.animate({width:s.width,height:s.height}):this.clipRect=b.clipRect(s);if(m)g?g.animate(g.crisp({x:p,y:u,width:o,height:q})):this.plotBorder=b.rect(p,u,o,q,0,-m).attr({stroke:a.plotBorderColor,"stroke-width":m,fill:X,zIndex:1}).add();this.isDirtyBox=!1},propFromSeries:function(){var a=this,b=a.options.chart,c,d=a.options.series,e,f;q(["inverted","angular","polar"],function(g){c=C[b.type||b.defaultSeriesType];f=a[g]||b[g]||c&&c.prototype[g];
for(e=d&&d.length;!f&&e--;)(c=C[d[e].type])&&c.prototype[g]&&(f=!0);a[g]=f})},linkSeries:function(){var a=this,b=a.series;q(b,function(a){a.linkedSeries.length=0});q(b,function(b){var d=b.options.linkedTo;if(Oa(d)&&(d=d===":previous"?a.series[b.index-1]:a.get(d)))d.linkedSeries.push(b),b.linkedParent=d})},renderSeries:function(){q(this.series,function(a){a.translate();a.setTooltipPoints&&a.setTooltipPoints();a.render()})},render:function(){var a=this,b=a.axes,c=a.renderer,d=a.options,e=d.labels,f=
d.credits,g;a.setTitle();a.legend=new pb(a,d.legend);a.getStacks();q(b,function(a){a.setScale()});a.getMargins();a.maxTicks=null;q(b,function(a){a.setTickPositions(!0);a.setMaxTicks()});a.adjustTickAmounts();a.getMargins();a.drawChartBox();a.hasCartesianSeries&&q(b,function(a){a.render()});if(!a.seriesGroup)a.seriesGroup=c.g("series-group").attr({zIndex:3}).add();a.renderSeries();e.items&&q(e.items,function(b){var d=v(e.style,b.style),f=J(d.left)+a.plotLeft,g=J(d.top)+a.plotTop+12;delete d.left;delete d.top;
c.text(b.html,f,g).attr({zIndex:2}).css(d).add()});if(f.enabled&&!a.credits)g=f.href,a.credits=c.text(f.text,0,0).on("click",function(){if(g)location.href=g}).attr({align:f.position.align,zIndex:8}).css(f.style).add().align(f.position);a.hasRendered=!0},destroy:function(){var a=this,b=a.axes,c=a.series,d=a.container,e,f=d&&d.parentNode;K(a,"destroy");$[a.index]=r;eb--;a.renderTo.removeAttribute("data-highcharts-chart");R(a);for(e=b.length;e--;)b[e]=b[e].destroy();for(e=c.length;e--;)c[e]=c[e].destroy();
q("title,subtitle,chartBackground,plotBackground,plotBGImage,plotBorder,seriesGroup,clipRect,credits,pointer,scroller,rangeSelector,legend,resetZoomButton,tooltip,renderer".split(","),function(b){var c=a[b];c&&c.destroy&&(a[b]=c.destroy())});if(d)d.innerHTML="",R(d),f&&Sa(d);for(e in a)delete a[e]},isReadyToRender:function(){var a=this;return!ba&&W==W.top&&B.readyState!=="complete"||ia&&!W.canvg?(ia?Vb.push(function(){a.firstRender()},a.options.global.canvasToolsURL):B.attachEvent("onreadystatechange",
function(){B.detachEvent("onreadystatechange",a.firstRender);B.readyState==="complete"&&a.firstRender()}),!1):!0},firstRender:function(){var a=this,b=a.options,c=a.callback;if(a.isReadyToRender()){a.getContainer();K(a,"init");a.resetMargins();a.setChartSize();a.propFromSeries();a.getAxes();q(b.series||[],function(b){a.initSeries(b)});a.linkSeries();K(a,"beforeRender");if(P.Pointer)a.pointer=new Xa(a,b);a.render();a.renderer.draw();c&&c.apply(a,[a]);q(a.callbacks,function(b){b.apply(a,[a])});a.cloneRenderTo(!0);
K(a,"load")}},splashArray:function(a,b){var c=b[a],c=ea(c)?c:[c,c,c,c];return[o(b[a+"Top"],c[0]),o(b[a+"Right"],c[1]),o(b[a+"Bottom"],c[2]),o(b[a+"Left"],c[3])]}};va.prototype.callbacks=[];da=P.CenteredSeriesMixin={getCenter:function(){var a=this.options,b=this.chart,c=2*(a.slicedOffset||0),d,e=b.plotWidth-2*c,f=b.plotHeight-2*c,b=a.center,a=[o(b[0],"50%"),o(b[1],"50%"),a.size||"100%",a.innerSize||0],g=z(e,f),h;return xa(a,function(a,b){h=/%$/.test(a);d=b<2||b===2&&h;return(h?[e,f,g,g][b]*J(a)/100:
a)+(d?c:0)})}};var za=function(){};za.prototype={init:function(a,b,c){this.series=a;this.applyOptions(b,c);this.pointAttr={};if(a.options.colorByPoint&&(b=a.options.colors||a.chart.options.colors,this.color=this.color||b[a.colorCounter++],a.colorCounter===b.length))a.colorCounter=0;a.chart.pointCount++;return this},applyOptions:function(a,b){var c=this.series,d=c.pointValKey,a=za.prototype.optionsToObject.call(this,a);v(this,a);this.options=this.options?v(this.options,a):a;if(d)this.y=this[d];if(this.x===
r&&c)this.x=b===r?c.autoIncrement():b;return this},optionsToObject:function(a){var b={},c=this.series,d=c.pointArrayMap||["y"],e=d.length,f=0,g=0;if(typeof a==="number"||a===null)b[d[0]]=a;else if(Pa(a)){if(a.length>e){c=typeof a[0];if(c==="string")b.name=a[0];else if(c==="number")b.x=a[0];f++}for(;g<e;)b[d[g++]]=a[f++]}else if(typeof a==="object"){b=a;if(a.dataLabels)c._hasPointLabels=!0;if(a.marker)c._hasPointMarkers=!0}return b},destroy:function(){var a=this.series.chart,b=a.hoverPoints,c;a.pointCount--;
if(b&&(this.setState(),oa(b,this),!b.length))a.hoverPoints=null;if(this===a.hoverPoint)this.onMouseOut();if(this.graphic||this.dataLabel)R(this),this.destroyElements();this.legendItem&&a.legend.destroyItem(this);for(c in this)this[c]=null},destroyElements:function(){for(var a="graphic,dataLabel,dataLabelUpper,group,connector,shadowGroup".split(","),b,c=6;c--;)b=a[c],this[b]&&(this[b]=this[b].destroy())},getLabelConfig:function(){return{x:this.category,y:this.y,key:this.name||this.category,series:this.series,
point:this,percentage:this.percentage,total:this.total||this.stackTotal}},tooltipFormatter:function(a){var b=this.series,c=b.tooltipOptions,d=o(c.valueDecimals,""),e=c.valuePrefix||"",f=c.valueSuffix||"";q(b.pointArrayMap||["y"],function(b){b="{point."+b;if(e||f)a=a.replace(b+"}",e+b+"}"+f);a=a.replace(b+"}",b+":,."+d+"f}")});return Ja(a,{point:this,series:this.series})},firePointEvent:function(a,b,c){var d=this,e=this.series.options;(e.point.events[a]||d.options&&d.options.events&&d.options.events[a])&&
this.importEvents();a==="click"&&e.allowPointSelect&&(c=function(a){d.select(null,a.ctrlKey||a.metaKey||a.shiftKey)});K(this,a,b,c)}};var L=function(){};L.prototype={isCartesian:!0,type:"line",pointClass:za,sorted:!0,requireSorting:!0,pointAttrToOptions:{stroke:"lineColor","stroke-width":"lineWidth",fill:"fillColor",r:"radius"},axisTypes:["xAxis","yAxis"],colorCounter:0,parallelArrays:["x","y"],init:function(a,b){var c=this,d,e,f=a.series,g=function(a,b){return o(a.options.index,a._i)-o(b.options.index,
b._i)};c.chart=a;c.options=b=c.setOptions(b);c.linkedSeries=[];c.bindAxes();v(c,{name:b.name,state:"",pointAttr:{},visible:b.visible!==!1,selected:b.selected===!0});if(ia)b.animation=!1;e=b.events;for(d in e)A(c,d,e[d]);if(e&&e.click||b.point&&b.point.events&&b.point.events.click||b.allowPointSelect)a.runTrackerClick=!0;c.getColor();c.getSymbol();q(c.parallelArrays,function(a){c[a+"Data"]=[]});c.setData(b.data,!1);if(c.isCartesian)a.hasCartesianSeries=!0;f.push(c);c._i=f.length-1;tb(f,g);this.yAxis&&
tb(this.yAxis.series,g);q(f,function(a,b){a.index=b;a.name=a.name||"Series "+(b+1)})},bindAxes:function(){var a=this,b=a.options,c=a.chart,d;q(a.axisTypes||[],function(e){q(c[e],function(c){d=c.options;if(b[e]===d.index||b[e]!==r&&b[e]===d.id||b[e]===r&&d.index===0)c.series.push(a),a[e]=c,c.isDirty=!0});!a[e]&&a.optionalAxis!==e&&pa(18,!0)})},updateParallelArrays:function(a,b){var c=a.series,d=arguments;q(c.parallelArrays,typeof b==="number"?function(d){var f=d==="y"&&c.toYData?c.toYData(a):a[d];
c[d+"Data"][b]=f}:function(a){Array.prototype[b].apply(c[a+"Data"],Array.prototype.slice.call(d,2))})},autoIncrement:function(){var a=this.options,b=this.xIncrement,b=o(b,a.pointStart,0);this.pointInterval=o(this.pointInterval,a.pointInterval,1);this.xIncrement=b+this.pointInterval;return b},getSegments:function(){var a=-1,b=[],c,d=this.points,e=d.length;if(e)if(this.options.connectNulls){for(c=e;c--;)d[c].y===null&&d.splice(c,1);d.length&&(b=[d])}else q(d,function(c,g){c.y===null?(g>a+1&&b.push(d.slice(a+
1,g)),a=g):g===e-1&&b.push(d.slice(a+1,g+1))});this.segments=b},setOptions:function(a){var b=this.chart,c=b.options.plotOptions,b=b.userOptions||{},d=b.plotOptions||{},e=c[this.type];this.userOptions=a;c=y(e,c.series,a);this.tooltipOptions=y(I.tooltip,I.plotOptions[this.type].tooltip,b.tooltip,d.series&&d.series.tooltip,d[this.type]&&d[this.type].tooltip,a.tooltip);e.marker===null&&delete c.marker;return c},getColor:function(){var a=this.options,b=this.userOptions,c=this.chart.options.colors,d=this.chart.counters,
e;e=a.color||T[this.type].color;if(!e&&!a.colorByPoint)t(b._colorIndex)?a=b._colorIndex:(b._colorIndex=d.color,a=d.color++),e=c[a];this.color=e;d.wrapColor(c.length)},getSymbol:function(){var a=this.userOptions,b=this.options.marker,c=this.chart,d=c.options.symbols,c=c.counters;this.symbol=b.symbol;if(!this.symbol)t(a._symbolIndex)?a=a._symbolIndex:(a._symbolIndex=c.symbol,a=c.symbol++),this.symbol=d[a];if(/^url/.test(this.symbol))b.radius=0;c.wrapSymbol(d.length)},drawLegendSymbol:Q.drawLineMarker,
setData:function(a,b,c,d){var e=this,f=e.points,g=f&&f.length||0,h,i=e.options,k=e.chart,j=null,l=e.xAxis,m=l&&!!l.categories,n=e.tooltipPoints,p=i.turboThreshold,u=this.xData,s=this.yData,G=(h=e.pointArrayMap)&&h.length,a=a||[];h=a.length;b=o(b,!0);if(d!==!1&&h&&g===h&&!e.cropped&&!e.hasGroupedData)q(a,function(a,b){f[b].update(a,!1)});else{e.xIncrement=null;e.pointRange=m?1:i.pointRange;e.colorCounter=0;q(this.parallelArrays,function(a){e[a+"Data"].length=0});if(p&&h>p){for(c=0;j===null&&c<h;)j=
a[c],c++;if(ka(j)){m=o(i.pointStart,0);i=o(i.pointInterval,1);for(c=0;c<h;c++)u[c]=m,s[c]=a[c],m+=i;e.xIncrement=m}else if(Pa(j))if(G)for(c=0;c<h;c++)i=a[c],u[c]=i[0],s[c]=i.slice(1,G+1);else for(c=0;c<h;c++)i=a[c],u[c]=i[0],s[c]=i[1];else pa(12)}else for(c=0;c<h;c++)if(a[c]!==r&&(i={series:e},e.pointClass.prototype.applyOptions.apply(i,[a[c]]),e.updateParallelArrays(i,c),m&&i.name))l.names[i.x]=i.name;Oa(s[0])&&pa(14,!0);e.data=[];e.options.data=a;for(c=g;c--;)f[c]&&f[c].destroy&&f[c].destroy();
if(n)n.length=0;if(l)l.minRange=l.userMinRange;e.isDirty=e.isDirtyData=k.isDirtyBox=!0;c=!1}b&&k.redraw(c)},processData:function(a){var b=this.xData,c=this.yData,d=b.length,e;e=0;var f,g,h=this.xAxis,i=this.options,k=i.cropThreshold,j=0,l=this.isCartesian,m,n;if(l&&!this.isDirty&&!h.isDirty&&!this.yAxis.isDirty&&!a)return!1;if(l&&this.sorted&&(!k||d>k||this.forceCrop))if(m=h.min,n=h.max,b[d-1]<m||b[0]>n)b=[],c=[];else if(b[0]<m||b[d-1]>n)e=this.cropData(this.xData,this.yData,m,n),b=e.xData,c=e.yData,
e=e.start,f=!0,j=b.length;for(d=b.length-1;d>=0;d--)a=b[d]-b[d-1],!f&&b[d]>m&&b[d]<n&&j++,a>0&&(g===r||a<g)?g=a:a<0&&this.requireSorting&&pa(15);this.cropped=f;this.cropStart=e;this.processedXData=b;this.processedYData=c;this.activePointCount=j;if(i.pointRange===null)this.pointRange=g||1;this.closestPointRange=g},cropData:function(a,b,c,d){var e=a.length,f=0,g=e,h=o(this.cropShoulder,1),i;for(i=0;i<e;i++)if(a[i]>=c){f=w(0,i-h);break}for(;i<e;i++)if(a[i]>d){g=i+h;break}return{xData:a.slice(f,g),yData:b.slice(f,
g),start:f,end:g}},generatePoints:function(){var a=this.options.data,b=this.data,c,d=this.processedXData,e=this.processedYData,f=this.pointClass,g=d.length,h=this.cropStart||0,i,k=this.hasGroupedData,j,l=[],m;if(!b&&!k)b=[],b.length=a.length,b=this.data=b;for(m=0;m<g;m++)i=h+m,k?l[m]=(new f).init(this,[d[m]].concat(la(e[m]))):(b[i]?j=b[i]:a[i]!==r&&(b[i]=j=(new f).init(this,a[i],d[m])),l[m]=j);if(b&&(g!==(c=b.length)||k))for(m=0;m<c;m++)if(m===h&&!k&&(m+=g),b[m])b[m].destroyElements(),b[m].plotX=
r;this.data=b;this.points=l},getExtremes:function(a){var b=this.yAxis,c=this.processedXData,d,e=[],f=0;d=this.xAxis.getExtremes();var g=d.min,h=d.max,i,k,j,l,a=a||this.stackedYData||this.processedYData;d=a.length;for(l=0;l<d;l++)if(k=c[l],j=a[l],i=j!==null&&j!==r&&(!b.isLog||j.length||j>0),k=this.getExtremesFromAll||this.cropped||(c[l+1]||k)>=g&&(c[l-1]||k)<=h,i&&k)if(i=j.length)for(;i--;)j[i]!==null&&(e[f++]=j[i]);else e[f++]=j;this.dataMin=o(void 0,Ra(e));this.dataMax=o(void 0,Ba(e))},translate:function(){this.processedXData||
this.processData();this.generatePoints();for(var a=this.options,b=a.stacking,c=this.xAxis,d=c.categories,e=this.yAxis,f=this.points,g=f.length,h=!!this.modifyValue,i=a.pointPlacement,k=i==="between"||ka(i),j=a.threshold,a=0;a<g;a++){var l=f[a],m=l.x,n=l.y,p=l.low,u=b&&e.stacks[(this.negStacks&&n<j?"-":"")+this.stackKey];if(e.isLog&&n<=0)l.y=n=null;l.plotX=c.translate(m,0,0,0,1,i,this.type==="flags");if(b&&this.visible&&u&&u[m])u=u[m],n=u.points[this.index+","+a],p=n[0],n=n[1],p===0&&(p=o(j,e.min)),
e.isLog&&p<=0&&(p=null),l.total=l.stackTotal=u.total,l.percentage=u.total&&l.y/u.total*100,l.stackY=n,u.setOffset(this.pointXOffset||0,this.barW||0);l.yBottom=t(p)?e.translate(p,0,1,0,1):null;h&&(n=this.modifyValue(n,l));l.plotY=typeof n==="number"&&n!==Infinity?e.translate(n,0,1,0,1):r;l.clientX=k?c.translate(m,0,0,0,1):l.plotX;l.negative=l.y<(j||0);l.category=d&&d[l.x]!==r?d[l.x]:l.x}this.getSegments()},animate:function(a){var b=this.chart,c=b.renderer,d;d=this.options.animation;var e=this.clipBox||
b.clipBox,f=b.inverted,g;if(d&&!ea(d))d=T[this.type].animation;g=["_sharedClip",d.duration,d.easing,e.height].join(",");a?(a=b[g],d=b[g+"m"],a||(b[g]=a=c.clipRect(v(e,{width:0})),b[g+"m"]=d=c.clipRect(-99,f?-b.plotLeft:-b.plotTop,99,f?b.chartWidth:b.chartHeight)),this.group.clip(a),this.markerGroup.clip(d),this.sharedClipKey=g):((a=b[g])&&a.animate({width:b.plotSizeX},d),b[g+"m"]&&b[g+"m"].animate({width:b.plotSizeX+99},d),this.animate=null)},afterAnimate:function(){var a=this.chart,b=this.sharedClipKey,
c=this.group,d=this.clipBox;if(c&&this.options.clip!==!1){if(!b||!d)c.clip(d?a.renderer.clipRect(d):a.clipRect);this.markerGroup.clip()}K(this,"afterAnimate");setTimeout(function(){b&&a[b]&&(d||(a[b]=a[b].destroy()),a[b+"m"]&&(a[b+"m"]=a[b+"m"].destroy()))},100)},drawPoints:function(){var a,b=this.points,c=this.chart,d,e,f,g,h,i,k,j;d=this.options.marker;var l=this.pointAttr[""],m,n=this.markerGroup,p=o(d.enabled,this.activePointCount<0.5*this.xAxis.len/d.radius);if(d.enabled!==!1||this._hasPointMarkers)for(f=
b.length;f--;)if(g=b[f],d=S(g.plotX),e=g.plotY,j=g.graphic,i=g.marker||{},a=p&&i.enabled===r||i.enabled,m=c.isInsidePlot(s(d),e,c.inverted),a&&e!==r&&!isNaN(e)&&g.y!==null)if(a=g.pointAttr[g.selected?"select":""]||l,h=a.r,i=o(i.symbol,this.symbol),k=i.indexOf("url")===0,j)j[m?"show":"hide"](!0).animate(v({x:d-h,y:e-h},j.symbolName?{width:2*h,height:2*h}:{}));else{if(m&&(h>0||k))g.graphic=c.renderer.symbol(i,d-h,e-h,2*h,2*h).attr(a).add(n)}else if(j)g.graphic=j.destroy()},convertAttribs:function(a,
b,c,d){var e=this.pointAttrToOptions,f,g,h={},a=a||{},b=b||{},c=c||{},d=d||{};for(f in e)g=e[f],h[f]=o(a[g],b[f],c[f],d[f]);return h},getAttribs:function(){var a=this,b=a.options,c=T[a.type].marker?b.marker:b,d=c.states,e=d.hover,f,g=a.color;f={stroke:g,fill:g};var h=a.points||[],i,k=[],j,l=a.pointAttrToOptions;j=a.hasPointSpecificOptions;var m=b.negativeColor,n=c.lineColor,p=c.fillColor;i=b.turboThreshold;var u;b.marker?(e.radius=e.radius||c.radius+2,e.lineWidth=e.lineWidth||c.lineWidth+1):e.color=
e.color||Fa(e.color||g).brighten(e.brightness).get();k[""]=a.convertAttribs(c,f);q(["hover","select"],function(b){k[b]=a.convertAttribs(d[b],k[""])});a.pointAttr=k;g=h.length;if(!i||g<i||j)for(;g--;){i=h[g];if((c=i.options&&i.options.marker||i.options)&&c.enabled===!1)c.radius=0;if(i.negative&&m)i.color=i.fillColor=m;j=b.colorByPoint||i.color;if(i.options)for(u in l)t(c[l[u]])&&(j=!0);if(j){c=c||{};j=[];d=c.states||{};f=d.hover=d.hover||{};if(!b.marker)f.color=f.color||!i.options.color&&e.color||
Fa(i.color).brighten(f.brightness||e.brightness).get();f={color:i.color};if(!p)f.fillColor=i.color;if(!n)f.lineColor=i.color;j[""]=a.convertAttribs(v(f,c),k[""]);j.hover=a.convertAttribs(d.hover,k.hover,j[""]);j.select=a.convertAttribs(d.select,k.select,j[""])}else j=k;i.pointAttr=j}},destroy:function(){var a=this,b=a.chart,c=/AppleWebKit\/533/.test(Da),d,e,f=a.data||[],g,h,i;K(a,"destroy");R(a);q(a.axisTypes||[],function(b){if(i=a[b])oa(i.series,a),i.isDirty=i.forceRedraw=!0});a.legendItem&&a.chart.legend.destroyItem(a);
for(e=f.length;e--;)(g=f[e])&&g.destroy&&g.destroy();a.points=null;clearTimeout(a.animationTimeout);q("area,graph,dataLabelsGroup,group,markerGroup,tracker,graphNeg,areaNeg,posClip,negClip".split(","),function(b){a[b]&&(d=c&&b==="group"?"hide":"destroy",a[b][d]())});if(b.hoverSeries===a)b.hoverSeries=null;oa(b.series,a);for(h in a)delete a[h]},getSegmentPath:function(a){var b=this,c=[],d=b.options.step;q(a,function(e,f){var g=e.plotX,h=e.plotY,i;b.getPointSpline?c.push.apply(c,b.getPointSpline(a,
e,f)):(c.push(f?"L":"M"),d&&f&&(i=a[f-1],d==="right"?c.push(i.plotX,h):d==="center"?c.push((i.plotX+g)/2,i.plotY,(i.plotX+g)/2,h):c.push(g,i.plotY)),c.push(e.plotX,e.plotY))});return c},getGraphPath:function(){var a=this,b=[],c,d=[];q(a.segments,function(e){c=a.getSegmentPath(e);e.length>1?b=b.concat(c):d.push(e[0])});a.singlePoints=d;return a.graphPath=b},drawGraph:function(){var a=this,b=this.options,c=[["graph",b.lineColor||this.color]],d=b.lineWidth,e=b.dashStyle,f=b.linecap!=="square",g=this.getGraphPath(),
h=b.negativeColor;h&&c.push(["graphNeg",h]);q(c,function(c,h){var j=c[0],l=a[j];if(l)fb(l),l.animate({d:g});else if(d&&g.length)l={stroke:c[1],"stroke-width":d,fill:X,zIndex:1},e?l.dashstyle=e:f&&(l["stroke-linecap"]=l["stroke-linejoin"]="round"),a[j]=a.chart.renderer.path(g).attr(l).add(a.group).shadow(!h&&b.shadow)})},clipNeg:function(){var a=this.options,b=this.chart,c=b.renderer,d=a.negativeColor||a.negativeFillColor,e,f=this.graph,g=this.area,h=this.posClip,i=this.negClip;e=b.chartWidth;var k=
b.chartHeight,j=w(e,k),l=this.yAxis;if(d&&(f||g)){d=s(l.toPixels(a.threshold||0,!0));d<0&&(j-=d);a={x:0,y:0,width:j,height:d};j={x:0,y:d,width:j,height:j};if(b.inverted)a.height=j.y=b.plotWidth-d,c.isVML&&(a={x:b.plotWidth-d-b.plotLeft,y:0,width:e,height:k},j={x:d+b.plotLeft-e,y:0,width:b.plotLeft+d,height:e});l.reversed?(b=j,e=a):(b=a,e=j);h?(h.animate(b),i.animate(e)):(this.posClip=h=c.clipRect(b),this.negClip=i=c.clipRect(e),f&&this.graphNeg&&(f.clip(h),this.graphNeg.clip(i)),g&&(g.clip(h),this.areaNeg.clip(i)))}},
invertGroups:function(){function a(){var a={width:b.yAxis.len,height:b.xAxis.len};q(["group","markerGroup"],function(c){b[c]&&b[c].attr(a).invert()})}var b=this,c=b.chart;if(b.xAxis)A(c,"resize",a),A(b,"destroy",function(){R(c,"resize",a)}),a(),b.invertGroups=a},plotGroup:function(a,b,c,d,e){var f=this[a],g=!f;g&&(this[a]=f=this.chart.renderer.g(b).attr({visibility:c,zIndex:d||0.1}).add(e));f[g?"attr":"animate"](this.getPlotBox());return f},getPlotBox:function(){var a=this.chart,b=this.xAxis,c=this.yAxis;
if(a.inverted)b=c,c=this.xAxis;return{translateX:b?b.left:a.plotLeft,translateY:c?c.top:a.plotTop,scaleX:1,scaleY:1}},render:function(){var a=this,b=a.chart,c,d=a.options,e=(c=d.animation)&&!!a.animate&&b.renderer.isSVG&&o(c.duration,500)||0,f=a.visible?"visible":"hidden",g=d.zIndex,h=a.hasRendered,i=b.seriesGroup;c=a.plotGroup("group","series",f,g,i);a.markerGroup=a.plotGroup("markerGroup","markers",f,g,i);e&&a.animate(!0);a.getAttribs();c.inverted=a.isCartesian?b.inverted:!1;a.drawGraph&&(a.drawGraph(),
a.clipNeg());a.drawDataLabels&&a.drawDataLabels();a.visible&&a.drawPoints();a.drawTracker&&a.options.enableMouseTracking!==!1&&a.drawTracker();b.inverted&&a.invertGroups();d.clip!==!1&&!a.sharedClipKey&&!h&&c.clip(b.clipRect);e&&a.animate();if(!h)e?a.animationTimeout=setTimeout(function(){a.afterAnimate()},e):a.afterAnimate();a.isDirty=a.isDirtyData=!1;a.hasRendered=!0},redraw:function(){var a=this.chart,b=this.isDirtyData,c=this.group,d=this.xAxis,e=this.yAxis;c&&(a.inverted&&c.attr({width:a.plotWidth,
height:a.plotHeight}),c.animate({translateX:o(d&&d.left,a.plotLeft),translateY:o(e&&e.top,a.plotTop)}));this.translate();this.setTooltipPoints&&this.setTooltipPoints(!0);this.render();b&&K(this,"updatedData")}};Rb.prototype={destroy:function(){Ka(this,this.axis)},render:function(a){var b=this.options,c=b.format,c=c?Ja(c,this):b.formatter.call(this);this.label?this.label.attr({text:c,visibility:"hidden"}):this.label=this.axis.chart.renderer.text(c,null,null,b.useHTML).css(b.style).attr({align:this.textAlign,
rotation:b.rotation,visibility:"hidden"}).add(a)},setOffset:function(a,b){var c=this.axis,d=c.chart,e=d.inverted,f=this.isNegative,g=c.translate(c.usePercentage?100:this.total,0,0,0,1),c=c.translate(0),c=N(g-c),h=d.xAxis[0].translate(this.x)+a,i=d.plotHeight,f={x:e?f?g:g-c:h,y:e?i-h-b:f?i-g-c:i-g,width:e?c:b,height:e?b:c};if(e=this.label)e.align(this.alignOptions,null,f),f=e.alignAttr,e[this.options.crop===!1||d.isInsidePlot(f.x,f.y)?"show":"hide"](!0)}};F.prototype.buildStacks=function(){var a=this.series,
b=o(this.options.reversedStacks,!0),c=a.length;if(!this.isXAxis){for(this.usePercentage=!1;c--;)a[b?c:a.length-c-1].setStackedPoints();if(this.usePercentage)for(c=0;c<a.length;c++)a[c].setPercentStacks()}};F.prototype.renderStackTotals=function(){var a=this.chart,b=a.renderer,c=this.stacks,d,e,f=this.stackTotalGroup;if(!f)this.stackTotalGroup=f=b.g("stack-labels").attr({visibility:"visible",zIndex:6}).add();f.translate(a.plotLeft,a.plotTop);for(d in c)for(e in a=c[d],a)a[e].render(f)};L.prototype.setStackedPoints=
function(){if(this.options.stacking&&!(this.visible!==!0&&this.chart.options.chart.ignoreHiddenSeries!==!1)){var a=this.processedXData,b=this.processedYData,c=[],d=b.length,e=this.options,f=e.threshold,g=e.stack,e=e.stacking,h=this.stackKey,i="-"+h,k=this.negStacks,j=this.yAxis,l=j.stacks,m=j.oldStacks,n,p,u,o,q,x;for(o=0;o<d;o++){q=a[o];x=b[o];u=this.index+","+o;p=(n=k&&x<f)?i:h;l[p]||(l[p]={});if(!l[p][q])m[p]&&m[p][q]?(l[p][q]=m[p][q],l[p][q].total=null):l[p][q]=new Rb(j,j.options.stackLabels,
n,q,g);p=l[p][q];p.points[u]=[p.cum||0];e==="percent"?(n=n?h:i,k&&l[n]&&l[n][q]?(n=l[n][q],p.total=n.total=w(n.total,p.total)+N(x)||0):p.total=ga(p.total+(N(x)||0))):p.total=ga(p.total+(x||0));p.cum=(p.cum||0)+(x||0);p.points[u].push(p.cum);c[o]=p.cum}if(e==="percent")j.usePercentage=!0;this.stackedYData=c;j.oldStacks={}}};L.prototype.setPercentStacks=function(){var a=this,b=a.stackKey,c=a.yAxis.stacks,d=a.processedXData;q([b,"-"+b],function(b){var e;for(var f=d.length,g,h;f--;)if(g=d[f],e=(h=c[b]&&
c[b][g])&&h.points[a.index+","+f],g=e)h=h.total?100/h.total:0,g[0]=ga(g[0]*h),g[1]=ga(g[1]*h),a.stackedYData[f]=g[1]})};v(va.prototype,{addSeries:function(a,b,c){var d,e=this;a&&(b=o(b,!0),K(e,"addSeries",{options:a},function(){d=e.initSeries(a);e.isDirtyLegend=!0;e.linkSeries();b&&e.redraw(c)}));return d},addAxis:function(a,b,c,d){var e=b?"xAxis":"yAxis",f=this.options;new F(this,y(a,{index:this[e].length,isX:b}));f[e]=la(f[e]||{});f[e].push(a);o(c,!0)&&this.redraw(d)},showLoading:function(a){var b=
this.options,c=this.loadingDiv,d=b.loading;if(!c)this.loadingDiv=c=Y(Ta,{className:"highcharts-loading"},v(d.style,{zIndex:10,display:X}),this.container),this.loadingSpan=Y("span",null,d.labelStyle,c);this.loadingSpan.innerHTML=a||b.lang.loading;if(!this.loadingShown)E(c,{opacity:0,display:"",left:this.plotLeft+"px",top:this.plotTop+"px",width:this.plotWidth+"px",height:this.plotHeight+"px"}),ob(c,{opacity:d.style.opacity},{duration:d.showDuration||0}),this.loadingShown=!0},hideLoading:function(){var a=
this.options,b=this.loadingDiv;b&&ob(b,{opacity:0},{duration:a.loading.hideDuration||100,complete:function(){E(b,{display:X})}});this.loadingShown=!1}});v(za.prototype,{update:function(a,b,c){var d=this,e=d.series,f=d.graphic,g,h=e.data,i=e.chart,k=e.options,b=o(b,!0);d.firePointEvent("update",{options:a},function(){d.applyOptions(a);if(ea(a)){e.getAttribs();if(f)a&&a.marker&&a.marker.symbol?d.graphic=f.destroy():f.attr(d.pointAttr[d.state||""]);if(a&&a.dataLabels&&d.dataLabel)d.dataLabel=d.dataLabel.destroy()}g=
wa(d,h);e.updateParallelArrays(d,g);k.data[g]=d.options;e.isDirty=e.isDirtyData=!0;if(!e.fixedBox&&e.hasCartesianSeries)i.isDirtyBox=!0;k.legendType==="point"&&i.legend.destroyItem(d);b&&i.redraw(c)})},remove:function(a,b){var c=this,d=c.series,e=d.points,f=d.chart,g,h=d.data;Ya(b,f);a=o(a,!0);c.firePointEvent("remove",null,function(){g=wa(c,h);h.length===e.length&&e.splice(g,1);h.splice(g,1);d.options.data.splice(g,1);d.updateParallelArrays(c,"splice",g,1);c.destroy();d.isDirty=!0;d.isDirtyData=
!0;a&&f.redraw()})}});v(L.prototype,{addPoint:function(a,b,c,d){var e=this.options,f=this.data,g=this.graph,h=this.area,i=this.chart,k=this.xAxis&&this.xAxis.names,j=g&&g.shift||0,l=e.data,m,n=this.xData;Ya(d,i);c&&q([g,h,this.graphNeg,this.areaNeg],function(a){if(a)a.shift=j+1});if(h)h.isArea=!0;b=o(b,!0);d={series:this};this.pointClass.prototype.applyOptions.apply(d,[a]);g=d.x;h=n.length;if(this.requireSorting&&g<n[h-1])for(m=!0;h&&n[h-1]>g;)h--;this.updateParallelArrays(d,"splice",h,0,0);this.updateParallelArrays(d,
h);if(k)k[g]=d.name;l.splice(h,0,a);m&&(this.data.splice(h,0,null),this.processData());e.legendType==="point"&&this.generatePoints();c&&(f[0]&&f[0].remove?f[0].remove(!1):(f.shift(),this.updateParallelArrays(d,"shift"),l.shift()));this.isDirtyData=this.isDirty=!0;b&&(this.getAttribs(),i.redraw())},remove:function(a,b){var c=this,d=c.chart,a=o(a,!0);if(!c.isRemoving)c.isRemoving=!0,K(c,"remove",null,function(){c.destroy();d.isDirtyLegend=d.isDirtyBox=!0;d.linkSeries();a&&d.redraw(b)});c.isRemoving=
!1},update:function(a,b){var c=this.chart,d=this.type,e=C[d].prototype,f,a=y(this.userOptions,{animation:!1,index:this.index,pointStart:this.xData[0]},{data:this.options.data},a);this.remove(!1);for(f in e)e.hasOwnProperty(f)&&(this[f]=r);v(this,C[a.type||d].prototype);this.init(c,a);o(b,!0)&&c.redraw(!1)}});v(F.prototype,{update:function(a,b){var c=this.chart,a=c.options[this.coll][this.options.index]=y(this.userOptions,a);this.destroy(!0);this._addedPlotLB=r;this.init(c,v(a,{events:r}));c.isDirtyBox=
!0;o(b,!0)&&c.redraw()},remove:function(a){for(var b=this.chart,c=this.coll,d=this.series,e=d.length;e--;)d[e]&&d[e].remove(!1);oa(b.axes,this);oa(b[c],this);b.options[c].splice(this.options.index,1);q(b[c],function(a,b){a.options.index=b});this.destroy();b.isDirtyBox=!0;o(a,!0)&&b.redraw()},setTitle:function(a,b){this.update({title:a},b)},setCategories:function(a,b){this.update({categories:a},b)}});var Aa=fa(L);C.line=Aa;T.area=y(M,{threshold:0});var ta=fa(L,{type:"area",getSegments:function(){var a=
[],b=[],c=[],d=this.xAxis,e=this.yAxis,f=e.stacks[this.stackKey],g={},h,i,k=this.points,j=this.options.connectNulls,l,m,n;if(this.options.stacking&&!this.cropped){for(m=0;m<k.length;m++)g[k[m].x]=k[m];for(n in f)f[n].total!==null&&c.push(+n);c.sort(function(a,b){return a-b});q(c,function(a){if(!j||g[a]&&g[a].y!==null)g[a]?b.push(g[a]):(h=d.translate(a),l=f[a].percent?f[a].total?f[a].cum*100/f[a].total:0:f[a].cum,i=e.toPixels(l,!0),b.push({y:null,plotX:h,clientX:h,plotY:i,yBottom:i,onMouseOver:ma}))});
b.length&&a.push(b)}else L.prototype.getSegments.call(this),a=this.segments;this.segments=a},getSegmentPath:function(a){var b=L.prototype.getSegmentPath.call(this,a),c=[].concat(b),d,e=this.options;d=b.length;var f=this.yAxis.getThreshold(e.threshold),g;d===3&&c.push("L",b[1],b[2]);if(e.stacking&&!this.closedStacks)for(d=a.length-1;d>=0;d--)g=o(a[d].yBottom,f),d<a.length-1&&e.step&&c.push(a[d+1].plotX,g),c.push(a[d].plotX,g);else this.closeSegment(c,a,f);this.areaPath=this.areaPath.concat(c);return b},
closeSegment:function(a,b,c){a.push("L",b[b.length-1].plotX,c,"L",b[0].plotX,c)},drawGraph:function(){this.areaPath=[];L.prototype.drawGraph.apply(this);var a=this,b=this.areaPath,c=this.options,d=c.negativeColor,e=c.negativeFillColor,f=[["area",this.color,c.fillColor]];(d||e)&&f.push(["areaNeg",d,e]);q(f,function(d){var e=d[0],f=a[e];f?f.animate({d:b}):a[e]=a.chart.renderer.path(b).attr({fill:o(d[2],Fa(d[1]).setOpacity(o(c.fillOpacity,0.75)).get()),zIndex:0}).add(a.group)})},drawLegendSymbol:Q.drawRectangle});
C.area=ta;T.spline=y(M);Aa=fa(L,{type:"spline",getPointSpline:function(a,b,c){var d=b.plotX,e=b.plotY,f=a[c-1],g=a[c+1],h,i,k,j;if(f&&g){a=f.plotY;k=g.plotX;var g=g.plotY,l;h=(1.5*d+f.plotX)/2.5;i=(1.5*e+a)/2.5;k=(1.5*d+k)/2.5;j=(1.5*e+g)/2.5;l=(j-i)*(k-d)/(k-h)+e-j;i+=l;j+=l;i>a&&i>e?(i=w(a,e),j=2*e-i):i<a&&i<e&&(i=z(a,e),j=2*e-i);j>g&&j>e?(j=w(g,e),i=2*e-j):j<g&&j<e&&(j=z(g,e),i=2*e-j);b.rightContX=k;b.rightContY=j}c?(b=["C",f.rightContX||f.plotX,f.rightContY||f.plotY,h||d,i||e,d,e],f.rightContX=
f.rightContY=null):b=["M",d,e];return b}});C.spline=Aa;T.areaspline=y(T.area);ta=ta.prototype;Aa=fa(Aa,{type:"areaspline",closedStacks:!0,getSegmentPath:ta.getSegmentPath,closeSegment:ta.closeSegment,drawGraph:ta.drawGraph,drawLegendSymbol:Q.drawRectangle});C.areaspline=Aa;T.column=y(M,{borderColor:"#FFFFFF",borderRadius:0,groupPadding:0.2,marker:null,pointPadding:0.1,minPointLength:0,cropThreshold:50,pointRange:null,states:{hover:{brightness:0.1,shadow:!1,halo:!1},select:{color:"#C0C0C0",borderColor:"#000000",
shadow:!1}},dataLabels:{align:null,verticalAlign:null,y:null},stickyTracking:!1,tooltip:{distance:6},threshold:0});Aa=fa(L,{type:"column",pointAttrToOptions:{stroke:"borderColor",fill:"color",r:"borderRadius"},cropShoulder:0,trackerGroups:["group","dataLabelsGroup"],negStacks:!0,init:function(){L.prototype.init.apply(this,arguments);var a=this,b=a.chart;b.hasRendered&&q(b.series,function(b){if(b.type===a.type)b.isDirty=!0})},getColumnMetrics:function(){var a=this,b=a.options,c=a.xAxis,d=a.yAxis,e=
c.reversed,f,g={},h,i=0;b.grouping===!1?i=1:q(a.chart.series,function(b){var c=b.options,e=b.yAxis;if(b.type===a.type&&b.visible&&d.len===e.len&&d.pos===e.pos)c.stacking?(f=b.stackKey,g[f]===r&&(g[f]=i++),h=g[f]):c.grouping!==!1&&(h=i++),b.columnIndex=h});var c=z(N(c.transA)*(c.ordinalSlope||b.pointRange||c.closestPointRange||c.tickInterval||1),c.len),k=c*b.groupPadding,j=(c-2*k)/i,l=b.pointWidth,b=t(l)?(j-l)/2:j*b.pointPadding,l=o(l,j-2*b);return a.columnMetrics={width:l,offset:b+(k+((e?i-(a.columnIndex||
0):a.columnIndex)||0)*j-c/2)*(e?-1:1)}},translate:function(){var a=this,b=a.chart,c=a.options,d=a.borderWidth=o(c.borderWidth,a.activePointCount>0.5*a.xAxis.len?0:1),e=a.yAxis,f=a.translatedThreshold=e.getThreshold(c.threshold),g=o(c.minPointLength,5),c=a.getColumnMetrics(),h=c.width,i=a.barW=Va(w(h,1+2*d)),k=a.pointXOffset=c.offset,j=-(d%2?0.5:0),l=d%2?0.5:1;b.renderer.isVML&&b.inverted&&(l+=1);L.prototype.translate.apply(a);q(a.points,function(c){var d=o(c.yBottom,f),p=z(w(-999-d,c.plotY),e.len+
999+d),u=c.plotX+k,q=i,r=z(p,d),x;x=w(p,d)-r;N(x)<g&&g&&(x=g,r=s(N(r-f)>g?d-g:f-(e.translate(c.y,0,1,0,1)<=f?g:0)));c.barX=u;c.pointWidth=h;c.tooltipPos=b.inverted?[e.len-p,a.xAxis.len-u-q/2]:[u+q/2,p];d=N(u)<0.5;q=s(u+q)+j;u=s(u)+j;q-=u;p=N(r)<0.5;x=s(r+x)+l;r=s(r)+l;x-=r;d&&(u+=1,q-=1);p&&(r-=1,x+=1);c.shapeType="rect";c.shapeArgs={x:u,y:r,width:q,height:x}})},getSymbol:ma,drawLegendSymbol:Q.drawRectangle,drawGraph:ma,drawPoints:function(){var a=this,b=this.chart,c=a.options,d=b.renderer,e=c.animationLimit||
250,f,g,h;q(a.points,function(i){var k=i.plotY,j=i.graphic;if(k!==r&&!isNaN(k)&&i.y!==null)f=i.shapeArgs,h=t(a.borderWidth)?{"stroke-width":a.borderWidth}:{},g=i.pointAttr[i.selected?"select":""]||a.pointAttr[""],j?(fb(j),j.attr(h)[b.pointCount<e?"animate":"attr"](y(f))):i.graphic=d[i.shapeType](f).attr(g).attr(h).add(a.group).shadow(c.shadow,null,c.stacking&&!c.borderRadius);else if(j)i.graphic=j.destroy()})},animate:function(a){var b=this.yAxis,c=this.options,d=this.chart.inverted,e={};if(ba)a?
(e.scaleY=0.001,a=z(b.pos+b.len,w(b.pos,b.toPixels(c.threshold))),d?e.translateX=a-b.len:e.translateY=a,this.group.attr(e)):(e.scaleY=1,e[d?"translateX":"translateY"]=b.pos,this.group.animate(e,this.options.animation),this.animate=null)},remove:function(){var a=this,b=a.chart;b.hasRendered&&q(b.series,function(b){if(b.type===a.type)b.isDirty=!0});L.prototype.remove.apply(a,arguments)}});C.column=Aa;T.bar=y(T.column);ta=fa(Aa,{type:"bar",inverted:!0});C.bar=ta;T.scatter=y(M,{lineWidth:0,tooltip:{headerFormat:'<span style="color:{series.color}">●</span> <span style="font-size: 10px;"> {series.name}</span><br/>',
pointFormat:"x: <b>{point.x}</b><br/>y: <b>{point.y}</b><br/>"},stickyTracking:!1});ta=fa(L,{type:"scatter",sorted:!1,requireSorting:!1,noSharedTooltip:!0,trackerGroups:["markerGroup"],takeOrdinalPosition:!1,singularTooltips:!0,drawGraph:function(){this.options.lineWidth&&L.prototype.drawGraph.call(this)}});C.scatter=ta;T.pie=y(M,{borderColor:"#FFFFFF",borderWidth:1,center:[null,null],clip:!1,colorByPoint:!0,dataLabels:{distance:30,enabled:!0,format:"{point.name}"},ignoreHiddenPoint:!0,legendType:"point",
marker:null,size:null,showInLegend:!1,slicedOffset:10,states:{hover:{brightness:0.1,shadow:!1}},stickyTracking:!1,tooltip:{followPointer:!0}});M={type:"pie",isCartesian:!1,pointClass:fa(za,{init:function(){za.prototype.init.apply(this,arguments);var a=this,b;if(a.y<0)a.y=null;v(a,{visible:a.visible!==!1,name:o(a.name,"Slice")});b=function(b){a.slice(b.type==="select")};A(a,"select",b);A(a,"unselect",b);return a},setVisible:function(a){var b=this,c=b.series,d=c.chart;b.visible=b.options.visible=a=
a===r?!b.visible:a;c.options.data[wa(b,c.data)]=b.options;q(["graphic","dataLabel","connector","shadowGroup"],function(c){if(b[c])b[c][a?"show":"hide"](!0)});b.legendItem&&d.legend.colorizeItem(b,a);if(!c.isDirty&&c.options.ignoreHiddenPoint)c.isDirty=!0,d.redraw()},slice:function(a,b,c){var d=this.series;Ya(c,d.chart);o(b,!0);this.sliced=this.options.sliced=a=t(a)?a:!this.sliced;d.options.data[wa(this,d.data)]=this.options;a=a?this.slicedTranslation:{translateX:0,translateY:0};this.graphic.animate(a);
this.shadowGroup&&this.shadowGroup.animate(a)},haloPath:function(a){var b=this.shapeArgs,c=this.series.chart;return this.series.chart.renderer.symbols.arc(c.plotLeft+b.x,c.plotTop+b.y,b.r+a,b.r+a,{innerR:this.shapeArgs.r,start:b.start,end:b.end})}}),requireSorting:!1,noSharedTooltip:!0,trackerGroups:["group","dataLabelsGroup"],axisTypes:[],pointAttrToOptions:{stroke:"borderColor","stroke-width":"borderWidth",fill:"color"},singularTooltips:!0,getColor:ma,animate:function(a){var b=this,c=b.points,d=
b.startAngleRad;if(!a)q(c,function(a){var c=a.graphic,a=a.shapeArgs;c&&(c.attr({r:b.center[3]/2,start:d,end:d}),c.animate({r:a.r,start:a.start,end:a.end},b.options.animation))}),b.animate=null},setData:function(a,b,c,d){L.prototype.setData.call(this,a,!1,c,d);this.processData();this.generatePoints();o(b,!0)&&this.chart.redraw(c)},generatePoints:function(){var a,b=0,c,d,e,f=this.options.ignoreHiddenPoint;L.prototype.generatePoints.call(this);c=this.points;d=c.length;for(a=0;a<d;a++)e=c[a],b+=f&&!e.visible?
0:e.y;this.total=b;for(a=0;a<d;a++)e=c[a],e.percentage=b>0?e.y/b*100:0,e.total=b},translate:function(a){this.generatePoints();var b=0,c=this.options,d=c.slicedOffset,e=d+c.borderWidth,f,g,h,i=c.startAngle||0,k=this.startAngleRad=qa/180*(i-90),i=(this.endAngleRad=qa/180*(o(c.endAngle,i+360)-90))-k,j=this.points,l=c.dataLabels.distance,c=c.ignoreHiddenPoint,m,n=j.length,p;if(!a)this.center=a=this.getCenter();this.getX=function(b,c){h=U.asin(z((b-a[1])/(a[2]/2+l),1));return a[0]+(c?-1:1)*ca(h)*(a[2]/
2+l)};for(m=0;m<n;m++){p=j[m];f=k+b*i;if(!c||p.visible)b+=p.percentage/100;g=k+b*i;p.shapeType="arc";p.shapeArgs={x:a[0],y:a[1],r:a[2]/2,innerR:a[3]/2,start:s(f*1E3)/1E3,end:s(g*1E3)/1E3};h=(g+f)/2;h>1.5*qa?h-=2*qa:h<-qa/2&&(h+=2*qa);p.slicedTranslation={translateX:s(ca(h)*d),translateY:s(ha(h)*d)};f=ca(h)*a[2]/2;g=ha(h)*a[2]/2;p.tooltipPos=[a[0]+f*0.7,a[1]+g*0.7];p.half=h<-qa/2||h>qa/2?1:0;p.angle=h;e=z(e,l/2);p.labelPos=[a[0]+f+ca(h)*l,a[1]+g+ha(h)*l,a[0]+f+ca(h)*e,a[1]+g+ha(h)*e,a[0]+f,a[1]+g,
l<0?"center":p.half?"right":"left",h]}},drawGraph:null,drawPoints:function(){var a=this,b=a.chart.renderer,c,d,e=a.options.shadow,f,g;if(e&&!a.shadowGroup)a.shadowGroup=b.g("shadow").add(a.group);q(a.points,function(h){d=h.graphic;g=h.shapeArgs;f=h.shadowGroup;if(e&&!f)f=h.shadowGroup=b.g("shadow").add(a.shadowGroup);c=h.sliced?h.slicedTranslation:{translateX:0,translateY:0};f&&f.attr(c);d?d.animate(v(g,c)):h.graphic=d=b[h.shapeType](g).setRadialReference(a.center).attr(h.pointAttr[h.selected?"select":
""]).attr({"stroke-linejoin":"round"}).attr(c).add(a.group).shadow(e,f);h.visible!==void 0&&h.setVisible(h.visible)})},sortByAngle:function(a,b){a.sort(function(a,d){return a.angle!==void 0&&(d.angle-a.angle)*b})},drawLegendSymbol:Q.drawRectangle,getCenter:da.getCenter,getSymbol:ma};M=fa(L,M);C.pie=M;L.prototype.drawDataLabels=function(){var a=this,b=a.options,c=b.cursor,d=b.dataLabels,e=a.points,f,g,h,i;if(d.enabled||a._hasPointLabels)a.dlProcessOptions&&a.dlProcessOptions(d),i=a.plotGroup("dataLabelsGroup",
"data-labels","hidden",d.zIndex||6),!a.hasRendered&&o(d.defer,!0)&&(i.attr({opacity:0}),A(a,"afterAnimate",function(){a.dataLabelsGroup.show()[b.animation?"animate":"attr"]({opacity:1},{duration:200})})),g=d,q(e,function(b){var e,l=b.dataLabel,m,n,p=b.connector,u=!0;f=b.options&&b.options.dataLabels;e=o(f&&f.enabled,g.enabled);if(l&&!e)b.dataLabel=l.destroy();else if(e){d=y(g,f);e=d.rotation;m=b.getLabelConfig();h=d.format?Ja(d.format,m):d.formatter.call(m,d);d.style.color=o(d.color,d.style.color,
a.color,"black");if(l)if(t(h))l.attr({text:h}),u=!1;else{if(b.dataLabel=l=l.destroy(),p)b.connector=p.destroy()}else if(t(h)){l={fill:d.backgroundColor,stroke:d.borderColor,"stroke-width":d.borderWidth,r:d.borderRadius||0,rotation:e,padding:d.padding,zIndex:1};for(n in l)l[n]===r&&delete l[n];l=b.dataLabel=a.chart.renderer[e?"text":"label"](h,0,-999,null,null,null,d.useHTML).attr(l).css(v(d.style,c&&{cursor:c})).add(i).shadow(d.shadow)}l&&a.alignDataLabel(b,l,d,null,u)}})};L.prototype.alignDataLabel=
function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=o(a.plotX,-999),i=o(a.plotY,-999),k=b.getBBox();if(a=this.visible&&(a.series.forceDL||f.isInsidePlot(h,s(i),g)||d&&f.isInsidePlot(h,g?d.x+1:d.y+d.height-1,g)))d=v({x:g?f.plotWidth-i:h,y:s(g?f.plotHeight-h:i),width:0,height:0},d),v(c,{width:k.width,height:k.height}),c.rotation?(g={align:c.align,x:d.x+c.x+d.width/2,y:d.y+c.y+d.height/2},b[e?"attr":"animate"](g)):(b.align(c,null,d),g=b.alignAttr,o(c.overflow,"justify")==="justify"?this.justifyDataLabel(b,
c,g,k,d,e):o(c.crop,!0)&&(a=f.isInsidePlot(g.x,g.y)&&f.isInsidePlot(g.x+k.width,g.y+k.height)));if(!a)b.attr({y:-999}),b.placed=!1};L.prototype.justifyDataLabel=function(a,b,c,d,e,f){var g=this.chart,h=b.align,i=b.verticalAlign,k,j;k=c.x;if(k<0)h==="right"?b.align="left":b.x=-k,j=!0;k=c.x+d.width;if(k>g.plotWidth)h==="left"?b.align="right":b.x=g.plotWidth-k,j=!0;k=c.y;if(k<0)i==="bottom"?b.verticalAlign="top":b.y=-k,j=!0;k=c.y+d.height;if(k>g.plotHeight)i==="top"?b.verticalAlign="bottom":b.y=g.plotHeight-
k,j=!0;if(j)a.placed=!f,a.align(b,null,e)};if(C.pie)C.pie.prototype.drawDataLabels=function(){var a=this,b=a.data,c,d=a.chart,e=a.options.dataLabels,f=o(e.connectorPadding,10),g=o(e.connectorWidth,1),h=d.plotWidth,d=d.plotHeight,i,k,j=o(e.softConnector,!0),l=e.distance,m=a.center,n=m[2]/2,p=m[1],u=l>0,r,G,x,t,v=[[],[]],y,z,A,B,D,C=[0,0,0,0],J=function(a,b){return b.y-a.y};if(a.visible&&(e.enabled||a._hasPointLabels)){L.prototype.drawDataLabels.apply(a);q(b,function(a){a.dataLabel&&a.visible&&v[a.half].push(a)});
for(B=0;!t&&b[B];)t=b[B]&&b[B].dataLabel&&(b[B].dataLabel.getBBox().height||21),B++;for(B=2;B--;){var b=[],H=[],E=v[B],I=E.length,F;a.sortByAngle(E,B-0.5);if(l>0){for(D=p-n-l;D<=p+n+l;D+=t)b.push(D);G=b.length;if(I>G){c=[].concat(E);c.sort(J);for(D=I;D--;)c[D].rank=D;for(D=I;D--;)E[D].rank>=G&&E.splice(D,1);I=E.length}for(D=0;D<I;D++){c=E[D];x=c.labelPos;c=9999;var M,K;for(K=0;K<G;K++)M=N(b[K]-x[1]),M<c&&(c=M,F=K);if(F<D&&b[D]!==null)F=D;else for(G<I-D+F&&b[D]!==null&&(F=G-I+D);b[F]===null;)F++;H.push({i:F,
y:b[F]});b[F]=null}H.sort(J)}for(D=0;D<I;D++){c=E[D];x=c.labelPos;r=c.dataLabel;A=c.visible===!1?"hidden":"visible";c=x[1];if(l>0){if(G=H.pop(),F=G.i,z=G.y,c>z&&b[F+1]!==null||c<z&&b[F-1]!==null)z=c}else z=c;y=e.justify?m[0]+(B?-1:1)*(n+l):a.getX(F===0||F===b.length-1?c:z,B);r._attr={visibility:A,align:x[6]};r._pos={x:y+e.x+({left:f,right:-f}[x[6]]||0),y:z+e.y-10};r.connX=y;r.connY=z;if(this.options.size===null)G=r.width,y-G<f?C[3]=w(s(G-y+f),C[3]):y+G>h-f&&(C[1]=w(s(y+G-h+f),C[1])),z-t/2<0?C[0]=
w(s(-z+t/2),C[0]):z+t/2>d&&(C[2]=w(s(z+t/2-d),C[2]))}}if(Ba(C)===0||this.verifyDataLabelOverflow(C))this.placeDataLabels(),u&&g&&q(this.points,function(b){i=b.connector;x=b.labelPos;if((r=b.dataLabel)&&r._pos)A=r._attr.visibility,y=r.connX,z=r.connY,k=j?["M",y+(x[6]==="left"?5:-5),z,"C",y,z,2*x[2]-x[4],2*x[3]-x[5],x[2],x[3],"L",x[4],x[5]]:["M",y+(x[6]==="left"?5:-5),z,"L",x[2],x[3],"L",x[4],x[5]],i?(i.animate({d:k}),i.attr("visibility",A)):b.connector=i=a.chart.renderer.path(k).attr({"stroke-width":g,
stroke:e.connectorColor||b.color||"#606060",visibility:A}).add(a.dataLabelsGroup);else if(i)b.connector=i.destroy()})}},C.pie.prototype.placeDataLabels=function(){q(this.points,function(a){var a=a.dataLabel,b;if(a)(b=a._pos)?(a.attr(a._attr),a[a.moved?"animate":"attr"](b),a.moved=!0):a&&a.attr({y:-999})})},C.pie.prototype.alignDataLabel=ma,C.pie.prototype.verifyDataLabelOverflow=function(a){var b=this.center,c=this.options,d=c.center,e=c=c.minSize||80,f;d[0]!==null?e=w(b[2]-w(a[1],a[3]),c):(e=w(b[2]-
a[1]-a[3],c),b[0]+=(a[3]-a[1])/2);d[1]!==null?e=w(z(e,b[2]-w(a[0],a[2])),c):(e=w(z(e,b[2]-a[0]-a[2]),c),b[1]+=(a[0]-a[2])/2);e<b[2]?(b[2]=e,this.translate(b),q(this.points,function(a){if(a.dataLabel)a.dataLabel._pos=null}),this.drawDataLabels&&this.drawDataLabels()):f=!0;return f};if(C.column)C.column.prototype.alignDataLabel=function(a,b,c,d,e){var f=this.chart,g=f.inverted,h=a.dlBox||a.shapeArgs,i=a.below||a.plotY>o(this.translatedThreshold,f.plotSizeY),k=o(c.inside,!!this.options.stacking);if(h&&
(d=y(h),g&&(d={x:f.plotWidth-d.y-d.height,y:f.plotHeight-d.x-d.width,width:d.height,height:d.width}),!k))g?(d.x+=i?0:d.width,d.width=0):(d.y+=i?d.height:0,d.height=0);c.align=o(c.align,!g||k?"center":i?"right":"left");c.verticalAlign=o(c.verticalAlign,g||k?"middle":i?"top":"bottom");L.prototype.alignDataLabel.call(this,a,b,c,d,e)};var cb=P.TrackerMixin={drawTrackerPoint:function(){var a=this,b=a.chart,c=b.pointer,d=a.options.cursor,e=d&&{cursor:d},f=function(c){var d=c.target,e;if(b.hoverSeries!==
a)a.onMouseOver();for(;d&&!e;)e=d.point,d=d.parentNode;if(e!==r&&e!==b.hoverPoint)e.onMouseOver(c)};q(a.points,function(a){if(a.graphic)a.graphic.element.point=a;if(a.dataLabel)a.dataLabel.element.point=a});if(!a._hasTracking)q(a.trackerGroups,function(b){if(a[b]&&(a[b].addClass("highcharts-tracker").on("mouseover",f).on("mouseout",function(a){c.onTrackerMouseOut(a)}).css(e),ab))a[b].on("touchstart",f)}),a._hasTracking=!0},drawTrackerGraph:function(){var a=this,b=a.options,c=b.trackByArea,d=[].concat(c?
a.areaPath:a.graphPath),e=d.length,f=a.chart,g=f.pointer,h=f.renderer,i=f.options.tooltip.snap,k=a.tracker,j=b.cursor,l=j&&{cursor:j},j=a.singlePoints,m,n=function(){if(f.hoverSeries!==a)a.onMouseOver()},p="rgba(192,192,192,"+(ba?1.0E-4:0.002)+")";if(e&&!c)for(m=e+1;m--;)d[m]==="M"&&d.splice(m+1,0,d[m+1]-i,d[m+2],"L"),(m&&d[m]==="M"||m===e)&&d.splice(m,0,"L",d[m-2]+i,d[m-1]);for(m=0;m<j.length;m++)e=j[m],d.push("M",e.plotX-i,e.plotY,"L",e.plotX+i,e.plotY);k?k.attr({d:d}):(a.tracker=h.path(d).attr({"stroke-linejoin":"round",
visibility:a.visible?"visible":"hidden",stroke:p,fill:c?p:X,"stroke-width":b.lineWidth+(c?0:2*i),zIndex:2}).add(a.group),q([a.tracker,a.markerGroup],function(a){a.addClass("highcharts-tracker").on("mouseover",n).on("mouseout",function(a){g.onTrackerMouseOut(a)}).css(l);if(ab)a.on("touchstart",n)}))}};if(C.column)Aa.prototype.drawTracker=cb.drawTrackerPoint;if(C.pie)C.pie.prototype.drawTracker=cb.drawTrackerPoint;if(C.scatter)ta.prototype.drawTracker=cb.drawTrackerPoint;if(C.gauge)C.gauge.prototype.drawTracker=
cb.drawTrackerPoint;v(pb.prototype,{setItemEvents:function(a,b,c,d,e){var f=this;(c?b:a.legendGroup).on("mouseover",function(){a.setState("hover");b.css(f.options.itemHoverStyle)}).on("mouseout",function(){b.css(a.visible?d:e);a.setState()}).on("click",function(b){var c=function(){a.setVisible()},b={browserEvent:b};a.firePointEvent?a.firePointEvent("legendItemClick",b,c):K(a,"legendItemClick",b,c)})},createCheckboxForItem:function(a){a.checkbox=Y("input",{type:"checkbox",checked:a.selected,defaultChecked:a.selected},
this.options.itemCheckboxStyle,this.chart.container);A(a.checkbox,"click",function(b){K(a,"checkboxClick",{checked:b.target.checked},function(){a.select()})})}});I.legend.itemStyle.cursor="pointer";v(va.prototype,{showResetZoom:function(){var a=this,b=I.lang,c=a.options.chart.resetZoomButton,d=c.theme,e=d.states,f=c.relativeTo==="chart"?null:"plotBox";this.resetZoomButton=a.renderer.button(b.resetZoom,null,null,function(){a.zoomOut()},d,e&&e.hover).attr({align:c.position.align,title:b.resetZoomTitle}).add().align(c.position,
!1,f)},zoomOut:function(){var a=this;K(a,"selection",{resetSelection:!0},function(){a.zoom()})},zoom:function(a){var b,c=this.pointer,d=!1,e;!a||a.resetSelection?q(this.axes,function(a){b=a.zoom()}):q(a.xAxis.concat(a.yAxis),function(a){var e=a.axis,h=e.isXAxis;if(c[h?"zoomX":"zoomY"]||c[h?"pinchX":"pinchY"])b=e.zoom(a.min,a.max),e.displayBtn&&(d=!0)});e=this.resetZoomButton;if(d&&!e)this.showResetZoom();else if(!d&&ea(e))this.resetZoomButton=e.destroy();b&&this.redraw(o(this.options.chart.animation,
a&&a.animation,this.pointCount<100))},pan:function(a,b){var c=this,d=c.hoverPoints,e;d&&q(d,function(a){a.setState()});q(b==="xy"?[1,0]:[1],function(b){var d=a[b?"chartX":"chartY"],h=c[b?"xAxis":"yAxis"][0],i=c[b?"mouseDownX":"mouseDownY"],k=(h.pointRange||0)/2,j=h.getExtremes(),l=h.toValue(i-d,!0)+k,i=h.toValue(i+c[b?"plotWidth":"plotHeight"]-d,!0)-k;h.series.length&&l>z(j.dataMin,j.min)&&i<w(j.dataMax,j.max)&&(h.setExtremes(l,i,!1,!1,{trigger:"pan"}),e=!0);c[b?"mouseDownX":"mouseDownY"]=d});e&&
c.redraw(!1);E(c.container,{cursor:"move"})}});v(za.prototype,{select:function(a,b){var c=this,d=c.series,e=d.chart,a=o(a,!c.selected);c.firePointEvent(a?"select":"unselect",{accumulate:b},function(){c.selected=c.options.selected=a;d.options.data[wa(c,d.data)]=c.options;c.setState(a&&"select");b||q(e.getSelectedPoints(),function(a){if(a.selected&&a!==c)a.selected=a.options.selected=!1,d.options.data[wa(a,d.data)]=a.options,a.setState(""),a.firePointEvent("unselect")})})},onMouseOver:function(a){var b=
this.series,c=b.chart,d=c.tooltip,e=c.hoverPoint;if(e&&e!==this)e.onMouseOut();this.firePointEvent("mouseOver");d&&(!d.shared||b.noSharedTooltip)&&d.refresh(this,a);this.setState("hover");c.hoverPoint=this},onMouseOut:function(){var a=this.series.chart,b=a.hoverPoints;if(!b||wa(this,b)===-1)this.firePointEvent("mouseOut"),this.setState(),a.hoverPoint=null},importEvents:function(){if(!this.hasImportedEvents){var a=y(this.series.options.point,this.options).events,b;this.events=a;for(b in a)A(this,b,
a[b]);this.hasImportedEvents=!0}},setState:function(a,b){var c=this.plotX,d=this.plotY,e=this.series,f=e.options.states,g=T[e.type].marker&&e.options.marker,h=g&&!g.enabled,i=g&&g.states[a],k=i&&i.enabled===!1,j=e.stateMarkerGraphic,l=this.marker||{},m=e.chart,n=e.halo,p,a=a||"";p=this.pointAttr[a]||e.pointAttr[a];if(!(a===this.state&&!b||this.selected&&a!=="select"||f[a]&&f[a].enabled===!1||a&&(k||h&&i.enabled===!1)||a&&l.states&&l.states[a]&&l.states[a].enabled===!1)){if(this.graphic)g=g&&this.graphic.symbolName&&
p.r,this.graphic.attr(y(p,g?{x:c-g,y:d-g,width:2*g,height:2*g}:{})),j&&j.hide();else{if(a&&i)if(g=i.radius,l=l.symbol||e.symbol,j&&j.currentSymbol!==l&&(j=j.destroy()),j)j[b?"animate":"attr"]({x:c-g,y:d-g});else if(l)e.stateMarkerGraphic=j=m.renderer.symbol(l,c-g,d-g,2*g,2*g).attr(p).add(e.markerGroup),j.currentSymbol=l;if(j)j[a&&m.isInsidePlot(c,d,m.inverted)?"show":"hide"]()}if((c=f[a]&&f[a].halo)&&c.size){if(!n)e.halo=n=m.renderer.path().add(e.seriesGroup);n.attr(v({fill:Fa(this.color||e.color).setOpacity(c.opacity).get()},
c.attributes))[b?"animate":"attr"]({d:this.haloPath(c.size)})}else n&&n.attr({d:[]});this.state=a}},haloPath:function(a){var b=this.series.chart;return b.renderer.symbols.circle(b.plotLeft+this.plotX-a,b.plotTop+this.plotY-a,a*2,a*2)}});v(L.prototype,{onMouseOver:function(){var a=this.chart,b=a.hoverSeries;if(b&&b!==this)b.onMouseOut();this.options.events.mouseOver&&K(this,"mouseOver");this.setState("hover");a.hoverSeries=this},onMouseOut:function(){var a=this.options,b=this.chart,c=b.tooltip,d=b.hoverPoint;
if(d)d.onMouseOut();this&&a.events.mouseOut&&K(this,"mouseOut");c&&!a.stickyTracking&&(!c.shared||this.noSharedTooltip)&&c.hide();this.setState();b.hoverSeries=null},setState:function(a){var b=this.options,c=this.graph,d=this.graphNeg,e=b.states,b=b.lineWidth,a=a||"";if(this.state!==a)this.state=a,e[a]&&e[a].enabled===!1||(a&&(b=e[a].lineWidth||b+1),c&&!c.dashstyle&&(a={"stroke-width":b},c.attr(a),d&&d.attr(a)))},setVisible:function(a,b){var c=this,d=c.chart,e=c.legendItem,f,g=d.options.chart.ignoreHiddenSeries,
h=c.visible;f=(c.visible=a=c.userOptions.visible=a===r?!h:a)?"show":"hide";q(["group","dataLabelsGroup","markerGroup","tracker"],function(a){if(c[a])c[a][f]()});if(d.hoverSeries===c)c.onMouseOut();e&&d.legend.colorizeItem(c,a);c.isDirty=!0;c.options.stacking&&q(d.series,function(a){if(a.options.stacking&&a.visible)a.isDirty=!0});q(c.linkedSeries,function(b){b.setVisible(a,!1)});if(g)d.isDirtyBox=!0;b!==!1&&d.redraw();K(c,f)},setTooltipPoints:function(a){var b=[],c,d,e=this.xAxis,f=e&&e.getExtremes(),
g=e?e.tooltipLen||e.len:this.chart.plotSizeX,h,i,k=[];if(!(this.options.enableMouseTracking===!1||this.singularTooltips)){if(a)this.tooltipPoints=null;q(this.segments||this.points,function(a){b=b.concat(a)});e&&e.reversed&&(b=b.reverse());this.orderTooltipPoints&&this.orderTooltipPoints(b);a=b.length;for(i=0;i<a;i++)if(e=b[i],c=e.x,c>=f.min&&c<=f.max){h=b[i+1];c=d===r?0:d+1;for(d=b[i+1]?z(w(0,S((e.clientX+(h?h.wrappedClientX||h.clientX:g))/2)),g):g;c>=0&&c<=d;)k[c++]=e}this.tooltipPoints=k}},show:function(){this.setVisible(!0)},
hide:function(){this.setVisible(!1)},select:function(a){this.selected=a=a===r?!this.selected:a;if(this.checkbox)this.checkbox.checked=a;K(this,a?"select":"unselect")},drawTracker:cb.drawTrackerGraph});O(L.prototype,"init",function(a){var b;a.apply(this,Array.prototype.slice.call(arguments,1));(b=this.xAxis)&&b.options.ordinal&&A(this,"updatedData",function(){delete b.ordinalIndex})});O(F.prototype,"getTimeTicks",function(a,b,c,d,e,f,g,h){var i=0,k=0,j,l={},m,n,p,o=[],q=-Number.MAX_VALUE,s=this.options.tickPixelInterval;
if(!this.options.ordinal||!f||f.length<3||c===r)return a.call(this,b,c,d,e);for(n=f.length;k<n;k++){p=k&&f[k-1]>d;f[k]<c&&(i=k);if(k===n-1||f[k+1]-f[k]>g*5||p){if(f[k]>q){for(j=a.call(this,b,f[i],f[k],e);j.length&&j[0]<=q;)j.shift();j.length&&(q=j[j.length-1]);o=o.concat(j)}i=k+1}if(p)break}a=j.info;if(h&&a.unitRange<=H.hour){k=o.length-1;for(i=1;i<k;i++)(new Date(o[i]-La))[Ua]()!==(new Date(o[i-1]-La))[Ua]()&&(l[o[i]]="day",m=!0);m&&(l[o[0]]="day");a.higherRanks=l}o.info=a;if(h&&t(s)){var h=a=o.length,
k=[],x;for(m=[];h--;)i=this.translate(o[h]),x&&(m[h]=x-i),k[h]=x=i;m.sort();m=m[S(m.length/2)];m<s*0.6&&(m=null);h=o[a-1]>d?a-1:a;for(x=void 0;h--;)i=k[h],d=x-i,x&&d<s*0.8&&(m===null||d<m*0.8)?(l[o[h]]&&!l[o[h+1]]?(d=h+1,x=i):d=h,o.splice(d,1)):x=i}return o});v(F.prototype,{beforeSetTickPositions:function(){var a,b=[],c=!1,d,e=this.getExtremes(),f=e.min,e=e.max,g;if(this.options.ordinal){q(this.series,function(c,d){if(c.visible!==!1&&c.takeOrdinalPosition!==!1&&(b=b.concat(c.processedXData),a=b.length,
b.sort(function(a,b){return a-b}),a))for(d=a-1;d--;)b[d]===b[d+1]&&b.splice(d,1)});a=b.length;if(a>2){d=b[1]-b[0];for(g=a-1;g--&&!c;)b[g+1]-b[g]!==d&&(c=!0);if(!this.options.keepOrdinalPadding&&(b[0]-f>d||e-b[b.length-1]>d))c=!0}c?(this.ordinalPositions=b,c=this.val2lin(w(f,b[0]),!0),d=this.val2lin(z(e,b[b.length-1]),!0),this.ordinalSlope=e=(e-f)/(d-c),this.ordinalOffset=f-c*e):this.ordinalPositions=this.ordinalSlope=this.ordinalOffset=r}this.groupIntervalFactor=null},val2lin:function(a,b){var c=
this.ordinalPositions;if(c){var d=c.length,e,f;for(e=d;e--;)if(c[e]===a){f=e;break}for(e=d-1;e--;)if(a>c[e]||e===0){c=(a-c[e])/(c[e+1]-c[e]);f=e+c;break}return b?f:this.ordinalSlope*(f||0)+this.ordinalOffset}else return a},lin2val:function(a,b){var c=this.ordinalPositions;if(c){var d=this.ordinalSlope,e=this.ordinalOffset,f=c.length-1,g,h;if(b)a<0?a=c[0]:a>f?a=c[f]:(f=S(a),h=a-f);else for(;f--;)if(g=d*f+e,a>=g){d=d*(f+1)+e;h=(a-g)/(d-g);break}return h!==r&&c[f]!==r?c[f]+(h?h*(c[f+1]-c[f]):0):a}else return a},
getExtendedPositions:function(){var a=this.chart,b=this.series[0].currentDataGrouping,c=this.ordinalIndex,d=b?b.count+b.unitName:"raw",e=this.getExtremes(),f,g;if(!c)c=this.ordinalIndex={};if(!c[d])f={series:[],getExtremes:function(){return{min:e.dataMin,max:e.dataMax}},options:{ordinal:!0},val2lin:F.prototype.val2lin},q(this.series,function(c){g={xAxis:f,xData:c.xData,chart:a,destroyGroupedData:ma};g.options={dataGrouping:b?{enabled:!0,forced:!0,approximation:"open",units:[[b.unitName,[b.count]]]}:
{enabled:!1}};c.processData.apply(g);f.series.push(g)}),this.beforeSetTickPositions.apply(f),c[d]=f.ordinalPositions;return c[d]},getGroupIntervalFactor:function(a,b,c){var d=0,c=c.processedXData,e=c.length,f=[],g=this.groupIntervalFactor;if(!g){for(;d<e-1;d++)f[d]=c[d+1]-c[d];f.sort(function(a,b){return a-b});d=f[S(e/2)];a=w(a,c[0]);b=z(b,c[e-1]);this.groupIntervalFactor=g=e*d/(b-a)}return g},postProcessTickInterval:function(a){var b=this.ordinalSlope;return b?a/(b/this.closestPointRange):a}});O(va.prototype,
"pan",function(a,b){var c=this.xAxis[0],d=b.chartX,e=!1;if(c.options.ordinal&&c.series.length){var f=this.mouseDownX,g=c.getExtremes(),h=g.dataMax,i=g.min,k=g.max,j=this.hoverPoints,l=c.closestPointRange,f=(f-d)/(c.translationSlope*(c.ordinalSlope||l)),m={ordinalPositions:c.getExtendedPositions()},l=c.lin2val,n=c.val2lin,p;if(m.ordinalPositions){if(N(f)>1)j&&q(j,function(a){a.setState()}),f<0?(j=m,p=c.ordinalPositions?c:m):(j=c.ordinalPositions?c:m,p=m),m=p.ordinalPositions,h>m[m.length-1]&&m.push(h),
this.fixedRange=k-i,f=c.toFixedRange(null,null,l.apply(j,[n.apply(j,[i,!0])+f,!0]),l.apply(p,[n.apply(p,[k,!0])+f,!0])),f.min>=z(g.dataMin,i)&&f.max<=w(h,k)&&c.setExtremes(f.min,f.max,!0,!1,{trigger:"pan"}),this.mouseDownX=d,E(this.container,{cursor:"move"})}else e=!0}else e=!0;e&&a.apply(this,Array.prototype.slice.call(arguments,1))});O(L.prototype,"getSegments",function(a){var b,c=this.options.gapSize,d=this.xAxis;a.apply(this,Array.prototype.slice.call(arguments,1));if(c)b=this.segments,q(b,function(a,
f){for(var g=a.length-1;g--;)a[g+1].x-a[g].x>d.closestPointRange*c&&b.splice(f+1,0,a.splice(g+1,a.length-g))})});var aa=L.prototype,M=Hb.prototype,hc=aa.processData,ic=aa.generatePoints,jc=aa.destroy,kc=M.tooltipHeaderFormatter,lc={approximation:"average",groupPixelWidth:2,dateTimeLabelFormats:Kb("millisecond",["%A, %b %e, %H:%M:%S.%L","%A, %b %e, %H:%M:%S.%L","-%H:%M:%S.%L"],"second",["%A, %b %e, %H:%M:%S","%A, %b %e, %H:%M:%S","-%H:%M:%S"],"minute",["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],
"hour",["%A, %b %e, %H:%M","%A, %b %e, %H:%M","-%H:%M"],"day",["%A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],"week",["Week from %A, %b %e, %Y","%A, %b %e","-%A, %b %e, %Y"],"month",["%B %Y","%B","-%B %Y"],"year",["%Y","%Y","-%Y"])},Wb={line:{},spline:{},area:{},areaspline:{},column:{approximation:"sum",groupPixelWidth:10},arearange:{approximation:"range"},areasplinerange:{approximation:"range"},columnrange:{approximation:"range",groupPixelWidth:10},candlestick:{approximation:"ohlc",groupPixelWidth:10},
ohlc:{approximation:"ohlc",groupPixelWidth:5}},Xb=[["millisecond",[1,2,5,10,20,25,50,100,200,500]],["second",[1,2,5,10,15,30]],["minute",[1,2,5,10,15,30]],["hour",[1,2,3,4,6,8,12]],["day",[1]],["week",[1]],["month",[1,3,6]],["year",null]],Na={sum:function(a){var b=a.length,c;if(!b&&a.hasNulls)c=null;else if(b)for(c=0;b--;)c+=a[b];return c},average:function(a){var b=a.length,a=Na.sum(a);typeof a==="number"&&b&&(a/=b);return a},open:function(a){return a.length?a[0]:a.hasNulls?null:r},high:function(a){return a.length?
Ba(a):a.hasNulls?null:r},low:function(a){return a.length?Ra(a):a.hasNulls?null:r},close:function(a){return a.length?a[a.length-1]:a.hasNulls?null:r},ohlc:function(a,b,c,d){a=Na.open(a);b=Na.high(b);c=Na.low(c);d=Na.close(d);if(typeof a==="number"||typeof b==="number"||typeof c==="number"||typeof d==="number")return[a,b,c,d]},range:function(a,b){a=Na.low(a);b=Na.high(b);if(typeof a==="number"||typeof b==="number")return[a,b]}};aa.groupData=function(a,b,c,d){var e=this.data,f=this.options.data,g=[],
h=[],i=a.length,k,j,l=!!b,m=[[],[],[],[]],d=typeof d==="function"?d:Na[d],n=this.pointArrayMap,p=n&&n.length,o;for(o=0;o<=i;o++)if(a[o]>=c[0])break;for(;o<=i;o++){for(;c[1]!==r&&a[o]>=c[1]||o===i;)if(k=c.shift(),j=d.apply(0,m),j!==r&&(g.push(k),h.push(j)),m[0]=[],m[1]=[],m[2]=[],m[3]=[],o===i)break;if(o===i)break;if(n){k=this.cropStart+o;k=e&&e[k]||this.pointClass.prototype.applyOptions.apply({series:this},[f[k]]);var q;for(j=0;j<p;j++)if(q=k[n[j]],typeof q==="number")m[j].push(q);else if(q===null)m[j].hasNulls=
!0}else if(k=l?b[o]:null,typeof k==="number")m[0].push(k);else if(k===null)m[0].hasNulls=!0}return[g,h]};aa.processData=function(){var a=this.chart,b=this.options,c=b.dataGrouping,d=c&&o(c.enabled,a.options._stock),e;this.forceCrop=d;this.groupPixelWidth=null;this.hasProcessed=!0;if(hc.apply(this,arguments)!==!1&&d){this.destroyGroupedData();var f=this.processedXData,g=this.processedYData,h=a.plotSizeX,a=this.xAxis,i=a.options.ordinal,k=this.groupPixelWidth=a.getGroupPixelWidth&&a.getGroupPixelWidth(),
d=this.pointRange;if(k){e=!0;this.points=null;var j=a.getExtremes(),d=j.min,j=j.max,i=i&&a.getGroupIntervalFactor(d,j,this)||1,h=k*(j-d)/h*i,k=a.getTimeTicks(a.normalizeTimeTickInterval(h,c.units||Xb),d,j,null,f,this.closestPointRange),g=aa.groupData.apply(this,[f,g,k,c.approximation]),f=g[0],g=g[1];if(c.smoothed){c=f.length-1;for(f[c]=j;c--&&c>0;)f[c]+=h/2;f[0]=d}this.currentDataGrouping=k.info;if(b.pointRange===null)this.pointRange=k.info.totalRange;this.closestPointRange=k.info.totalRange;if(t(f[0])&&
f[0]<a.dataMin)a.dataMin=f[0];this.processedXData=f;this.processedYData=g}else this.currentDataGrouping=null,this.pointRange=d;this.hasGroupedData=e}};aa.destroyGroupedData=function(){var a=this.groupedData;q(a||[],function(b,c){b&&(a[c]=b.destroy?b.destroy():null)});this.groupedData=null};aa.generatePoints=function(){ic.apply(this);this.destroyGroupedData();this.groupedData=this.hasGroupedData?this.points:null};M.tooltipHeaderFormatter=function(a){var b=a.series,c=b.tooltipOptions,d=b.options.dataGrouping,
e=c.xDateFormat,f,g=b.xAxis,h;if(g&&g.options.type==="datetime"&&d&&ka(a.key)){b=b.currentDataGrouping;d=d.dateTimeLabelFormats;if(b)g=d[b.unitName],b.count===1?e=g[0]:(e=g[1],f=g[2]);else if(!e&&d)for(h in H)if(H[h]>=g.closestPointRange||H[h]<=H.day&&a.key%H[h]>0){e=d[h][0];break}e=ua(e,a.key);f&&(e+=ua(f,a.key+b.totalRange-1));a=c.headerFormat.replace("{point.key}",e)}else a=kc.call(this,a);return a};aa.destroy=function(){for(var a=this.groupedData||[],b=a.length;b--;)a[b]&&a[b].destroy();jc.apply(this)};
O(aa,"setOptions",function(a,b){var c=a.call(this,b),d=this.type,e=this.chart.options.plotOptions,f=T[d].dataGrouping;if(Wb[d])f||(f=y(lc,Wb[d])),c.dataGrouping=y(f,e.series&&e.series.dataGrouping,e[d].dataGrouping,b.dataGrouping);if(this.chart.options._stock)this.requireSorting=!0;return c});O(F.prototype,"setScale",function(a){a.call(this);q(this.series,function(a){a.hasProcessed=!1})});F.prototype.getGroupPixelWidth=function(){var a=this.series,b=a.length,c,d=0,e=!1,f;for(c=b;c--;)(f=a[c].options.dataGrouping)&&
(d=w(d,f.groupPixelWidth));for(c=b;c--;)if((f=a[c].options.dataGrouping)&&a[c].hasProcessed)if(b=(a[c].processedXData||a[c].data).length,a[c].groupPixelWidth||b>this.chart.plotSizeX/d||b&&f.forced)e=!0;return e?d:0};T.ohlc=y(T.column,{lineWidth:1,tooltip:{pointFormat:'<span style="color:{series.color}">●</span> <b> {series.name}</b><br/>Open: {point.open}<br/>High: {point.high}<br/>Low: {point.low}<br/>Close: {point.close}<br/>'},states:{hover:{lineWidth:3}},threshold:null});M=fa(C.column,{type:"ohlc",
pointArrayMap:["open","high","low","close"],toYData:function(a){return[a.open,a.high,a.low,a.close]},pointValKey:"high",pointAttrToOptions:{stroke:"color","stroke-width":"lineWidth"},upColorProp:"stroke",getAttribs:function(){C.column.prototype.getAttribs.apply(this,arguments);var a=this.options,b=a.states,a=a.upColor||this.color,c=y(this.pointAttr),d=this.upColorProp;c[""][d]=a;c.hover[d]=b.hover.upColor||a;c.select[d]=b.select.upColor||a;q(this.points,function(a){if(a.open<a.close)a.pointAttr=c})},
translate:function(){var a=this.yAxis;C.column.prototype.translate.apply(this);q(this.points,function(b){if(b.open!==null)b.plotOpen=a.translate(b.open,0,1,0,1);if(b.close!==null)b.plotClose=a.translate(b.close,0,1,0,1)})},drawPoints:function(){var a=this,b=a.chart,c,d,e,f,g,h,i,k;q(a.points,function(j){if(j.plotY!==r)i=j.graphic,c=j.pointAttr[j.selected?"selected":""],f=c["stroke-width"]%2/2,k=s(j.plotX)-f,g=s(j.shapeArgs.width/2),h=["M",k,s(j.yBottom),"L",k,s(j.plotY)],j.open!==null&&(d=s(j.plotOpen)+
f,h.push("M",k,d,"L",k-g,d)),j.close!==null&&(e=s(j.plotClose)+f,h.push("M",k,e,"L",k+g,e)),i?i.animate({d:h}):j.graphic=b.renderer.path(h).attr(c).add(a.group)})},animate:null});C.ohlc=M;T.candlestick=y(T.column,{lineColor:"black",lineWidth:1,states:{hover:{lineWidth:2}},tooltip:T.ohlc.tooltip,threshold:null,upColor:"white"});M=fa(M,{type:"candlestick",pointAttrToOptions:{fill:"color",stroke:"lineColor","stroke-width":"lineWidth"},upColorProp:"fill",getAttribs:function(){C.ohlc.prototype.getAttribs.apply(this,
arguments);var a=this.options,b=a.states,c=a.upLineColor||a.lineColor,d=b.hover.upLineColor||c,e=b.select.upLineColor||c;q(this.points,function(a){if(a.open<a.close)a.pointAttr[""].stroke=c,a.pointAttr.hover.stroke=d,a.pointAttr.select.stroke=e})},drawPoints:function(){var a=this,b=a.chart,c,d=a.pointAttr[""],e,f,g,h,i,k,j,l,m,n,p;q(a.points,function(o){m=o.graphic;if(o.plotY!==r)c=o.pointAttr[o.selected?"selected":""]||d,j=c["stroke-width"]%2/2,l=s(o.plotX)-j,e=o.plotOpen,f=o.plotClose,g=U.min(e,
f),h=U.max(e,f),p=s(o.shapeArgs.width/2),i=s(g)!==s(o.plotY),k=h!==o.yBottom,g=s(g)+j,h=s(h)+j,n=["M",l-p,h,"L",l-p,g,"L",l+p,g,"L",l+p,h,"Z","M",l,g,"L",l,i?s(o.plotY):g,"M",l,h,"L",l,k?s(o.yBottom):h,"Z"],m?m.animate({d:n}):o.graphic=b.renderer.path(n).attr(c).add(a.group).shadow(a.options.shadow)})}});C.candlestick=M;var qb=ja.prototype.symbols;T.flags=y(T.column,{dataGrouping:null,fillColor:"white",lineWidth:1,pointRange:0,shape:"flag",stackDistance:12,states:{hover:{lineColor:"black",fillColor:"#FCFFC5"}},
style:{fontSize:"11px",fontWeight:"bold",textAlign:"center"},tooltip:{pointFormat:"{point.text}<br/>"},threshold:null,y:-30});C.flags=fa(C.column,{type:"flags",sorted:!1,noSharedTooltip:!0,takeOrdinalPosition:!1,trackerGroups:["markerGroup"],forceCrop:!0,init:L.prototype.init,pointAttrToOptions:{fill:"fillColor",stroke:"color","stroke-width":"lineWidth",r:"radius"},translate:function(){C.column.prototype.translate.apply(this);var a=this.chart,b=this.points,c=b.length-1,d,e,f=this.options.onSeries,
f=(d=f&&a.get(f))&&d.options.step,g=d&&d.points,h=g&&g.length,i=this.xAxis,k=i.getExtremes(),j,l,m;if(d&&d.visible&&h){d=d.currentDataGrouping;l=g[h-1].x+(d?d.totalRange:0);for(b.sort(function(a,b){return a.x-b.x});h--&&b[c];)if(d=b[c],j=g[h],j.x<=d.x&&j.plotY!==r){if(d.x<=l)d.plotY=j.plotY,j.x<d.x&&!f&&(m=g[h+1])&&m.plotY!==r&&(d.plotY+=(d.x-j.x)/(m.x-j.x)*(m.plotY-j.plotY));c--;h++;if(c<0)break}}q(b,function(c,d){if(c.plotY===r)c.x>=k.min&&c.x<=k.max?c.plotY=a.chartHeight-i.bottom-(i.opposite?i.height:
0)+i.offset-a.plotTop:c.shapeArgs={};if((e=b[d-1])&&e.plotX===c.plotX){if(e.stackIndex===r)e.stackIndex=0;c.stackIndex=e.stackIndex+1}})},drawPoints:function(){var a,b=this.pointAttr[""],c=this.points,d=this.chart.renderer,e,f,g=this.options,h=g.y,i,k,j,l,m=g.lineWidth%2/2,n,o;for(k=c.length;k--;)if(j=c[k],a=j.plotX>this.xAxis.len,e=j.plotX+(a?m:-m),l=j.stackIndex,i=j.options.shape||g.shape,f=j.plotY,f!==r&&(f=j.plotY+h+m-(l!==r&&l*g.stackDistance)),n=l?r:j.plotX+m,o=l?r:j.plotY,l=j.graphic,f!==r&&
e>=0&&!a)a=j.pointAttr[j.selected?"select":""]||b,l?l.attr({x:e,y:f,r:a.r,anchorX:n,anchorY:o}):j.graphic=d.label(j.options.title||g.title||"A",e,f,i,n,o,g.useHTML).css(y(g.style,j.style)).attr(a).attr({align:i==="flag"?"left":"center",width:g.width,height:g.height}).add(this.markerGroup).shadow(g.shadow),j.tooltipPos=[e,f];else if(l)j.graphic=l.destroy()},drawTracker:function(){var a=this.points;cb.drawTrackerPoint.apply(this);q(a,function(b){var c=b.graphic;c&&A(c.element,"mouseover",function(){if(b.stackIndex>
0&&!b.raised)b._y=c.y,c.attr({y:b._y-8}),b.raised=!0;q(a,function(a){if(a!==b&&a.raised&&a.graphic)a.graphic.attr({y:a._y}),a.raised=!1})})})},animate:ma});qb.flag=function(a,b,c,d,e){var f=e&&e.anchorX||a,e=e&&e.anchorY||b;return["M",f,e,"L",a,b+d,a,b,a+c,b,a+c,b+d,a,b+d,"M",f,e,"Z"]};q(["circle","square"],function(a){qb[a+"pin"]=function(b,c,d,e,f){var g=f&&f.anchorX,f=f&&f.anchorY,b=qb[a](b,c,d,e);g&&f&&b.push("M",g,c>f?c:c+e,"L",g,f);return b}});Wa===P.VMLRenderer&&q(["flag","circlepin","squarepin"],
function(a){gb.prototype.symbols[a]=qb[a]});M=[].concat(Xb);M[4]=["day",[1,2,3,4]];M[5]=["week",[1,2,3]];v(I,{navigator:{handles:{backgroundColor:"#ebe7e8",borderColor:"#b2b1b6"},height:40,margin:25,maskFill:"rgba(128,179,236,0.3)",maskInside:!0,outlineColor:"#b2b1b6",outlineWidth:1,series:{type:C.areaspline===r?"line":"areaspline",color:"#4572A7",compare:null,fillOpacity:0.05,dataGrouping:{approximation:"average",enabled:!0,groupPixelWidth:2,smoothed:!0,units:M},dataLabels:{enabled:!1,zIndex:2},
id:"highcharts-navigator-series",lineColor:"#4572A7",lineWidth:1,marker:{enabled:!1},pointRange:0,shadow:!1,threshold:null},xAxis:{tickWidth:0,lineWidth:0,gridLineColor:"#EEE",gridLineWidth:1,tickPixelInterval:200,labels:{align:"left",style:{color:"#888"},x:3,y:-4},crosshair:!1},yAxis:{gridLineWidth:0,startOnTick:!1,endOnTick:!1,minPadding:0.1,maxPadding:0.1,labels:{enabled:!1},crosshair:!1,title:{text:null},tickWidth:0}},scrollbar:{height:db?20:14,barBackgroundColor:"#bfc8d1",barBorderRadius:0,barBorderWidth:1,
barBorderColor:"#bfc8d1",buttonArrowColor:"#666",buttonBackgroundColor:"#ebe7e8",buttonBorderColor:"#bbb",buttonBorderRadius:0,buttonBorderWidth:1,minWidth:6,rifleColor:"#666",trackBackgroundColor:"#eeeeee",trackBorderColor:"#eeeeee",trackBorderWidth:1,liveRedraw:ba&&!db}});yb.prototype={drawHandle:function(a,b){var c=this.chart,d=c.renderer,e=this.elementsToDestroy,f=this.handles,g=this.navigatorOptions.handles,g={fill:g.backgroundColor,stroke:g.borderColor,"stroke-width":1},h;this.rendered||(f[b]=
d.g("navigator-handle-"+["left","right"][b]).css({cursor:"e-resize"}).attr({zIndex:4-b}).add(),h=d.rect(-4.5,0,9,16,0,1).attr(g).add(f[b]),e.push(h),h=d.path(["M",-1.5,4,"L",-1.5,12,"M",0.5,4,"L",0.5,12]).attr(g).add(f[b]),e.push(h));f[b][c.isResizing?"animate":"attr"]({translateX:this.scrollerLeft+this.scrollbarHeight+parseInt(a,10),translateY:this.top+this.height/2-8})},drawScrollbarButton:function(a){var b=this.chart.renderer,c=this.elementsToDestroy,d=this.scrollbarButtons,e=this.scrollbarHeight,
f=this.scrollbarOptions,g;this.rendered||(d[a]=b.g().add(this.scrollbarGroup),g=b.rect(-0.5,-0.5,e+1,e+1,f.buttonBorderRadius,f.buttonBorderWidth).attr({stroke:f.buttonBorderColor,"stroke-width":f.buttonBorderWidth,fill:f.buttonBackgroundColor}).add(d[a]),c.push(g),g=b.path(["M",e/2+(a?-1:1),e/2-3,"L",e/2+(a?-1:1),e/2+3,e/2+(a?2:-2),e/2]).attr({fill:f.buttonArrowColor}).add(d[a]),c.push(g));a&&d[a].attr({translateX:this.scrollerWidth-e})},render:function(a,b,c,d){var e=this.chart,f=e.renderer,g,h,
i,k,j=this.scrollbarGroup,l=this.navigatorGroup,m=this.scrollbar,l=this.xAxis,n=this.scrollbarTrack,p=this.scrollbarHeight,q=this.scrollbarEnabled,r=this.navigatorOptions,t=this.scrollbarOptions,x=t.minWidth,v=this.height,y=this.top,A=this.navigatorEnabled,B=r.outlineWidth,C=B/2,F=0,D=this.outlineHeight,J=t.barBorderRadius,H=t.barBorderWidth,E=y+C,I;if(!isNaN(a)){this.navigatorLeft=g=o(l.left,e.plotLeft+p);this.navigatorWidth=h=o(l.len,e.plotWidth-2*p);this.scrollerLeft=i=g-p;this.scrollerWidth=k=
k=h+2*p;l.getExtremes&&(I=this.getUnionExtremes(!0))&&(I.dataMin!==l.min||I.dataMax!==l.max)&&l.setExtremes(I.dataMin,I.dataMax,!0,!1);c=o(c,l.translate(a));d=o(d,l.translate(b));if(isNaN(c)||N(c)===Infinity)c=0,d=k;if(!(l.translate(d,!0)-l.translate(c,!0)<e.xAxis[0].minRange)){this.zoomedMax=z(w(c,d),h);this.zoomedMin=w(this.fixedWidth?this.zoomedMax-this.fixedWidth:z(c,d),0);this.range=this.zoomedMax-this.zoomedMin;c=s(this.zoomedMax);b=s(this.zoomedMin);a=c-b;if(!this.rendered){if(A){this.navigatorGroup=
l=f.g("navigator").attr({zIndex:3}).add();this.leftShade=f.rect().attr({fill:r.maskFill}).add(l);if(!r.maskInside)this.rightShade=f.rect().attr({fill:r.maskFill}).add(l);this.outline=f.path().attr({"stroke-width":B,stroke:r.outlineColor}).add(l)}if(q)this.scrollbarGroup=j=f.g("scrollbar").add(),m=t.trackBorderWidth,this.scrollbarTrack=n=f.rect().attr({x:0,y:-m%2/2,fill:t.trackBackgroundColor,stroke:t.trackBorderColor,"stroke-width":m,r:t.trackBorderRadius||0,height:p}).add(j),this.scrollbar=m=f.rect().attr({y:-H%
2/2,height:p,fill:t.barBackgroundColor,stroke:t.barBorderColor,"stroke-width":H,r:J}).add(j),this.scrollbarRifles=f.path().attr({stroke:t.rifleColor,"stroke-width":1}).add(j)}e=e.isResizing?"animate":"attr";if(A){this.leftShade[e](r.maskInside?{x:g+b,y:y,width:c-b,height:v}:{x:g,y:y,width:b,height:v});if(this.rightShade)this.rightShade[e]({x:g+c,y:y,width:h-c,height:v});this.outline[e]({d:["M",i,E,"L",g+b+C,E,g+b+C,E+D,"L",g+c-C,E+D,"L",g+c-C,E,i+k,E].concat(r.maskInside?["M",g+b+C,E,"L",g+c-C,E]:
[])});this.drawHandle(b+C,0);this.drawHandle(c+C,1)}if(q&&j)this.drawScrollbarButton(0),this.drawScrollbarButton(1),j[e]({translateX:i,translateY:s(E+v)}),n[e]({width:k}),g=p+b,h=a-H,h<x&&(F=(x-h)/2,h=x,g-=F),this.scrollbarPad=F,m[e]({x:S(g)+H%2/2,width:h}),x=p+b+a/2-0.5,this.scrollbarRifles.attr({visibility:a>12?"visible":"hidden"})[e]({d:["M",x-3,p/4,"L",x-3,2*p/3,"M",x,p/4,"L",x,2*p/3,"M",x+3,p/4,"L",x+3,2*p/3]});this.scrollbarPad=F;this.rendered=!0}}},addEvents:function(){var a=this.chart.container,
b=this.mouseDownHandler,c=this.mouseMoveHandler,d=this.mouseUpHandler,e;e=[[a,"mousedown",b],[a,"mousemove",c],[document,"mouseup",d]];ab&&e.push([a,"touchstart",b],[a,"touchmove",c],[document,"touchend",d]);q(e,function(a){A.apply(null,a)});this._events=e},removeEvents:function(){q(this._events,function(a){R.apply(null,a)});this._events=r;this.navigatorEnabled&&this.baseSeries&&R(this.baseSeries,"updatedData",this.updatedDataHandler)},init:function(){var a=this,b=a.chart,c,d,e=a.scrollbarHeight,
f=a.navigatorOptions,g=a.height,h=a.top,i,k,j=document.body.style,l,m=a.baseSeries;a.mouseDownHandler=function(d){var d=b.pointer.normalize(d),e=a.zoomedMin,f=a.zoomedMax,h=a.top,k=a.scrollbarHeight,m=a.scrollerLeft,n=a.scrollerWidth,o=a.navigatorLeft,p=a.navigatorWidth,q=a.scrollbarPad,r=a.range,s=d.chartX,t=d.chartY,d=b.xAxis[0],v,w=db?10:7;if(t>h&&t<h+g+k)if((h=!a.scrollbarEnabled||t<h+g)&&U.abs(s-e-o)<w)a.grabbedLeft=!0,a.otherHandlePos=f,a.fixedExtreme=d.max,b.fixedRange=null;else if(h&&U.abs(s-
f-o)<w)a.grabbedRight=!0,a.otherHandlePos=e,a.fixedExtreme=d.min,b.fixedRange=null;else if(s>o+e-q&&s<o+f+q){a.grabbedCenter=s;a.fixedWidth=r;if(b.renderer.isSVG)l=j.cursor,j.cursor="ew-resize";i=s-e}else if(s>m&&s<m+n){f=h?s-o-r/2:s<o?e-r*0.2:s>m+n-k?e+r*0.2:s<o+e?e-r:f;if(f<0)f=0;else if(f+r>=p)f=p-r,v=c.dataMax;if(f!==e)a.fixedWidth=r,e=c.toFixedRange(f,f+r,null,v),d.setExtremes(e.min,e.max,!0,!1,{trigger:"navigator"})}};a.mouseMoveHandler=function(c){var d=a.scrollbarHeight,e=a.navigatorLeft,
f=a.navigatorWidth,g=a.scrollerLeft,h=a.scrollerWidth,j=a.range,l;if(c.pageX!==0)c=b.pointer.normalize(c),l=c.chartX,l<e?l=e:l>g+h-d&&(l=g+h-d),a.grabbedLeft?(k=!0,a.render(0,0,l-e,a.otherHandlePos)):a.grabbedRight?(k=!0,a.render(0,0,a.otherHandlePos,l-e)):a.grabbedCenter&&(k=!0,l<i?l=i:l>f+i-j&&(l=f+i-j),a.render(0,0,l-i,l-i+j)),k&&a.scrollbarOptions.liveRedraw&&setTimeout(function(){a.mouseUpHandler(c)},0)};a.mouseUpHandler=function(d){var e,f;if(k){if(a.zoomedMin===a.otherHandlePos)e=a.fixedExtreme;
else if(a.zoomedMax===a.otherHandlePos)f=a.fixedExtreme;e=c.toFixedRange(a.zoomedMin,a.zoomedMax,e,f);b.xAxis[0].setExtremes(e.min,e.max,!0,!1,{trigger:"navigator",triggerOp:"navigator-drag",DOMEvent:d})}if(d.type!=="mousemove")a.grabbedLeft=a.grabbedRight=a.grabbedCenter=a.fixedWidth=a.fixedExtreme=a.otherHandlePos=k=i=null,j.cursor=l||""};var n=b.xAxis.length,p=b.yAxis.length;b.extraBottomMargin=a.outlineHeight+f.margin;a.navigatorEnabled?(a.xAxis=c=new F(b,y({ordinal:m&&m.xAxis.options.ordinal},
f.xAxis,{id:"navigator-x-axis",isX:!0,type:"datetime",index:n,height:g,offset:0,offsetLeft:e,offsetRight:-e,keepOrdinalPadding:!0,startOnTick:!1,endOnTick:!1,minPadding:0,maxPadding:0,zoomEnabled:!1})),a.yAxis=d=new F(b,y(f.yAxis,{id:"navigator-y-axis",alignTicks:!1,height:g,offset:0,index:p,zoomEnabled:!1})),m||f.series.data?a.addBaseSeries():b.series.length===0&&O(b,"redraw",function(c,d){if(b.series.length>0&&!a.series)a.setBaseSeries(),b.redraw=c;c.call(b,d)})):a.xAxis=c={translate:function(a,
c){var d=b.xAxis[0].getExtremes(),f=b.plotWidth-2*e,g=d.dataMin,d=d.dataMax-g;return c?a*d/f+g:f*(a-g)/d},toFixedRange:F.prototype.toFixedRange};O(b,"getMargins",function(b){var e=this.legend,f=e.options;b.call(this);a.top=h=a.navigatorOptions.top||this.chartHeight-a.height-a.scrollbarHeight-this.spacing[2]-(f.verticalAlign==="bottom"&&f.enabled&&!f.floating?e.legendHeight+o(f.margin,10):0);if(c&&d)c.options.top=d.options.top=h,c.setAxisSize(),d.setAxisSize()});a.addEvents()},getUnionExtremes:function(a){var b=
this.chart.xAxis[0],c=this.xAxis,d=c.options;if(!a||b.dataMin!==null)return{dataMin:o(d&&d.min,(t(b.dataMin)&&t(c.dataMin)?z:o)(b.dataMin,c.dataMin)),dataMax:o(d&&d.max,(t(b.dataMax)&&t(c.dataMax)?w:o)(b.dataMax,c.dataMax))}},setBaseSeries:function(a){var b=this.chart,a=a||b.options.navigator.baseSeries;this.series&&this.series.remove();this.baseSeries=b.series[a]||typeof a==="string"&&b.get(a)||b.series[0];this.xAxis&&this.addBaseSeries()},addBaseSeries:function(){var a=this.baseSeries,b=a?a.options:
{},c=b.data,d=this.navigatorOptions.series,e;e=d.data;this.hasNavigatorData=!!e;b=y(b,d,{enableMouseTracking:!1,group:"nav",padXAxis:!1,xAxis:"navigator-x-axis",yAxis:"navigator-y-axis",name:"Navigator",showInLegend:!1,isInternal:!0,visible:!0});b.data=e||c;this.series=this.chart.initSeries(b);if(a&&this.navigatorOptions.adaptToUpdatedData!==!1)A(a,"updatedData",this.updatedDataHandler),a.userOptions.events=v(a.userOptions.event,{updatedData:this.updatedDataHandler})},updatedDataHandler:function(){var a=
this.chart.scroller,b=a.baseSeries,c=b.xAxis,d=c.getExtremes(),e=d.min,f=d.max,g=d.dataMin,d=d.dataMax,h=f-e,i,k,j,l,m,n=a.series;i=n.xData;var o=!!c.setExtremes;k=f>=i[i.length-1]-(this.closestPointRange||0);i=e<=g;if(!a.hasNavigatorData)n.options.pointStart=b.xData[0],n.setData(b.options.data,!1),m=!0;i&&(l=g,j=l+h);k&&(j=d,i||(l=w(j-h,n.xData[0])));o&&(i||k)?isNaN(l)||c.setExtremes(l,j,!0,!1,{trigger:"updatedData"}):(m&&this.chart.redraw(!1),a.render(w(e,g),z(f,d)))},destroy:function(){this.removeEvents();
q([this.xAxis,this.yAxis,this.leftShade,this.rightShade,this.outline,this.scrollbarTrack,this.scrollbarRifles,this.scrollbarGroup,this.scrollbar],function(a){a&&a.destroy&&a.destroy()});this.xAxis=this.yAxis=this.leftShade=this.rightShade=this.outline=this.scrollbarTrack=this.scrollbarRifles=this.scrollbarGroup=this.scrollbar=null;q([this.scrollbarButtons,this.handles,this.elementsToDestroy],function(a){Ka(a)})}};P.Scroller=yb;O(F.prototype,"zoom",function(a,b,c){var d=this.chart,e=d.options,f=e.chart.zoomType,
g=e.navigator,e=e.rangeSelector,h;if(this.isXAxis&&(g&&g.enabled||e&&e.enabled))if(f==="x")d.resetZoomButton="blocked";else if(f==="y")h=!1;else if(f==="xy")d=this.previousZoom,t(b)?this.previousZoom=[this.min,this.max]:d&&(b=d[0],c=d[1],delete this.previousZoom);return h!==r?h:a.call(this,b,c)});O(va.prototype,"init",function(a,b,c){A(this,"beforeRender",function(){var a=this.options;if(a.navigator.enabled||a.scrollbar.enabled)this.scroller=new yb(this)});a.call(this,b,c)});O(L.prototype,"addPoint",
function(a,b,c,d,e){var f=this.options.turboThreshold;f&&this.xData.length>f&&ea(b)&&!Pa(b)&&this.chart.scroller&&pa(20,!0);a.call(this,b,c,d,e)});v(I,{rangeSelector:{buttonTheme:{width:28,height:18,fill:"#f7f7f7",padding:2,r:0,"stroke-width":0,style:{color:"#444",fontWeight:"normal"},zIndex:7,states:{hover:{fill:"#e7e7e7"},select:{fill:"#e7f0f9",style:{color:"black",fontWeight:"bold"}}}},inputPosition:{align:"right"},labelStyle:{color:"#666"}}});I.lang=y(I.lang,{rangeSelectorZoom:"Zoom",rangeSelectorFrom:"From",
rangeSelectorTo:"To"});zb.prototype={clickButton:function(a,b){var c=this,d=c.selected,e=c.chart,f=c.buttons,g=c.buttonOptions[a],h=e.xAxis[0],i=e.scroller&&e.scroller.getUnionExtremes()||h||{},k=i.dataMin,j=i.dataMax,l,m=h&&s(z(h.max,o(j,h.max))),n=new Date(m),p=g.type,u=g.count,i=g._range,t;if(!(k===null||j===null||a===c.selected)){if(p==="month"||p==="year")l={month:"Month",year:"FullYear"}[p],n["set"+l](n["get"+l]()-u),l=n.getTime(),k=o(k,Number.MIN_VALUE),isNaN(l)||l<k?(l=k,m=z(l+i,j)):i=m-l;
else if(i)l=w(m-i,k),m=z(l+i,j);else if(p==="ytd")if(h){if(j===r)k=Number.MAX_VALUE,j=Number.MIN_VALUE,q(e.series,function(a){a=a.xData;k=z(a[0],k);j=w(a[a.length-1],j)}),b=!1;m=new Date(j);t=m.getFullYear();l=t=w(k||0,Date.UTC(t,0,1));m=m.getTime();m=z(j||m,m)}else{A(e,"beforeRender",function(){c.clickButton(a)});return}else p==="all"&&h&&(l=k,m=j);f[d]&&f[d].setState(0);f[a]&&f[a].setState(2);e.fixedRange=i;h?h.setExtremes(l,m,o(b,1),0,{trigger:"rangeSelectorButton",rangeSelectorButton:g}):(d=e.options.xAxis,
d[0]=y(d[0],{range:i,min:t}));c.setSelected(a)}},setSelected:function(a){this.selected=this.options.selected=a},defaultButtons:[{type:"month",count:1,text:"1m"},{type:"month",count:3,text:"3m"},{type:"month",count:6,text:"6m"},{type:"ytd",text:"YTD"},{type:"year",count:1,text:"1y"},{type:"all",text:"All"}],init:function(a){var b=this,c=a.options.rangeSelector,d=c.buttons||[].concat(b.defaultButtons),e=c.selected,f=b.blurInputs=function(){var a=b.minInput,c=b.maxInput;a&&a.blur();c&&c.blur()};b.chart=
a;b.options=c;b.buttons=[];a.extraTopMargin=35;b.buttonOptions=d;A(a.container,"mousedown",f);A(a,"resize",f);q(d,b.computeButtonRange);e!==r&&d[e]&&this.clickButton(e,!1);A(a,"load",function(){A(a.xAxis[0],"afterSetExtremes",function(){b.updateButtonStates(!0)})})},updateButtonStates:function(a){var b=this,c=this.chart,d=c.xAxis[0],e=c.scroller&&c.scroller.getUnionExtremes()||d,f=e.dataMin,g=e.dataMax,h=b.selected,i=b.buttons;a&&c.fixedRange!==s(d.max-d.min)&&(i[h]&&i[h].setState(0),b.setSelected(null));
q(b.buttonOptions,function(a,c){var e=a._range,m=e>g-f,n=e<d.minRange,o=a.type==="all"&&d.max-d.min>=g-f&&i[c].state!==2,q=a.type==="ytd"&&ua("%Y",f)===ua("%Y",g);e===s(d.max-d.min)&&c!==h?(b.setSelected(c),i[c].setState(2)):m||n||o||q?i[c].setState(3):i[c].state===3&&i[c].setState(0)})},computeButtonRange:function(a){var b=a.type,c=a.count||1,d={millisecond:1,second:1E3,minute:6E4,hour:36E5,day:864E5,week:6048E5};if(d[b])a._range=d[b]*c;else if(b==="month"||b==="year")a._range={month:30,year:365}[b]*
864E5*c},setInputValue:function(a,b){var c=this.chart.options.rangeSelector;if(t(b))this[a+"Input"].HCTime=b;this[a+"Input"].value=ua(c.inputEditDateFormat||"%Y-%m-%d",this[a+"Input"].HCTime);this[a+"DateBox"].attr({text:ua(c.inputDateFormat||"%b %e, %Y",this[a+"Input"].HCTime)})},drawInput:function(a){var b=this,c=b.chart,d=c.renderer.style,e=c.renderer,f=c.options.rangeSelector,g=b.div,h=a==="min",i,k,j,l=this.inputGroup;this[a+"Label"]=k=e.label(I.lang[h?"rangeSelectorFrom":"rangeSelectorTo"],
this.inputGroup.offset).attr({padding:2}).css(y(d,f.labelStyle)).add(l);l.offset+=k.width+5;this[a+"DateBox"]=j=e.label("",l.offset).attr({padding:2,width:f.inputBoxWidth||90,height:f.inputBoxHeight||17,stroke:f.inputBoxBorderColor||"silver","stroke-width":1}).css(y({textAlign:"center",color:"#444"},d,f.inputStyle)).on("click",function(){b[a+"Input"].focus()}).add(l);l.offset+=j.width+(h?10:0);this[a+"Input"]=i=Y("input",{name:a,className:"highcharts-range-selector",type:"text"},v({position:"absolute",
border:0,width:"1px",height:"1px",padding:0,textAlign:"center",fontSize:d.fontSize,fontFamily:d.fontFamily,top:c.plotTop+"px"},f.inputStyle),g);i.onfocus=function(){E(this,{left:l.translateX+j.x+"px",top:l.translateY+"px",width:j.width-2+"px",height:j.height-2+"px",border:"2px solid silver"})};i.onblur=function(){E(this,{border:0,width:"1px",height:"1px"});b.setInputValue(a)};i.onchange=function(){var a=i.value,d=(f.inputDateParser||Date.parse)(a),e=c.xAxis[0],g=e.dataMin,j=e.dataMax;isNaN(d)&&(d=
a.split("-"),d=Date.UTC(J(d[0]),J(d[1])-1,J(d[2])));isNaN(d)||(I.global.useUTC||(d+=(new Date).getTimezoneOffset()*6E4),h?d>b.maxInput.HCTime?d=r:d<g&&(d=g):d<b.minInput.HCTime?d=r:d>j&&(d=j),d!==r&&c.xAxis[0].setExtremes(h?d:e.min,h?e.max:d,r,r,{trigger:"rangeSelectorInput"}))}},render:function(a,b){var c=this,d=c.chart,e=d.renderer,f=d.container,g=d.options,h=g.exporting&&g.navigation&&g.navigation.buttonOptions,i=g.rangeSelector,k=c.buttons,g=I.lang,j=c.div,j=c.inputGroup,l=i.buttonTheme,m=i.inputEnabled!==
!1,n=l&&l.states,p=d.plotLeft,r;if(!c.rendered&&(c.zoomText=e.text(g.rangeSelectorZoom,p,d.plotTop-20).css(i.labelStyle).add(),r=p+c.zoomText.getBBox().width+5,q(c.buttonOptions,function(a,b){k[b]=e.button(a.text,r,d.plotTop-35,function(){c.clickButton(b);c.isActive=!0},l,n&&n.hover,n&&n.select).css({textAlign:"center"}).add();r+=k[b].width+o(i.buttonSpacing,5);c.selected===b&&k[b].setState(2)}),c.updateButtonStates(),m))c.div=j=Y("div",null,{position:"relative",height:0,zIndex:1}),f.parentNode.insertBefore(j,
f),c.inputGroup=j=e.g("input-group").add(),j.offset=0,c.drawInput("min"),c.drawInput("max");m&&(f=d.plotTop-45,j.align(v({y:f,width:j.offset,x:h&&f<(h.y||0)+h.height-d.spacing[0]?-40:0},i.inputPosition),!0,d.spacingBox),c.setInputValue("min",a),c.setInputValue("max",b));c.rendered=!0},destroy:function(){var a=this.minInput,b=this.maxInput,c=this.chart,d=this.blurInputs,e;R(c.container,"mousedown",d);R(c,"resize",d);Ka(this.buttons);if(a)a.onfocus=a.onblur=a.onchange=null;if(b)b.onfocus=b.onblur=b.onchange=
null;for(e in this)this[e]&&e!=="chart"&&(this[e].destroy?this[e].destroy():this[e].nodeType&&Sa(this[e])),this[e]=null}};F.prototype.toFixedRange=function(a,b,c,d){var e=this.chart&&this.chart.fixedRange,a=o(c,this.translate(a,!0)),b=o(d,this.translate(b,!0)),c=e&&(b-a)/e;c>0.7&&c<1.3&&(d?a=b-e:b=a+e);return{min:a,max:b}};O(va.prototype,"init",function(a,b,c){A(this,"init",function(){if(this.options.rangeSelector.enabled)this.rangeSelector=new zb(this)});a.call(this,b,c)});P.RangeSelector=zb;va.prototype.callbacks.push(function(a){function b(){f=
a.xAxis[0].getExtremes();g.render(f.min,f.max)}function c(){f=a.xAxis[0].getExtremes();isNaN(f.min)||h.render(f.min,f.max)}function d(a){a.triggerOp!=="navigator-drag"&&g.render(a.min,a.max)}function e(a){h.render(a.min,a.max)}var f,g=a.scroller,h=a.rangeSelector;g&&(A(a.xAxis[0],"afterSetExtremes",d),O(a,"drawChartBox",function(a){var c=this.isDirtyBox;a.call(this);c&&b()}),b());h&&(A(a.xAxis[0],"afterSetExtremes",e),A(a,"resize",c),c());A(a,"destroy",function(){g&&R(a.xAxis[0],"afterSetExtremes",
d);h&&(R(a,"resize",c),R(a.xAxis[0],"afterSetExtremes",e))})});P.StockChart=function(a,b){var c=a.series,d,e=o(a.navigator&&a.navigator.enabled,!0)?{startOnTick:!1,endOnTick:!1}:null,f={marker:{enabled:!1,radius:2},states:{hover:{lineWidth:2}}},g={shadow:!1,borderWidth:0};a.xAxis=xa(la(a.xAxis||{}),function(a){return y({minPadding:0,maxPadding:0,ordinal:!0,title:{text:null},labels:{overflow:"justify"},showLastLabel:!0},a,{type:"datetime",categories:null},e)});a.yAxis=xa(la(a.yAxis||{}),function(a){d=
o(a.opposite,!0);return y({labels:{y:-2},opposite:d,showLastLabel:!1,title:{text:null}},a)});a.series=null;a=y({chart:{panning:!0,pinchType:"x"},navigator:{enabled:!0},scrollbar:{enabled:!0},rangeSelector:{enabled:!0},title:{text:null,style:{fontSize:"16px"}},tooltip:{shared:!0,crosshairs:!0},legend:{enabled:!1},plotOptions:{line:f,spline:f,area:f,areaspline:f,arearange:f,areasplinerange:f,column:g,columnrange:g,candlestick:g,ohlc:g}},a,{_stock:!0,chart:{inverted:!1}});a.series=c;return new va(a,
b)};O(Xa.prototype,"init",function(a,b,c){var d=c.chart.pinchType||"";a.call(this,b,c);this.pinchX=this.pinchHor=d.indexOf("x")!==-1;this.pinchY=this.pinchVert=d.indexOf("y")!==-1;this.hasZoom=this.hasZoom||this.pinchHor||this.pinchVert});O(F.prototype,"autoLabelAlign",function(a){if(this.chart.options._stock&&this.coll==="yAxis"&&wa(this,this.chart.yAxis)===0){if(this.options.labels.x===15)this.options.labels.x=0;return"right"}return a.call(this)});F.prototype.getPlotLinePath=function(a,b,c,d,e){var f=
this,g=this.isLinked&&!this.series?this.linkedParent.series:this.series,h=f.chart,i=h.renderer,k=f.left,j=f.top,l,m,n,p,r=[],v,w;v=f.isXAxis?t(f.options.yAxis)?[h.yAxis[f.options.yAxis]]:xa(g,function(a){return a.yAxis}):t(f.options.xAxis)?[h.xAxis[f.options.xAxis]]:xa(g,function(a){return a.xAxis});q(f.isXAxis?h.yAxis:h.xAxis,function(a){if(t(a.options.id)?a.options.id.indexOf("navigator")===-1:1){var b=a.isXAxis?"yAxis":"xAxis",b=t(a.options[b])?h[b][a.options[b]]:h[b][0];f===b&&v.push(a)}});w=
v.length?[]:[f];q(v,function(a){wa(a,w)===-1&&w.push(a)});e=o(e,f.translate(a,null,null,c));isNaN(e)||(f.horiz?q(w,function(a){m=a.top;p=m+a.len;l=n=s(e+f.transB);(l>=k&&l<=k+f.width||d)&&r.push("M",l,m,"L",n,p)}):q(w,function(a){l=a.left;n=l+a.width;m=p=s(j+f.height-e);(m>=j&&m<=j+f.height||d)&&r.push("M",l,m,"L",n,p)}));if(r.length>0)return i.crispPolyLine(r,b||1)};F.prototype.getPlotBandPath=function(a,b){var c=this.getPlotLinePath(b),d=this.getPlotLinePath(a),e=[],f;if(d&&c)for(f=0;f<d.length;f+=
6)e.push("M",d[f+1],d[f+2],"L",d[f+4],d[f+5],c[f+4],c[f+5],c[f+1],c[f+2]);else e=null;return e};ja.prototype.crispPolyLine=function(a,b){var c;for(c=0;c<a.length;c+=6)a[c+1]===a[c+4]&&(a[c+1]=a[c+4]=s(a[c+1])-b%2/2),a[c+2]===a[c+5]&&(a[c+2]=a[c+5]=s(a[c+2])+b%2/2);return a};if(Wa===P.VMLRenderer)gb.prototype.crispPolyLine=ja.prototype.crispPolyLine;O(F.prototype,"hideCrosshair",function(a,b){a.call(this,b);t(this.crossLabelArray)&&(t(b)?this.crossLabelArray[b]&&this.crossLabelArray[b].hide():q(this.crossLabelArray,
function(a){a.hide()}))});O(F.prototype,"drawCrosshair",function(a,b,c){var d,e;a.call(this,b,c);if(t(this.crosshair.label)&&this.crosshair.label.enabled&&t(c)){var a=this.chart,f=this.options.crosshair.label,g=this.isXAxis?"x":"y",b=this.horiz,h=this.opposite,i=this.left,k=this.top,j=this.crossLabel,l,m,n=f.format,p="";if(!j)j=this.crossLabel=a.renderer.label().attr({align:f.align||(b?"center":h?this.labelAlign==="right"?"right":"left":this.labelAlign==="left"?"left":"center"),zIndex:12,height:b?
16:r,fill:f.backgroundColor||this.series[0]&&this.series[0].color||"gray",padding:o(f.padding,2),stroke:f.borderColor||null,"stroke-width":f.borderWidth||0}).css(v({color:"white",fontWeight:"normal",fontSize:"11px",textAlign:"center"},f.style)).add();b?(l=c.plotX+i,m=k+(h?0:this.height)):(l=h?this.width+i:0,m=c.plotY+k);if(m<k||m>k+this.height)this.hideCrosshair();else{!n&&!f.formatter&&(this.isDatetimeAxis&&(p="%b %d, %Y"),n="{value"+(p?":"+p:"")+"}");j.attr({text:n?Ja(n,{value:c[g]}):f.formatter.call(this,
c[g]),x:l,y:m,visibility:"visible"});c=j.getBBox();if(b){if(this.options.tickPosition==="inside"&&!h||this.options.tickPosition!=="inside"&&h)m=j.y-c.height}else m=j.y-c.height/2;b?(d=i-c.x,e=i+this.width-c.x):(d=this.labelAlign==="left"?i:0,e=this.labelAlign==="right"?i+this.width:a.chartWidth);j.translateX<d&&(l+=d-j.translateX);j.translateX+c.width>=e&&(l-=j.translateX+c.width-e);j.attr({x:l,y:m,visibility:"visible"})}}});var mc=aa.init,nc=aa.processData,oc=za.prototype.tooltipFormatter;aa.init=
function(){mc.apply(this,arguments);this.setCompare(this.options.compare)};aa.setCompare=function(a){this.modifyValue=a==="value"||a==="percent"?function(b,c){var d=this.compareValue;if(b!==r&&(b=a==="value"?b-d:b=100*(b/d)-100,c))c.change=b;return b}:null;if(this.chart.hasRendered)this.isDirty=!0};aa.processData=function(){var a=0,b,c,d;nc.apply(this,arguments);if(this.xAxis&&this.processedYData){b=this.processedXData;c=this.processedYData;for(d=c.length;a<d;a++)if(typeof c[a]==="number"&&b[a]>=
this.xAxis.min){this.compareValue=c[a];break}}};O(aa,"getExtremes",function(a){a.call(this);if(this.modifyValue)this.dataMax=this.modifyValue(this.dataMax),this.dataMin=this.modifyValue(this.dataMin)});F.prototype.setCompare=function(a,b){this.isXAxis||(q(this.series,function(b){b.setCompare(a)}),o(b,!0)&&this.chart.redraw())};za.prototype.tooltipFormatter=function(a){a=a.replace("{point.change}",(this.change>0?"+":"")+Ia(this.change,o(this.series.tooltipOptions.changeDecimals,2)));return oc.apply(this,
[a])};O(L.prototype,"render",function(a){if(this.isCartesian)this.clipBox?this.chart[this.sharedClipKey]&&this.chart[this.sharedClipKey].attr({width:this.xAxis.len,height:this.yAxis.len}):(this.clipBox=y(this.chart.clipBox),this.clipBox.width=this.xAxis.len,this.clipBox.height=this.yAxis.len);a.call(this)});v(P,{Axis:F,Chart:va,Color:Fa,Point:za,Tick:Za,Renderer:Wa,Series:L,SVGElement:Z,SVGRenderer:ja,arrayMin:Ra,arrayMax:Ba,charts:$,dateFormat:ua,format:Ja,pathAnim:Bb,getOptions:function(){return I},
hasBidiBug:Yb,isTouchDevice:db,numberFormat:Ia,seriesTypes:C,setOptions:function(a){I=y(!0,I,a);Mb();return I},addEvent:A,removeEvent:R,createElement:Y,discardElement:Sa,css:E,each:q,extend:v,map:xa,merge:y,pick:o,splat:la,extendClass:fa,pInt:J,wrap:O,svg:ba,canvas:ia,vml:!ba&&!ia,product:"Highstock",version:"2.0.0"})})();

/*
 Highcharts JS v4.0.1 (2014-04-24)
 Exporting module

 (c) 2010-2014 Torstein Honsi

 License: www.highcharts.com/license
 */
(function(f){var A=f.Chart,t=f.addEvent,B=f.removeEvent,l=f.createElement,o=f.discardElement,v=f.css,k=f.merge,r=f.each,p=f.extend,D=Math.max,j=document,C=window,E=f.isTouchDevice,F=f.Renderer.prototype.symbols,s=f.getOptions(),y;p(s.lang,{printChart:"Print chart",downloadPNG:"Download PNG image",downloadJPEG:"Download JPEG image",downloadPDF:"Download PDF document",downloadSVG:"Download SVG vector image",contextButtonTitle:"Chart context menu"});s.navigation={menuStyle:{border:"1px solid #A0A0A0",
    background:"#FFFFFF",padding:"5px 0"},menuItemStyle:{padding:"0 10px",background:"none",color:"#303030",fontSize:E?"14px":"11px"},menuItemHoverStyle:{background:"#4572A5",color:"#FFFFFF"},buttonOptions:{symbolFill:"#E0E0E0",symbolSize:14,symbolStroke:"#666",symbolStrokeWidth:3,symbolX:12.5,symbolY:10.5,align:"right",buttonSpacing:3,height:22,theme:{fill:"white",stroke:"none"},verticalAlign:"top",width:24}};s.exporting={type:"image/png",url:"http://export.highcharts.com/",buttons:{contextButton:{menuClassName:"highcharts-contextmenu",
    symbol:"menu",_titleKey:"contextButtonTitle",menuItems:[{textKey:"printChart",onclick:function(){this.print()}},{separator:!0},{textKey:"downloadPNG",onclick:function(){this.exportChart()}},{textKey:"downloadJPEG",onclick:function(){this.exportChart({type:"image/jpeg"})}},{textKey:"downloadPDF",onclick:function(){this.exportChart({type:"application/pdf"})}},{textKey:"downloadSVG",onclick:function(){this.exportChart({type:"image/svg+xml"})}}]}}};f.post=function(b,a,d){var c,b=l("form",k({method:"post",
    action:b,enctype:"multipart/form-data"},d),{display:"none"},j.body);for(c in a)l("input",{type:"hidden",name:c,value:a[c]},null,b);b.submit();o(b)};p(A.prototype,{getSVG:function(b){var a=this,d,c,z,h,g=k(a.options,b);if(!j.createElementNS)j.createElementNS=function(a,b){return j.createElement(b)};b=l("div",null,{position:"absolute",top:"-9999em",width:a.chartWidth+"px",height:a.chartHeight+"px"},j.body);c=a.renderTo.style.width;h=a.renderTo.style.height;c=g.exporting.sourceWidth||g.chart.width||
    /px$/.test(c)&&parseInt(c,10)||600;h=g.exporting.sourceHeight||g.chart.height||/px$/.test(h)&&parseInt(h,10)||400;p(g.chart,{animation:!1,renderTo:b,forExport:!0,width:c,height:h});g.exporting.enabled=!1;g.series=[];r(a.series,function(a){z=k(a.options,{animation:!1,showCheckbox:!1,visible:a.visible});z.isInternal||g.series.push(z)});d=new f.Chart(g,a.callback);r(["xAxis","yAxis"],function(b){r(a[b],function(a,c){var g=d[b][c],f=a.getExtremes(),h=f.userMin,f=f.userMax;g&&(h!==void 0||f!==void 0)&&
g.setExtremes(h,f,!0,!1)})});c=d.container.innerHTML;g=null;d.destroy();o(b);c=c.replace(/zIndex="[^"]+"/g,"").replace(/isShadow="[^"]+"/g,"").replace(/symbolName="[^"]+"/g,"").replace(/jQuery[0-9]+="[^"]+"/g,"").replace(/url\([^#]+#/g,"url(#").replace(/<svg /,'<svg xmlns:xlink="http://www.w3.org/1999/xlink" ').replace(/ href=/g," xlink:href=").replace(/\n/," ").replace(/<\/svg>.*?$/,"</svg>").replace(/&nbsp;/g,"Â ").replace(/&shy;/g,"Â­").replace(/<IMG /g,"<image ").replace(/height=([^" ]+)/g,'height="$1"').replace(/width=([^" ]+)/g,
    'width="$1"').replace(/hc-svg-href="([^"]+)">/g,'xlink:href="$1"/>').replace(/id=([^" >]+)/g,'id="$1"').replace(/class=([^" >]+)/g,'class="$1"').replace(/ transform /g," ").replace(/:(path|rect)/g,"$1").replace(/style="([^"]+)"/g,function(a){return a.toLowerCase()});return c=c.replace(/(url\(#highcharts-[0-9]+)&quot;/g,"$1").replace(/&quot;/g,"'")},exportChart:function(b,a){var b=b||{},d=this.options.exporting,d=this.getSVG(k({chart:{borderRadius:0}},d.chartOptions,a,{exporting:{sourceWidth:b.sourceWidth||
    d.sourceWidth,sourceHeight:b.sourceHeight||d.sourceHeight}})),b=k(this.options.exporting,b);f.post(b.url,{filename:b.filename||"chart",type:b.type,width:b.width||0,scale:b.scale||2,svg:d},b.formAttributes)},print:function(){var b=this,a=b.container,d=[],c=a.parentNode,f=j.body,h=f.childNodes;if(!b.isPrinting)b.isPrinting=!0,r(h,function(a,b){if(a.nodeType===1)d[b]=a.style.display,a.style.display="none"}),f.appendChild(a),C.focus(),C.print(),setTimeout(function(){c.appendChild(a);r(h,function(a,b){if(a.nodeType===
    1)a.style.display=d[b]});b.isPrinting=!1},1E3)},contextMenu:function(b,a,d,c,f,h,g){var e=this,k=e.options.navigation,q=k.menuItemStyle,m=e.chartWidth,n=e.chartHeight,j="cache-"+b,i=e[j],u=D(f,h),w,x,o,s=function(a){e.pointer.inClass(a.target,b)||x()};if(!i)e[j]=i=l("div",{className:b},{position:"absolute",zIndex:1E3,padding:u+"px"},e.container),w=l("div",null,p({MozBoxShadow:"3px 3px 10px #888",WebkitBoxShadow:"3px 3px 10px #888",boxShadow:"3px 3px 10px #888"},k.menuStyle),i),x=function(){v(i,{display:"none"});
    g&&g.setState(0);e.openMenu=!1},t(i,"mouseleave",function(){o=setTimeout(x,500)}),t(i,"mouseenter",function(){clearTimeout(o)}),t(document,"mouseup",s),t(e,"destroy",function(){B(document,"mouseup",s)}),r(a,function(a){if(a){var b=a.separator?l("hr",null,null,w):l("div",{onmouseover:function(){v(this,k.menuItemHoverStyle)},onmouseout:function(){v(this,q)},onclick:function(){x();a.onclick.apply(e,arguments)},innerHTML:a.text||e.options.lang[a.textKey]},p({cursor:"pointer"},q),w);e.exportDivElements.push(b)}}),
    e.exportDivElements.push(w,i),e.exportMenuWidth=i.offsetWidth,e.exportMenuHeight=i.offsetHeight;a={display:"block"};d+e.exportMenuWidth>m?a.right=m-d-f-u+"px":a.left=d-u+"px";c+h+e.exportMenuHeight>n&&g.alignOptions.verticalAlign!=="top"?a.bottom=n-c-u+"px":a.top=c+h-u+"px";v(i,a);e.openMenu=!0},addButton:function(b){var a=this,d=a.renderer,c=k(a.options.navigation.buttonOptions,b),j=c.onclick,h=c.menuItems,g,e,l={stroke:c.symbolStroke,fill:c.symbolFill},q=c.symbolSize||12;if(!a.btnCount)a.btnCount=
    0;if(!a.exportDivElements)a.exportDivElements=[],a.exportSVGElements=[];if(c.enabled!==!1){var m=c.theme,n=m.states,o=n&&n.hover,n=n&&n.select,i;delete m.states;j?i=function(){j.apply(a,arguments)}:h&&(i=function(){a.contextMenu(e.menuClassName,h,e.translateX,e.translateY,e.width,e.height,e);e.setState(2)});c.text&&c.symbol?m.paddingLeft=f.pick(m.paddingLeft,25):c.text||p(m,{width:c.width,height:c.height,padding:0});e=d.button(c.text,0,0,i,m,o,n).attr({title:a.options.lang[c._titleKey],"stroke-linecap":"round"});
    e.menuClassName=b.menuClassName||"highcharts-menu-"+a.btnCount++;c.symbol&&(g=d.symbol(c.symbol,c.symbolX-q/2,c.symbolY-q/2,q,q).attr(p(l,{"stroke-width":c.symbolStrokeWidth||1,zIndex:1})).add(e));e.add().align(p(c,{width:e.width,x:f.pick(c.x,y)}),!0,"spacingBox");y+=(e.width+c.buttonSpacing)*(c.align==="right"?-1:1);a.exportSVGElements.push(e,g)}},destroyExport:function(b){var b=b.target,a,d;for(a=0;a<b.exportSVGElements.length;a++)if(d=b.exportSVGElements[a])d.onclick=d.ontouchstart=null,b.exportSVGElements[a]=
    d.destroy();for(a=0;a<b.exportDivElements.length;a++)d=b.exportDivElements[a],B(d,"mouseleave"),b.exportDivElements[a]=d.onmouseout=d.onmouseover=d.ontouchstart=d.onclick=null,o(d)}});F.menu=function(b,a,d,c){return["M",b,a+2.5,"L",b+d,a+2.5,"M",b,a+c/2+0.5,"L",b+d,a+c/2+0.5,"M",b,a+c-1.5,"L",b+d,a+c-1.5]};A.prototype.callbacks.push(function(b){var a,d=b.options.exporting,c=d.buttons;y=0;if(d.enabled!==!1){for(a in c)b.addButton(c[a]);t(b,"destroy",b.destroyExport)}})})(Highcharts);
/**
 * A small plugin for getting the CSV of a categorized chart
 */
(function (Highcharts) {
    
    
    var each = Highcharts.each;
    Highcharts.Chart.prototype.getCSV = function () {
        var columns = [],
            line,
            tempLine,
            csv = "", 
            row,
            col,
            options = (this.options.exporting || {}).csv || {},

            // Options
            dateFormat = options.dateFormat || '%Y-%m-%d %H:%M:%S',
            itemDelimiter = options.itemDelimiter || ',', // use ';' for direct import to Excel
            lineDelimiter = options.lineDelimeter || '\n';

        each (this.series, function (series) {
            if (series.options.includeInCSVExport !== false) {
                if (series.xAxis) {
                    var xData = series.xData.slice(),
                        xTitle = 'X values';
                    if (series.xAxis.isDatetimeAxis) {
                        xData = Highcharts.map(xData, function (x) {
                            return Highcharts.dateFormat(dateFormat, x)
                        });
                        xTitle = 'DateTime';
                    } else if (series.xAxis.categories) {
                        xData = Highcharts.map(xData, function (x) {
                            return Highcharts.pick(series.xAxis.categories[x], x);
                        });
                        xTitle = 'Category';
                    }
                    columns.push(xData);
                    columns[columns.length - 1].unshift(xTitle);
                }
                columns.push(series.yData.slice());
                columns[columns.length - 1].unshift(series.name);
            }
        });

        // Transform the columns to CSV
        for (row = 0; row < columns[0].length; row++) {
            line = [];
            for (col = 0; col < columns.length; col++) {
                line.push(columns[col][row]);
            }
            csv += line.join(itemDelimiter) + lineDelimiter;
        }

        return csv;
    };

    // Now we want to add "Download CSV" to the exporting menu. We post the CSV
    // to a simple PHP script that returns it with a content-type header as a 
    // downloadable file.
    // The source code for the PHP script can be viewed at 
    // https://raw.github.com/highslide-software/highcharts.com/master/studies/csv-export/csv.php
    if (Highcharts.getOptions().exporting) {
        Highcharts.getOptions().exporting.buttons.contextButton.menuItems.push({
            text: Highcharts.getOptions().lang.downloadCSV || "Download CSV",
            onclick: function () {
                Highcharts.post('http://www.highcharts.com/studies/csv-export/csv.php', {
                    csv: this.getCSV()
                });
            }
        });
    }
}(Highcharts));


/*!

JSZip - A Javascript class for generating and reading zip files
<http://stuartk.com/jszip>

(c) 2009-2014 Stuart Knightley <stuart [at] stuartk.com>
Dual licenced under the MIT license or GPLv3. See https://raw.github.com/Stuk/jszip/master/LICENSE.markdown.

JSZip uses the library pako released under the MIT license :
https://github.com/nodeca/pako/blob/master/LICENSE
*/
!function(a){"object"==typeof exports?module.exports=a():"function"==typeof define&&define.amd?define(a):"undefined"!=typeof window?window.JSZip=a():"undefined"!=typeof global?global.JSZip=a():"undefined"!=typeof self&&(self.JSZip=a())}(function(){return function a(b,c,d){function e(g,h){if(!c[g]){if(!b[g]){var i="function"==typeof require&&require;if(!h&&i)return i(g,!0);if(f)return f(g,!0);throw new Error("Cannot find module '"+g+"'")}var j=c[g]={exports:{}};b[g][0].call(j.exports,function(a){var c=b[g][1][a];return e(c?c:a)},j,j.exports,a,b,c,d)}return c[g].exports}for(var f="function"==typeof require&&require,g=0;g<d.length;g++)e(d[g]);return e}({1:[function(a,b,c){"use strict";var d="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";c.encode=function(a){for(var b,c,e,f,g,h,i,j="",k=0;k<a.length;)b=a.charCodeAt(k++),c=a.charCodeAt(k++),e=a.charCodeAt(k++),f=b>>2,g=(3&b)<<4|c>>4,h=(15&c)<<2|e>>6,i=63&e,isNaN(c)?h=i=64:isNaN(e)&&(i=64),j=j+d.charAt(f)+d.charAt(g)+d.charAt(h)+d.charAt(i);return j},c.decode=function(a){var b,c,e,f,g,h,i,j="",k=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");k<a.length;)f=d.indexOf(a.charAt(k++)),g=d.indexOf(a.charAt(k++)),h=d.indexOf(a.charAt(k++)),i=d.indexOf(a.charAt(k++)),b=f<<2|g>>4,c=(15&g)<<4|h>>2,e=(3&h)<<6|i,j+=String.fromCharCode(b),64!=h&&(j+=String.fromCharCode(c)),64!=i&&(j+=String.fromCharCode(e));return j}},{}],2:[function(a,b){"use strict";function c(){this.compressedSize=0,this.uncompressedSize=0,this.crc32=0,this.compressionMethod=null,this.compressedContent=null}c.prototype={getContent:function(){return null},getCompressedContent:function(){return null}},b.exports=c},{}],3:[function(a,b,c){"use strict";c.STORE={magic:"\x00\x00",compress:function(a){return a},uncompress:function(a){return a},compressInputType:null,uncompressInputType:null},c.DEFLATE=a("./flate")},{"./flate":6}],4:[function(a,b){"use strict";function c(){this.data=null,this.length=0,this.index=0}var d=a("./utils");c.prototype={checkOffset:function(a){this.checkIndex(this.index+a)},checkIndex:function(a){if(this.length<a||0>a)throw new Error("End of data reached (data length = "+this.length+", asked index = "+a+"). Corrupted zip ?")},setIndex:function(a){this.checkIndex(a),this.index=a},skip:function(a){this.setIndex(this.index+a)},byteAt:function(){},readInt:function(a){var b,c=0;for(this.checkOffset(a),b=this.index+a-1;b>=this.index;b--)c=(c<<8)+this.byteAt(b);return this.index+=a,c},readString:function(a){return d.transformTo("string",this.readData(a))},readData:function(){},lastIndexOfSignature:function(){},readDate:function(){var a=this.readInt(4);return new Date((a>>25&127)+1980,(a>>21&15)-1,a>>16&31,a>>11&31,a>>5&63,(31&a)<<1)}},b.exports=c},{"./utils":14}],5:[function(a,b,c){"use strict";c.base64=!1,c.binary=!1,c.dir=!1,c.date=null,c.compression=null},{}],6:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Uint32Array,e=a("pako");c.uncompressInputType=d?"uint8array":"array",c.compressInputType=d?"uint8array":"array",c.magic="\b\x00",c.compress=function(a){return e.deflateRaw(a)},c.uncompress=function(a){return e.inflateRaw(a)}},{pako:19}],7:[function(a,b){"use strict";function c(a,b){return this instanceof c?(this.files={},this.root="",a&&this.load(a,b),void(this.clone=function(){var a=new c;for(var b in this)"function"!=typeof this[b]&&(a[b]=this[b]);return a})):new c(a,b)}c.prototype=a("./object"),c.prototype.load=a("./load"),c.support=a("./support"),c.defaults=a("./defaults"),c.utils=a("./utils"),c.base64=a("./base64"),c.compressions=a("./compressions"),b.exports=c},{"./base64":1,"./compressions":3,"./defaults":5,"./load":8,"./object":9,"./support":12,"./utils":14}],8:[function(a,b){"use strict";var c=a("./base64"),d=a("./zipEntries");b.exports=function(a,b){var e,f,g,h;for(b=b||{},b.base64&&(a=c.decode(a)),f=new d(a,b),e=f.files,g=0;g<e.length;g++)h=e[g],this.file(h.fileName,h.decompressed,{binary:!0,optimizedBinaryString:!0,date:h.date,dir:h.dir});return this}},{"./base64":1,"./zipEntries":15}],9:[function(a,b){"use strict";var c,d,e=a("./support"),f=a("./utils"),g=a("./signature"),h=a("./defaults"),i=a("./base64"),j=a("./compressions"),k=a("./compressedObject"),l=a("./nodeBuffer");e.uint8array&&"function"==typeof TextEncoder&&"function"==typeof TextDecoder&&(c=new TextEncoder("utf-8"),d=new TextDecoder("utf-8"));var m=function(a){if(a._data instanceof k&&(a._data=a._data.getContent(),a.options.binary=!0,a.options.base64=!1,"uint8array"===f.getTypeOf(a._data))){var b=a._data;a._data=new Uint8Array(b.length),0!==b.length&&a._data.set(b,0)}return a._data},n=function(a){var b=m(a),d=f.getTypeOf(b);if("string"===d){if(!a.options.binary){if(c)return c.encode(b);if(e.nodebuffer)return l(b,"utf-8")}return a.asBinary()}return b},o=function(a){var b=m(this);return null===b||"undefined"==typeof b?"":(this.options.base64&&(b=i.decode(b)),b=a&&this.options.binary?A.utf8decode(b):f.transformTo("string",b),a||this.options.binary||(b=A.utf8encode(b)),b)},p=function(a,b,c){this.name=a,this._data=b,this.options=c};p.prototype={asText:function(){return o.call(this,!0)},asBinary:function(){return o.call(this,!1)},asNodeBuffer:function(){var a=n(this);return f.transformTo("nodebuffer",a)},asUint8Array:function(){var a=n(this);return f.transformTo("uint8array",a)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var q=function(a,b){var c,d="";for(c=0;b>c;c++)d+=String.fromCharCode(255&a),a>>>=8;return d},r=function(){var a,b,c={};for(a=0;a<arguments.length;a++)for(b in arguments[a])arguments[a].hasOwnProperty(b)&&"undefined"==typeof c[b]&&(c[b]=arguments[a][b]);return c},s=function(a){return a=a||{},a.base64!==!0||null!==a.binary&&void 0!==a.binary||(a.binary=!0),a=r(a,h),a.date=a.date||new Date,null!==a.compression&&(a.compression=a.compression.toUpperCase()),a},t=function(a,b,c){var d=u(a),e=f.getTypeOf(b);if(d&&v.call(this,d),c=s(c),c.dir||null===b||"undefined"==typeof b)c.base64=!1,c.binary=!1,b=null;else if("string"===e)c.binary&&!c.base64&&c.optimizedBinaryString!==!0&&(b=f.string2binary(b));else{if(c.base64=!1,c.binary=!0,!(e||b instanceof k))throw new Error("The data of '"+a+"' is in an unsupported format !");"arraybuffer"===e&&(b=f.transformTo("uint8array",b))}var g=new p(a,b,c);return this.files[a]=g,g},u=function(a){"/"==a.slice(-1)&&(a=a.substring(0,a.length-1));var b=a.lastIndexOf("/");return b>0?a.substring(0,b):""},v=function(a){return"/"!=a.slice(-1)&&(a+="/"),this.files[a]||t.call(this,a,null,{dir:!0}),this.files[a]},w=function(a,b){var c,d=new k;return a._data instanceof k?(d.uncompressedSize=a._data.uncompressedSize,d.crc32=a._data.crc32,0===d.uncompressedSize||a.options.dir?(b=j.STORE,d.compressedContent="",d.crc32=0):a._data.compressionMethod===b.magic?d.compressedContent=a._data.getCompressedContent():(c=a._data.getContent(),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c)))):(c=n(a),(!c||0===c.length||a.options.dir)&&(b=j.STORE,c=""),d.uncompressedSize=c.length,d.crc32=this.crc32(c),d.compressedContent=b.compress(f.transformTo(b.compressInputType,c))),d.compressedSize=d.compressedContent.length,d.compressionMethod=b.magic,d},x=function(a,b,c,d){var e,f,h=(c.compressedContent,this.utf8encode(b.name)),i=h!==b.name,j=b.options,k="",l="";e=j.date.getHours(),e<<=6,e|=j.date.getMinutes(),e<<=5,e|=j.date.getSeconds()/2,f=j.date.getFullYear()-1980,f<<=4,f|=j.date.getMonth()+1,f<<=5,f|=j.date.getDate(),i&&(l=q(1,1)+q(this.crc32(h),4)+h,k+="up"+q(l.length,2)+l);var m="";m+="\n\x00",m+=i?"\x00\b":"\x00\x00",m+=c.compressionMethod,m+=q(e,2),m+=q(f,2),m+=q(c.crc32,4),m+=q(c.compressedSize,4),m+=q(c.uncompressedSize,4),m+=q(h.length,2),m+=q(k.length,2);var n=g.LOCAL_FILE_HEADER+m+h+k,o=g.CENTRAL_FILE_HEADER+"\x00"+m+"\x00\x00\x00\x00\x00\x00"+(b.options.dir===!0?"\x00\x00\x00":"\x00\x00\x00\x00")+q(d,4)+h+k;return{fileRecord:n,dirRecord:o,compressedObject:c}},y=function(){this.data=[]};y.prototype={append:function(a){a=f.transformTo("string",a),this.data.push(a)},finalize:function(){return this.data.join("")}};var z=function(a){this.data=new Uint8Array(a),this.index=0};z.prototype={append:function(a){0!==a.length&&(a=f.transformTo("uint8array",a),this.data.set(a,this.index),this.index+=a.length)},finalize:function(){return this.data}};var A={load:function(){throw new Error("Load method is not defined. Is the file jszip-load.js included ?")},filter:function(a){var b,c,d,e,f=[];for(b in this.files)this.files.hasOwnProperty(b)&&(d=this.files[b],e=new p(d.name,d._data,r(d.options)),c=b.slice(this.root.length,b.length),b.slice(0,this.root.length)===this.root&&a(c,e)&&f.push(e));return f},file:function(a,b,c){if(1===arguments.length){if(f.isRegExp(a)){var d=a;return this.filter(function(a,b){return!b.options.dir&&d.test(a)})}return this.filter(function(b,c){return!c.options.dir&&b===a})[0]||null}return a=this.root+a,t.call(this,a,b,c),this},folder:function(a){if(!a)return this;if(f.isRegExp(a))return this.filter(function(b,c){return c.options.dir&&a.test(b)});var b=this.root+a,c=v.call(this,b),d=this.clone();return d.root=c.name,d},remove:function(a){a=this.root+a;var b=this.files[a];if(b||("/"!=a.slice(-1)&&(a+="/"),b=this.files[a]),b)if(b.options.dir)for(var c=this.filter(function(b,c){return c.name.slice(0,a.length)===a}),d=0;d<c.length;d++)delete this.files[c[d].name];else delete this.files[a];return this},generate:function(a){a=r(a||{},{base64:!0,compression:"STORE",type:"base64"}),f.checkSupport(a.type);var b,c,d=[],e=0,h=0;for(var k in this.files)if(this.files.hasOwnProperty(k)){var l=this.files[k],m=l.options.compression||a.compression.toUpperCase(),n=j[m];if(!n)throw new Error(m+" is not a valid compression method !");var o=w.call(this,l,n),p=x.call(this,k,l,o,e);e+=p.fileRecord.length+o.compressedSize,h+=p.dirRecord.length,d.push(p)}var s="";s=g.CENTRAL_DIRECTORY_END+"\x00\x00\x00\x00"+q(d.length,2)+q(d.length,2)+q(h,4)+q(e,4)+"\x00\x00";var t=a.type.toLowerCase();for(b="uint8array"===t||"arraybuffer"===t||"blob"===t||"nodebuffer"===t?new z(e+h+s.length):new y(e+h+s.length),c=0;c<d.length;c++)b.append(d[c].fileRecord),b.append(d[c].compressedObject.compressedContent);for(c=0;c<d.length;c++)b.append(d[c].dirRecord);b.append(s);var u=b.finalize();switch(a.type.toLowerCase()){case"uint8array":case"arraybuffer":case"nodebuffer":return f.transformTo(a.type.toLowerCase(),u);case"blob":return f.arrayBuffer2Blob(f.transformTo("arraybuffer",u));case"base64":return a.base64?i.encode(u):u;default:return u}},crc32:function(a,b){if("undefined"==typeof a||!a.length)return 0;var c="string"!==f.getTypeOf(a),d=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];"undefined"==typeof b&&(b=0);var e=0,g=0,h=0;b=-1^b;for(var i=0,j=a.length;j>i;i++)h=c?a[i]:a.charCodeAt(i),g=255&(b^h),e=d[g],b=b>>>8^e;return-1^b},utf8encode:function(a){if(c){var b=c.encode(a);return f.transformTo("string",b)}if(e.nodebuffer)return f.transformTo("string",l(a,"utf-8"));for(var d=[],g=0,h=0;h<a.length;h++){var i=a.charCodeAt(h);128>i?d[g++]=String.fromCharCode(i):i>127&&2048>i?(d[g++]=String.fromCharCode(i>>6|192),d[g++]=String.fromCharCode(63&i|128)):(d[g++]=String.fromCharCode(i>>12|224),d[g++]=String.fromCharCode(i>>6&63|128),d[g++]=String.fromCharCode(63&i|128))}return d.join("")},utf8decode:function(a){var b=[],c=0,g=f.getTypeOf(a),h="string"!==g,i=0,j=0,k=0,l=0;if(d)return d.decode(f.transformTo("uint8array",a));if(e.nodebuffer)return f.transformTo("nodebuffer",a).toString("utf-8");for(;i<a.length;)j=h?a[i]:a.charCodeAt(i),128>j?(b[c++]=String.fromCharCode(j),i++):j>191&&224>j?(k=h?a[i+1]:a.charCodeAt(i+1),b[c++]=String.fromCharCode((31&j)<<6|63&k),i+=2):(k=h?a[i+1]:a.charCodeAt(i+1),l=h?a[i+2]:a.charCodeAt(i+2),b[c++]=String.fromCharCode((15&j)<<12|(63&k)<<6|63&l),i+=3);return b.join("")}};b.exports=A},{"./base64":1,"./compressedObject":2,"./compressions":3,"./defaults":5,"./nodeBuffer":17,"./signature":10,"./support":12,"./utils":14}],10:[function(a,b,c){"use strict";c.LOCAL_FILE_HEADER="PK",c.CENTRAL_FILE_HEADER="PK",c.CENTRAL_DIRECTORY_END="PK",c.ZIP64_CENTRAL_DIRECTORY_LOCATOR="PK",c.ZIP64_CENTRAL_DIRECTORY_END="PK",c.DATA_DESCRIPTOR="PK\b"},{}],11:[function(a,b){"use strict";function c(a,b){this.data=a,b||(this.data=e.string2binary(this.data)),this.length=this.data.length,this.index=0}var d=a("./dataReader"),e=a("./utils");c.prototype=new d,c.prototype.byteAt=function(a){return this.data.charCodeAt(a)},c.prototype.lastIndexOfSignature=function(a){return this.data.lastIndexOf(a)},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.slice(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4,"./utils":14}],12:[function(a,b,c){var d=a("__browserify_process");if(c.base64=!0,c.array=!0,c.string=!0,c.arraybuffer="undefined"!=typeof ArrayBuffer&&"undefined"!=typeof Uint8Array,c.nodebuffer=!d.browser,c.uint8array="undefined"!=typeof Uint8Array,"undefined"==typeof ArrayBuffer)c.blob=!1;else{var e=new ArrayBuffer(0);try{c.blob=0===new Blob([e],{type:"application/zip"}).size}catch(f){try{var g=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,h=new g;h.append(e),c.blob=0===h.getBlob("application/zip").size}catch(f){c.blob=!1}}}},{__browserify_process:18}],13:[function(a,b){"use strict";function c(a){a&&(this.data=a,this.length=this.data.length,this.index=0)}var d=a("./dataReader");c.prototype=new d,c.prototype.byteAt=function(a){return this.data[a]},c.prototype.lastIndexOfSignature=function(a){for(var b=a.charCodeAt(0),c=a.charCodeAt(1),d=a.charCodeAt(2),e=a.charCodeAt(3),f=this.length-4;f>=0;--f)if(this.data[f]===b&&this.data[f+1]===c&&this.data[f+2]===d&&this.data[f+3]===e)return f;return-1},c.prototype.readData=function(a){this.checkOffset(a);var b=this.data.subarray(this.index,this.index+a);return this.index+=a,b},b.exports=c},{"./dataReader":4}],14:[function(a,b,c){"use strict";function d(a){return a}function e(a,b){for(var c=0;c<a.length;++c)b[c]=255&a.charCodeAt(c);return b}function f(a){var b=65536,d=[],e=a.length,f=c.getTypeOf(a),g=0,h=!0;try{switch(f){case"uint8array":String.fromCharCode.apply(null,new Uint8Array(0));break;case"nodebuffer":String.fromCharCode.apply(null,j(0))}}catch(i){h=!1}if(!h){for(var k="",l=0;l<a.length;l++)k+=String.fromCharCode(a[l]);return k}for(;e>g&&b>1;)try{d.push("array"===f||"nodebuffer"===f?String.fromCharCode.apply(null,a.slice(g,Math.min(g+b,e))):String.fromCharCode.apply(null,a.subarray(g,Math.min(g+b,e)))),g+=b}catch(i){b=Math.floor(b/2)}return d.join("")}function g(a,b){for(var c=0;c<a.length;c++)b[c]=a[c];return b}var h=a("./support"),i=a("./compressions"),j=a("./nodeBuffer");c.string2binary=function(a){for(var b="",c=0;c<a.length;c++)b+=String.fromCharCode(255&a.charCodeAt(c));return b},c.string2Uint8Array=function(a){return c.transformTo("uint8array",a)},c.uint8Array2String=function(a){return c.transformTo("string",a)},c.string2Blob=function(a){var b=c.transformTo("arraybuffer",a);return c.arrayBuffer2Blob(b)},c.arrayBuffer2Blob=function(a){c.checkSupport("blob");try{return new Blob([a],{type:"application/zip"})}catch(b){try{var d=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder,e=new d;return e.append(a),e.getBlob("application/zip")}catch(b){throw new Error("Bug : can't construct the Blob.")}}};var k={};k.string={string:d,array:function(a){return e(a,new Array(a.length))},arraybuffer:function(a){return k.string.uint8array(a).buffer},uint8array:function(a){return e(a,new Uint8Array(a.length))},nodebuffer:function(a){return e(a,j(a.length))}},k.array={string:f,array:d,arraybuffer:function(a){return new Uint8Array(a).buffer},uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(a)}},k.arraybuffer={string:function(a){return f(new Uint8Array(a))},array:function(a){return g(new Uint8Array(a),new Array(a.byteLength))},arraybuffer:d,uint8array:function(a){return new Uint8Array(a)},nodebuffer:function(a){return j(new Uint8Array(a))}},k.uint8array={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return a.buffer},uint8array:d,nodebuffer:function(a){return j(a)}},k.nodebuffer={string:f,array:function(a){return g(a,new Array(a.length))},arraybuffer:function(a){return k.nodebuffer.uint8array(a).buffer},uint8array:function(a){return g(a,new Uint8Array(a.length))},nodebuffer:d},c.transformTo=function(a,b){if(b||(b=""),!a)return b;c.checkSupport(a);var d=c.getTypeOf(b),e=k[d][a](b);return e},c.getTypeOf=function(a){return"string"==typeof a?"string":"[object Array]"===Object.prototype.toString.call(a)?"array":h.nodebuffer&&j.test(a)?"nodebuffer":h.uint8array&&a instanceof Uint8Array?"uint8array":h.arraybuffer&&a instanceof ArrayBuffer?"arraybuffer":void 0},c.checkSupport=function(a){var b=h[a.toLowerCase()];if(!b)throw new Error(a+" is not supported by this browser")},c.MAX_VALUE_16BITS=65535,c.MAX_VALUE_32BITS=-1,c.pretty=function(a){var b,c,d="";for(c=0;c<(a||"").length;c++)b=a.charCodeAt(c),d+="\\x"+(16>b?"0":"")+b.toString(16).toUpperCase();return d},c.findCompression=function(a){for(var b in i)if(i.hasOwnProperty(b)&&i[b].magic===a)return i[b];return null},c.isRegExp=function(a){return"[object RegExp]"===Object.prototype.toString.call(a)}},{"./compressions":3,"./nodeBuffer":17,"./support":12}],15:[function(a,b){"use strict";function c(a,b){this.files=[],this.loadOptions=b,a&&this.load(a)}var d=a("./stringReader"),e=a("./nodeBufferReader"),f=a("./uint8ArrayReader"),g=a("./utils"),h=a("./signature"),i=a("./zipEntry"),j=a("./support");c.prototype={checkSignature:function(a){var b=this.reader.readString(4);if(b!==a)throw new Error("Corrupted zip or bug : unexpected signature ("+g.pretty(b)+", expected "+g.pretty(a)+")")},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2),this.diskWithCentralDirStart=this.reader.readInt(2),this.centralDirRecordsOnThisDisk=this.reader.readInt(2),this.centralDirRecords=this.reader.readInt(2),this.centralDirSize=this.reader.readInt(4),this.centralDirOffset=this.reader.readInt(4),this.zipCommentLength=this.reader.readInt(2),this.zipComment=this.reader.readString(this.zipCommentLength)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8),this.versionMadeBy=this.reader.readString(2),this.versionNeeded=this.reader.readInt(2),this.diskNumber=this.reader.readInt(4),this.diskWithCentralDirStart=this.reader.readInt(4),this.centralDirRecordsOnThisDisk=this.reader.readInt(8),this.centralDirRecords=this.reader.readInt(8),this.centralDirSize=this.reader.readInt(8),this.centralDirOffset=this.reader.readInt(8),this.zip64ExtensibleData={};for(var a,b,c,d=this.zip64EndOfCentralSize-44,e=0;d>e;)a=this.reader.readInt(2),b=this.reader.readInt(4),c=this.reader.readString(b),this.zip64ExtensibleData[a]={id:a,length:b,value:c}},readBlockZip64EndOfCentralLocator:function(){if(this.diskWithZip64CentralDirStart=this.reader.readInt(4),this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8),this.disksCount=this.reader.readInt(4),this.disksCount>1)throw new Error("Multi-volumes zip are not supported")},readLocalFiles:function(){var a,b;for(a=0;a<this.files.length;a++)b=this.files[a],this.reader.setIndex(b.localHeaderOffset),this.checkSignature(h.LOCAL_FILE_HEADER),b.readLocalPart(this.reader),b.handleUTF8()},readCentralDir:function(){var a;for(this.reader.setIndex(this.centralDirOffset);this.reader.readString(4)===h.CENTRAL_FILE_HEADER;)a=new i({zip64:this.zip64},this.loadOptions),a.readCentralPart(this.reader),this.files.push(a)},readEndOfCentral:function(){var a=this.reader.lastIndexOfSignature(h.CENTRAL_DIRECTORY_END);if(-1===a)throw new Error("Corrupted zip : can't find end of central directory");if(this.reader.setIndex(a),this.checkSignature(h.CENTRAL_DIRECTORY_END),this.readBlockEndOfCentral(),this.diskNumber===g.MAX_VALUE_16BITS||this.diskWithCentralDirStart===g.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===g.MAX_VALUE_16BITS||this.centralDirRecords===g.MAX_VALUE_16BITS||this.centralDirSize===g.MAX_VALUE_32BITS||this.centralDirOffset===g.MAX_VALUE_32BITS){if(this.zip64=!0,a=this.reader.lastIndexOfSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),-1===a)throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");this.reader.setIndex(a),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_LOCATOR),this.readBlockZip64EndOfCentralLocator(),this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir),this.checkSignature(h.ZIP64_CENTRAL_DIRECTORY_END),this.readBlockZip64EndOfCentral()}},prepareReader:function(a){var b=g.getTypeOf(a);this.reader="string"!==b||j.uint8array?"nodebuffer"===b?new e(a):new f(g.transformTo("uint8array",a)):new d(a,this.loadOptions.optimizedBinaryString)},load:function(a){this.prepareReader(a),this.readEndOfCentral(),this.readCentralDir(),this.readLocalFiles()}},b.exports=c},{"./nodeBufferReader":17,"./signature":10,"./stringReader":11,"./support":12,"./uint8ArrayReader":13,"./utils":14,"./zipEntry":16}],16:[function(a,b){"use strict";function c(a,b){this.options=a,this.loadOptions=b}var d=a("./stringReader"),e=a("./utils"),f=a("./compressedObject"),g=a("./object");c.prototype={isEncrypted:function(){return 1===(1&this.bitFlag)},useUTF8:function(){return 2048===(2048&this.bitFlag)},prepareCompressedContent:function(a,b,c){return function(){var d=a.index;a.setIndex(b);var e=a.readData(c);return a.setIndex(d),e}},prepareContent:function(a,b,c,d,f){return function(){var a=e.transformTo(d.uncompressInputType,this.getCompressedContent()),b=d.uncompress(a);if(b.length!==f)throw new Error("Bug : uncompressed data size mismatch");return b}},readLocalPart:function(a){var b,c;if(a.skip(22),this.fileNameLength=a.readInt(2),c=a.readInt(2),this.fileName=a.readString(this.fileNameLength),a.skip(c),-1==this.compressedSize||-1==this.uncompressedSize)throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory (compressedSize == -1 || uncompressedSize == -1)");if(b=e.findCompression(this.compressionMethod),null===b)throw new Error("Corrupted zip : compression "+e.pretty(this.compressionMethod)+" unknown (inner file : "+this.fileName+")");if(this.decompressed=new f,this.decompressed.compressedSize=this.compressedSize,this.decompressed.uncompressedSize=this.uncompressedSize,this.decompressed.crc32=this.crc32,this.decompressed.compressionMethod=this.compressionMethod,this.decompressed.getCompressedContent=this.prepareCompressedContent(a,a.index,this.compressedSize,b),this.decompressed.getContent=this.prepareContent(a,a.index,this.compressedSize,b,this.uncompressedSize),this.loadOptions.checkCRC32&&(this.decompressed=e.transformTo("string",this.decompressed.getContent()),g.crc32(this.decompressed)!==this.crc32))throw new Error("Corrupted zip : CRC32 mismatch")},readCentralPart:function(a){if(this.versionMadeBy=a.readString(2),this.versionNeeded=a.readInt(2),this.bitFlag=a.readInt(2),this.compressionMethod=a.readString(2),this.date=a.readDate(),this.crc32=a.readInt(4),this.compressedSize=a.readInt(4),this.uncompressedSize=a.readInt(4),this.fileNameLength=a.readInt(2),this.extraFieldsLength=a.readInt(2),this.fileCommentLength=a.readInt(2),this.diskNumberStart=a.readInt(2),this.internalFileAttributes=a.readInt(2),this.externalFileAttributes=a.readInt(4),this.localHeaderOffset=a.readInt(4),this.isEncrypted())throw new Error("Encrypted zip are not supported");this.fileName=a.readString(this.fileNameLength),this.readExtraFields(a),this.parseZIP64ExtraField(a),this.fileComment=a.readString(this.fileCommentLength),this.dir=16&this.externalFileAttributes?!0:!1},parseZIP64ExtraField:function(){if(this.extraFields[1]){var a=new d(this.extraFields[1].value);this.uncompressedSize===e.MAX_VALUE_32BITS&&(this.uncompressedSize=a.readInt(8)),this.compressedSize===e.MAX_VALUE_32BITS&&(this.compressedSize=a.readInt(8)),this.localHeaderOffset===e.MAX_VALUE_32BITS&&(this.localHeaderOffset=a.readInt(8)),this.diskNumberStart===e.MAX_VALUE_32BITS&&(this.diskNumberStart=a.readInt(4))}},readExtraFields:function(a){var b,c,d,e=a.index;for(this.extraFields=this.extraFields||{};a.index<e+this.extraFieldsLength;)b=a.readInt(2),c=a.readInt(2),d=a.readString(c),this.extraFields[b]={id:b,length:c,value:d}},handleUTF8:function(){if(this.useUTF8())this.fileName=g.utf8decode(this.fileName),this.fileComment=g.utf8decode(this.fileComment);else{var a=this.findExtraFieldUnicodePath();null!==a&&(this.fileName=a)}},findExtraFieldUnicodePath:function(){var a=this.extraFields[28789];if(a){var b=new d(a.value);return 1!==b.readInt(1)?null:g.crc32(this.fileName)!==b.readInt(4)?null:g.utf8decode(b.readString(a.length-5))}return null}},b.exports=c},{"./compressedObject":2,"./object":9,"./stringReader":11,"./utils":14}],17:[function(){},{}],18:[function(a,b){var c=b.exports={};c.nextTick=function(){var a="undefined"!=typeof window&&window.setImmediate,b="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(a)return function(a){return window.setImmediate(a)};if(b){var c=[];return window.addEventListener("message",function(a){var b=a.source;if((b===window||null===b)&&"process-tick"===a.data&&(a.stopPropagation(),c.length>0)){var d=c.shift();d()}},!0),function(a){c.push(a),window.postMessage("process-tick","*")}}return function(a){setTimeout(a,0)}}(),c.title="browser",c.browser=!0,c.env={},c.argv=[],c.binding=function(){throw new Error("process.binding is not supported")},c.cwd=function(){return"/"},c.chdir=function(){throw new Error("process.chdir is not supported")}},{}],19:[function(a,b){"use strict";var c=a("./lib/utils/common").assign,d=a("./lib/deflate"),e=a("./lib/inflate"),f=a("./lib/zlib/constants"),g={};c(g,d,e,f),b.exports=g},{"./lib/deflate":20,"./lib/inflate":21,"./lib/utils/common":22,"./lib/zlib/constants":25}],20:[function(a,b,c){"use strict";function d(a,b){var c=new s(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}function f(a,b){return b=b||{},b.gzip=!0,d(a,b)}var g=a("./zlib/deflate.js"),h=a("./utils/common"),i=a("./utils/strings"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=0,m=4,n=0,o=1,p=-1,q=0,r=8,s=function(a){this.options=h.assign({level:p,method:r,chunkSize:16384,windowBits:15,memLevel:8,strategy:q,to:""},a||{});var b=this.options;b.raw&&b.windowBits>0?b.windowBits=-b.windowBits:b.gzip&&b.windowBits>0&&b.windowBits<16&&(b.windowBits+=16),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=g.deflateInit2(this.strm,b.level,b.method,b.windowBits,b.memLevel,b.strategy);if(c!==n)throw new Error(j[c]);b.header&&g.deflateSetHeader(this.strm,b.header)};s.prototype.push=function(a,b){var c,d,e=this.strm,f=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?m:l,e.input="string"==typeof a?i.string2buf(a):a,e.next_in=0,e.avail_in=e.input.length;do{if(0===e.avail_out&&(e.output=new h.Buf8(f),e.next_out=0,e.avail_out=f),c=g.deflate(e,d),c!==o&&c!==n)return this.onEnd(c),this.ended=!0,!1;(0===e.avail_out||0===e.avail_in&&d===m)&&this.onData("string"===this.options.to?i.buf2binstring(h.shrinkBuf(e.output,e.next_out)):h.shrinkBuf(e.output,e.next_out))}while((e.avail_in>0||0===e.avail_out)&&c!==o);return d===m?(c=g.deflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===n):!0},s.prototype.onData=function(a){this.chunks.push(a)},s.prototype.onEnd=function(a){a===n&&(this.result="string"===this.options.to?this.chunks.join(""):h.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Deflate=s,c.deflate=d,c.deflateRaw=e,c.gzip=f},{"./utils/common":22,"./utils/strings":23,"./zlib/deflate.js":27,"./zlib/messages":32,"./zlib/zstream":34}],21:[function(a,b,c){"use strict";function d(a,b){var c=new m(b);if(c.push(a,!0),c.err)throw c.msg;return c.result}function e(a,b){return b=b||{},b.raw=!0,d(a,b)}var f=a("./zlib/inflate.js"),g=a("./utils/common"),h=a("./utils/strings"),i=a("./zlib/constants"),j=a("./zlib/messages"),k=a("./zlib/zstream"),l=a("./zlib/gzheader"),m=function(a){this.options=g.assign({chunkSize:16384,windowBits:0,to:""},a||{});var b=this.options;b.raw&&b.windowBits>=0&&b.windowBits<16&&(b.windowBits=-b.windowBits,0===b.windowBits&&(b.windowBits=-15)),!(b.windowBits>=0&&b.windowBits<16)||a&&a.windowBits||(b.windowBits+=32),b.windowBits>15&&b.windowBits<48&&0===(15&b.windowBits)&&(b.windowBits|=15),this.err=0,this.msg="",this.ended=!1,this.chunks=[],this.strm=new k,this.strm.avail_out=0;var c=f.inflateInit2(this.strm,b.windowBits);if(c!==i.Z_OK)throw new Error(j[c]);this.header=new l,f.inflateGetHeader(this.strm,this.header)};m.prototype.push=function(a,b){var c,d,e,j,k,l=this.strm,m=this.options.chunkSize;if(this.ended)return!1;d=b===~~b?b:b===!0?i.Z_FINISH:i.Z_NO_FLUSH,l.input="string"==typeof a?h.binstring2buf(a):a,l.next_in=0,l.avail_in=l.input.length;do{if(0===l.avail_out&&(l.output=new g.Buf8(m),l.next_out=0,l.avail_out=m),c=f.inflate(l,i.Z_NO_FLUSH),c!==i.Z_STREAM_END&&c!==i.Z_OK)return this.onEnd(c),this.ended=!0,!1;l.next_out&&(0===l.avail_out||c===i.Z_STREAM_END||0===l.avail_in&&d===i.Z_FINISH)&&("string"===this.options.to?(e=h.utf8border(l.output,l.next_out),j=l.next_out-e,k=h.buf2string(l.output,e),l.next_out=j,l.avail_out=m-j,j&&g.arraySet(l.output,l.output,e,j,0),this.onData(k)):this.onData(g.shrinkBuf(l.output,l.next_out)))
}while((l.avail_in>0||0===l.avail_out)&&c!==i.Z_STREAM_END);return c===i.Z_STREAM_END&&(d=i.Z_FINISH),d===i.Z_FINISH?(c=f.inflateEnd(this.strm),this.onEnd(c),this.ended=!0,c===i.Z_OK):!0},m.prototype.onData=function(a){this.chunks.push(a)},m.prototype.onEnd=function(a){a===i.Z_OK&&(this.result="string"===this.options.to?this.chunks.join(""):g.flattenChunks(this.chunks)),this.chunks=[],this.err=a,this.msg=this.strm.msg},c.Inflate=m,c.inflate=d,c.inflateRaw=e,c.ungzip=d},{"./utils/common":22,"./utils/strings":23,"./zlib/constants":25,"./zlib/gzheader":28,"./zlib/inflate.js":30,"./zlib/messages":32,"./zlib/zstream":34}],22:[function(a,b,c){"use strict";var d="undefined"!=typeof Uint8Array&&"undefined"!=typeof Uint16Array&&"undefined"!=typeof Int32Array;c.assign=function(a){for(var b=Array.prototype.slice.call(arguments,1);b.length;){var c=b.shift();if(c){if("object"!=typeof c)throw new TypeError(c+"must be non-object");for(var d in c)c.hasOwnProperty(d)&&(a[d]=c[d])}}return a},c.shrinkBuf=function(a,b){return a.length===b?a:a.subarray?a.subarray(0,b):(a.length=b,a)};var e={arraySet:function(a,b,c,d,e){if(b.subarray&&a.subarray)return void a.set(b.subarray(c,c+d),e);for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){var b,c,d,e,f,g;for(d=0,b=0,c=a.length;c>b;b++)d+=a[b].length;for(g=new Uint8Array(d),e=0,b=0,c=a.length;c>b;b++)f=a[b],g.set(f,e),e+=f.length;return g}},f={arraySet:function(a,b,c,d,e){for(var f=0;d>f;f++)a[e+f]=b[c+f]},flattenChunks:function(a){return[].concat.apply([],a)}};c.setTyped=function(a){a?(c.Buf8=Uint8Array,c.Buf16=Uint16Array,c.Buf32=Int32Array,c.assign(c,e)):(c.Buf8=Array,c.Buf16=Array,c.Buf32=Array,c.assign(c,f))},c.setTyped(d)},{}],23:[function(a,b,c){"use strict";var d=a("./common"),e=!0;try{String.fromCharCode.apply(null,[0])}catch(f){e=!1}for(var g=new d.Buf8(256),h=0;256>h;h++)g[h]=h>=252?6:h>=248?5:h>=240?4:h>=224?3:h>=192?2:1;g[254]=g[254]=1,c.string2buf=function(a){var b,c,e,f,g,h=a.length,i=0;for(f=0;h>f;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(e=a.charCodeAt(f+1),56320===(64512&e)&&(c=65536+(c-55296<<10)+(e-56320),f++)),i+=128>c?1:2048>c?2:65536>c?3:4;for(b=new d.Buf8(i),g=0,f=0;i>g;f++)c=a.charCodeAt(f),55296===(64512&c)&&h>f+1&&(e=a.charCodeAt(f+1),56320===(64512&e)&&(c=65536+(c-55296<<10)+(e-56320),f++)),128>c?b[g++]=c:2048>c?(b[g++]=192|c>>>6,b[g++]=128|63&c):65536>c?(b[g++]=224|c>>>12,b[g++]=128|c>>>6&63,b[g++]=128|63&c):(b[g++]=240|c>>>18,b[g++]=128|c>>>12&63,b[g++]=128|c>>>6&63,b[g++]=128|63&c);return b},c.buf2binstring=function(a){if(e&&a.length<65537)return String.fromCharCode.apply(null,a);for(var b="",c=0,d=a.length;d>c;c++)b+=String.fromCharCode(a[c]);return b},c.binstring2buf=function(a){for(var b=new d.Buf8(a.length),c=0,e=b.length;e>c;c++)b[c]=a.charCodeAt(c);return b},c.buf2string=function(a,b){var c,f,h,i,j,k=b||a.length,l=new Array(2*k);for(h=0,f=0;k>f;)if(i=a[f++],128>i)l[h++]=i;else if(j=g[i],j>4)l[h++]=65533,f+=j-1;else{for(i&=2===j?31:3===j?15:7;j>1&&k>f;)i=i<<6|63&a[f++],j--;j>1?l[h++]=65533:65536>i?l[h++]=i:(i-=65536,l[h++]=55296|i>>10&1023,l[h++]=56320|1023&i)}if(e)return String.fromCharCode.apply(null,d.shrinkBuf(l,h));for(c="",f=0,k=h;k>f;f++)c+=String.fromCharCode(l[f]);return c},c.utf8border=function(a,b){var c;for(b=b||a.length,b>a.length&&(b=a.length),c=b-1;c>=0&&128===(192&a[c]);)c--;return 0>c?b:0===c?b:c+g[a[c]]>b?c:b}},{"./common":22}],24:[function(a,b){"use strict";function c(a,b,c,d){for(var e=65535&a|0,f=a>>>16&65535|0,g=0;0!==c;){g=c>2e3?2e3:c,c-=g;do e=e+b[d++]|0,f=f+e|0;while(--g);e%=65521,f%=65521}return e|f<<16|0}b.exports=c},{}],25:[function(a,b){b.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],26:[function(a,b){"use strict";function c(){for(var a,b=[],c=0;256>c;c++){a=c;for(var d=0;8>d;d++)a=1&a?3988292384^a>>>1:a>>>1;b[c]=a}return b}function d(a,b,c,d){var f=e,g=d+c;a=-1^a;for(var h=d;g>h;h++)a=a>>>8^f[255&(a^b[h])];return-1^a}var e=c();b.exports=d},{}],27:[function(a,b,c){"use strict";function d(a,b){return a.msg=G[b],b}function e(a){return(a<<1)-(a>4?9:0)}function f(a){for(var b=a.length;--b>=0;)a[b]=0}function g(a){var b=a.state,c=b.pending;c>a.avail_out&&(c=a.avail_out),0!==c&&(C.arraySet(a.output,b.pending_buf,b.pending_out,c,a.next_out),a.next_out+=c,b.pending_out+=c,a.total_out+=c,a.avail_out-=c,b.pending-=c,0===b.pending&&(b.pending_out=0))}function h(a,b){D._tr_flush_block(a,a.block_start>=0?a.block_start:-1,a.strstart-a.block_start,b),a.block_start=a.strstart,g(a.strm)}function i(a,b){a.pending_buf[a.pending++]=b}function j(a,b){a.pending_buf[a.pending++]=b>>>8&255,a.pending_buf[a.pending++]=255&b}function k(a,b,c,d){var e=a.avail_in;return e>d&&(e=d),0===e?0:(a.avail_in-=e,C.arraySet(b,a.input,a.next_in,e,c),1===a.state.wrap?a.adler=E(a.adler,b,e,c):2===a.state.wrap&&(a.adler=F(a.adler,b,e,c)),a.next_in+=e,a.total_in+=e,e)}function l(a,b){var c,d,e=a.max_chain_length,f=a.strstart,g=a.prev_length,h=a.nice_match,i=a.strstart>a.w_size-jb?a.strstart-(a.w_size-jb):0,j=a.window,k=a.w_mask,l=a.prev,m=a.strstart+ib,n=j[f+g-1],o=j[f+g];a.prev_length>=a.good_match&&(e>>=2),h>a.lookahead&&(h=a.lookahead);do if(c=b,j[c+g]===o&&j[c+g-1]===n&&j[c]===j[f]&&j[++c]===j[f+1]){f+=2,c++;do;while(j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&j[++f]===j[++c]&&m>f);if(d=ib-(m-f),f=m-ib,d>g){if(a.match_start=b,g=d,d>=h)break;n=j[f+g-1],o=j[f+g]}}while((b=l[b&k])>i&&0!==--e);return g<=a.lookahead?g:a.lookahead}function m(a){var b,c,d,e,f,g=a.w_size;do{if(e=a.window_size-a.lookahead-a.strstart,a.strstart>=g+(g-jb)){C.arraySet(a.window,a.window,g,g,0),a.match_start-=g,a.strstart-=g,a.block_start-=g,c=a.hash_size,b=c;do d=a.head[--b],a.head[b]=d>=g?d-g:0;while(--c);c=g,b=c;do d=a.prev[--b],a.prev[b]=d>=g?d-g:0;while(--c);e+=g}if(0===a.strm.avail_in)break;if(c=k(a.strm,a.window,a.strstart+a.lookahead,e),a.lookahead+=c,a.lookahead+a.insert>=hb)for(f=a.strstart-a.insert,a.ins_h=a.window[f],a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+1])&a.hash_mask;a.insert&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[f+hb-1])&a.hash_mask,a.prev[f&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=f,f++,a.insert--,!(a.lookahead+a.insert<hb)););}while(a.lookahead<jb&&0!==a.strm.avail_in)}function n(a,b){var c=65535;for(c>a.pending_buf_size-5&&(c=a.pending_buf_size-5);;){if(a.lookahead<=1){if(m(a),0===a.lookahead&&b===H)return sb;if(0===a.lookahead)break}a.strstart+=a.lookahead,a.lookahead=0;var d=a.block_start+c;if((0===a.strstart||a.strstart>=d)&&(a.lookahead=a.strstart-d,a.strstart=d,h(a,!1),0===a.strm.avail_out))return sb;if(a.strstart-a.block_start>=a.w_size-jb&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.strstart>a.block_start&&(h(a,!1),0===a.strm.avail_out)?sb:sb}function o(a,b){for(var c,d;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),0!==c&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c)),a.match_length>=hb)if(d=D._tr_tally(a,a.strstart-a.match_start,a.match_length-hb),a.lookahead-=a.match_length,a.match_length<=a.max_lazy_match&&a.lookahead>=hb){a.match_length--;do a.strstart++,a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart;while(0!==--a.match_length);a.strstart++}else a.strstart+=a.match_length,a.match_length=0,a.ins_h=a.window[a.strstart],a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+1])&a.hash_mask;else d=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++;if(d&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function p(a,b){for(var c,d,e;;){if(a.lookahead<jb){if(m(a),a.lookahead<jb&&b===H)return sb;if(0===a.lookahead)break}if(c=0,a.lookahead>=hb&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart),a.prev_length=a.match_length,a.prev_match=a.match_start,a.match_length=hb-1,0!==c&&a.prev_length<a.max_lazy_match&&a.strstart-c<=a.w_size-jb&&(a.match_length=l(a,c),a.match_length<=5&&(a.strategy===S||a.match_length===hb&&a.strstart-a.match_start>4096)&&(a.match_length=hb-1)),a.prev_length>=hb&&a.match_length<=a.prev_length){e=a.strstart+a.lookahead-hb,d=D._tr_tally(a,a.strstart-1-a.prev_match,a.prev_length-hb),a.lookahead-=a.prev_length-1,a.prev_length-=2;do++a.strstart<=e&&(a.ins_h=(a.ins_h<<a.hash_shift^a.window[a.strstart+hb-1])&a.hash_mask,c=a.prev[a.strstart&a.w_mask]=a.head[a.ins_h],a.head[a.ins_h]=a.strstart);while(0!==--a.prev_length);if(a.match_available=0,a.match_length=hb-1,a.strstart++,d&&(h(a,!1),0===a.strm.avail_out))return sb}else if(a.match_available){if(d=D._tr_tally(a,0,a.window[a.strstart-1]),d&&h(a,!1),a.strstart++,a.lookahead--,0===a.strm.avail_out)return sb}else a.match_available=1,a.strstart++,a.lookahead--}return a.match_available&&(d=D._tr_tally(a,0,a.window[a.strstart-1]),a.match_available=0),a.insert=a.strstart<hb-1?a.strstart:hb-1,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function q(a,b){for(var c,d,e,f,g=a.window;;){if(a.lookahead<=ib){if(m(a),a.lookahead<=ib&&b===H)return sb;if(0===a.lookahead)break}if(a.match_length=0,a.lookahead>=hb&&a.strstart>0&&(e=a.strstart-1,d=g[e],d===g[++e]&&d===g[++e]&&d===g[++e])){f=a.strstart+ib;do;while(d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&d===g[++e]&&f>e);a.match_length=ib-(f-e),a.match_length>a.lookahead&&(a.match_length=a.lookahead)}if(a.match_length>=hb?(c=D._tr_tally(a,1,a.match_length-hb),a.lookahead-=a.match_length,a.strstart+=a.match_length,a.match_length=0):(c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++),c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function r(a,b){for(var c;;){if(0===a.lookahead&&(m(a),0===a.lookahead)){if(b===H)return sb;break}if(a.match_length=0,c=D._tr_tally(a,0,a.window[a.strstart]),a.lookahead--,a.strstart++,c&&(h(a,!1),0===a.strm.avail_out))return sb}return a.insert=0,b===K?(h(a,!0),0===a.strm.avail_out?ub:vb):a.last_lit&&(h(a,!1),0===a.strm.avail_out)?sb:tb}function s(a){a.window_size=2*a.w_size,f(a.head),a.max_lazy_match=B[a.level].max_lazy,a.good_match=B[a.level].good_length,a.nice_match=B[a.level].nice_length,a.max_chain_length=B[a.level].max_chain,a.strstart=0,a.block_start=0,a.lookahead=0,a.insert=0,a.match_length=a.prev_length=hb-1,a.match_available=0,a.ins_h=0}function t(){this.strm=null,this.status=0,this.pending_buf=null,this.pending_buf_size=0,this.pending_out=0,this.pending=0,this.wrap=0,this.gzhead=null,this.gzindex=0,this.method=Y,this.last_flush=-1,this.w_size=0,this.w_bits=0,this.w_mask=0,this.window=null,this.window_size=0,this.prev=null,this.head=null,this.ins_h=0,this.hash_size=0,this.hash_bits=0,this.hash_mask=0,this.hash_shift=0,this.block_start=0,this.match_length=0,this.prev_match=0,this.match_available=0,this.strstart=0,this.match_start=0,this.lookahead=0,this.prev_length=0,this.max_chain_length=0,this.max_lazy_match=0,this.level=0,this.strategy=0,this.good_match=0,this.nice_match=0,this.dyn_ltree=new C.Buf16(2*fb),this.dyn_dtree=new C.Buf16(2*(2*db+1)),this.bl_tree=new C.Buf16(2*(2*eb+1)),f(this.dyn_ltree),f(this.dyn_dtree),f(this.bl_tree),this.l_desc=null,this.d_desc=null,this.bl_desc=null,this.bl_count=new C.Buf16(gb+1),this.heap=new C.Buf16(2*cb+1),f(this.heap),this.heap_len=0,this.heap_max=0,this.depth=new C.Buf16(2*cb+1),f(this.depth),this.l_buf=0,this.lit_bufsize=0,this.last_lit=0,this.d_buf=0,this.opt_len=0,this.static_len=0,this.matches=0,this.insert=0,this.bi_buf=0,this.bi_valid=0}function u(a){var b;return a&&a.state?(a.total_in=a.total_out=0,a.data_type=X,b=a.state,b.pending=0,b.pending_out=0,b.wrap<0&&(b.wrap=-b.wrap),b.status=b.wrap?lb:qb,a.adler=2===b.wrap?0:1,b.last_flush=H,D._tr_init(b),M):d(a,O)}function v(a){var b=u(a);return b===M&&s(a.state),b}function w(a,b){return a&&a.state?2!==a.state.wrap?O:(a.state.gzhead=b,M):O}function x(a,b,c,e,f,g){if(!a)return O;var h=1;if(b===R&&(b=6),0>e?(h=0,e=-e):e>15&&(h=2,e-=16),1>f||f>Z||c!==Y||8>e||e>15||0>b||b>9||0>g||g>V)return d(a,O);8===e&&(e=9);var i=new t;return a.state=i,i.strm=a,i.wrap=h,i.gzhead=null,i.w_bits=e,i.w_size=1<<i.w_bits,i.w_mask=i.w_size-1,i.hash_bits=f+7,i.hash_size=1<<i.hash_bits,i.hash_mask=i.hash_size-1,i.hash_shift=~~((i.hash_bits+hb-1)/hb),i.window=new C.Buf8(2*i.w_size),i.head=new C.Buf16(i.hash_size),i.prev=new C.Buf16(i.w_size),i.lit_bufsize=1<<f+6,i.pending_buf_size=4*i.lit_bufsize,i.pending_buf=new C.Buf8(i.pending_buf_size),i.d_buf=i.lit_bufsize>>1,i.l_buf=3*i.lit_bufsize,i.level=b,i.strategy=g,i.method=c,v(a)}function y(a,b){return x(a,b,Y,$,_,W)}function z(a,b){var c,h,k,l;if(!a||!a.state||b>L||0>b)return a?d(a,O):O;if(h=a.state,!a.output||!a.input&&0!==a.avail_in||h.status===rb&&b!==K)return d(a,0===a.avail_out?Q:O);if(h.strm=a,c=h.last_flush,h.last_flush=b,h.status===lb)if(2===h.wrap)a.adler=0,i(h,31),i(h,139),i(h,8),h.gzhead?(i(h,(h.gzhead.text?1:0)+(h.gzhead.hcrc?2:0)+(h.gzhead.extra?4:0)+(h.gzhead.name?8:0)+(h.gzhead.comment?16:0)),i(h,255&h.gzhead.time),i(h,h.gzhead.time>>8&255),i(h,h.gzhead.time>>16&255),i(h,h.gzhead.time>>24&255),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,255&h.gzhead.os),h.gzhead.extra&&h.gzhead.extra.length&&(i(h,255&h.gzhead.extra.length),i(h,h.gzhead.extra.length>>8&255)),h.gzhead.hcrc&&(a.adler=F(a.adler,h.pending_buf,h.pending,0)),h.gzindex=0,h.status=mb):(i(h,0),i(h,0),i(h,0),i(h,0),i(h,0),i(h,9===h.level?2:h.strategy>=T||h.level<2?4:0),i(h,wb),h.status=qb);else{var m=Y+(h.w_bits-8<<4)<<8,n=-1;n=h.strategy>=T||h.level<2?0:h.level<6?1:6===h.level?2:3,m|=n<<6,0!==h.strstart&&(m|=kb),m+=31-m%31,h.status=qb,j(h,m),0!==h.strstart&&(j(h,a.adler>>>16),j(h,65535&a.adler)),a.adler=1}if(h.status===mb)if(h.gzhead.extra){for(k=h.pending;h.gzindex<(65535&h.gzhead.extra.length)&&(h.pending!==h.pending_buf_size||(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending!==h.pending_buf_size));)i(h,255&h.gzhead.extra[h.gzindex]),h.gzindex++;h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),h.gzindex===h.gzhead.extra.length&&(h.gzindex=0,h.status=nb)}else h.status=nb;if(h.status===nb)if(h.gzhead.name){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.name.length?255&h.gzhead.name.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.gzindex=0,h.status=ob)}else h.status=ob;if(h.status===ob)if(h.gzhead.comment){k=h.pending;do{if(h.pending===h.pending_buf_size&&(h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),g(a),k=h.pending,h.pending===h.pending_buf_size)){l=1;break}l=h.gzindex<h.gzhead.comment.length?255&h.gzhead.comment.charCodeAt(h.gzindex++):0,i(h,l)}while(0!==l);h.gzhead.hcrc&&h.pending>k&&(a.adler=F(a.adler,h.pending_buf,h.pending-k,k)),0===l&&(h.status=pb)}else h.status=pb;if(h.status===pb&&(h.gzhead.hcrc?(h.pending+2>h.pending_buf_size&&g(a),h.pending+2<=h.pending_buf_size&&(i(h,255&a.adler),i(h,a.adler>>8&255),a.adler=0,h.status=qb)):h.status=qb),0!==h.pending){if(g(a),0===a.avail_out)return h.last_flush=-1,M}else if(0===a.avail_in&&e(b)<=e(c)&&b!==K)return d(a,Q);if(h.status===rb&&0!==a.avail_in)return d(a,Q);if(0!==a.avail_in||0!==h.lookahead||b!==H&&h.status!==rb){var o=h.strategy===T?r(h,b):h.strategy===U?q(h,b):B[h.level].func(h,b);if((o===ub||o===vb)&&(h.status=rb),o===sb||o===ub)return 0===a.avail_out&&(h.last_flush=-1),M;if(o===tb&&(b===I?D._tr_align(h):b!==L&&(D._tr_stored_block(h,0,0,!1),b===J&&(f(h.head),0===h.lookahead&&(h.strstart=0,h.block_start=0,h.insert=0))),g(a),0===a.avail_out))return h.last_flush=-1,M}return b!==K?M:h.wrap<=0?N:(2===h.wrap?(i(h,255&a.adler),i(h,a.adler>>8&255),i(h,a.adler>>16&255),i(h,a.adler>>24&255),i(h,255&a.total_in),i(h,a.total_in>>8&255),i(h,a.total_in>>16&255),i(h,a.total_in>>24&255)):(j(h,a.adler>>>16),j(h,65535&a.adler)),g(a),h.wrap>0&&(h.wrap=-h.wrap),0!==h.pending?M:N)}function A(a){var b;return a&&a.state?(b=a.state.status,b!==lb&&b!==mb&&b!==nb&&b!==ob&&b!==pb&&b!==qb&&b!==rb?d(a,O):(a.state=null,b===qb?d(a,P):M)):O}var B,C=a("../utils/common"),D=a("./trees"),E=a("./adler32"),F=a("./crc32"),G=a("./messages"),H=0,I=1,J=3,K=4,L=5,M=0,N=1,O=-2,P=-3,Q=-5,R=-1,S=1,T=2,U=3,V=4,W=0,X=2,Y=8,Z=9,$=15,_=8,ab=29,bb=256,cb=bb+1+ab,db=30,eb=19,fb=2*cb+1,gb=15,hb=3,ib=258,jb=ib+hb+1,kb=32,lb=42,mb=69,nb=73,ob=91,pb=103,qb=113,rb=666,sb=1,tb=2,ub=3,vb=4,wb=3,xb=function(a,b,c,d,e){this.good_length=a,this.max_lazy=b,this.nice_length=c,this.max_chain=d,this.func=e};B=[new xb(0,0,0,0,n),new xb(4,4,8,4,o),new xb(4,5,16,8,o),new xb(4,6,32,32,o),new xb(4,4,16,16,p),new xb(8,16,32,32,p),new xb(8,16,128,128,p),new xb(8,32,128,256,p),new xb(32,128,258,1024,p),new xb(32,258,258,4096,p)],c.deflateInit=y,c.deflateInit2=x,c.deflateReset=v,c.deflateResetKeep=u,c.deflateSetHeader=w,c.deflate=z,c.deflateEnd=A,c.deflateInfo="pako deflate (from Nodeca project)"},{"../utils/common":22,"./adler32":24,"./crc32":26,"./messages":32,"./trees":33}],28:[function(a,b){"use strict";function c(){this.text=0,this.time=0,this.xflags=0,this.os=0,this.extra=null,this.extra_len=0,this.name="",this.comment="",this.hcrc=0,this.done=!1}b.exports=c},{}],29:[function(a,b){"use strict";var c=30,d=12;b.exports=function(a,b){var e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C;e=a.state,f=a.next_in,B=a.input,g=f+(a.avail_in-5),h=a.next_out,C=a.output,i=h-(b-a.avail_out),j=h+(a.avail_out-257),k=e.dmax,l=e.wsize,m=e.whave,n=e.wnext,o=e.window,p=e.hold,q=e.bits,r=e.lencode,s=e.distcode,t=(1<<e.lenbits)-1,u=(1<<e.distbits)-1;a:do{15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=r[p&t];b:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,0===w)C[h++]=65535&v;else{if(!(16&w)){if(0===(64&w)){v=r[(65535&v)+(p&(1<<w)-1)];continue b}if(32&w){e.mode=d;break a}a.msg="invalid literal/length code",e.mode=c;break a}x=65535&v,w&=15,w&&(w>q&&(p+=B[f++]<<q,q+=8),x+=p&(1<<w)-1,p>>>=w,q-=w),15>q&&(p+=B[f++]<<q,q+=8,p+=B[f++]<<q,q+=8),v=s[p&u];c:for(;;){if(w=v>>>24,p>>>=w,q-=w,w=v>>>16&255,!(16&w)){if(0===(64&w)){v=s[(65535&v)+(p&(1<<w)-1)];continue c}a.msg="invalid distance code",e.mode=c;break a}if(y=65535&v,w&=15,w>q&&(p+=B[f++]<<q,q+=8,w>q&&(p+=B[f++]<<q,q+=8)),y+=p&(1<<w)-1,y>k){a.msg="invalid distance too far back",e.mode=c;break a}if(p>>>=w,q-=w,w=h-i,y>w){if(w=y-w,w>m&&e.sane){a.msg="invalid distance too far back",e.mode=c;break a}if(z=0,A=o,0===n){if(z+=l-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}else if(w>n){if(z+=l+n-w,w-=n,x>w){x-=w;do C[h++]=o[z++];while(--w);if(z=0,x>n){w=n,x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}}}else if(z+=n-w,x>w){x-=w;do C[h++]=o[z++];while(--w);z=h-y,A=C}for(;x>2;)C[h++]=A[z++],C[h++]=A[z++],C[h++]=A[z++],x-=3;x&&(C[h++]=A[z++],x>1&&(C[h++]=A[z++]))}else{z=h-y;do C[h++]=C[z++],C[h++]=C[z++],C[h++]=C[z++],x-=3;while(x>2);x&&(C[h++]=C[z++],x>1&&(C[h++]=C[z++]))}break}}break}}while(g>f&&j>h);x=q>>3,f-=x,q-=x<<3,p&=(1<<q)-1,a.next_in=f,a.next_out=h,a.avail_in=g>f?5+(g-f):5-(f-g),a.avail_out=j>h?257+(j-h):257-(h-j),e.hold=p,e.bits=q}},{}],30:[function(a,b,c){"use strict";function d(a){return(a>>>24&255)+(a>>>8&65280)+((65280&a)<<8)+((255&a)<<24)}function e(){this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new r.Buf16(320),this.work=new r.Buf16(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}function f(a){var b;return a&&a.state?(b=a.state,a.total_in=a.total_out=b.total=0,a.msg="",b.wrap&&(a.adler=1&b.wrap),b.mode=K,b.last=0,b.havedict=0,b.dmax=32768,b.head=null,b.hold=0,b.bits=0,b.lencode=b.lendyn=new r.Buf32(ob),b.distcode=b.distdyn=new r.Buf32(pb),b.sane=1,b.back=-1,C):F}function g(a){var b;return a&&a.state?(b=a.state,b.wsize=0,b.whave=0,b.wnext=0,f(a)):F}function h(a,b){var c,d;return a&&a.state?(d=a.state,0>b?(c=0,b=-b):(c=(b>>4)+1,48>b&&(b&=15)),b&&(8>b||b>15)?F:(null!==d.window&&d.wbits!==b&&(d.window=null),d.wrap=c,d.wbits=b,g(a))):F}function i(a,b){var c,d;return a?(d=new e,a.state=d,d.window=null,c=h(a,b),c!==C&&(a.state=null),c):F}function j(a){return i(a,rb)}function k(a){if(sb){var b;for(p=new r.Buf32(512),q=new r.Buf32(32),b=0;144>b;)a.lens[b++]=8;for(;256>b;)a.lens[b++]=9;for(;280>b;)a.lens[b++]=7;for(;288>b;)a.lens[b++]=8;for(v(x,a.lens,0,288,p,0,a.work,{bits:9}),b=0;32>b;)a.lens[b++]=5;v(y,a.lens,0,32,q,0,a.work,{bits:5}),sb=!1}a.lencode=p,a.lenbits=9,a.distcode=q,a.distbits=5}function l(a,b,c,d){var e,f=a.state;return null===f.window&&(f.wsize=1<<f.wbits,f.wnext=0,f.whave=0,f.window=new r.Buf8(f.wsize)),d>=f.wsize?(r.arraySet(f.window,b,c-f.wsize,f.wsize,0),f.wnext=0,f.whave=f.wsize):(e=f.wsize-f.wnext,e>d&&(e=d),r.arraySet(f.window,b,c-d,e,f.wnext),d-=e,d?(r.arraySet(f.window,b,c-d,d,0),f.wnext=d,f.whave=f.wsize):(f.wnext+=e,f.wnext===f.wsize&&(f.wnext=0),f.whave<f.wsize&&(f.whave+=e))),0}function m(a,b){var c,e,f,g,h,i,j,m,n,o,p,q,ob,pb,qb,rb,sb,tb,ub,vb,wb,xb,yb,zb,Ab=0,Bb=new r.Buf8(4),Cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!a||!a.state||!a.output||!a.input&&0!==a.avail_in)return F;c=a.state,c.mode===V&&(c.mode=W),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,o=i,p=j,xb=C;a:for(;;)switch(c.mode){case K:if(0===c.wrap){c.mode=W;break}for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(2&c.wrap&&35615===m){c.check=0,Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0),m=0,n=0,c.mode=L;break}if(c.flags=0,c.head&&(c.head.done=!1),!(1&c.wrap)||(((255&m)<<8)+(m>>8))%31){a.msg="incorrect header check",c.mode=lb;break}if((15&m)!==J){a.msg="unknown compression method",c.mode=lb;break}if(m>>>=4,n-=4,wb=(15&m)+8,0===c.wbits)c.wbits=wb;else if(wb>c.wbits){a.msg="invalid window size",c.mode=lb;break}c.dmax=1<<wb,a.adler=c.check=1,c.mode=512&m?T:V,m=0,n=0;break;case L:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.flags=m,(255&c.flags)!==J){a.msg="unknown compression method",c.mode=lb;break}if(57344&c.flags){a.msg="unknown header flags set",c.mode=lb;break}c.head&&(c.head.text=m>>8&1),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=M;case M:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.time=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,Bb[2]=m>>>16&255,Bb[3]=m>>>24&255,c.check=t(c.check,Bb,4,0)),m=0,n=0,c.mode=N;case N:for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.head&&(c.head.xflags=255&m,c.head.os=m>>8),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0,c.mode=O;case O:if(1024&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length=m,c.head&&(c.head.extra_len=m),512&c.flags&&(Bb[0]=255&m,Bb[1]=m>>>8&255,c.check=t(c.check,Bb,2,0)),m=0,n=0}else c.head&&(c.head.extra=null);c.mode=P;case P:if(1024&c.flags&&(q=c.length,q>i&&(q=i),q&&(c.head&&(wb=c.head.extra_len-c.length,c.head.extra||(c.head.extra=new Array(c.head.extra_len)),r.arraySet(c.head.extra,e,g,q,wb)),512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,c.length-=q),c.length))break a;c.length=0,c.mode=Q;case Q:if(2048&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.name+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.name=null);c.length=0,c.mode=R;case R:if(4096&c.flags){if(0===i)break a;q=0;do wb=e[g+q++],c.head&&wb&&c.length<65536&&(c.head.comment+=String.fromCharCode(wb));while(wb&&i>q);if(512&c.flags&&(c.check=t(c.check,e,q,g)),i-=q,g+=q,wb)break a}else c.head&&(c.head.comment=null);c.mode=S;case S:if(512&c.flags){for(;16>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(65535&c.check)){a.msg="header crc mismatch",c.mode=lb;break}m=0,n=0}c.head&&(c.head.hcrc=c.flags>>9&1,c.head.done=!0),a.adler=c.check=0,c.mode=V;break;case T:for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}a.adler=c.check=d(m),m=0,n=0,c.mode=U;case U:if(0===c.havedict)return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,E;a.adler=c.check=1,c.mode=V;case V:if(b===A||b===B)break a;case W:if(c.last){m>>>=7&n,n-=7&n,c.mode=ib;break}for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}switch(c.last=1&m,m>>>=1,n-=1,3&m){case 0:c.mode=X;break;case 1:if(k(c),c.mode=bb,b===B){m>>>=2,n-=2;break a}break;case 2:c.mode=$;break;case 3:a.msg="invalid block type",c.mode=lb}m>>>=2,n-=2;break;case X:for(m>>>=7&n,n-=7&n;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if((65535&m)!==(m>>>16^65535)){a.msg="invalid stored block lengths",c.mode=lb;break}if(c.length=65535&m,m=0,n=0,c.mode=Y,b===B)break a;case Y:c.mode=Z;case Z:if(q=c.length){if(q>i&&(q=i),q>j&&(q=j),0===q)break a;r.arraySet(f,e,g,q,h),i-=q,g+=q,j-=q,h+=q,c.length-=q;break}c.mode=V;break;case $:for(;14>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(c.nlen=(31&m)+257,m>>>=5,n-=5,c.ndist=(31&m)+1,m>>>=5,n-=5,c.ncode=(15&m)+4,m>>>=4,n-=4,c.nlen>286||c.ndist>30){a.msg="too many length or distance symbols",c.mode=lb;break}c.have=0,c.mode=_;case _:for(;c.have<c.ncode;){for(;3>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.lens[Cb[c.have++]]=7&m,m>>>=3,n-=3}for(;c.have<19;)c.lens[Cb[c.have++]]=0;if(c.lencode=c.lendyn,c.lenbits=7,yb={bits:c.lenbits},xb=v(w,c.lens,0,19,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid code lengths set",c.mode=lb;break}c.have=0,c.mode=ab;case ab:for(;c.have<c.nlen+c.ndist;){for(;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(16>sb)m>>>=qb,n-=qb,c.lens[c.have++]=sb;else{if(16===sb){for(zb=qb+2;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m>>>=qb,n-=qb,0===c.have){a.msg="invalid bit length repeat",c.mode=lb;break}wb=c.lens[c.have-1],q=3+(3&m),m>>>=2,n-=2}else if(17===sb){for(zb=qb+3;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=3+(7&m),m>>>=3,n-=3}else{for(zb=qb+7;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=qb,n-=qb,wb=0,q=11+(127&m),m>>>=7,n-=7}if(c.have+q>c.nlen+c.ndist){a.msg="invalid bit length repeat",c.mode=lb;break}for(;q--;)c.lens[c.have++]=wb}}if(c.mode===lb)break;if(0===c.lens[256]){a.msg="invalid code -- missing end-of-block",c.mode=lb;break}if(c.lenbits=9,yb={bits:c.lenbits},xb=v(x,c.lens,0,c.nlen,c.lencode,0,c.work,yb),c.lenbits=yb.bits,xb){a.msg="invalid literal/lengths set",c.mode=lb;break}if(c.distbits=6,c.distcode=c.distdyn,yb={bits:c.distbits},xb=v(y,c.lens,c.nlen,c.ndist,c.distcode,0,c.work,yb),c.distbits=yb.bits,xb){a.msg="invalid distances set",c.mode=lb;break}if(c.mode=bb,b===B)break a;case bb:c.mode=cb;case cb:if(i>=6&&j>=258){a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,u(a,p),h=a.next_out,f=a.output,j=a.avail_out,g=a.next_in,e=a.input,i=a.avail_in,m=c.hold,n=c.bits,c.mode===V&&(c.back=-1);break}for(c.back=0;Ab=c.lencode[m&(1<<c.lenbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(rb&&0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.lencode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,c.length=sb,0===rb){c.mode=hb;break}if(32&rb){c.back=-1,c.mode=V;break}if(64&rb){a.msg="invalid literal/length code",c.mode=lb;break}c.extra=15&rb,c.mode=db;case db:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.length+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}c.was=c.length,c.mode=eb;case eb:for(;Ab=c.distcode[m&(1<<c.distbits)-1],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(0===(240&rb)){for(tb=qb,ub=rb,vb=sb;Ab=c.distcode[vb+((m&(1<<tb+ub)-1)>>tb)],qb=Ab>>>24,rb=Ab>>>16&255,sb=65535&Ab,!(n>=tb+qb);){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}m>>>=tb,n-=tb,c.back+=tb}if(m>>>=qb,n-=qb,c.back+=qb,64&rb){a.msg="invalid distance code",c.mode=lb;break}c.offset=sb,c.extra=15&rb,c.mode=fb;case fb:if(c.extra){for(zb=c.extra;zb>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}c.offset+=m&(1<<c.extra)-1,m>>>=c.extra,n-=c.extra,c.back+=c.extra}if(c.offset>c.dmax){a.msg="invalid distance too far back",c.mode=lb;break}c.mode=gb;case gb:if(0===j)break a;if(q=p-j,c.offset>q){if(q=c.offset-q,q>c.whave&&c.sane){a.msg="invalid distance too far back",c.mode=lb;break}q>c.wnext?(q-=c.wnext,ob=c.wsize-q):ob=c.wnext-q,q>c.length&&(q=c.length),pb=c.window}else pb=f,ob=h-c.offset,q=c.length;q>j&&(q=j),j-=q,c.length-=q;do f[h++]=pb[ob++];while(--q);0===c.length&&(c.mode=cb);break;case hb:if(0===j)break a;f[h++]=c.length,j--,c.mode=cb;break;case ib:if(c.wrap){for(;32>n;){if(0===i)break a;i--,m|=e[g++]<<n,n+=8}if(p-=j,a.total_out+=p,c.total+=p,p&&(a.adler=c.check=c.flags?t(c.check,f,p,h-p):s(c.check,f,p,h-p)),p=j,(c.flags?m:d(m))!==c.check){a.msg="incorrect data check",c.mode=lb;break}m=0,n=0}c.mode=jb;case jb:if(c.wrap&&c.flags){for(;32>n;){if(0===i)break a;i--,m+=e[g++]<<n,n+=8}if(m!==(4294967295&c.total)){a.msg="incorrect length check",c.mode=lb;break}m=0,n=0}c.mode=kb;case kb:xb=D;break a;case lb:xb=G;break a;case mb:return H;case nb:default:return F}return a.next_out=h,a.avail_out=j,a.next_in=g,a.avail_in=i,c.hold=m,c.bits=n,(c.wsize||p!==a.avail_out&&c.mode<lb&&(c.mode<ib||b!==z))&&l(a,a.output,a.next_out,p-a.avail_out)?(c.mode=mb,H):(o-=a.avail_in,p-=a.avail_out,a.total_in+=o,a.total_out+=p,c.total+=p,c.wrap&&p&&(a.adler=c.check=c.flags?t(c.check,f,p,a.next_out-p):s(c.check,f,p,a.next_out-p)),a.data_type=c.bits+(c.last?64:0)+(c.mode===V?128:0)+(c.mode===bb||c.mode===Y?256:0),(0===o&&0===p||b===z)&&xb===C&&(xb=I),xb)}function n(a){if(!a||!a.state)return F;var b=a.state;return b.window&&(b.window=null),a.state=null,C}function o(a,b){var c;return a&&a.state?(c=a.state,0===(2&c.wrap)?F:(c.head=b,b.done=!1,C)):F}var p,q,r=a("../utils/common"),s=a("./adler32"),t=a("./crc32"),u=a("./inffast"),v=a("./inftrees"),w=0,x=1,y=2,z=4,A=5,B=6,C=0,D=1,E=2,F=-2,G=-3,H=-4,I=-5,J=8,K=1,L=2,M=3,N=4,O=5,P=6,Q=7,R=8,S=9,T=10,U=11,V=12,W=13,X=14,Y=15,Z=16,$=17,_=18,ab=19,bb=20,cb=21,db=22,eb=23,fb=24,gb=25,hb=26,ib=27,jb=28,kb=29,lb=30,mb=31,nb=32,ob=852,pb=592,qb=15,rb=qb,sb=!0;c.inflateReset=g,c.inflateReset2=h,c.inflateResetKeep=f,c.inflateInit=j,c.inflateInit2=i,c.inflate=m,c.inflateEnd=n,c.inflateGetHeader=o,c.inflateInfo="pako inflate (from Nodeca project)"},{"../utils/common":22,"./adler32":24,"./crc32":26,"./inffast":29,"./inftrees":31}],31:[function(a,b){"use strict";var c=a("../utils/common"),d=15,e=852,f=592,g=0,h=1,i=2,j=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0],k=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78],l=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0],m=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];
b.exports=function(a,b,n,o,p,q,r,s){var t,u,v,w,x,y,z,A,B,C=s.bits,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=null,O=0,P=new c.Buf16(d+1),Q=new c.Buf16(d+1),R=null,S=0;for(D=0;d>=D;D++)P[D]=0;for(E=0;o>E;E++)P[b[n+E]]++;for(H=C,G=d;G>=1&&0===P[G];G--);if(H>G&&(H=G),0===G)return p[q++]=20971520,p[q++]=20971520,s.bits=1,0;for(F=1;G>F&&0===P[F];F++);for(F>H&&(H=F),K=1,D=1;d>=D;D++)if(K<<=1,K-=P[D],0>K)return-1;if(K>0&&(a===g||1!==G))return-1;for(Q[1]=0,D=1;d>D;D++)Q[D+1]=Q[D]+P[D];for(E=0;o>E;E++)0!==b[n+E]&&(r[Q[b[n+E]]++]=E);switch(a){case g:N=R=r,y=19;break;case h:N=j,O-=257,R=k,S-=257,y=256;break;default:N=l,R=m,y=-1}if(M=0,E=0,D=F,x=q,I=H,J=0,v=-1,L=1<<H,w=L-1,a===h&&L>e||a===i&&L>f)return 1;for(var T=0;;){T++,z=D-J,r[E]<y?(A=0,B=r[E]):r[E]>y?(A=R[S+r[E]],B=N[O+r[E]]):(A=96,B=0),t=1<<D-J,u=1<<I,F=u;do u-=t,p[x+(M>>J)+u]=z<<24|A<<16|B|0;while(0!==u);for(t=1<<D-1;M&t;)t>>=1;if(0!==t?(M&=t-1,M+=t):M=0,E++,0===--P[D]){if(D===G)break;D=b[n+r[E]]}if(D>H&&(M&w)!==v){for(0===J&&(J=H),x+=F,I=D-J,K=1<<I;G>I+J&&(K-=P[I+J],!(0>=K));)I++,K<<=1;if(L+=1<<I,a===h&&L>e||a===i&&L>f)return 1;v=M&w,p[v]=H<<24|I<<16|x-q|0}}return 0!==M&&(p[x+M]=D-J<<24|64<<16|0),s.bits=H,0}},{"../utils/common":22}],32:[function(a,b){"use strict";b.exports={2:"need dictionary",1:"stream end",0:"","-1":"file error","-2":"stream error","-3":"data error","-4":"insufficient memory","-5":"buffer error","-6":"incompatible version"}},{}],33:[function(a,b,c){"use strict";function d(a){for(var b=a.length;--b>=0;)a[b]=0}function e(a){return 256>a?gb[a]:gb[256+(a>>>7)]}function f(a,b){a.pending_buf[a.pending++]=255&b,a.pending_buf[a.pending++]=b>>>8&255}function g(a,b,c){a.bi_valid>V-c?(a.bi_buf|=b<<a.bi_valid&65535,f(a,a.bi_buf),a.bi_buf=b>>V-a.bi_valid,a.bi_valid+=c-V):(a.bi_buf|=b<<a.bi_valid&65535,a.bi_valid+=c)}function h(a,b,c){g(a,c[2*b],c[2*b+1])}function i(a,b){var c=0;do c|=1&a,a>>>=1,c<<=1;while(--b>0);return c>>>1}function j(a){16===a.bi_valid?(f(a,a.bi_buf),a.bi_buf=0,a.bi_valid=0):a.bi_valid>=8&&(a.pending_buf[a.pending++]=255&a.bi_buf,a.bi_buf>>=8,a.bi_valid-=8)}function k(a,b){var c,d,e,f,g,h,i=b.dyn_tree,j=b.max_code,k=b.stat_desc.static_tree,l=b.stat_desc.has_stree,m=b.stat_desc.extra_bits,n=b.stat_desc.extra_base,o=b.stat_desc.max_length,p=0;for(f=0;U>=f;f++)a.bl_count[f]=0;for(i[2*a.heap[a.heap_max]+1]=0,c=a.heap_max+1;T>c;c++)d=a.heap[c],f=i[2*i[2*d+1]+1]+1,f>o&&(f=o,p++),i[2*d+1]=f,d>j||(a.bl_count[f]++,g=0,d>=n&&(g=m[d-n]),h=i[2*d],a.opt_len+=h*(f+g),l&&(a.static_len+=h*(k[2*d+1]+g)));if(0!==p){do{for(f=o-1;0===a.bl_count[f];)f--;a.bl_count[f]--,a.bl_count[f+1]+=2,a.bl_count[o]--,p-=2}while(p>0);for(f=o;0!==f;f--)for(d=a.bl_count[f];0!==d;)e=a.heap[--c],e>j||(i[2*e+1]!==f&&(a.opt_len+=(f-i[2*e+1])*i[2*e],i[2*e+1]=f),d--)}}function l(a,b,c){var d,e,f=new Array(U+1),g=0;for(d=1;U>=d;d++)f[d]=g=g+c[d-1]<<1;for(e=0;b>=e;e++){var h=a[2*e+1];0!==h&&(a[2*e]=i(f[h]++,h))}}function m(){var a,b,c,d,e,f=new Array(U+1);for(c=0,d=0;O-1>d;d++)for(ib[d]=c,a=0;a<1<<_[d];a++)hb[c++]=d;for(hb[c-1]=d,e=0,d=0;16>d;d++)for(jb[d]=e,a=0;a<1<<ab[d];a++)gb[e++]=d;for(e>>=7;R>d;d++)for(jb[d]=e<<7,a=0;a<1<<ab[d]-7;a++)gb[256+e++]=d;for(b=0;U>=b;b++)f[b]=0;for(a=0;143>=a;)eb[2*a+1]=8,a++,f[8]++;for(;255>=a;)eb[2*a+1]=9,a++,f[9]++;for(;279>=a;)eb[2*a+1]=7,a++,f[7]++;for(;287>=a;)eb[2*a+1]=8,a++,f[8]++;for(l(eb,Q+1,f),a=0;R>a;a++)fb[2*a+1]=5,fb[2*a]=i(a,5);kb=new nb(eb,_,P+1,Q,U),lb=new nb(fb,ab,0,R,U),mb=new nb(new Array(0),bb,0,S,W)}function n(a){var b;for(b=0;Q>b;b++)a.dyn_ltree[2*b]=0;for(b=0;R>b;b++)a.dyn_dtree[2*b]=0;for(b=0;S>b;b++)a.bl_tree[2*b]=0;a.dyn_ltree[2*X]=1,a.opt_len=a.static_len=0,a.last_lit=a.matches=0}function o(a){a.bi_valid>8?f(a,a.bi_buf):a.bi_valid>0&&(a.pending_buf[a.pending++]=a.bi_buf),a.bi_buf=0,a.bi_valid=0}function p(a,b,c,d){o(a),d&&(f(a,c),f(a,~c)),E.arraySet(a.pending_buf,a.window,b,c,a.pending),a.pending+=c}function q(a,b,c,d){var e=2*b,f=2*c;return a[e]<a[f]||a[e]===a[f]&&d[b]<=d[c]}function r(a,b,c){for(var d=a.heap[c],e=c<<1;e<=a.heap_len&&(e<a.heap_len&&q(b,a.heap[e+1],a.heap[e],a.depth)&&e++,!q(b,d,a.heap[e],a.depth));)a.heap[c]=a.heap[e],c=e,e<<=1;a.heap[c]=d}function s(a,b,c){var d,f,i,j,k=0;if(0!==a.last_lit)do d=a.pending_buf[a.d_buf+2*k]<<8|a.pending_buf[a.d_buf+2*k+1],f=a.pending_buf[a.l_buf+k],k++,0===d?h(a,f,b):(i=hb[f],h(a,i+P+1,b),j=_[i],0!==j&&(f-=ib[i],g(a,f,j)),d--,i=e(d),h(a,i,c),j=ab[i],0!==j&&(d-=jb[i],g(a,d,j)));while(k<a.last_lit);h(a,X,b)}function t(a,b){var c,d,e,f=b.dyn_tree,g=b.stat_desc.static_tree,h=b.stat_desc.has_stree,i=b.stat_desc.elems,j=-1;for(a.heap_len=0,a.heap_max=T,c=0;i>c;c++)0!==f[2*c]?(a.heap[++a.heap_len]=j=c,a.depth[c]=0):f[2*c+1]=0;for(;a.heap_len<2;)e=a.heap[++a.heap_len]=2>j?++j:0,f[2*e]=1,a.depth[e]=0,a.opt_len--,h&&(a.static_len-=g[2*e+1]);for(b.max_code=j,c=a.heap_len>>1;c>=1;c--)r(a,f,c);e=i;do c=a.heap[1],a.heap[1]=a.heap[a.heap_len--],r(a,f,1),d=a.heap[1],a.heap[--a.heap_max]=c,a.heap[--a.heap_max]=d,f[2*e]=f[2*c]+f[2*d],a.depth[e]=(a.depth[c]>=a.depth[d]?a.depth[c]:a.depth[d])+1,f[2*c+1]=f[2*d+1]=e,a.heap[1]=e++,r(a,f,1);while(a.heap_len>=2);a.heap[--a.heap_max]=a.heap[1],k(a,b),l(f,j,a.bl_count)}function u(a,b,c){var d,e,f=-1,g=b[1],h=0,i=7,j=4;for(0===g&&(i=138,j=3),b[2*(c+1)+1]=65535,d=0;c>=d;d++)e=g,g=b[2*(d+1)+1],++h<i&&e===g||(j>h?a.bl_tree[2*e]+=h:0!==e?(e!==f&&a.bl_tree[2*e]++,a.bl_tree[2*Y]++):10>=h?a.bl_tree[2*Z]++:a.bl_tree[2*$]++,h=0,f=e,0===g?(i=138,j=3):e===g?(i=6,j=3):(i=7,j=4))}function v(a,b,c){var d,e,f=-1,i=b[1],j=0,k=7,l=4;for(0===i&&(k=138,l=3),d=0;c>=d;d++)if(e=i,i=b[2*(d+1)+1],!(++j<k&&e===i)){if(l>j){do h(a,e,a.bl_tree);while(0!==--j)}else 0!==e?(e!==f&&(h(a,e,a.bl_tree),j--),h(a,Y,a.bl_tree),g(a,j-3,2)):10>=j?(h(a,Z,a.bl_tree),g(a,j-3,3)):(h(a,$,a.bl_tree),g(a,j-11,7));j=0,f=e,0===i?(k=138,l=3):e===i?(k=6,l=3):(k=7,l=4)}}function w(a){var b;for(u(a,a.dyn_ltree,a.l_desc.max_code),u(a,a.dyn_dtree,a.d_desc.max_code),t(a,a.bl_desc),b=S-1;b>=3&&0===a.bl_tree[2*cb[b]+1];b--);return a.opt_len+=3*(b+1)+5+5+4,b}function x(a,b,c,d){var e;for(g(a,b-257,5),g(a,c-1,5),g(a,d-4,4),e=0;d>e;e++)g(a,a.bl_tree[2*cb[e]+1],3);v(a,a.dyn_ltree,b-1),v(a,a.dyn_dtree,c-1)}function y(a){var b,c=4093624447;for(b=0;31>=b;b++,c>>>=1)if(1&c&&0!==a.dyn_ltree[2*b])return G;if(0!==a.dyn_ltree[18]||0!==a.dyn_ltree[20]||0!==a.dyn_ltree[26])return H;for(b=32;P>b;b++)if(0!==a.dyn_ltree[2*b])return H;return G}function z(a){pb||(m(),pb=!0),a.l_desc=new ob(a.dyn_ltree,kb),a.d_desc=new ob(a.dyn_dtree,lb),a.bl_desc=new ob(a.bl_tree,mb),a.bi_buf=0,a.bi_valid=0,n(a)}function A(a,b,c,d){g(a,(J<<1)+(d?1:0),3),p(a,b,c,!0)}function B(a){g(a,K<<1,3),h(a,X,eb),j(a)}function C(a,b,c,d){var e,f,h=0;a.level>0?(a.strm.data_type===I&&(a.strm.data_type=y(a)),t(a,a.l_desc),t(a,a.d_desc),h=w(a),e=a.opt_len+3+7>>>3,f=a.static_len+3+7>>>3,e>=f&&(e=f)):e=f=c+5,e>=c+4&&-1!==b?A(a,b,c,d):a.strategy===F||f===e?(g(a,(K<<1)+(d?1:0),3),s(a,eb,fb)):(g(a,(L<<1)+(d?1:0),3),x(a,a.l_desc.max_code+1,a.d_desc.max_code+1,h+1),s(a,a.dyn_ltree,a.dyn_dtree)),n(a),d&&o(a)}function D(a,b,c){return a.pending_buf[a.d_buf+2*a.last_lit]=b>>>8&255,a.pending_buf[a.d_buf+2*a.last_lit+1]=255&b,a.pending_buf[a.l_buf+a.last_lit]=255&c,a.last_lit++,0===b?a.dyn_ltree[2*c]++:(a.matches++,b--,a.dyn_ltree[2*(hb[c]+P+1)]++,a.dyn_dtree[2*e(b)]++),a.last_lit===a.lit_bufsize-1}var E=a("../utils/common"),F=4,G=0,H=1,I=2,J=0,K=1,L=2,M=3,N=258,O=29,P=256,Q=P+1+O,R=30,S=19,T=2*Q+1,U=15,V=16,W=7,X=256,Y=16,Z=17,$=18,_=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0],ab=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13],bb=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7],cb=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15],db=512,eb=new Array(2*(Q+2));d(eb);var fb=new Array(2*R);d(fb);var gb=new Array(db);d(gb);var hb=new Array(N-M+1);d(hb);var ib=new Array(O);d(ib);var jb=new Array(R);d(jb);var kb,lb,mb,nb=function(a,b,c,d,e){this.static_tree=a,this.extra_bits=b,this.extra_base=c,this.elems=d,this.max_length=e,this.has_stree=a&&a.length},ob=function(a,b){this.dyn_tree=a,this.max_code=0,this.stat_desc=b},pb=!1;c._tr_init=z,c._tr_stored_block=A,c._tr_flush_block=C,c._tr_tally=D,c._tr_align=B},{"../utils/common":22}],34:[function(a,b){"use strict";function c(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg="",this.state=null,this.data_type=2,this.adler=0}b.exports=c},{}]},{},[7])(7)});
/*! FileSaver.js
 *  A saveAs() FileSaver implementation.
 *  2014-01-24
 *
 *  By Eli Grey, http://eligrey.com
 *  License: X11/MIT
 *    See LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs
    // IE 10+ (native saveAs)
    || (typeof navigator !== "undefined" &&
    navigator.msSaveOrOpenBlob && navigator.msSaveOrOpenBlob.bind(navigator))
    // Everyone else
    || (function(view) {
    "use strict";
    // IE <10 is explicitly unsupported
    if (typeof navigator !== "undefined" &&
        /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
    // only get URL when necessary in case BlobBuilder.js hasn't overridden it yet
        , get_URL = function() {
            return view.URL || view.webkitURL || view;
        }
        , URL = view.URL || view.webkitURL || view
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = !view.externalHost && "download" in save_link
        , click = function(node) {
            var event = doc.createEvent("MouseEvents");
            event.initMouseEvent(
                "click", true, false, view, 0, 0, 0, 0, 0
                , false, false, false, false, 0, null
            );
            node.dispatchEvent(event);
        }
        , webkit_req_fs = view.webkitRequestFileSystem
        , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
        , throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        , fs_min_size = 0
        , deletion_queue = []
        , process_deletion_queue = function() {
            var i = deletion_queue.length;
            while (i--) {
                var file = deletion_queue[i];
                if (typeof file === "string") { // file is an object URL
                    URL.revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            }
            deletion_queue.length = 0; // clear queue
        }
        , dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , FileSaver = function(blob, name) {
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this
                , type = blob.type
                , blob_changed = false
                , object_url
                , target_view
                , get_object_url = function() {
                    var object_url = get_URL().createObjectURL(blob);
                    deletion_queue.push(object_url);
                    return object_url;
                }
                , dispatch_all = function() {
                    dispatch(filesaver, "writestart progress write writeend".split(" "));
                }
            // on any filesys errors revert to saving with object URLs
                , fs_error = function() {
                    // don't create more object URLs than needed
                    if (blob_changed || !object_url) {
                        object_url = get_object_url(blob);
                    }
                    if (target_view) {
                        target_view.location.href = object_url;
                    } else {
                        window.open(object_url, "_blank");
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                }
                , abortable = function(func) {
                    return function() {
                        if (filesaver.readyState !== filesaver.DONE) {
                            return func.apply(this, arguments);
                        }
                    };
                }
                , create_if_not_found = {create: true, exclusive: false}
                , slice
                ;
            filesaver.readyState = filesaver.INIT;
            if (!name) {
                name = "download";
            }
            if (can_use_save_link) {
                object_url = get_object_url(blob);
                // FF for Android has a nasty garbage collection mechanism
                // that turns all objects that are not pure javascript into 'deadObject'
                // this means `doc` and `save_link` are unusable and need to be recreated
                // `view` is usable though:
                doc = view.document;
                save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a");
                save_link.href = object_url;
                save_link.download = name;
                var event = doc.createEvent("MouseEvents");
                event.initMouseEvent(
                    "click", true, false, view, 0, 0, 0, 0, 0
                    , false, false, false, false, 0, null
                );
                save_link.dispatchEvent(event);
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
                return;
            }
            // Object and web filesystem URLs have a problem saving in Google Chrome when
            // viewed in a tab, so I force save with application/octet-stream
            // http://code.google.com/p/chromium/issues/detail?id=91158
            if (view.chrome && type && type !== force_saveable_type) {
                slice = blob.slice || blob.webkitSlice;
                blob = slice.call(blob, 0, blob.size, force_saveable_type);
                blob_changed = true;
            }
            // Since I can't be sure that the guessed media type will trigger a download
            // in WebKit, I append .download to the filename.
            // https://bugs.webkit.org/show_bug.cgi?id=65440
            if (webkit_req_fs && name !== "download") {
                name += ".download";
            }
            if (type === force_saveable_type || webkit_req_fs) {
                target_view = view;
            }
            if (!req_fs) {
                fs_error();
                return;
            }
            fs_min_size += blob.size;
            req_fs(view.TEMPORARY, fs_min_size, abortable(function(fs) {
                fs.root.getDirectory("saved", create_if_not_found, abortable(function(dir) {
                    var save = function() {
                        dir.getFile(name, create_if_not_found, abortable(function(file) {
                            file.createWriter(abortable(function(writer) {
                                writer.onwriteend = function(event) {
                                    target_view.location.href = file.toURL();
                                    deletion_queue.push(file);
                                    filesaver.readyState = filesaver.DONE;
                                    dispatch(filesaver, "writeend", event);
                                };
                                writer.onerror = function() {
                                    var error = writer.error;
                                    if (error.code !== error.ABORT_ERR) {
                                        fs_error();
                                    }
                                };
                                "writestart progress write abort".split(" ").forEach(function(event) {
                                    writer["on" + event] = filesaver["on" + event];
                                });
                                writer.write(blob);
                                filesaver.abort = function() {
                                    writer.abort();
                                    filesaver.readyState = filesaver.DONE;
                                };
                                filesaver.readyState = filesaver.WRITING;
                            }), fs_error);
                        }), fs_error);
                    };
                    dir.getFile(name, {create: false}, abortable(function(file) {
                        // delete file if it already exists
                        file.remove();
                        save();
                    }), abortable(function(ex) {
                        if (ex.code === ex.NOT_FOUND_ERR) {
                            save();
                        } else {
                            fs_error();
                        }
                    }));
                }), fs_error);
            }), fs_error);
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function(blob, name) {
            return new FileSaver(blob, name);
        }
        ;
    FS_proto.abort = function() {
        var filesaver = this;
        filesaver.readyState = filesaver.DONE;
        dispatch(filesaver, "abort");
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
            FS_proto.onprogress =
                FS_proto.onwrite =
                    FS_proto.onabort =
                        FS_proto.onerror =
                            FS_proto.onwriteend =
                                null;

    view.addEventListener("unload", process_deletion_queue, false);
    saveAs.unload = function() {
        process_deletion_queue();
        view.removeEventListener("unload", process_deletion_queue, false);
    };
    return saveAs;
}(
        typeof self !== "undefined" && self
            || typeof window !== "undefined" && window
            || this.content
    ));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module !== null) {
    module.exports = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd != null)) {
    define([], function() {
        return saveAs;
    });
}
var reports_view_model = new ReportsViewModel();

function ReportsViewModel() {
    //Data
    var self = this;
    self.selected_workstream = ko.observable(1);

    self.forecast_requested = ko.observable(false);

    self.workstreams = ko.observableArray([]);

    self.selected_workstream = ko.observable();

    self.intervals = ko.observableArray([]);

    self.data_type = ko.observableArray([]);

    self.time_series = ko.observableArray([]);

    self.has_data = ko.observable(false);

    self.average_handle_time = ko.observable(0);
    self.grade_of_service = ko.observable(0);
    self.occupancy = ko.observable("0%");

    self.selected_interval = ko.observable();
    self.selected_workstream = ko.observable("");

    self.start_date = ko.observable(moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD'));
    self.end_date = ko.observable(moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD'));

    self.intervals.push({value: 'day',display: 'Day'});
    self.intervals.push({value: 'quarter_hour',display: 'Quarter Hour'});
    self.intervals.push({value: 'hour',display: 'Hour'});
    self.intervals.push({value: 'month',display: 'Month'});

    self.data_type.push({value: "forecast/aggregate", display: "Actual"});
    self.data_type.push({value: "forecast/forecast", display: "Forecast"});

    self.error_modal = {
        error_message: ko.observable(),
        error_code: ko.observable(),
        show: ko.observable(false), /* Set to true to show initially */
        body: ko.observable(),
        header: ko.observable(),
        onClose: function() {}
    };

    self.volumes_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'volume_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Volumes'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    // Dealing with inaccurate rounding with float-point numbers calculation
                    // If result is a whole number don't toFixed(2)
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Volume (s)',
                margin: 10
            }
        }
    });

    self.workload_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'workload_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Workload'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Workload (s)',
                margin: 10
            }
        }
    });

    self.aht_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'aht_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Average Handle Time'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true,
            formatter: function() {
                var points = {};
                var return_string = "";
                $.each(this.points, function(key, val) {
                    points[val.series.name] = {
                        yVal:  val.y
                    };
                    var result =  Math.round(val.y*100)/100;
                    if(result !== Math.round(result)) {
                        result = result.toFixed(2);
                    }
                    return_string += "<p><strong>"+val.series.name+": </strong>" + result + "</p><br />";
                });
                if(Object.size(points) == 2) {
                    var variance_score = Math.round(((points["Actual"].yVal/points["Forecast"].yVal*100) - 100) * 100) /100;
                    points["Variance"] = {
                        yVal: variance_score
                    };
                    if(variance_score !== Math.round(variance_score)) {
                        variance_score = variance_score.toFixed(2);
                    }
                    return_string += "<p><strong>Variance: </strong>" + variance_score + "%</p><br />";
                }

                return return_string;
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: {
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Average Handle Time (s)',
                margin: 10
            }
        }
    });

    self.wait_time_chart = new Highcharts.Chart({
        chart: {
            renderTo: 'wait_time_container',
            defaultSeriesType: 'spline',
            events: {
            }
        },
        title: {
            text: 'Average Queue Time'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            shared: true
        },
        navigator: {
            series: {
                includeInCSVExport: false
            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            }
        },
        yAxis: [{
            //Left Axis
            labels: {
                format: '{value}s',
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Queue Time (s)',
                margin: 10,
                style: {
                    color: Highcharts.getOptions().colors[0]
                }
            }
        },{
            //Right Axis
            labels: {
                format: '{value}s',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            minPadding: 0.2,
            maxPadding: 0.2,
            title: {
                text: 'Grade of Service (%)',
                style: {
                    color: Highcharts.getOptions().colors[1]
                }
            },
            opposite: true
        }]
    });


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
    $.getJSON("workstream/workstream", function(allData) {
        self.selected_workstream(new Workstream(allData.data[0]));
        var mappedWorkstreams = $.map(allData.data, function(val, key) { return new Workstream(val)});
        self.workstreams(mappedWorkstreams);
        self.selected_workstream(self.selected_workstream()[0]);
        self.getData();
    });

    self.addSeries = function() {
        self.time_series.push(new TimeSeries({name: "Forecast", route: "forecast/forecast"}));
        self.time_series.push(new TimeSeries({name: "Actual", route: "forecast/aggregate"}));


        $('.input-datepicker').datepicker({
            format: "yyyy-mm-dd",
            weekStart: 1
        }).on('changeDate', function (ev) {
                $(this).datepicker('hide');
            }
        );

    };

    self.getData = function() {
        var data = {
            workstream_id: self.selected_workstream().id(),
            start_date: self.start_date(),
            end_date: self.end_date(),
            interval: self.selected_interval().value
        };

        $.each(self.time_series(), function(key, val) {
            val.getSeries(data);
        });

        $.getJSON("forecast/report-totals", data, function(allData) {
            self.average_handle_time(Math.round(allData.data.average_handle_time));
            self.grade_of_service(Math.round(allData.data.grade_of_service));
            self.occupancy((allData.data.occupancy !== -1) ? Math.round(allData.data.occupancy) + "%" : "Insufficient Data");
        });

        self.aht_chart.redraw();
        self.volumes_chart.redraw();
        self.workload_chart.redraw();
        self.wait_time_chart.redraw();

    };

    self.downloadAll = function() {
        var zip = new JSZip();
        var aht_csv = self.aht_chart.getCSV();
        var workload_csv = self.workload_chart.getCSV();
        var volume_csv = self.volumes_chart.getCSV();
        var wait_time_csv = self.wait_time_chart.getCSV();

        zip.file("aht.csv", aht_csv);
        zip.file("workload.csv", workload_csv);
        zip.file("volume.csv", volume_csv);
        zip.file("wait_time.csv", wait_time_csv);

        var blob = zip.generate({type:"blob"});
        saveAs(blob, "charts.zip");
    };

    self.addSeries();

}

function Workstream(workstream) {
    this.id = ko.observable(workstream.id);
    this.name = ko.observable(workstream.name);
}

function TimeSeries(data_type) {
    this.workstream_id = ko.observable("");
    this.workstream_name = ko.observable("");
    this.data_type = ko.observable("");

    this.selected_data_type = ko.observable(data_type);

    this.x_axis = ko.observableArray([]);
    this.volumes = ko.observableArray([]);
    this.aht = ko.observableArray([]);
    this.workload = ko.observableArray([]);
    this.wait_time = ko.observableArray([]);
    this.grade_of_service = ko.observableArray([]);

    this.chart_id = ko.observable(Math.random()*200);
}

TimeSeries.prototype.getSeries = function(data) {
    var self = this;
    var aht_series = reports_view_model.aht_chart.get(this.chart_id());
    var volume_series = reports_view_model.volumes_chart.get(this.chart_id());
    var workload_series = reports_view_model.workload_chart.get(this.chart_id());
    var wait_time_series = reports_view_model.wait_time_chart.get(this.chart_id());
    var gos_time_series = reports_view_model.wait_time_chart.get(self.chart_id() + 'gos');

    if(aht_series !== null)
        aht_series.remove(false);

    if(volume_series !== null)
        volume_series.remove(false);

    if(workload_series !== null)
        workload_series.remove(false);

    if(wait_time_series !== null)
        wait_time_series.remove(false);

    if(gos_time_series !== null)
        gos_time_series.remove(false);

    this.x_axis.removeAll();
    this.volumes.removeAll();
    this.aht.removeAll();
    this.workload.removeAll();
    this.wait_time.removeAll();
    this.grade_of_service.removeAll();

    $.getJSON(this.selected_data_type().route, data, function(allData) {
        if(allData['result'] == 0) {

            self.workstream_id = ko.observable(allData.data.workstream.id);
            self.workstream_name = ko.observable(allData.data.workstream.name);

            if(self.selected_data_type().name === 'Actual') {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.volume);
                    self.workload.push(workloadUnit(val.total_handle_time, data.interval));
                    self.wait_time.push((val.volume > 0) ? val.total_wait_time/val.volume : 0);
                    self.aht.push((val.volume > 0) ? val.total_handle_time/val.volume : 0);
                    self.grade_of_service.push((val.volume > 0) ? val.grade_of_service/val.volume*100 : 0);

                });
            } else {
                $.each(allData.data.data, function(key, val) {
                    var point = moment.utc(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000;
                    self.x_axis.push(point);
                    self.volumes.push(val.expected_volume);
                    self.workload.push(workloadUnit(val.expected_workload, data.interval));
                    self.aht.push(val.expected_average_handle_time)
                });
            }

        } else {
            reports_view_model.showErrorModal(allData['result'], allData['message']);
        }

        var workload_chart_data = createSeries(self.x_axis(), self.workload());
        var aht_chart_data = createSeries(self.x_axis(), self.aht());
        var volume_chart_data = createSeries(self.x_axis(), self.volumes());


        reports_view_model.has_data((workload_chart_data.length > 0) ? true : reports_view_model.has_data());

        reports_view_model.workload_chart.addSeries({
            id: self.chart_id(),
            data: workload_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        reports_view_model.aht_chart.addSeries({
            id: self.chart_id(),
            data: aht_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        reports_view_model.volumes_chart.addSeries({
            id: self.chart_id(),
            data: volume_chart_data,
            name: self.selected_data_type().name,
            marker: {
                enabled: false
            }
        });

        if(self.selected_data_type().name == "Actual") {
            var grade_of_service_chart_data = createSeries(self.x_axis(), self.grade_of_service());
            var wait_time_chart_data = createSeries(self.x_axis(), self.wait_time());

            reports_view_model.wait_time_chart.addSeries({
                id: self.chart_id(),
                data: wait_time_chart_data,
                name: "Average Queue Time",
                marker: {
                    enabled: false
                }
            });

            reports_view_model.wait_time_chart.addSeries({
                id: self.chart_id() + 'gos',
                data: grade_of_service_chart_data,
                name: "Grade of Service",
                marker: {
                    enabled: false
                }
            });
        }
    });
};

TimeSeries.prototype.deleteSeries = function() {
    var series = forecasts_view_model.chart.get(this.chart_id());
    if(series !== undefined) {
        series.remove();
    }

    reports_view_model.time_series.remove(this);
    reports_view_model.has_data((reports_view_model.time_series().length == 0) ? false : reports_view_model.time_series());
};

function createSeries(xValues, yValues) {
    var chart_data = [];
    for(var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], Math.round(yValues[i]*100)/100];
    }
    chart_data.sort(function(a,b){return a[0] - b[0];});
    return chart_data;
}

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function workloadUnit(handle_time, interval) {
    if(handle_time > 0) {
        switch(interval) {
            case 'quarter_hour':
                return handle_time / 60 / 15;
            case 'hour':
                return handle_time / 60 / 60;
            case 'day':
                return handle_time / 60 / 60 / 24;
            case 'month':
                return handle_time / 60 / 60 / 30;
        }
    }

    return handle_time;
}


// Activates knockout.js
ko.applyBindings(reports_view_model);


//# sourceMappingURL=reports.js.map
