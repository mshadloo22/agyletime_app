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

/*
 AngularJS v1.2.14
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
 */
(function(D,T,s){'use strict';function F(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.14/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function ub(b){if(null==b||ya(b))return!1;
    var a=b.length;return 1===b.nodeType&&a?!0:E(b)||I(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function r(b,a,c){var d;if(b)if(N(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==r)b.forEach(a,c);else if(ub(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Pb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Qc(b,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             a,c){for(var d=Pb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Qb(b){return function(a,c){b(c,a)}}function Za(){for(var b=ia.length,a;b;){b--;a=ia[b].charCodeAt(0);if(57==a)return ia[b]="A",ia.join("");if(90==a)ia[b]="0";else return ia[b]=String.fromCharCode(a+1),ia.join("")}ia.unshift("0");return ia.join("")}function Rb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function t(b){var a=b.$$hashKey;r(arguments,function(a){a!==b&&r(a,function(a,c){b[c]=a})});Rb(b,a);return b}function Q(b){return parseInt(b,
    10)}function Sb(b,a){return t(new (t(function(){},{prototype:b})),a)}function x(){}function za(b){return b}function $(b){return function(){return b}}function B(b){return"undefined"===typeof b}function v(b){return"undefined"!==typeof b}function X(b){return null!=b&&"object"===typeof b}function E(b){return"string"===typeof b}function vb(b){return"number"===typeof b}function La(b){return"[object Date]"===Aa.call(b)}function I(b){return"[object Array]"===Aa.call(b)}function N(b){return"function"===typeof b}
    function $a(b){return"[object RegExp]"===Aa.call(b)}function ya(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Rc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Sc(b,a,c){var d=[];r(b,function(b,f,g){d.push(a.call(c,b,f,g))});return d}function ab(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Ma(b,a){var c=ab(b,a);0<=c&&b.splice(c,1);return a}function ba(b,a){if(ya(b)||b&&b.$evalAsync&&b.$watch)throw Na("cpws");
        if(a){if(b===a)throw Na("cpi");if(I(b))for(var c=a.length=0;c<b.length;c++)a.push(ba(b[c]));else{c=a.$$hashKey;r(a,function(b,c){delete a[c]});for(var d in b)a[d]=ba(b[d]);Rb(a,c)}}else(a=b)&&(I(b)?a=ba(b,[]):La(b)?a=new Date(b.getTime()):$a(b)?a=RegExp(b.source):X(b)&&(a=ba(b,{})));return a}function Tb(b,a){a=a||{};for(var c in b)!b.hasOwnProperty(c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a}function sa(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;
        var c=typeof b,d;if(c==typeof a&&"object"==c)if(I(b)){if(!I(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!sa(b[d],a[d]))return!1;return!0}}else{if(La(b))return La(a)&&b.getTime()==a.getTime();if($a(b)&&$a(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&a.$watch||ya(b)||ya(a)||I(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!N(b[d])){if(!sa(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!N(a[d]))return!1;
            return!0}return!1}function Ub(){return T.securityPolicy&&T.securityPolicy.isActive||T.querySelector&&!(!T.querySelector("[ng-csp]")&&!T.querySelector("[data-ng-csp]"))}function bb(b,a){var c=2<arguments.length?ta.call(arguments,2):[];return!N(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?a.apply(b,c.concat(ta.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Tc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=
        s:ya(a)?c="$WINDOW":a&&T===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function na(b,a){return"undefined"===typeof b?s:JSON.stringify(b,Tc,a?"  ":null)}function Vb(b){return E(b)?JSON.parse(b):b}function Oa(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=O(""+b),b=!("f"==b||"0"==b||"false"==b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function fa(b){b=z(b).clone();try{b.empty()}catch(a){}var c=z("<div>").append(b).html();try{return 3===b[0].nodeType?O(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,
        function(a,b){return"<"+O(b)})}catch(d){return O(c)}}function Wb(b){try{return decodeURIComponent(b)}catch(a){}}function Xb(b){var a={},c,d;r((b||"").split("&"),function(b){b&&(c=b.split("="),d=Wb(c[0]),v(d)&&(b=v(c[1])?Wb(c[1]):!0,a[d]?I(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}function Yb(b){var a=[];r(b,function(b,d){I(b)?r(b,function(b){a.push(ua(d,!0)+(!0===b?"":"="+ua(b,!0)))}):a.push(ua(d,!0)+(!0===b?"":"="+ua(b,!0)))});return a.length?a.join("&"):""}function wb(b){return ua(b,
        !0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function ua(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Uc(b,a){function c(a){a&&d.push(a)}var d=[b],e,f,g=["ng:app","ng-app","x-ng-app","data-ng-app"],h=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;r(g,function(a){g[a]=!0;c(T.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(r(b.querySelectorAll("."+a),c),r(b.querySelectorAll("."+
        a+"\\:"),c),r(b.querySelectorAll("["+a+"]"),c))});r(d,function(a){if(!e){var b=h.exec(" "+a.className+" ");b?(e=a,f=(b[2]||"").replace(/\s+/g,",")):r(a.attributes,function(b){!e&&g[b.name]&&(e=a,f=b.value)})}});e&&a(e,f?[f]:[])}function Zb(b,a){var c=function(){b=z(b);if(b.injector()){var c=b[0]===T?"document":fa(b);throw Na("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=$b(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",
        function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(D&&!d.test(D.name))return c();D.name=D.name.replace(d,"");Ba.resumeBootstrap=function(b){r(b,function(b){a.push(b)});c()}}function cb(b,a){a=a||"_";return b.replace(Vc,function(b,d){return(d?a:"")+b.toLowerCase()})}function xb(b,a,c){if(!b)throw Na("areq",a||"?",c||"required");return b}function Pa(b,a,c){c&&I(b)&&(b=b[b.length-1]);xb(N(b),a,"not a function, got "+(b&&"object"==typeof b?
        b.constructor.name||"Object":typeof b));return b}function va(b,a){if("hasOwnProperty"===b)throw Na("badname",a);}function ac(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,f=a.length,g=0;g<f;g++)d=a[g],b&&(b=(e=b)[d]);return!c&&N(b)?bb(e,b):b}function yb(b){var a=b[0];b=b[b.length-1];if(a===b)return z(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return z(c)}function Wc(b){var a=F("$injector"),c=F("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||F;return b.module||
        (b.module=function(){var b={};return function(e,f,g){if("hasOwnProperty"===e)throw c("badname","module");f&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!f)throw a("nomod",e);var c=[],d=[],l=b("$injector","invoke"),n={_invokeQueue:c,_runBlocks:d,requires:f,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide",
            "constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};g&&l(g);return n}())}}())}function Qa(b){return b.replace(Xc,function(a,b,d,e){return e?d.toUpperCase():d}).replace(Yc,"Moz$1")}function zb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,k,l,n,q,p,y;if(!d||null!=b)for(;e.length;)for(k=e.shift(),
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            l=0,n=k.length;l<n;l++)for(q=z(k[l]),m?q.triggerHandler("$destroy"):m=!m,p=0,q=(y=q.children()).length;p<q;p++)e.push(Ca(y[p]));return f.apply(this,arguments)}var f=Ca.fn[b],f=f.$original||f;e.$original=f;Ca.fn[b]=e}function R(b){if(b instanceof R)return b;E(b)&&(b=ca(b));if(!(this instanceof R)){if(E(b)&&"<"!=b.charAt(0))throw Ab("nosel");return new R(b)}if(E(b)){var a=T.createElement("div");a.innerHTML="<div>&#160;</div>"+b;a.removeChild(a.firstChild);Bb(this,a.childNodes);z(T.createDocumentFragment()).append(this)}else Bb(this,
        b)}function Cb(b){return b.cloneNode(!0)}function Da(b){bc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Da(b[a])}function cc(b,a,c,d){if(v(d))throw Ab("offargs");var e=ja(b,"events");ja(b,"handle")&&(B(a)?r(e,function(a,c){Db(b,c,a);delete e[c]}):r(a.split(" "),function(a){B(c)?(Db(b,a,e[a]),delete e[a]):Ma(e[a]||[],c)}))}function bc(b,a){var c=b[db],d=Ra[c];d&&(a?delete Ra[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),cc(b)),delete Ra[c],b[db]=s))}function ja(b,a,c){var d=
        b[db],d=Ra[d||-1];if(v(c))d||(b[db]=d=++Zc,d=Ra[d]={}),d[a]=c;else return d&&d[a]}function dc(b,a,c){var d=ja(b,"data"),e=v(c),f=!e&&v(a),g=f&&!X(a);d||g||ja(b,"data",d={});if(e)d[a]=c;else if(f){if(g)return d&&d[a];t(d,a)}else return d}function Eb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function eb(b,a){a&&b.setAttribute&&r(a.split(" "),function(a){b.setAttribute("class",ca((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g,
        " ").replace(" "+ca(a)+" "," ")))})}function fb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");r(a.split(" "),function(a){a=ca(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",ca(c))}}function Bb(b,a){if(a){a=a.nodeName||!v(a.length)||ya(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function ec(b,a){return gb(b,"$"+(a||"ngController")+"Controller")}function gb(b,a,c){b=z(b);9==b[0].nodeType&&(b=b.find("html"));for(a=I(a)?a:[a];b.length;){for(var d=
        0,e=a.length;d<e;d++)if((c=b.data(a[d]))!==s)return c;b=b.parent()}}function fc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Da(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function gc(b,a){var c=hb[a.toLowerCase()];return c&&hc[b.nodeName]&&c}function $c(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||T);if(B(c.defaultPrevented)){var f=c.preventDefault;
        c.preventDefault=function(){c.defaultPrevented=!0;f.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var g=Tb(a[e||c.type]||[]);r(g,function(a){a.call(b,c)});8>=P?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ea(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=b.$$hashKey():c===
        s&&(c=b.$$hashKey=Za()):c=b;return a+":"+c}function Sa(b){r(b,this.put,this)}function ic(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(ad,""),c=c.match(bd),r(c[1].split(cd),function(b){b.replace(dd,function(b,c,d){a.push(d)})})),b.$inject=a):I(b)?(c=b.length-1,Pa(b[c],"fn"),a=b.slice(0,c)):Pa(b,"fn",!0);return a}function $b(b){function a(a){return function(b,c){if(X(b))r(b,Qb(a));else return a(b,c)}}function c(a,b){va(a,"service");if(N(b)||I(b))b=n.instantiate(b);
        if(!b.$get)throw Ta("pget",a);return l[a+h]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,f,h;r(a,function(a){if(!k.get(a)){k.put(a,!0);try{if(E(a))for(c=Ua(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,f=0,h=d.length;f<h;f++){var g=d[f],m=n.get(g[0]);m[g[1]].apply(m,g[2])}else N(a)?b.push(n.invoke(a)):I(a)?b.push(n.invoke(a)):Pa(a,"module")}catch(l){throw I(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&(l=l.message+"\n"+l.stack),
        Ta("modulerr",a,l.stack||l.message||l);}}});return b}function f(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===g)throw Ta("cdep",m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=g,a[d]=b(d)}catch(e){throw a[d]===g&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var f=[],h=ic(a),g,k,m;k=0;for(g=h.length;k<g;k++){m=h[k];if("string"!==typeof m)throw Ta("itkn",m);f.push(e&&e.hasOwnProperty(m)?e[m]:c(m))}a.$inject||(a=a[g]);return a.apply(b,f)}return{invoke:d,instantiate:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           b){var c=function(){},e;c.prototype=(I(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return X(e)||N(e)?e:c},get:c,annotate:ic,has:function(b){return l.hasOwnProperty(b+h)||a.hasOwnProperty(b)}}}var g={},h="Provider",m=[],k=new Sa,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){va(a,"constant");l[a]=b;q[a]=b}),decorator:function(a,b){var c=n.get(a+h),
        d=c.$get;c.$get=function(){var a=p.invoke(d,c);return p.invoke(b,null,{$delegate:a})}}}},n=l.$injector=f(l,function(){throw Ta("unpr",m.join(" <- "));}),q={},p=q.$injector=f(q,function(a){a=n.get(a+h);return p.invoke(a.$get,a)});r(e(b),function(a){p.invoke(a||x)});return p}function ed(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;r(a,function(a){b||"a"!==O(a.nodeName)||(b=a)});return b}function f(){var b=
        c.hash(),d;b?(d=g.getElementById(b))?d.scrollIntoView():(d=e(g.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var g=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(f)});return f}]}function fd(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function gd(b,a,c,d){function e(a){try{a.apply(null,ta.call(arguments,1))}finally{if(y--,0===y)for(;C.length;)try{C.pop()()}catch(b){c.error(b)}}}
        function f(a,b){(function jb(){r(A,function(a){a()});u=b(jb,a)})()}function g(){w=null;H!=h.url()&&(H=h.url(),r(Y,function(a){a(h.url())}))}var h=this,m=a[0],k=b.location,l=b.history,n=b.setTimeout,q=b.clearTimeout,p={};h.isMock=!1;var y=0,C=[];h.$$completeOutstandingRequest=e;h.$$incOutstandingRequestCount=function(){y++};h.notifyWhenNoOutstandingRequests=function(a){r(A,function(a){a()});0===y?a():C.push(a)};var A=[],u;h.addPollFn=function(a){B(u)&&f(100,n);A.push(a);return a};var H=k.href,W=a.find("base"),
            w=null;h.url=function(a,c){k!==b.location&&(k=b.location);l!==b.history&&(l=b.history);if(a){if(H!=a)return H=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),W.attr("href",W.attr("href"))):(w=a,c?k.replace(a):k.href=a),h}else return w||k.href.replace(/%27/g,"'")};var Y=[],S=!1;h.onUrlChange=function(a){if(!S){if(d.history)z(b).on("popstate",g);if(d.hashchange)z(b).on("hashchange",g);else h.addPollFn(g);S=!0}Y.push(a);return a};h.baseHref=function(){var a=W.attr("href");return a?a.replace(/^(https?\:)?\/\/[^\/]*/,
            ""):""};var M={},aa="",U=h.baseHref();h.cookies=function(a,b){var d,e,f,h;if(a)b===s?m.cookie=escape(a)+"=;path="+U+";expires=Thu, 01 Jan 1970 00:00:00 GMT":E(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+U).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==aa)for(aa=m.cookie,d=aa.split("; "),M={},f=0;f<d.length;f++)e=d[f],h=e.indexOf("="),0<h&&(a=unescape(e.substring(0,h)),M[a]===s&&(M[a]=unescape(e.substring(h+
            1))));return M}};h.defer=function(a,b){var c;y++;c=n(function(){delete p[c];e(a)},b||0);p[c]=!0;return c};h.defer.cancel=function(a){return p[a]?(delete p[a],q(a),e(x),!0):!1}}function hd(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new gd(b,d,a,c)}]}function id(){this.$get=function(){function b(b,d){function e(a){a!=n&&(q?q==a&&(q=a.n):q=a,f(a.n,a.p),f(a,n),n=a,n.n=null)}function f(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in a)throw F("$cacheFactory")("iid",b);var g=
        0,h=t({},d,{id:b}),m={},k=d&&d.capacity||Number.MAX_VALUE,l={},n=null,q=null;return a[b]={put:function(a,b){if(k<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!B(b))return a in m||g++,m[a]=b,g>k&&this.remove(q.key),b},get:function(a){if(k<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return m[a]},remove:function(a){if(k<Number.MAX_VALUE){var b=l[a];if(!b)return;b==n&&(n=b.p);b==q&&(q=b.n);f(b.n,b.p);delete l[a]}delete m[a];g--},removeAll:function(){m={};g=0;l={};n=q=null},destroy:function(){l=
        h=m=null;delete a[b]},info:function(){return t({},h,{size:g})}}}var a={};b.info=function(){var b={};r(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function jd(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function jc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w\-_]+)\s+(.*)$/,f=/(([\d\w\-_]+)(?:\:([^;]+))?;?)/,g=/^<\s*(tr|th|td|tbody)(\s+[^>]*)?>/i,h=/^(on[a-z]+|formaction)$/;this.directive=function k(a,e){va(a,"directive");E(a)?
        (xb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];r(c[a],function(c,f){try{var h=b.invoke(c);N(h)?h={compile:$(h)}:!h.compile&&h.link&&(h.compile=$(h.link));h.priority=h.priority||0;h.index=f;h.name=h.name||a;h.require=h.require||h.controller&&h.name;h.restrict=h.restrict||"A";e.push(h)}catch(g){d(g)}});return e}])),c[a].push(e)):r(a,Qb(k));return this};this.aHrefSanitizationWhitelist=function(b){return v(b)?(a.aHrefSanitizationWhitelist(b),
        this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return v(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,n,q,p,y,C,A,u,H,W,w){function Y(a,b,c,d,e){a instanceof z||(a=z(a));r(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=z(b).wrap("<span></span>").parent()[0])});
        var f=M(a,b,a,c,d,e);S(a,"ng-scope");return function(b,c,d){xb(b,"scope");var e=c?Fa.clone.call(a):a;r(d,function(a,b){e.data("$"+b+"Controller",a)});d=0;for(var h=e.length;d<h;d++){var g=e[d].nodeType;1!==g&&9!==g||e.eq(d).data("$scope",b)}c&&c(e,b);f&&f(b,e,e);return e}}function S(a,b){try{a.addClass(b)}catch(c){}}function M(a,b,c,d,e,f){function h(a,c,d,e){var f,k,l,n,p,q,y;f=c.length;var L=Array(f);for(p=0;p<f;p++)L[p]=c[p];y=p=0;for(q=g.length;p<q;y++)k=L[y],c=g[p++],f=g[p++],l=z(k),c?(c.scope?
        (n=a.$new(),l.data("$scope",n)):n=a,(l=c.transclude)||!e&&b?c(f,n,k,d,aa(a,l||b)):c(f,n,k,d,e)):f&&f(a,k.childNodes,s,e)}for(var g=[],k,l,n,p,q=0;q<a.length;q++)k=new Fb,l=U(a[q],[],k,0===q?d:s,e),(f=l.length?Va(l,a[q],k,b,c,null,[],[],f):null)&&f.scope&&S(z(a[q]),"ng-scope"),k=f&&f.terminal||!(n=a[q].childNodes)||!n.length?null:M(n,f?f.transclude:b),g.push(f,k),p=p||f||k,f=null;return p?h:null}function aa(a,b){return function(c,d,e){var f=!1;c||(c=a.$new(),f=c.$$transcluded=!0);d=b(c,d,e);if(f)d.on("$destroy",
        bb(c,c.$destroy));return d}}function U(a,b,c,d,h){var g=c.$attr,k;switch(a.nodeType){case 1:v(b,ka(Ga(a).toLowerCase()),"E",d,h);var l,n,p;k=a.attributes;for(var q=0,y=k&&k.length;q<y;q++){var C=!1,H=!1;l=k[q];if(!P||8<=P||l.specified){n=l.name;p=ka(n);oa.test(p)&&(n=cb(p.substr(6),"-"));var A=p.replace(/(Start|End)$/,"");p===A+"Start"&&(C=n,H=n.substr(0,n.length-5)+"end",n=n.substr(0,n.length-6));p=ka(n.toLowerCase());g[p]=n;c[p]=l=ca(l.value);gc(a,p)&&(c[p]=!0);ga(a,b,l,p);v(b,p,"A",d,h,C,H)}}a=
        a.className;if(E(a)&&""!==a)for(;k=f.exec(a);)p=ka(k[2]),v(b,p,"C",d,h)&&(c[p]=ca(k[3])),a=a.substr(k.index+k[0].length);break;case 3:D(b,a.nodeValue);break;case 8:try{if(k=e.exec(a.nodeValue))p=ka(k[1]),v(b,p,"M",d,h)&&(c[p]=ca(k[2]))}catch(w){}}b.sort(F);return b}function J(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ha("uterdir",b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return z(d)}function ib(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      b,c){return function(d,e,f,h,g){e=J(e[0],b,c);return a(d,e,f,h,g)}}function Va(a,c,d,e,f,h,g,k,p){function q(a,b,c,d){if(a){c&&(a=ib(a,c,d));a.require=G.require;if(M===G||G.$$isolateScope)a=kc(a,{isolateScope:!0});g.push(a)}if(b){c&&(b=ib(b,c,d));b.require=G.require;if(M===G||G.$$isolateScope)b=kc(b,{isolateScope:!0});k.push(b)}}function H(a,b,c){var d,e="data",f=!1;if(E(a)){for(;"^"==(d=a.charAt(0))||"?"==d;)a=a.substr(1),"^"==d&&(e="inheritedData"),f=f||"?"==d;d=null;c&&"data"===e&&(d=c[a]);d=d||
        b[e]("$"+a+"Controller");if(!d&&!f)throw ha("ctreq",a,ga);}else I(a)&&(d=[],r(a,function(a){d.push(H(a,b,c))}));return d}function A(a,e,f,h,p){function q(a,b){var c;2>arguments.length&&(b=a,a=s);Ha&&(c=kb);return p(a,b,c)}var L,w,u,Y,J,U,kb={},v;L=c===f?d:Tb(d,new Fb(z(f),d.$attr));w=L.$$element;if(M){var t=/^\s*([@=&])(\??)\s*(\w*)\s*$/;h=z(f);U=e.$new(!0);aa&&aa===M.$$originalDirective?h.data("$isolateScope",U):h.data("$isolateScopeNoTemplate",U);S(h,"ng-isolate-scope");r(M.scope,function(a,c){var d=
        a.match(t)||[],f=d[3]||c,h="?"==d[2],d=d[1],g,k,p,n;U.$$isolateBindings[c]=d+f;switch(d){case "@":L.$observe(f,function(a){U[c]=a});L.$$observers[f].$$scope=e;L[f]&&(U[c]=b(L[f])(e));break;case "=":if(h&&!L[f])break;k=y(L[f]);n=k.literal?sa:function(a,b){return a===b};p=k.assign||function(){g=U[c]=k(e);throw ha("nonassign",L[f],M.name);};g=U[c]=k(e);U.$watch(function(){var a=k(e);n(a,U[c])||(n(a,g)?p(e,a=U[c]):U[c]=a);return g=a},null,k.literal);break;case "&":k=y(L[f]);U[c]=function(a){return k(e,
        a)};break;default:throw ha("iscp",M.name,c,a);}})}v=p&&q;W&&r(W,function(a){var b={$scope:a===M||a.$$isolateScope?U:e,$element:w,$attrs:L,$transclude:v},c;J=a.controller;"@"==J&&(J=L[a.name]);c=C(J,b);kb[a.name]=c;Ha||w.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});h=0;for(u=g.length;h<u;h++)try{Y=g[h],Y(Y.isolateScope?U:e,w,L,Y.require&&H(Y.require,w,kb),v)}catch(K){n(K,fa(w))}h=e;M&&(M.template||null===M.templateUrl)&&(h=U);a&&a(h,f.childNodes,s,p);for(h=k.length-
        1;0<=h;h--)try{Y=k[h],Y(Y.isolateScope?U:e,w,L,Y.require&&H(Y.require,w,kb),v)}catch(ib){n(ib,fa(w))}}p=p||{};for(var w=-Number.MAX_VALUE,u,W=p.controllerDirectives,M=p.newIsolateScopeDirective,aa=p.templateDirective,v=p.nonTlbTranscludeDirective,Va=!1,Ha=p.hasElementTranscludeDirective,K=d.$$element=z(c),G,ga,t,F=e,oa,D=0,P=a.length;D<P;D++){G=a[D];var Q=G.$$start,V=G.$$end;Q&&(K=J(c,Q,V));t=s;if(w>G.priority)break;if(t=G.scope)u=u||G,G.templateUrl||(R("new/isolated scope",M,G,K),X(t)&&(M=G));ga=
        G.name;!G.templateUrl&&G.controller&&(t=G.controller,W=W||{},R("'"+ga+"' controller",W[ga],G,K),W[ga]=G);if(t=G.transclude)Va=!0,G.$$tlb||(R("transclusion",v,G,K),v=G),"element"==t?(Ha=!0,w=G.priority,t=J(c,Q,V),K=d.$$element=z(T.createComment(" "+ga+": "+d[ga]+" ")),c=K[0],lb(f,z(ta.call(t,0)),c),F=Y(t,e,w,h&&h.name,{nonTlbTranscludeDirective:v})):(t=z(Cb(c)).contents(),K.empty(),F=Y(t,e));if(G.template)if(R("template",aa,G,K),aa=G,t=N(G.template)?G.template(K,d):G.template,t=lc(t),G.replace){h=
        G;t=B(t);c=t[0];if(1!=t.length||1!==c.nodeType)throw ha("tplrt",ga,"");lb(f,K,c);P={$attr:{}};t=U(c,[],P);var Z=a.splice(D+1,a.length-(D+1));M&&jb(t);a=a.concat(t).concat(Z);x(d,P);P=a.length}else K.html(t);if(G.templateUrl)R("template",aa,G,K),aa=G,G.replace&&(h=G),A=O(a.splice(D,a.length-D),K,d,f,F,g,k,{controllerDirectives:W,newIsolateScopeDirective:M,templateDirective:aa,nonTlbTranscludeDirective:v}),P=a.length;else if(G.compile)try{oa=G.compile(K,d,F),N(oa)?q(null,oa,Q,V):oa&&q(oa.pre,oa.post,
        Q,V)}catch($){n($,fa(K))}G.terminal&&(A.terminal=!0,w=Math.max(w,G.priority))}A.scope=u&&!0===u.scope;A.transclude=Va&&F;p.hasElementTranscludeDirective=Ha;return A}function jb(a){for(var b=0,c=a.length;b<c;b++)a[b]=Sb(a[b],{$$isolateScope:!0})}function v(b,e,f,h,g,l,p){if(e===g)return null;g=null;if(c.hasOwnProperty(e)){var q;e=a.get(e+d);for(var y=0,C=e.length;y<C;y++)try{q=e[y],(h===s||h>q.priority)&&-1!=q.restrict.indexOf(f)&&(l&&(q=Sb(q,{$$start:l,$$end:p})),b.push(q),g=q)}catch(H){n(H)}}return g}
        function x(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;r(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});r(b,function(b,f){"class"==f?(S(e,b),a["class"]=(a["class"]?a["class"]+" ":"")+b):"style"==f?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==f.charAt(0)||a.hasOwnProperty(f)||(a[f]=b,d[f]=c[f])})}function B(a){var b;a=ca(a);if(b=g.exec(a)){b=b[1].toLowerCase();a=z("<table>"+a+"</table>");var c=a.children("tbody"),d=
            /(td|th)/.test(b)&&a.find("tr");c.length&&"tbody"!==b&&(a=c);d&&d.length&&(a=d);return a.contents()}return z("<div>"+a+"</div>").contents()}function O(a,b,c,d,e,f,h,g){var k=[],l,n,y=b[0],C=a.shift(),w=t({},C,{templateUrl:null,transclude:null,replace:null,$$originalDirective:C}),A=N(C.templateUrl)?C.templateUrl(b,c):C.templateUrl;b.empty();q.get(H.getTrustedResourceUrl(A),{cache:p}).success(function(p){var q,H;p=lc(p);if(C.replace){p=B(p);q=p[0];if(1!=p.length||1!==q.nodeType)throw ha("tplrt",C.name,
            A);p={$attr:{}};lb(d,b,q);var u=U(q,[],p);X(C.scope)&&jb(u);a=u.concat(a);x(c,p)}else q=y,b.html(p);a.unshift(w);l=Va(a,q,c,e,b,C,f,h,g);r(d,function(a,c){a==q&&(d[c]=b[0])});for(n=M(b[0].childNodes,e);k.length;){p=k.shift();H=k.shift();var W=k.shift(),Y=k.shift(),u=b[0];if(H!==y){var J=H.className;g.hasElementTranscludeDirective&&C.replace||(u=Cb(q));lb(W,z(H),u);S(z(u),J)}H=l.transclude?aa(p,l.transclude):Y;l(n,p,u,d,H)}k=null}).error(function(a,b,c,d){throw ha("tpload",d.url);});return function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   b,c,d,e){k?(k.push(b),k.push(c),k.push(d),k.push(e)):l(n,b,c,d,e)}}function F(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function R(a,b,c,d){if(b)throw ha("multidir",b.name,c.name,a,fa(d));}function D(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:$(function(a,b){var c=b.parent(),e=c.data("$binding")||[];e.push(d);S(c.data("$binding",e),"ng-binding");a.$watch(d,function(a){b[0].nodeValue=a})})})}function Ha(a,b){if("srcdoc"==b)return H.HTML;
            var c=Ga(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return H.RESOURCE_URL}function ga(a,c,d,e){var f=b(d,!0);if(f){if("multiple"===e&&"SELECT"===Ga(a))throw ha("selmulti",fa(a));c.push({priority:100,compile:function(){return{pre:function(c,d,g){d=g.$$observers||(g.$$observers={});if(h.test(e))throw ha("nodomevents");if(f=b(g[e],!0,Ha(a,e)))g[e]=f(c),(d[e]||(d[e]=[])).$$inter=!0,(g.$$observers&&g.$$observers[e].$$scope||c).$watch(f,function(a,b){"class"===e&&a!=
            b?g.$updateClass(a,b):g.$set(e,a)})}}}})}}function lb(a,b,c){var d=b[0],e=b.length,f=d.parentNode,h,g;if(a)for(h=0,g=a.length;h<g;h++)if(a[h]==d){a[h++]=c;g=h+e-1;for(var k=a.length;h<k;h++,g++)g<k?a[h]=a[g]:delete a[h];a.length-=e-1;break}f&&f.replaceChild(c,d);a=T.createDocumentFragment();a.appendChild(d);c[z.expando]=d[z.expando];d=1;for(e=b.length;d<e;d++)f=b[d],z(f).remove(),a.appendChild(f),delete b[d];b[0]=c;b.length=1}function kc(a,b){return t(function(){return a.apply(null,arguments)},a,
            b)}var Fb=function(a,b){this.$$element=a;this.$attr=b||{}};Fb.prototype={$normalize:ka,$addClass:function(a){a&&0<a.length&&W.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&W.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=mc(a,b),d=mc(b,a);0===c.length?W.removeClass(this.$$element,d):0===d.length?W.addClass(this.$$element,c):W.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=gc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=
            d:(d=this.$attr[a])||(this.$attr[a]=d=cb(a,"-"));e=Ga(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=w(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&r(c[a],function(a){try{a(b)}catch(c){n(c)}})},$observe:function(a,b){var c=this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);A.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var Q=b.startSymbol(),V=b.endSymbol(),lc="{{"==Q||"}}"==V?za:
            function(a){return a.replace(/\{\{/g,Q).replace(/}}/g,V)},oa=/^ngAttr[A-Z]/;return Y}]}function ka(b){return Qa(b.replace(kd,""))}function mc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),f=0;a:for(;f<d.length;f++){for(var g=d[f],h=0;h<e.length;h++)if(g==e[h])continue a;c+=(0<c.length?" ":"")+g}return c}function ld(){var b={},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){va(a,"controller");X(a)?t(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,f){var g,h,
        m;E(e)&&(g=e.match(a),h=g[1],m=g[3],e=b.hasOwnProperty(h)?b[h]:ac(f.$scope,h,!0)||ac(d,h,!0),Pa(e,h,!0));g=c.instantiate(e,f);if(m){if(!f||"object"!=typeof f.$scope)throw F("$controller")("noscp",h||e.name,m);f.$scope[m]=g}return g}}]}function md(){this.$get=["$window",function(b){return z(b.document)}]}function nd(){this.$get=["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function nc(b){var a={},c,d,e;if(!b)return a;r(b.split("\n"),function(b){e=b.indexOf(":");c=O(ca(b.substr(0,
        e)));d=ca(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function oc(b){var a=X(b)?b:s;return function(c){a||(a=nc(b));return c?a[O(c)]||null:a}}function pc(b,a,c){if(N(c))return c(b,a);r(c,function(c){b=c(b,a)});return b}function od(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},e=this.defaults={transformResponse:[function(d){E(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=Vb(d)));return d}],transformRequest:[function(a){return X(a)&&
        "[object File]"!==Aa.call(a)?na(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ba(d),put:ba(d),patch:ba(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},f=this.interceptors=[],g=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope","$q","$injector",function(a,b,c,d,n,q){function p(a){function c(a){var b=t({},a,{data:pc(a.data,a.headers,d.transformResponse)});return 200<=a.status&&300>a.status?b:n.reject(b)}var d={method:"get",
        transformRequest:e.transformRequest,transformResponse:e.transformResponse},f=function(a){function b(a){var c;r(a,function(b,d){N(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=t({},a.headers),f,h,c=t({},c.common,c[O(a.method)]);b(c);b(d);a:for(f in c){a=O(f);for(h in d)if(O(h)===a)continue a;d[f]=c[f]}return d}(a);t(d,a);d.headers=f;d.method=Ia(d.method);(a=Gb(d.url)?b.cookies()[d.xsrfCookieName||e.xsrfCookieName]:s)&&(f[d.xsrfHeaderName||e.xsrfHeaderName]=a);var h=[function(a){f=a.headers;
        var b=pc(a.data,oc(f),a.transformRequest);B(a.data)&&r(f,function(a,b){"content-type"===O(b)&&delete f[b]});B(a.withCredentials)&&!B(e.withCredentials)&&(a.withCredentials=e.withCredentials);return y(a,b,f).then(c,c)},s],g=n.when(d);for(r(u,function(a){(a.request||a.requestError)&&h.unshift(a.request,a.requestError);(a.response||a.responseError)&&h.push(a.response,a.responseError)});h.length;){a=h.shift();var k=h.shift(),g=g.then(a,k)}g.success=function(a){g.then(function(b){a(b.data,b.status,b.headers,
        d)});return g};g.error=function(a){g.then(null,function(b){a(b.data,b.status,b.headers,d)});return g};return g}function y(b,c,f){function g(a,b,c){u&&(200<=a&&300>a?u.put(s,[a,b,nc(c)]):u.remove(s));k(b,a,c);d.$$phase||d.$apply()}function k(a,c,d){c=Math.max(c,0);(200<=c&&300>c?q.resolve:q.reject)({data:a,status:c,headers:oc(d),config:b})}function m(){var a=ab(p.pendingRequests,b);-1!==a&&p.pendingRequests.splice(a,1)}var q=n.defer(),y=q.promise,u,r,s=C(b.url,b.params);p.pendingRequests.push(b);y.then(m,
        m);(b.cache||e.cache)&&(!1!==b.cache&&"GET"==b.method)&&(u=X(b.cache)?b.cache:X(e.cache)?e.cache:A);if(u)if(r=u.get(s),v(r)){if(r.then)return r.then(m,m),r;I(r)?k(r[1],r[0],ba(r[2])):k(r,200,{})}else u.put(s,y);B(r)&&a(b.method,s,c,g,f,b.timeout,b.withCredentials,b.responseType);return y}function C(a,b){if(!b)return a;var c=[];Qc(b,function(a,b){null===a||B(a)||(I(a)||(a=[a]),r(a,function(a){X(a)&&(a=na(a));c.push(ua(b)+"="+ua(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}
        var A=c("$http"),u=[];r(f,function(a){u.unshift(E(a)?q.get(a):q.invoke(a))});r(g,function(a,b){var c=E(a)?q.get(a):q.invoke(a);u.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});p.pendingRequests=[];(function(a){r(arguments,function(a){p[a]=function(b,c){return p(t(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){r(arguments,function(a){p[a]=function(b,c,d){return p(t(d||{},{method:a,url:b,data:c}))}})})("post","put");
        p.defaults=e;return p}]}function pd(b){if(8>=P&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!D.XMLHttpRequest))return new D.ActiveXObject("Microsoft.XMLHTTP");if(D.XMLHttpRequest)return new D.XMLHttpRequest;throw F("$httpBackend")("noxhr");}function qd(){this.$get=["$browser","$window","$document",function(b,a,c){return rd(b,pd,b.defer,a.angular.callbacks,c[0])}]}function rd(b,a,c,d,e){function f(a,b){var c=e.createElement("script"),d=function(){c.onreadystatechange=c.onload=c.onerror=null;
        e.body.removeChild(c);b&&b()};c.type="text/javascript";c.src=a;P&&8>=P?c.onreadystatechange=function(){/loaded|complete/.test(c.readyState)&&d()}:c.onload=c.onerror=function(){d()};e.body.appendChild(c);return d}var g=-1;return function(e,m,k,l,n,q,p,y){function C(){u=g;W&&W();w&&w.abort()}function A(a,d,e,f){S&&c.cancel(S);W=w=null;d=0===d?e?200:404:d;a(1223==d?204:d,e,f);b.$$completeOutstandingRequest(x)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==O(e)){var H="_"+(d.counter++).toString(36);
        d[H]=function(a){d[H].data=a};var W=f(m.replace("JSON_CALLBACK","angular.callbacks."+H),function(){d[H].data?A(l,200,d[H].data):A(l,u||-2);d[H]=Ba.noop})}else{var w=a(e);w.open(e,m,!0);r(n,function(a,b){v(a)&&w.setRequestHeader(b,a)});w.onreadystatechange=function(){if(w&&4==w.readyState){var a=null,b=null;u!==g&&(a=w.getAllResponseHeaders(),b="response"in w?w.response:w.responseText);A(l,u||w.status,b,a)}};p&&(w.withCredentials=!0);if(y)try{w.responseType=y}catch(Y){if("json"!==y)throw Y;}w.send(k||
        null)}if(0<q)var S=c(C,q);else q&&q.then&&q.then(C)}}function sd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function f(f,k,l){for(var n,q,p=0,y=[],C=f.length,A=!1,u=[];p<C;)-1!=(n=f.indexOf(b,p))&&-1!=(q=f.indexOf(a,n+g))?(p!=n&&y.push(f.substring(p,n)),y.push(p=c(A=f.substring(n+g,q))),p.exp=A,p=q+h,A=!0):(p!=C&&y.push(f.substring(p)),p=C);(C=y.length)||(y.push(""),
        C=1);if(l&&1<y.length)throw qc("noconcat",f);if(!k||A)return u.length=C,p=function(a){try{for(var b=0,c=C,h;b<c;b++)"function"==typeof(h=y[b])&&(h=h(a),h=l?e.getTrusted(l,h):e.valueOf(h),null===h||B(h)?h="":"string"!=typeof h&&(h=na(h))),u[b]=h;return u.join("")}catch(g){a=qc("interr",f,g.toString()),d(a)}},p.exp=f,p.parts=y,p}var g=b.length,h=a.length;f.startSymbol=function(){return b};f.endSymbol=function(){return a};return f}]}function td(){this.$get=["$rootScope","$window","$q",function(b,a,c){function d(d,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          g,h,m){var k=a.setInterval,l=a.clearInterval,n=c.defer(),q=n.promise,p=0,y=v(m)&&!m;h=v(h)?h:0;q.then(null,null,d);q.$$intervalId=k(function(){n.notify(p++);0<h&&p>=h&&(n.resolve(p),l(q.$$intervalId),delete e[q.$$intervalId]);y||b.$apply()},g);e[q.$$intervalId]=n;return q}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function ud(){this.$get=function(){return{id:"en-us",NUMBER_FORMATS:{DECIMAL_SEP:".",
        GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
        SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function rc(b){b=b.split("/");for(var a=b.length;a--;)b[a]=wb(b[a]);return b.join("/")}function sc(b,a,c){b=wa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=Q(b.port)||vd[b.protocol]||null}
    function tc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=wa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=Xb(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function la(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function Wa(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Hb(b){return b.substr(0,Wa(b).lastIndexOf("/")+1)}function uc(b,a){this.$$html5=!0;a=a||
        "";var c=Hb(b);sc(b,this,b);this.$$parse=function(a){var e=la(c,a);if(!E(e))throw Ib("ipthprfx",a,c);tc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Yb(this.$$search),b=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=rc(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=la(b,d))!==s)return d=e,(e=la(a,e))!==s?c+(la("/",e)||e):b+d;if((e=la(c,d))!==s)return c+e;if(c==d+"/")return c}}function Jb(b,a){var c=
        Hb(b);sc(b,this,b);this.$$parse=function(d){var e=la(b,d)||la(c,d),e="#"==e.charAt(0)?la(a,e):this.$$html5?e:"";if(!E(e))throw Ib("ihshprfx",d,a);tc(e,this,b);d=this.$$path;var f=/^\/?.*?:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));f.exec(e)||(d=(e=f.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Yb(this.$$search),e=this.$$hash?"#"+wb(this.$$hash):"";this.$$url=rc(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if(Wa(b)==
        Wa(a))return a}}function vc(b,a){this.$$html5=!0;Jb.apply(this,arguments);var c=Hb(b);this.$$rewrite=function(d){var e;if(b==Wa(d))return d;if(e=la(c,d))return b+a+e;if(c===d+"/")return c}}function mb(b){return function(){return this[b]}}function wc(b,a){return function(c){if(B(c))return this[b];this[b]=a(c);this.$$compose();return this}}function wd(){var b="",a=!1;this.hashPrefix=function(a){return v(a)?(b=a,this):b};this.html5Mode=function(b){return v(b)?(a=b,this):a};this.$get=["$rootScope","$browser",
        "$sniffer","$rootElement",function(c,d,e,f){function g(a){c.$broadcast("$locationChangeSuccess",h.absUrl(),a)}var h,m=d.baseHref(),k=d.url();a?(m=k.substring(0,k.indexOf("/",k.indexOf("//")+2))+(m||"/"),e=e.history?uc:vc):(m=Wa(k),e=Jb);h=new e(m,"#"+b);h.$$parse(h.$$rewrite(k));f.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var b=z(a.target);"a"!==O(b[0].nodeName);)if(b[0]===f[0]||!(b=b.parent())[0])return;var e=b.prop("href");X(e)&&"[object SVGAnimatedString]"===e.toString()&&
        (e=wa(e.animVal).href);var g=h.$$rewrite(e);e&&(!b.attr("target")&&g&&!a.isDefaultPrevented())&&(a.preventDefault(),g!=d.url()&&(h.$$parse(g),c.$apply(),D.angular["ff-684208-preventDefault"]=!0))}});h.absUrl()!=k&&d.url(h.absUrl(),!0);d.onUrlChange(function(a){h.absUrl()!=a&&(c.$evalAsync(function(){var b=h.absUrl();h.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(h.$$parse(b),d.url(b)):g(b)}),c.$$phase||c.$digest())});var l=0;c.$watch(function(){var a=d.url(),b=h.$$replace;
            l&&a==h.absUrl()||(l++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",h.absUrl(),a).defaultPrevented?h.$$parse(a):(d.url(h.absUrl(),b),g(a))}));h.$$replace=!1;return l});return h}]}function xd(){var b=!0,a=this;this.debugEnabled=function(a){return v(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}
        function e(a){var b=c.console||{},e=b[a]||b.log||x;a=!1;try{a=!!e.apply}catch(m){}return a?function(){var a=[];r(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function da(b,a){if("constructor"===b)throw xa("isecfld",a);return b}function Xa(b,a){if(b){if(b.constructor===b)throw xa("isecfn",a);if(b.document&&
        b.location&&b.alert&&b.setInterval)throw xa("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&b.attr&&b.find))throw xa("isecdom",a);}return b}function nb(b,a,c,d,e){e=e||{};a=a.split(".");for(var f,g=0;1<a.length;g++){f=da(a.shift(),d);var h=b[f];h||(h={},b[f]=h);b=h;b.then&&e.unwrapPromises&&(pa(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}f=da(a.shift(),d);return b[f]=c}function xc(b,a,c,d,e,f,g){da(b,f);da(a,f);da(c,f);da(d,f);da(e,f);return g.unwrapPromises?
        function(h,g){var k=g&&g.hasOwnProperty(b)?g:h,l;if(null==k)return k;(k=k[b])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!a)return k;if(null==k)return s;(k=k[a])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!c)return k;if(null==k)return s;(k=k[c])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);if(!d)return k;if(null==k)return s;(k=k[d])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=
            a})),k=k.$$v);if(!e)return k;if(null==k)return s;(k=k[e])&&k.then&&(pa(f),"$$v"in k||(l=k,l.$$v=s,l.then(function(a){l.$$v=a})),k=k.$$v);return k}:function(f,g){var k=g&&g.hasOwnProperty(b)?g:f;if(null==k)return k;k=k[b];if(!a)return k;if(null==k)return s;k=k[a];if(!c)return k;if(null==k)return s;k=k[c];if(!d)return k;if(null==k)return s;k=k[d];return e?null==k?s:k=k[e]:k}}function yd(b,a){da(b,a);return function(a,d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function zd(b,a,c){da(b,c);da(a,
        c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==c?s:c[a]}}function yc(b,a,c){if(Kb.hasOwnProperty(b))return Kb[b];var d=b.split("."),e=d.length,f;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)f=6>e?xc(d[0],d[1],d[2],d[3],d[4],c,a):function(b,f){var h=0,g;do g=xc(d[h++],d[h++],d[h++],d[h++],d[h++],c,a)(b,f),f=s,b=g;while(h<e);return g};else{var g="var p;\n";r(d,function(b,d){da(b,c);g+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+
        b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var g=g+"return s;",h=new Function("s","k","pw",g);h.toString=$(g);f=a.unwrapPromises?function(a,b){return h(a,b,pa)}:h}else f=zd(d[0],d[1],c);else f=yd(d[0],c);"hasOwnProperty"!==b&&(Kb[b]=f);return f}function Ad(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=
        function(b){return v(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};this.logPromiseWarnings=function(b){return v(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;pa=function(b){a.logPromiseWarnings&&!zc.hasOwnProperty(b)&&(zc[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];
        e=new Lb(a);e=(new Ya(e,c,a)).parse(d,!1);"hasOwnProperty"!==d&&(b[d]=e);return e;case "function":return d;default:return x}}}]}function Bd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Cd(function(a){b.$evalAsync(a)},a)}]}function Cd(b,a){function c(a){return a}function d(a){return g(a)}var e=function(){var g=[],k,l;return l={resolve:function(a){if(g){var c=g;g=s;k=f(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],k.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(h(a))},
        notify:function(a){if(g){var c=g;g.length&&b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,f,h){var l=e(),C=function(d){try{l.resolve((N(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},A=function(b){try{l.resolve((N(f)?f:d)(b))}catch(c){l.reject(c),a(c)}},u=function(b){try{l.notify((N(h)?h:c)(b))}catch(d){a(d)}};g?g.push([C,A,u]):k.then(C,A,u);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):
            d.reject(a);return d.promise}function d(e,f){var h=null;try{h=(a||c)()}catch(g){return b(g,!1)}return h&&N(h.then)?h.then(function(){return b(e,f)},function(a){return b(a,!1)}):b(e,f)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},f=function(a){return a&&N(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},g=function(a){var b=e();b.reject(a);return b.promise},h=function(c){return{then:function(f,h){var g=e();b(function(){try{g.resolve((N(h)?
        h:d)(c))}catch(b){g.reject(b),a(b)}});return g.promise}}};return{defer:e,reject:g,when:function(h,k,l,n){var q=e(),p,y=function(b){try{return(N(k)?k:c)(b)}catch(d){return a(d),g(d)}},C=function(b){try{return(N(l)?l:d)(b)}catch(c){return a(c),g(c)}},A=function(b){try{return(N(n)?n:c)(b)}catch(d){a(d)}};b(function(){f(h).then(function(a){p||(p=!0,q.resolve(f(a).then(y,C,A)))},function(a){p||(p=!0,q.resolve(C(a)))},function(a){p||q.notify(A(a))})});return q.promise},all:function(a){var b=e(),c=0,d=I(a)?
        []:{};r(a,function(a,e){c++;f(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function Dd(){this.$get=["$window",function(b){var a=b.requestAnimationFrame||b.webkitRequestAnimationFrame,c=b.cancelAnimationFrame||b.webkitCancelAnimationFrame;b=function(b){var e=a(b);return function(){c(e)}};b.supported=!!a;return b}]}function Ed(){var b=10,a=F("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&
    (b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,f,g){function h(){this.$id=Za();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(q.$$phase)throw a("inprog",q.$$phase);q.$$phase=b}function k(a,b){var c=f(a);
        Pa(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}h.prototype={constructor:h,$new:function(a){a?(a=new h,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(a=function(){},a.prototype=this,a=new a,a.$id=Za());a["this"]=a;a.$$listeners={};a.$$listenerCount={};a.$parent=this;a.$$watchers=a.$$nextSibling=a.$$childHead=a.$$childTail=null;a.$$prevSibling=this.$$childTail;
        this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=k(a,"watch"),f=this.$$watchers,h={fn:b,last:n,get:e,exp:a,eq:!!d};c=null;if(!N(b)){var g=k(b||x,"listener");h.fn=function(a,b,c){g(c)}}if("string"==typeof a&&e.constant){var l=h.fn;h.fn=function(a,b,c){l.call(this,a,b,c);Ma(f,h)}}f||(f=this.$$watchers=[]);f.unshift(h);return function(){Ma(f,h);c=null}},$watchCollection:function(a,b){var c=this,d,e,h=0,g=f(a),
        k=[],l={},m=0;return this.$watch(function(){e=g(c);var a,b;if(X(e))if(ub(e))for(d!==k&&(d=k,m=d.length=0,h++),a=e.length,m!==a&&(h++,d.length=m=a),b=0;b<a;b++)d[b]!==e[b]&&(h++,d[b]=e[b]);else{d!==l&&(d=l={},m=0,h++);a=0;for(b in e)e.hasOwnProperty(b)&&(a++,d.hasOwnProperty(b)?d[b]!==e[b]&&(h++,d[b]=e[b]):(m++,d[b]=e[b],h++));if(m>a)for(b in h++,d)d.hasOwnProperty(b)&&!e.hasOwnProperty(b)&&(m--,delete d[b])}else d!==e&&(d=e,h++);return h},function(){b(e,d,c)})},$digest:function(){var d,f,h,g,k=this.$$asyncQueue,
        l=this.$$postDigestQueue,r,w,s=b,S,M=[],v,t,J;m("$digest");c=null;do{w=!1;for(S=this;k.length;){try{J=k.shift(),J.scope.$eval(J.expression)}catch(z){q.$$phase=null,e(z)}c=null}a:do{if(g=S.$$watchers)for(r=g.length;r--;)try{if(d=g[r])if((f=d.get(S))!==(h=d.last)&&!(d.eq?sa(f,h):"number"==typeof f&&"number"==typeof h&&isNaN(f)&&isNaN(h)))w=!0,c=d,d.last=d.eq?ba(f):f,d.fn(f,h===n?f:h,S),5>s&&(v=4-s,M[v]||(M[v]=[]),t=N(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,t+="; newVal: "+na(f)+"; oldVal: "+
        na(h),M[v].push(t));else if(d===c){w=!1;break a}}catch(E){q.$$phase=null,e(E)}if(!(g=S.$$childHead||S!==this&&S.$$nextSibling))for(;S!==this&&!(g=S.$$nextSibling);)S=S.$parent}while(S=g);if((w||k.length)&&!s--)throw q.$$phase=null,a("infdig",b,na(M));}while(w||k.length);for(q.$$phase=null;l.length;)try{l.shift()()}catch(x){e(x)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==q&&(r(this.$$listenerCount,bb(null,l,this)),a.$$childHead==
        this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null)}},$eval:function(a,b){return f(a)(this,b)},$evalAsync:function(a){q.$$phase||q.$$asyncQueue.length||g.defer(function(){q.$$asyncQueue.length&&q.$digest()});this.$$asyncQueue.push({scope:this,
        expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{q.$$phase=null;try{q.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[ab(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,f=this,h=!1,g={name:a,
        targetScope:f,stopPropagation:function(){h=!0},preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},k=[g].concat(ta.call(arguments,1)),l,m;do{d=f.$$listeners[a]||c;g.currentScope=f;l=0;for(m=d.length;l<m;l++)if(d[l])try{d[l].apply(null,k)}catch(q){e(q)}else d.splice(l,1),l--,m--;if(h)break;f=f.$parent}while(f);return g},$broadcast:function(a,b){for(var c=this,d=this,f={name:a,targetScope:this,preventDefault:function(){f.defaultPrevented=!0},defaultPrevented:!1},h=[f].concat(ta.call(arguments,
        1)),g,k;c=d;){f.currentScope=c;d=c.$$listeners[a]||[];g=0;for(k=d.length;g<k;g++)if(d[g])try{d[g].apply(null,h)}catch(l){e(l)}else d.splice(g,1),g--,k--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return f}};var q=new h;return q}]}function Fd(){var b=/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return v(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=
        function(b){return v(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,f;if(!P||8<=P)if(f=wa(c).href,""!==f&&!f.match(e))return"unsafe:"+f;return c}}}function Gd(b){if("self"===b)return b;if(E(b)){if(-1<b.indexOf("***"))throw qa("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if($a(b))return RegExp("^"+b.source+"$");throw qa("imatcher");}function Ac(b){var a=[];
        v(b)&&r(b,function(b){a.push(Gd(b))});return a}function Hd(){this.SCE_CONTEXTS=ea;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Ac(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Ac(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};
        return b}var e=function(a){throw qa("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var f=d(),g={};g[ea.HTML]=d(f);g[ea.CSS]=d(f);g[ea.URL]=d(f);g[ea.JS]=d(f);g[ea.RESOURCE_URL]=d(g[ea.URL]);return{trustAs:function(a,b){var c=g.hasOwnProperty(a)?g[a]:null;if(!c)throw qa("icontext",a,b);if(null===b||b===s||""===b)return b;if("string"!==typeof b)throw qa("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var f=g.hasOwnProperty(c)?g[c]:null;if(f&&d instanceof
        f)return d.$$unwrapTrustedValue();if(c===ea.RESOURCE_URL){var f=wa(d.toString()),l,n,q=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Gb(f):b[l].exec(f.href)){q=!0;break}if(q)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Gb(f):a[l].exec(f.href)){q=!1;break}if(q)return d;throw qa("insecurl",d.toString());}if(c===ea.HTML)return e(d);throw qa("unsafe");},valueOf:function(a){return a instanceof f?a.$$unwrapTrustedValue():a}}}]}function Id(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};
        this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw qa("iequirks");var e=ba(ea);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=za);e.parseAs=function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var f=e.parseAs,g=e.getTrusted,h=e.trustAs;r(ea,function(a,b){var c=O(b);e[Qa("parse_as_"+c)]=
            function(b){return f(a,b)};e[Qa("get_trusted_"+c)]=function(b){return g(a,b)};e[Qa("trust_as_"+c)]=function(b){return h(a,b)}});return e}]}function Jd(){this.$get=["$window","$document",function(b,a){var c={},d=Q((/android (\d+)/.exec(O((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||{}).userAgent),f=a[0]||{},g=f.documentMode,h,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,k=f.body&&f.body.style,l=!1,n=!1;if(k){for(var q in k)if(l=m.exec(q)){h=l[0];h=h.substr(0,1).toUpperCase()+h.substr(1);
        break}h||(h="WebkitOpacity"in k&&"webkit");l=!!("transition"in k||h+"Transition"in k);n=!!("animation"in k||h+"Animation"in k);!d||l&&n||(l=E(f.body.style.webkitTransition),n=E(f.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!g||7<g),hasEvent:function(a){if("input"==a&&9==P)return!1;if(B(c[a])){var b=f.createElement("div");c[a]="on"+a in b}return c[a]},csp:Ub(),vendorPrefix:h,transitions:l,animations:n,android:d,msie:P,msieDocumentMode:g}}]}
    function Kd(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,h,m){var k=c.defer(),l=k.promise,n=v(m)&&!m;h=a.defer(function(){try{k.resolve(e())}catch(a){k.reject(a),d(a)}finally{delete f[l.$$timeoutId]}n||b.$apply()},h);l.$$timeoutId=h;f[h]=k;return l}var f={};e.cancel=function(b){return b&&b.$$timeoutId in f?(f[b.$$timeoutId].reject("canceled"),delete f[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function wa(b,a){var c=b;P&&(V.setAttribute("href",
        c),c=V.href);V.setAttribute("href",c);return{href:V.href,protocol:V.protocol?V.protocol.replace(/:$/,""):"",host:V.host,search:V.search?V.search.replace(/^\?/,""):"",hash:V.hash?V.hash.replace(/^#/,""):"",hostname:V.hostname,port:V.port,pathname:"/"===V.pathname.charAt(0)?V.pathname:"/"+V.pathname}}function Gb(b){b=E(b)?wa(b):b;return b.protocol===Bc.protocol&&b.host===Bc.host}function Ld(){this.$get=$(D)}function Cc(b){function a(d,e){if(X(d)){var f={};r(d,function(b,c){f[c]=a(c,b)});return f}return b.factory(d+
        c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Dc);a("date",Ec);a("filter",Md);a("json",Nd);a("limitTo",Od);a("lowercase",Pd);a("number",Fc);a("orderBy",Gc);a("uppercase",Qd)}function Md(){return function(b,a,c){if(!I(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Ba.equals(a,b)}:function(a,b){if(a&&b&&
        "object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&Rd.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var f=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!f(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&f(a[d],b))return!0}return!1;case "array":for(d=0;d<
        a.length;d++)if(f(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var g in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return f("$"==b?c:c&&c[b],a[b])})})(g);break;case "function":e.push(a);break;default:return b}d=[];for(g=0;g<b.length;g++){var h=b[g];e.check(h)&&d.push(h)}return d}}function Dc(b){var a=b.NUMBER_FORMATS;return function(b,d){B(d)&&(d=a.CURRENCY_SYM);return Hc(b,a.PATTERNS[1],a.GROUP_SEP,
        a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Fc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Hc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Hc(b,a,c,d,e){if(null==b||!isFinite(b)||X(b))return"";var f=0>b;b=Math.abs(b);var g=b+"",h="",m=[],k=!1;if(-1!==g.indexOf("e")){var l=g.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&l[3]>e+1?g="0":(h=g,k=!0)}if(k)0<e&&(-1<b&&1>b)&&(h=b.toFixed(e));else{g=(g.split(Ic)[1]||"").length;B(e)&&(e=Math.min(Math.max(a.minFrac,g),a.maxFrac));g=Math.pow(10,
        e);b=Math.round(b*g)/g;b=(""+b).split(Ic);g=b[0];b=b[1]||"";var l=0,n=a.lgSize,q=a.gSize;if(g.length>=n+q)for(l=g.length-n,k=0;k<l;k++)0===(l-k)%q&&0!==k&&(h+=c),h+=g.charAt(k);for(k=l;k<g.length;k++)0===(g.length-k)%n&&0!==k&&(h+=c),h+=g.charAt(k);for(;b.length<e;)b+="0";e&&"0"!==e&&(h+=d+b.substr(0,e))}m.push(f?a.negPre:a.posPre);m.push(h);m.push(f?a.negSuf:a.posSuf);return m.join("")}function Mb(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+
        b}function Z(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Mb(e,a,d)}}function ob(b,a){return function(c,d){var e=c["get"+b](),f=Ia(a?"SHORT"+b:b);return d[f][e]}}function Ec(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var f=0,g=0,h=b[8]?a.setUTCFullYear:a.setFullYear,m=b[8]?a.setUTCHours:a.setHours;b[9]&&(f=Q(b[9]+b[10]),g=Q(b[9]+b[11]));h.call(a,Q(b[1]),Q(b[2])-1,Q(b[3]));f=Q(b[4]||0)-f;g=Q(b[5]||0)-g;h=Q(b[6]||0);b=Math.round(1E3*parseFloat("0."+
        (b[7]||0)));m.call(a,f,g,h,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var f="",g=[],h,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;E(c)&&(c=Sd.test(c)?Q(c):a(c));vb(c)&&(c=new Date(c));if(!La(c))return c;for(;e;)(m=Td.exec(e))?(g=g.concat(ta.call(m,1)),e=g.pop()):(g.push(e),e=null);r(g,function(a){h=Ud[a];f+=h?h(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return f}}function Nd(){return function(b){return na(b,
        !0)}}function Od(){return function(b,a){if(!I(b)&&!E(b))return b;a=Q(a);if(E(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);return c}}function Gc(b){return function(a,c,d){function e(a,b){return Oa(b)?function(b,c){return a(c,b)}:a}if(!I(a)||!c)return a;c=I(c)?c:[c];c=Sc(c,function(a){var c=!1,d=a||za;if(E(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),
        a=a.substring(1);d=b(a)}return e(function(a,b){var c;c=d(a);var e=d(b),f=typeof c,h=typeof e;f==h?("string"==f&&(c=c.toLowerCase(),e=e.toLowerCase()),c=c===e?0:c<e?-1:1):c=f<h?-1:1;return c},c)});for(var f=[],g=0;g<a.length;g++)f.push(a[g]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function ra(b){N(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Jc(b,a,c,d){function e(a,c){c=c?"-"+cb(c,"-"):"";d.removeClass(b,(a?pb:
        qb)+c);d.addClass(b,(a?qb:pb)+c)}var f=this,g=b.parent().controller("form")||rb,h=0,m=f.$error={},k=[];f.$name=a.name||a.ngForm;f.$dirty=!1;f.$pristine=!0;f.$valid=!0;f.$invalid=!1;g.$addControl(f);b.addClass(Ja);e(!0);f.$addControl=function(a){va(a.$name,"input");k.push(a);a.$name&&(f[a.$name]=a)};f.$removeControl=function(a){a.$name&&f[a.$name]===a&&delete f[a.$name];r(m,function(b,c){f.$setValidity(c,!0,a)});Ma(k,a)};f.$setValidity=function(a,b,c){var d=m[a];if(b)d&&(Ma(d,c),d.length||(h--,h||
        (e(b),f.$valid=!0,f.$invalid=!1),m[a]=!1,e(!0,a),g.$setValidity(a,!0,f)));else{h||e(b);if(d){if(-1!=ab(d,c))return}else m[a]=d=[],h++,e(!1,a),g.$setValidity(a,!1,f);d.push(c);f.$valid=!1;f.$invalid=!0}};f.$setDirty=function(){d.removeClass(b,Ja);d.addClass(b,sb);f.$dirty=!0;f.$pristine=!1;g.$setDirty()};f.$setPristine=function(){d.removeClass(b,sb);d.addClass(b,Ja);f.$dirty=!1;f.$pristine=!0;r(k,function(a){a.$setPristine()})}}function ma(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Vd(b,a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         c){var d=c.prop("validity");X(d)&&(c=function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)},b.$parsers.push(c),b.$formatters.push(c))}function tb(b,a,c,d,e,f){var g=a.prop("validity");if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;m()})}var m=function(){if(!h){var e=a.val();Oa(c.ngTrim||"T")&&(e=ca(e));if(d.$viewValue!==e||g&&""===e&&!g.valueMissing)b.$$phase?d.$setViewValue(e):
        b.$apply(function(){d.$setViewValue(e)})}};if(e.hasEvent("input"))a.on("input",m);else{var k,l=function(){k||(k=f.defer(function(){m();k=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||l()});if(e.hasEvent("paste"))a.on("paste cut",l)}a.on("change",m);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var n=c.ngPattern;n&&((e=n.match(/^\/(.*)\/([gim]*)$/))?(n=RegExp(e[1],e[2]),e=function(a){return ma(d,"pattern",d.$isEmpty(a)||n.test(a),a)}):e=
        function(c){var e=b.$eval(n);if(!e||!e.test)throw F("ngPattern")("noregexp",n,e,fa(a));return ma(d,"pattern",d.$isEmpty(c)||e.test(c),c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var q=Q(c.ngMinlength);e=function(a){return ma(d,"minlength",d.$isEmpty(a)||a.length>=q,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var p=Q(c.ngMaxlength);e=function(a){return ma(d,"maxlength",d.$isEmpty(a)||a.length<=p,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Nb(b,a){b=
        "ngClass"+b;return function(){return{restrict:"AC",link:function(c,d,e){function f(b){if(!0===a||c.$index%2===a){var d=g(b||"");h?sa(b,h)||e.$updateClass(d,g(h)):e.$addClass(d)}h=ba(b)}function g(a){if(I(a))return a.join(" ");if(X(a)){var b=[];r(a,function(a,c){a&&b.push(c)});return b.join(" ")}return a}var h;c.$watch(e[b],f,!0);e.$observe("class",function(a){f(c.$eval(e[b]))});"ngClass"!==b&&c.$watch("$index",function(d,f){var h=d&1;if(h!==f&1){var n=g(c.$eval(e[b]));h===a?e.$addClass(n):e.$removeClass(n)}})}}}}
    var O=function(b){return E(b)?b.toLowerCase():b},Rd=Object.prototype.hasOwnProperty,Ia=function(b){return E(b)?b.toUpperCase():b},P,z,Ca,ta=[].slice,Wd=[].push,Aa=Object.prototype.toString,Na=F("ng"),Ba=D.angular||(D.angular={}),Ua,Ga,ia=["0","0","0"];P=Q((/msie (\d+)/.exec(O(navigator.userAgent))||[])[1]);isNaN(P)&&(P=Q((/trident\/.*; rv:(\d+)/.exec(O(navigator.userAgent))||[])[1]));x.$inject=[];za.$inject=[];var ca=function(){return String.prototype.trim?function(b){return E(b)?b.trim():b}:function(b){return E(b)?
        b.replace(/^\s\s*/,"").replace(/\s\s*$/,""):b}}();Ga=9>P?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ia(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Vc=/[A-Z]/g,Xd={full:"1.2.14",major:1,minor:2,dot:14,codeName:"feisty-cryokinesis"},Ra=R.cache={},db=R.expando="ng-"+(new Date).getTime(),Zc=1,Kc=D.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Db=D.document.removeEventListener?
        function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};R._data=function(b){return this.cache[b[this.expando]]||{}};var Xc=/([\:\-\_]+(.))/g,Yc=/^moz([A-Z])/,Ab=F("jqLite"),Fa=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===T.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(D).on("load",a))},toString:function(){var b=[];r(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?z(this[b]):z(this[this.length+
        b])},length:0,push:Wd,sort:[].sort,splice:[].splice},hb={};r("multiple selected checked disabled readOnly required open".split(" "),function(b){hb[O(b)]=b});var hc={};r("input select option textarea button form details".split(" "),function(b){hc[Ia(b)]=!0});r({data:dc,inheritedData:gb,scope:function(b){return z(b).data("$scope")||gb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return z(b).data("$isolateScope")||z(b).data("$isolateScopeNoTemplate")},controller:ec,injector:function(b){return gb(b,
        "$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Eb,css:function(b,a,c){a=Qa(a);if(v(c))b.style[a]=c;else{var d;8>=P&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=P&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=O(a);if(hb[d])if(v(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||x).specified?d:s;else if(v(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,
        2),null===b?s:b},prop:function(b,a,c){if(v(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(B(d))return e?b[e]:"";b[e]=d}var a=[];9>P?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(B(a)){if("SELECT"===Ga(b)&&b.multiple){var c=[];r(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(B(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<
        d.length;c++)Da(d[c]);b.innerHTML=a},empty:fc},function(b,a){R.prototype[a]=function(a,d){var e,f;if(b!==fc&&(2==b.length&&b!==Eb&&b!==ec?a:d)===s){if(X(a)){for(e=0;e<this.length;e++)if(b===dc)b(this[e],a);else for(f in a)b(this[e],f,a[f]);return this}e=b.$dv;f=e===s?Math.min(this.length,1):this.length;for(var g=0;g<f;g++){var h=b(this[g],a,d);e=e?e+h:h}return e}for(e=0;e<this.length;e++)b(this[e],a,d);return this}});r({removeData:bc,dealoc:Da,on:function a(c,d,e,f){if(v(f))throw Ab("onargs");var g=
        ja(c,"events"),h=ja(c,"handle");g||ja(c,"events",g={});h||ja(c,"handle",h=$c(c,g));r(d.split(" "),function(d){var f=g[d];if(!f){if("mouseenter"==d||"mouseleave"==d){var l=T.body.contains||T.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};g[d]=[];a(c,{mouseleave:"mouseout",
        mouseenter:"mouseover"}[d],function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||h(a,d)})}else Kc(c,d,h),g[d]=[];f=g[d]}f.push(e)})},off:cc,one:function(a,c,d){a=z(a);a.on(c,function f(){a.off(c,d);a.off(c,f)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Da(a);r(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];r(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||
        a.childNodes||[]},append:function(a,c){r(new R(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;r(new R(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=z(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Da(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;r(new R(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:fb,removeClass:eb,
        toggleClass:function(a,c,d){c&&r(c.split(" "),function(c){var f=d;B(f)&&(f=!Eb(a,c));(f?fb:eb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Cb,triggerHandler:function(a,c,d){c=(ja(a,"events")||{})[c];d=d||[];var e=[{preventDefault:x,stopPropagation:x}];
            r(c,function(c){c.apply(a,e.concat(d))})}},function(a,c){R.prototype[c]=function(c,e,f){for(var g,h=0;h<this.length;h++)B(g)?(g=a(this[h],c,e,f),v(g)&&(g=z(g))):Bb(g,a(this[h],c,e,f));return v(g)?g:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});Sa.prototype={put:function(a,c){this[Ea(a)]=c},get:function(a){return this[Ea(a)]},remove:function(a){var c=this[a=Ea(a)];delete this[a];return c}};var bd=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,cd=/,/,dd=/^\s*(_?)(\S+?)\1\s*$/,ad=
        /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,Ta=F("$injector"),Yd=F("$animate"),Zd=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Yd("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,g,h){g?g.after(a):(c&&c[0]||
        (c=g.parent()),c.append(a));h&&d(h)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,h){this.enter(a,c,d,h)},addClass:function(a,c,g){c=E(c)?c:I(c)?c.join(" "):"";r(a,function(a){fb(a,c)});g&&d(g)},removeClass:function(a,c,g){c=E(c)?c:I(c)?c.join(" "):"";r(a,function(a){eb(a,c)});g&&d(g)},setClass:function(a,c,g,h){r(a,function(a){fb(a,c);eb(a,g)});h&&d(h)},enabled:x}}]}],ha=F("$compile");jc.$inject=["$provide","$$sanitizeUriProvider"];var kd=/^(x[\:\-_]|data[\:\-_])/i,qc=F("$interpolate"),
        $d=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,vd={http:80,https:443,ftp:21},Ib=F("$location");vc.prototype=Jb.prototype=uc.prototype={$$html5:!1,$$replace:!1,absUrl:mb("$$absUrl"),url:function(a,c){if(B(a))return this.$$url;var d=$d.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:mb("$$protocol"),host:mb("$$host"),port:mb("$$port"),path:wc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;
        case 1:if(E(a))this.$$search=Xb(a);else if(X(a))this.$$search=a;else throw Ib("isrcharg");break;default:B(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:wc("$$hash",za),replace:function(){this.$$replace=!0;return this}};var xa=F("$parse"),zc={},pa,Ka={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:x,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return v(d)?v(e)?d+e:d:v(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=
        e(a,c);return(v(d)?d:0)-(v(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":x,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},ae={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Lb=function(a){this.options=a};Lb.prototype={constructor:Lb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";this.tokens=[];var c;
        for(a=[];this.index<this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent(),this.was("{,")&&("{"===a[0]&&(c=this.tokens[this.tokens.length-1]))&&(c.json=-1===c.text.indexOf("."));else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch,json:this.was(":[,")&&this.is("{[")||this.is("}]:,")}),this.is("{[")&&
            a.unshift(this.ch),this.is("}]")&&a.shift(),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{var d=this.ch+this.peek(),e=d+this.peek(2),f=Ka[this.ch],g=Ka[d],h=Ka[e];h?(this.tokens.push({index:this.index,text:e,fn:h}),this.index+=3):g?(this.tokens.push({index:this.index,text:d,fn:g}),this.index+=2):f?(this.tokens.push({index:this.index,text:this.ch,fn:f,json:this.was("[,:")&&this.is("+-")}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+
            1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},
        throwError:function(a,c,d){d=d||this.index;c=v(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw xa("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=O(this.text.charAt(this.index));if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-
            1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,json:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,f,g,h;this.index<this.text.length;){h=this.text.charAt(this.index);if("."===h||this.isIdent(h)||this.isNumber(h))"."===h&&(e=this.index),c+=h;else break;this.index++}if(e)for(f=this.index;f<this.text.length;){h=this.text.charAt(f);if("("===h){g=c.substr(e-d+1);c=c.substr(0,e-d);this.index=f;break}if(this.isWhitespace(h))f++;
        else break}d={index:d,text:c};if(Ka.hasOwnProperty(c))d.fn=Ka[c],d.json=Ka[c];else{var m=yc(c,this.options,this.text);d.fn=t(function(a,c){return m(a,c)},{assign:function(d,e){return nb(d,c,e,a.text,a.options)}})}this.tokens.push(d);g&&(this.tokens.push({index:e,text:".",json:!1}),this.tokens.push({index:e+1,text:g,json:!1}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,f=!1;this.index<this.text.length;){var g=this.text.charAt(this.index),e=e+g;if(f)"u"===g?(g=this.text.substring(this.index+
            1,this.index+5),g.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+g+"]"),this.index+=4,d+=String.fromCharCode(parseInt(g,16))):d=(f=ae[g])?d+f:d+g,f=!1;else if("\\"===g)f=!0;else{if(g===a){this.index++;this.tokens.push({index:c,text:e,string:d,json:!0,fn:function(){return d}});return}d+=g}this.index++}this.throwError("Unterminated quote",c)}};var Ya=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};Ya.ZERO=function(){return 0};Ya.prototype={constructor:Ya,parse:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     c){this.text=a;this.json=c;this.tokens=this.lexer.lex(a);c&&(this.assignment=this.logicalOR,this.functionCall=this.fieldAccess=this.objectIndex=this.filterChain=function(){this.throwError("is not valid json",{text:a,index:0})});var d=c?this.primary():this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);d.literal=!!d.literal;d.constant=!!d.constant;return d},primary:function(){var a;if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=
        this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);c.json&&(a.constant=!0,a.literal=!0)}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,c){throw xa("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===
        this.tokens.length)throw xa("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var f=this.tokens[0],g=f.text;if(g===a||g===c||g===d||g===e||!(a||c||d||e))return f}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.json&&!a.json&&this.throwError("is not valid json",a),this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},unaryFn:function(a,c){return t(function(d,e){return a(d,
        e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return t(function(e,f){return a(e,f)?c(e,f):d(e,f)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return t(function(e,f){return c(e,f,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,f=0;f<a.length;f++){var g=a[f];g&&(e=g(c,d))}return e}},filterChain:function(){for(var a=
        this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,h){h=[h];for(var m=0;m<d.length;m++)h.push(d[m](a,e));return c.apply(a,h)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+
        this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,f){return a.assign(d,c(d,f),f)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=
        this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+","-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=
        this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(Ya.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=yc(d,this.options,this.text);return t(function(c,d,h){return e(h||a(c,d))},{assign:function(e,g,h){return nb(a(e,h),d,g,c.text,c.options)}})},objectIndex:function(a){var c=
        this,d=this.expression();this.consume("]");return t(function(e,f){var g=a(e,f),h=d(e,f),m;if(!g)return s;(g=Xa(g[h],c.text))&&(g.then&&c.options.unwrapPromises)&&(m=g,"$$v"in g||(m.$$v=s,m.then(function(a){m.$$v=a})),g=g.$$v);return g},{assign:function(e,f,g){var h=d(e,g);return Xa(a(e,g),c.text)[h]=f}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());while(this.expect(","))}this.consume(")");var e=this;return function(f,g){for(var h=[],m=c?c(f,g):
        f,k=0;k<d.length;k++)h.push(d[k](f,g));k=a(f,g,m)||x;Xa(m,e.text);Xa(k,e.text);h=k.apply?k.apply(m,h):k(h[0],h[1],h[2],h[3],h[4]);return Xa(h,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return t(function(c,d){for(var g=[],h=0;h<a.length;h++)g.push(a[h](c,d));return g},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;
        var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return t(function(c,d){for(var e={},m=0;m<a.length;m++){var k=a[m];e[k.key]=k.value(c,d)}return e},{literal:!0,constant:c})}};var Kb={},qa=F("$sce"),ea={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",JS:"js"},V=T.createElement("a"),Bc=wa(D.location.href,!0);Cc.$inject=["$provide"];Dc.$inject=["$locale"];Fc.$inject=["$locale"];
    var Ic=".",Ud={yyyy:Z("FullYear",4),yy:Z("FullYear",2,0,!0),y:Z("FullYear",1),MMMM:ob("Month"),MMM:ob("Month",!0),MM:Z("Month",2,1),M:Z("Month",1,1),dd:Z("Date",2),d:Z("Date",1),HH:Z("Hours",2),H:Z("Hours",1),hh:Z("Hours",2,-12),h:Z("Hours",1,-12),mm:Z("Minutes",2),m:Z("Minutes",1),ss:Z("Seconds",2),s:Z("Seconds",1),sss:Z("Milliseconds",3),EEEE:ob("Day"),EEE:ob("Day",!0),a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Mb(Math[0<
        a?"floor":"ceil"](a/60),2)+Mb(Math.abs(a%60),2))}},Td=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,Sd=/^\-?\d+$/;Ec.$inject=["$locale"];var Pd=$(O),Qd=$(Ia);Gc.$inject=["$parse"];var be=$({restrict:"E",compile:function(a,c){8>=P&&(c.href||c.name||c.$set("href",""),a.append(T.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,c){var f="[object SVGAnimatedString]"===Aa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(f)||
    a.preventDefault()})}}}),Ob={};r(hb,function(a,c){if("multiple"!=a){var d=ka("ng-"+c);Ob[d]=function(){return{priority:100,link:function(a,f,g){a.$watch(g[d],function(a){g.$set(c,!!a)})}}}}});r(["src","srcset","href"],function(a){var c=ka("ng-"+a);Ob[c]=function(){return{priority:99,link:function(d,e,f){var g=a,h=a;"href"===a&&"[object SVGAnimatedString]"===Aa.call(e.prop("href"))&&(h="xlinkHref",f.$attr[h]="xlink:href",g=null);f.$observe(c,function(a){a&&(f.$set(h,a),P&&g&&e.prop(g,f[h]))})}}}});
    var rb={$addControl:x,$removeControl:x,$setValidity:x,$setDirty:x,$setPristine:x};Jc.$inject=["$element","$attrs","$scope","$animate"];var Lc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Jc,compile:function(){return{pre:function(a,e,f,g){if(!f.action){var h=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};Kc(e[0],"submit",h);e.on("$destroy",function(){c(function(){Db(e[0],"submit",h)},0,!1)})}var m=e.parent().controller("form"),k=f.name||
            f.ngForm;k&&nb(a,k,g,k);if(m)e.on("$destroy",function(){m.$removeControl(g);k&&nb(a,k,s,k);t(g,rb)})}}}}}]},ce=Lc(),de=Lc(!0),ee=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,fe=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,ge=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Mc={text:tb,number:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);e.$parsers.push(function(a){var c=e.$isEmpty(a);if(c||ge.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);
            e.$setValidity("number",!1);return s});Vd(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return ma(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return ma(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return ma(e,"number",e.$isEmpty(a)||vb(a),a)})},url:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);a=
            function(a){return ma(e,"url",e.$isEmpty(a)||ee.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,f,g){tb(a,c,d,e,f,g);a=function(a){return ma(e,"email",e.$isEmpty(a)||fe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){B(d.name)&&c.attr("name",Za());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                c,d,e){var f=d.ngTrueValue,g=d.ngFalseValue;E(f)||(f=!0);E(g)||(g=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==f};e.$formatters.push(function(a){return a===f});e.$parsers.push(function(a){return a?f:g})},hidden:x,button:x,submit:x,reset:x,file:x},Nc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",link:function(d,e,f,g){g&&(Mc[O(f.type)]||Mc.text)(d,e,f,
            g,c,a)}}}],qb="ng-valid",pb="ng-invalid",Ja="ng-pristine",sb="ng-dirty",he=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,f,g){function h(a,c){c=c?"-"+cb(c,"-"):"";g.removeClass(e,(a?pb:qb)+c);g.addClass(e,(a?qb:pb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=d.name;var m=f(d.ngModel),k=m.assign;if(!k)throw F("ngModel")("nonassign",
            d.ngModel,fa(e));this.$render=x;this.$isEmpty=function(a){return B(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||rb,n=0,q=this.$error={};e.addClass(Ja);h(!0);this.$setValidity=function(a,c){q[a]!==!c&&(c?(q[a]&&n--,n||(h(!0),this.$valid=!0,this.$invalid=!1)):(h(!1),this.$invalid=!0,this.$valid=!1,n++),q[a]=!c,h(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=!0;g.removeClass(e,sb);g.addClass(e,Ja)};this.$setViewValue=function(d){this.$viewValue=
            d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,g.removeClass(e,Ja),g.addClass(e,sb),l.$setDirty());r(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,k(a,d),r(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var p=this;a.$watch(function(){var c=m(a);if(p.$modelValue!==c){var d=p.$formatters,e=d.length;for(p.$modelValue=c;e--;)c=d[e](c);p.$viewValue!==c&&(p.$viewValue=c,p.$render())}return c})}],ie=function(){return{require:["ngModel","^?form"],controller:he,
            link:function(a,c,d,e){var f=e[0],g=e[1]||rb;g.$addControl(f);a.$on("$destroy",function(){g.$removeControl(f)})}}},je=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),Oc=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var f=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",!0),a};e.$formatters.push(f);e.$parsers.unshift(f);d.$observe("required",function(){f(e.$viewValue)})}}}},
        ke=function(){return{require:"ngModel",link:function(a,c,d,e){var f=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!B(a)){var c=[];a&&r(a.split(f),function(a){a&&c.push(ca(a))});return c}});e.$formatters.push(function(a){return I(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},le=/^(true|false|\d+)$/,me=function(){return{priority:100,compile:function(a,c){return le.test(c.ngValue)?function(a,c,f){f.$set("value",a.$eval(f.ngValue))}:function(a,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   c,f){a.$watch(f.ngValue,function(a){f.$set("value",a)})}}}},ne=ra(function(a,c,d){c.addClass("ng-binding").data("$binding",d.ngBind);a.$watch(d.ngBind,function(a){c.text(a==s?"":a)})}),oe=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],pe=["$sce","$parse",function(a,c){return function(d,e,f){e.addClass("ng-binding").data("$binding",f.ngBindHtml);var g=c(f.ngBindHtml);
            d.$watch(function(){return(g(d)||"").toString()},function(c){e.html(a.getTrustedHtml(g(d))||"")})}}],qe=Nb("",!0),re=Nb("Odd",0),se=Nb("Even",1),te=ra({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),ue=[function(){return{scope:!0,controller:"@",priority:500}}],Pc={};r("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),function(a){var c=ka("ng-"+a);Pc[c]=["$parse",function(d){return{compile:function(e,
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            f){var g=d(f[c]);return function(c,d,e){d.on(O(a),function(a){c.$apply(function(){g(c,{$event:a})})})}}}}]});var ve=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,f,g){var h,m,k;c.$watch(e.ngIf,function(f){Oa(f)?m||(m=c.$new(),g(m,function(c){c[c.length++]=T.createComment(" end ngIf: "+e.ngIf+" ");h={clone:c};a.enter(c,d.parent(),d)})):(k&&(k.remove(),k=null),m&&(m.$destroy(),m=null),h&&(k=yb(h.clone),a.leave(k,function(){k=null}),
            h=null))})}}}],we=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,f){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Ba.noop,compile:function(g,h){var m=h.ngInclude||h.src,k=h.onload||"",l=h.autoscroll;return function(g,h,p,r,C){var s=0,u,t,z,w=function(){t&&(t.remove(),t=null);u&&(u.$destroy(),u=null);z&&(e.leave(z,function(){t=null}),t=z,z=null)};g.$watch(f.parseAsResourceUrl(m),function(f){var m=function(){!v(l)||l&&!g.$eval(l)||d()},
            p=++s;f?(a.get(f,{cache:c}).success(function(a){if(p===s){var c=g.$new();r.template=a;a=C(c,function(a){w();e.enter(a,null,h,m)});u=c;z=a;u.$emit("$includeContentLoaded");g.$eval(k)}}).error(function(){p===s&&w()}),g.$emit("$includeContentRequested")):(w(),r.template=null)})}}}}],xe=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,f){d.html(f.template);a(d.contents())(c)}}}],ye=ra({priority:450,compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),
        ze=ra({terminal:!0,priority:1E3}),Ae=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,f,g){var h=g.count,m=g.$attr.when&&f.attr(g.$attr.when),k=g.offset||0,l=e.$eval(m)||{},n={},q=c.startSymbol(),p=c.endSymbol(),s=/^when(Minus)?(.+)$/;r(g,function(a,c){s.test(c)&&(l[O(c.replace("when","").replace("Minus","-"))]=f.attr(g.$attr[c]))});r(l,function(a,e){n[e]=c(a.replace(d,q+h+"-"+k+p))});e.$watch(function(){var c=parseFloat(e.$eval(h));if(isNaN(c))return"";c in
            l||(c=a.pluralCat(c-k));return n[c](e,f,!0)},function(a){f.text(a)})}}}],Be=["$parse","$animate",function(a,c){var d=F("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,f,g,h,m){var k=g.ngRepeat,l=k.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,q,p,s,t,v,u={$id:Ea};if(!l)throw d("iexp",k);g=l[1];h=l[2];(l=l[3])?(n=a(l),q=function(a,c,d){v&&(u[v]=a);u[t]=c;u.$index=d;return n(e,u)}):(p=function(a,c){return Ea(c)},s=function(a){return a});
            l=g.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",g);t=l[3]||l[1];v=l[2];var H={};e.$watchCollection(h,function(a){var g,h,l=f[0],n,u={},E,J,x,B,F,K,I=[];if(ub(a))F=a,n=q||p;else{n=q||s;F=[];for(x in a)a.hasOwnProperty(x)&&"$"!=x.charAt(0)&&F.push(x);F.sort()}E=F.length;h=I.length=F.length;for(g=0;g<h;g++)if(x=a===F?g:F[g],B=a[x],B=n(x,B,g),va(B,"`track by` id"),H.hasOwnProperty(B))K=H[B],delete H[B],u[B]=K,I[g]=K;else{if(u.hasOwnProperty(B))throw r(I,function(a){a&&
                a.scope&&(H[a.id]=a)}),d("dupes",k,B);I[g]={id:B};u[B]=!1}for(x in H)H.hasOwnProperty(x)&&(K=H[x],g=yb(K.clone),c.leave(g),r(g,function(a){a.$$NG_REMOVED=!0}),K.scope.$destroy());g=0;for(h=F.length;g<h;g++){x=a===F?g:F[g];B=a[x];K=I[g];I[g-1]&&(l=I[g-1].clone[I[g-1].clone.length-1]);if(K.scope){J=K.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);K.clone[0]!=n&&c.move(yb(K.clone),null,z(l));l=K.clone[K.clone.length-1]}else J=e.$new();J[t]=B;v&&(J[v]=x);J.$index=g;J.$first=0===g;J.$last=g===E-
                1;J.$middle=!(J.$first||J.$last);J.$odd=!(J.$even=0===(g&1));K.scope||m(J,function(a){a[a.length++]=T.createComment(" end ngRepeat: "+k+" ");c.enter(a,null,z(l));l=a;K.scope=J;K.clone=a;u[K.id]=K})}H=u})}}}],Ce=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Oa(c)?"removeClass":"addClass"](d,"ng-hide")})}}],De=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Oa(c)?"addClass":"removeClass"](d,"ng-hide")})}}],Ee=ra(function(a,c,d){a.$watch(d.ngStyle,
            function(a,d){d&&a!==d&&r(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Fe=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,f){var g,h,m,k=[];c.$watch(e.ngSwitch||e.on,function(d){var n,q=k.length;if(0<q){if(m){for(n=0;n<q;n++)m[n].remove();m=null}m=[];for(n=0;n<q;n++){var p=h[n];k[n].$destroy();m[n]=p;a.leave(p,function(){m.splice(n,1);0===m.length&&(m=null)})}}h=[];k=[];if(g=f.cases["!"+d]||f.cases["?"])c.$eval(e.change),
            r(g,function(d){var e=c.$new();k.push(e);d.transclude(e,function(c){var e=d.element;h.push(c);a.enter(c,e.parent(),e)})})})}}}],Ge=ra({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:f,element:c})}}),He=ra({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,f){e.cases["?"]=e.cases["?"]||[];e.cases["?"].push({transclude:f,element:c})}}),Ie=
            ra({link:function(a,c,d,e,f){if(!f)throw F("ngTransclude")("orphan",fa(c));f(function(a){c.empty();c.append(a)})}}),Je=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Ke=F("ngOptions"),Le=$({terminal:!0}),Me=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
            e={$setViewValue:x};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var m=this,k={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){va(c,'"option value"');k[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete k[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Ea(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",
            !0)};m.hasOption=function(a){return k.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=x})}],link:function(e,g,h,m){function k(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(E.parent()&&E.remove(),c.val(a),""===a&&x.prop("selected",!0)):B(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){E.parent()&&E.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Sa(d.$viewValue);r(c.find("option"),
            function(c){c.selected=v(a.get(c.value))})};a.$watch(function(){sa(e,d.$viewValue)||(e=ba(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];r(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function h(){var a={"":[]},c=[""],d,k,s,t,y;t=g.$modelValue;y=z(e)||[];var B=n?Pb(y):y,E,A,D;A={};s=!1;var L,J;if(p)if(w&&I(t))for(s=new Sa([]),D=0;D<t.length;D++)A[m]=t[D],s.put(w(e,A),t[D]);else s=new Sa(t);for(D=0;E=B.length,
            D<E;D++){k=D;if(n){k=B[D];if("$"===k.charAt(0))continue;A[n]=k}A[m]=y[k];d=q(e,A)||"";(k=a[d])||(k=a[d]=[],c.push(d));p?d=v(s.remove(w?w(e,A):r(e,A))):(w?(d={},d[m]=t,d=w(e,d)===w(e,A)):d=t===r(e,A),s=s||d);L=l(e,A);L=v(L)?L:"";k.push({id:w?w(e,A):n?B[D]:D,label:L,selected:d})}p||(C||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));A=0;for(B=c.length;A<B;A++){d=c[A];k=a[d];x.length<=A?(t={element:F.clone().attr("label",d),label:k.label},y=[t],x.push(y),
            f.append(t.element)):(y=x[A],t=y[0],t.label!=d&&t.element.attr("label",t.label=d));L=null;D=0;for(E=k.length;D<E;D++)s=k[D],(d=y[D+1])?(L=d.element,d.label!==s.label&&L.text(d.label=s.label),d.id!==s.id&&L.val(d.id=s.id),L[0].selected!==s.selected&&L.prop("selected",d.selected=s.selected)):(""===s.id&&C?J=C:(J=u.clone()).val(s.id).attr("selected",s.selected).text(s.label),y.push({element:J,label:s.label,id:s.id,selected:s.selected}),L?L.after(J):t.element.append(J),L=J);for(D++;y.length>D;)y.pop().element.remove()}for(;x.length>
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             A;)x.pop()[0].element.remove()}var k;if(!(k=t.match(d)))throw Ke("iexp",t,fa(f));var l=c(k[2]||k[1]),m=k[4]||k[6],n=k[5],q=c(k[3]||""),r=c(k[2]?k[1]:m),z=c(k[7]),w=k[8]?c(k[8]):null,x=[[{element:f,label:""}]];C&&(a(C)(e),C.removeClass("ng-scope"),C.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=z(e)||[],d={},h,k,l,q,t,v,u;if(p)for(k=[],q=0,v=x.length;q<v;q++)for(a=x[q],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(w)for(u=0;u<c.length&&
            (d[m]=c[u],w(e,d)!=h);u++);else d[m]=c[h];k.push(r(e,d))}}else if(h=f.val(),"?"==h)k=s;else if(""===h)k=null;else if(w)for(u=0;u<c.length;u++){if(d[m]=c[u],w(e,d)==h){k=r(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=r(e,d);g.$setViewValue(k)})});g.$render=h;e.$watch(h)}if(m[1]){var q=m[0];m=m[1];var p=h.multiple,t=h.ngOptions,C=!1,x,u=z(T.createElement("option")),F=z(T.createElement("optgroup")),E=u.clone();h=0;for(var w=g.children(),D=w.length;h<D;h++)if(""===w[h].value){x=C=w.eq(h);break}q.init(m,C,
            E);p&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,g,m):p?l(e,g,m):k(e,g,m,q)}}}}],Ne=["$interpolate",function(a){var c={addOption:x,removeOption:x};return{restrict:"E",priority:100,compile:function(d,e){if(B(e.value)){var f=a(d.text(),!0);f||e.$set("value",d.text())}return function(a,d,e){var k=d.parent(),l=k.data("$selectController")||k.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;f?a.$watch(f,function(a,c){e.$set("value",a);a!==c&&l.removeOption(c);l.addOption(a)}):
            l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],Oe=$({restrict:"E",terminal:!0});(Ca=D.jQuery)?(z=Ca,t(Ca.fn,{scope:Fa.scope,isolateScope:Fa.isolateScope,controller:Fa.controller,injector:Fa.injector,inheritedData:Fa.inheritedData}),zb("remove",!0,!0,!1),zb("empty",!1,!1,!1),zb("html",!1,!1,!0)):z=R;Ba.element=z;(function(a){t(a,{bootstrap:Zb,copy:ba,extend:t,equals:sa,element:z,forEach:r,injector:$b,noop:x,bind:bb,toJson:na,fromJson:Vb,identity:za,isUndefined:B,isDefined:v,
        isString:E,isFunction:N,isObject:X,isNumber:vb,isElement:Rc,isArray:I,version:Xd,isDate:La,lowercase:O,uppercase:Ia,callbacks:{counter:0},$$minErr:F,$$csp:Ub});Ua=Wc(D);try{Ua("ngLocale")}catch(c){Ua("ngLocale",[]).provider("$locale",ud)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:Fd});a.provider("$compile",jc).directive({a:be,input:Nc,textarea:Nc,form:ce,script:Je,select:Me,style:Oe,option:Ne,ngBind:ne,ngBindHtml:pe,ngBindTemplate:oe,ngClass:qe,ngClassEven:se,ngClassOdd:re,
        ngCloak:te,ngController:ue,ngForm:de,ngHide:De,ngIf:ve,ngInclude:we,ngInit:ye,ngNonBindable:ze,ngPluralize:Ae,ngRepeat:Be,ngShow:Ce,ngStyle:Ee,ngSwitch:Fe,ngSwitchWhen:Ge,ngSwitchDefault:He,ngOptions:Le,ngTransclude:Ie,ngModel:ie,ngList:ke,ngChange:je,required:Oc,ngRequired:Oc,ngValue:me}).directive({ngInclude:xe}).directive(Ob).directive(Pc);a.provider({$anchorScroll:ed,$animate:Zd,$browser:hd,$cacheFactory:id,$controller:ld,$document:md,$exceptionHandler:nd,$filter:Cc,$interpolate:sd,$interval:td,
        $http:od,$httpBackend:qd,$location:wd,$log:xd,$parse:Ad,$rootScope:Ed,$q:Bd,$sce:Id,$sceDelegate:Hd,$sniffer:Jd,$templateCache:jd,$timeout:Kd,$window:Ld,$$rAF:Dd,$$asyncCallback:fd})}])})(Ba);z(T).ready(function(){Uc(T,Zb)})})(window,document);!angular.$$csp()&&angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}</style>');
//# sourceMappingURL=angular.min.js.map

/**
 * @license AngularJS v1.2.14
 * (c) 2010-2014 Google, Inc. http://angularjs.org
 * License: MIT
 */
(function(window, angular, undefined) {'use strict';

    var $sanitizeMinErr = angular.$$minErr('$sanitize');

    /**
     * @ngdoc module
     * @name ngSanitize
     * @description
     *
     * # ngSanitize
     *
     * The `ngSanitize` module provides functionality to sanitize HTML.
     *
     *
     * <div doc-module-components="ngSanitize"></div>
     *
     * See {@link ngSanitize.$sanitize `$sanitize`} for usage.
     */

    /*
     * HTML Parser By Misko Hevery (misko@hevery.com)
     * based on:  HTML Parser By John Resig (ejohn.org)
     * Original code by Erik Arvidsson, Mozilla Public License
     * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
     *
     * // Use like so:
     * htmlParser(htmlString, {
     *     start: function(tag, attrs, unary) {},
     *     end: function(tag) {},
     *     chars: function(text) {},
     *     comment: function(text) {}
     * });
     *
     */


    /**
     * @ngdoc service
     * @name $sanitize
     * @function
     *
     * @description
     *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
     *   then serialized back to properly escaped html string. This means that no unsafe input can make
     *   it into the returned string, however, since our parser is more strict than a typical browser
     *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
     *   browser, won't make it through the sanitizer.
     *   The whitelist is configured using the functions `aHrefSanitizationWhitelist` and
     *   `imgSrcSanitizationWhitelist` of {@link ng.$compileProvider `$compileProvider`}.
     *
     * @param {string} html Html input.
     * @returns {string} Sanitized html.
     *
     * @example
     <example module="ngSanitize" deps="angular-sanitize.js">
     <file name="index.html">
     <script>
     function Ctrl($scope, $sce) {
         $scope.snippet =
           '<p style="color:blue">an html\n' +
           '<em onmouseover="this.textContent=\'PWN3D!\'">click here</em>\n' +
           'snippet</p>';
         $scope.deliberatelyTrustDangerousSnippet = function() {
           return $sce.trustAsHtml($scope.snippet);
         };
       }
     </script>
     <div ng-controller="Ctrl">
     Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
     <table>
     <tr>
     <td>Directive</td>
     <td>How</td>
     <td>Source</td>
     <td>Rendered</td>
     </tr>
     <tr id="bind-html-with-sanitize">
     <td>ng-bind-html</td>
     <td>Automatically uses $sanitize</td>
     <td><pre>&lt;div ng-bind-html="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind-html="snippet"></div></td>
     </tr>
     <tr id="bind-html-with-trust">
     <td>ng-bind-html</td>
     <td>Bypass $sanitize by explicitly trusting the dangerous value</td>
     <td>
     <pre>&lt;div ng-bind-html="deliberatelyTrustDangerousSnippet()"&gt;
     &lt;/div&gt;</pre>
     </td>
     <td><div ng-bind-html="deliberatelyTrustDangerousSnippet()"></div></td>
     </tr>
     <tr id="bind-default">
     <td>ng-bind</td>
     <td>Automatically escapes</td>
     <td><pre>&lt;div ng-bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
     <td><div ng-bind="snippet"></div></td>
     </tr>
     </table>
     </div>
     </file>
     <file name="protractor.js" type="protractor">
     it('should sanitize the html snippet by default', function() {
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it('should inline raw snippet if bound to a trusted value', function() {
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should escape snippet without any filter', function() {
       expect(element(by.css('#bind-default div')).getInnerHtml()).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it('should update', function() {
       element(by.model('snippet')).clear();
       element(by.model('snippet')).sendKeys('new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-html-with-sanitize div')).getInnerHtml()).
         toBe('new <b>text</b>');
       expect(element(by.css('#bind-html-with-trust div')).getInnerHtml()).toBe(
         'new <b onclick="alert(1)">text</b>');
       expect(element(by.css('#bind-default div')).getInnerHtml()).toBe(
         "new &lt;b onclick=\"alert(1)\"&gt;text&lt;/b&gt;");
     });
     </file>
     </example>
     */
    function $SanitizeProvider() {
        this.$get = ['$$sanitizeUri', function($$sanitizeUri) {
            return function(html) {
                var buf = [];
                htmlParser(html, htmlSanitizeWriter(buf, function(uri, isImage) {
                    return !/^unsafe/.test($$sanitizeUri(uri, isImage));
                }));
                return buf.join('');
            };
        }];
    }

    function sanitizeText(chars) {
        var buf = [];
        var writer = htmlSanitizeWriter(buf, angular.noop);
        writer.chars(chars);
        return buf.join('');
    }


// Regular Expressions for parsing tags and attributes
    var START_TAG_REGEXP =
            /^<\s*([\w:-]+)((?:\s+[\w:-]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
        END_TAG_REGEXP = /^<\s*\/\s*([\w:-]+)[^>]*>/,
        ATTR_REGEXP = /([\w:-]+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
        BEGIN_TAG_REGEXP = /^</,
        BEGING_END_TAGE_REGEXP = /^<\s*\//,
        COMMENT_REGEXP = /<!--(.*?)-->/g,
        DOCTYPE_REGEXP = /<!DOCTYPE([^>]*?)>/i,
        CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
    // Match everything outside of normal chars and " (quote character)
        NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;


// Good source of info about elements and attributes
// http://dev.w3.org/html5/spec/Overview.html#semantics
// http://simon.html5.org/html-elements

// Safe Void Elements - HTML5
// http://dev.w3.org/html5/spec/Overview.html#void-elements
    var voidElements = makeMap("area,br,col,hr,img,wbr");

// Elements that you can, intentionally, leave open (and which close themselves)
// http://dev.w3.org/html5/spec/Overview.html#optional-tags
    var optionalEndTagBlockElements = makeMap("colgroup,dd,dt,li,p,tbody,td,tfoot,th,thead,tr"),
        optionalEndTagInlineElements = makeMap("rp,rt"),
        optionalEndTagElements = angular.extend({},
            optionalEndTagInlineElements,
            optionalEndTagBlockElements);

// Safe Block Elements - HTML5
    var blockElements = angular.extend({}, optionalEndTagBlockElements, makeMap("address,article," +
        "aside,blockquote,caption,center,del,dir,div,dl,figure,figcaption,footer,h1,h2,h3,h4,h5," +
        "h6,header,hgroup,hr,ins,map,menu,nav,ol,pre,script,section,table,ul"));

// Inline Elements - HTML5
    var inlineElements = angular.extend({}, optionalEndTagInlineElements, makeMap("a,abbr,acronym,b," +
        "bdi,bdo,big,br,cite,code,del,dfn,em,font,i,img,ins,kbd,label,map,mark,q,ruby,rp,rt,s," +
        "samp,small,span,strike,strong,sub,sup,time,tt,u,var"));


// Special Elements (can contain anything)
    var specialElements = makeMap("script,style");

    var validElements = angular.extend({},
        voidElements,
        blockElements,
        inlineElements,
        optionalEndTagElements);

//Attributes that have href and hence need to be sanitized
    var uriAttrs = makeMap("background,cite,href,longdesc,src,usemap");
    var validAttrs = angular.extend({}, uriAttrs, makeMap(
        'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
            'color,cols,colspan,compact,coords,dir,face,headers,height,hreflang,hspace,'+
            'ismap,lang,language,nohref,nowrap,rel,rev,rows,rowspan,rules,'+
            'scope,scrolling,shape,size,span,start,summary,target,title,type,'+
            'valign,value,vspace,width'));

    function makeMap(str) {
        var obj = {}, items = str.split(','), i;
        for (i = 0; i < items.length; i++) obj[items[i]] = true;
        return obj;
    }


    /**
     * @example
     * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
     *
     * @param {string} html string
     * @param {object} handler
     */
    function htmlParser( html, handler ) {
        var index, chars, match, stack = [], last = html;
        stack.last = function() { return stack[ stack.length - 1 ]; };

        while ( html ) {
            chars = true;

            // Make sure we're not in a script or style element
            if ( !stack.last() || !specialElements[ stack.last() ] ) {

                // Comment
                if ( html.indexOf("<!--") === 0 ) {
                    // comments containing -- are not allowed unless they terminate the comment
                    index = html.indexOf("--", 4);

                    if ( index >= 0 && html.lastIndexOf("-->", index) === index) {
                        if (handler.comment) handler.comment( html.substring( 4, index ) );
                        html = html.substring( index + 3 );
                        chars = false;
                    }
                    // DOCTYPE
                } else if ( DOCTYPE_REGEXP.test(html) ) {
                    match = html.match( DOCTYPE_REGEXP );

                    if ( match ) {
                        html = html.replace( match[0] , '');
                        chars = false;
                    }
                    // end tag
                } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
                    match = html.match( END_TAG_REGEXP );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( END_TAG_REGEXP, parseEndTag );
                        chars = false;
                    }

                    // start tag
                } else if ( BEGIN_TAG_REGEXP.test(html) ) {
                    match = html.match( START_TAG_REGEXP );

                    if ( match ) {
                        html = html.substring( match[0].length );
                        match[0].replace( START_TAG_REGEXP, parseStartTag );
                        chars = false;
                    }
                }

                if ( chars ) {
                    index = html.indexOf("<");

                    var text = index < 0 ? html : html.substring( 0, index );
                    html = index < 0 ? "" : html.substring( index );

                    if (handler.chars) handler.chars( decodeEntities(text) );
                }

            } else {
                html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'),
                    function(all, text){
                        text = text.replace(COMMENT_REGEXP, "$1").replace(CDATA_REGEXP, "$1");

                        if (handler.chars) handler.chars( decodeEntities(text) );

                        return "";
                    });

                parseEndTag( "", stack.last() );
            }

            if ( html == last ) {
                throw $sanitizeMinErr('badparse', "The sanitizer was unable to parse the following block " +
                    "of html: {0}", html);
            }
            last = html;
        }

        // Clean up any remaining tags
        parseEndTag();

        function parseStartTag( tag, tagName, rest, unary ) {
            tagName = angular.lowercase(tagName);
            if ( blockElements[ tagName ] ) {
                while ( stack.last() && inlineElements[ stack.last() ] ) {
                    parseEndTag( "", stack.last() );
                }
            }

            if ( optionalEndTagElements[ tagName ] && stack.last() == tagName ) {
                parseEndTag( "", tagName );
            }

            unary = voidElements[ tagName ] || !!unary;

            if ( !unary )
                stack.push( tagName );

            var attrs = {};

            rest.replace(ATTR_REGEXP,
                function(match, name, doubleQuotedValue, singleQuotedValue, unquotedValue) {
                    var value = doubleQuotedValue
                        || singleQuotedValue
                        || unquotedValue
                        || '';

                    attrs[name] = decodeEntities(value);
                });
            if (handler.start) handler.start( tagName, attrs, unary );
        }

        function parseEndTag( tag, tagName ) {
            var pos = 0, i;
            tagName = angular.lowercase(tagName);
            if ( tagName )
            // Find the closest opened tag of the same type
                for ( pos = stack.length - 1; pos >= 0; pos-- )
                    if ( stack[ pos ] == tagName )
                        break;

            if ( pos >= 0 ) {
                // Close all the open elements, up the stack
                for ( i = stack.length - 1; i >= pos; i-- )
                    if (handler.end) handler.end( stack[ i ] );

                // Remove the open elements from the stack
                stack.length = pos;
            }
        }
    }

    var hiddenPre=document.createElement("pre");
    var spaceRe = /^(\s*)([\s\S]*?)(\s*)$/;
    /**
     * decodes all entities into regular string
     * @param value
     * @returns {string} A string with decoded entities.
     */
    function decodeEntities(value) {
        if (!value) { return ''; }

        // Note: IE8 does not preserve spaces at the start/end of innerHTML
        // so we must capture them and reattach them afterward
        var parts = spaceRe.exec(value);
        var spaceBefore = parts[1];
        var spaceAfter = parts[3];
        var content = parts[2];
        if (content) {
            hiddenPre.innerHTML=content.replace(/</g,"&lt;");
            // innerText depends on styling as it doesn't display hidden elements.
            // Therefore, it's better to use textContent not to cause unnecessary
            // reflows. However, IE<9 don't support textContent so the innerText
            // fallback is necessary.
            content = 'textContent' in hiddenPre ?
                hiddenPre.textContent : hiddenPre.innerText;
        }
        return spaceBefore + content + spaceAfter;
    }

    /**
     * Escapes all potentially dangerous characters, so that the
     * resulting string can be safely inserted into attribute or
     * element text.
     * @param value
     * @returns {string} escaped text
     */
    function encodeEntities(value) {
        return value.
            replace(/&/g, '&amp;').
            replace(NON_ALPHANUMERIC_REGEXP, function(value){
                return '&#' + value.charCodeAt(0) + ';';
            }).
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;');
    }

    /**
     * create an HTML/XML writer which writes to buffer
     * @param {Array} buf use buf.jain('') to get out sanitized html string
     * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
     */
    function htmlSanitizeWriter(buf, uriValidator){
        var ignore = false;
        var out = angular.bind(buf, buf.push);
        return {
            start: function(tag, attrs, unary){
                tag = angular.lowercase(tag);
                if (!ignore && specialElements[tag]) {
                    ignore = tag;
                }
                if (!ignore && validElements[tag] === true) {
                    out('<');
                    out(tag);
                    angular.forEach(attrs, function(value, key){
                        var lkey=angular.lowercase(key);
                        var isImage = (tag === 'img' && lkey === 'src') || (lkey === 'background');
                        if (validAttrs[lkey] === true &&
                            (uriAttrs[lkey] !== true || uriValidator(value, isImage))) {
                            out(' ');
                            out(key);
                            out('="');
                            out(encodeEntities(value));
                            out('"');
                        }
                    });
                    out(unary ? '/>' : '>');
                }
            },
            end: function(tag){
                tag = angular.lowercase(tag);
                if (!ignore && validElements[tag] === true) {
                    out('</');
                    out(tag);
                    out('>');
                }
                if (tag == ignore) {
                    ignore = false;
                }
            },
            chars: function(chars){
                if (!ignore) {
                    out(encodeEntities(chars));
                }
            }
        };
    }


// define ngSanitize module and register $sanitize service
    angular.module('ngSanitize', []).provider('$sanitize', $SanitizeProvider);

    /* global sanitizeText: false */

    /**
     * @ngdoc filter
     * @name linky
     * @function
     *
     * @description
     * Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
     * plain email address links.
     *
     * Requires the {@link ngSanitize `ngSanitize`} module to be installed.
     *
     * @param {string} text Input text.
     * @param {string} target Window (_blank|_self|_parent|_top) or named frame to open links in.
     * @returns {string} Html-linkified text.
     *
     * @usage
     <span ng-bind-html="linky_expression | linky"></span>
     *
     * @example
     <example module="ngSanitize" deps="angular-sanitize.js">
     <file name="index.html">
     <script>
     function Ctrl($scope) {
           $scope.snippet =
             'Pretty text with some links:\n'+
             'http://angularjs.org/,\n'+
             'mailto:us@somewhere.org,\n'+
     'another@somewhere.org,\n'+
     'and one more: ftp://127.0.0.1/.';
     $scope.snippetWithTarget = 'http://angularjs.org/';
     }
     </script>
     <div ng-controller="Ctrl">
     Snippet: <textarea ng-model="snippet" cols="60" rows="3"></textarea>
     <table>
     <tr>
     <td>Filter</td>
     <td>Source</td>
     <td>Rendered</td>
     </tr>
     <tr id="linky-filter">
     <td>linky filter</td>
     <td>
     <pre>&lt;div ng-bind-html="snippet | linky"&gt;<br>&lt;/div&gt;</pre>
     </td>
     <td>
     <div ng-bind-html="snippet | linky"></div>
     </td>
     </tr>
     <tr id="linky-target">
     <td>linky target</td>
     <td>
     <pre>&lt;div ng-bind-html="snippetWithTarget | linky:'_blank'"&gt;<br>&lt;/div&gt;</pre>
     </td>
     <td>
     <div ng-bind-html="snippetWithTarget | linky:'_blank'"></div>
     </td>
     </tr>
     <tr id="escaped-html">
     <td>no filter</td>
     <td><pre>&lt;div ng-bind="snippet"&gt;<br>&lt;/div&gt;</pre></td>
     <td><div ng-bind="snippet"></div></td>
     </tr>
     </table>
     </file>
     <file name="protractor.js" type="protractor">
     it('should linkify the snippet with urls', function() {
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, us@somewhere.org, ' +
     'another@somewhere.org, and one more: ftp://127.0.0.1/.');
     expect(element.all(by.css('#linky-filter a')).count()).toEqual(4);
     });

     it('should not linkify snippet without the linky filter', function() {
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText()).
             toBe('Pretty text with some links: http://angularjs.org/, mailto:us@somewhere.org, ' +
     'another@somewhere.org, and one more: ftp://127.0.0.1/.');
     expect(element.all(by.css('#escaped-html a')).count()).toEqual(0);
     });

     it('should update', function() {
         element(by.model('snippet')).clear();
         element(by.model('snippet')).sendKeys('new http://link.');
         expect(element(by.id('linky-filter')).element(by.binding('snippet | linky')).getText()).
             toBe('new http://link.');
         expect(element.all(by.css('#linky-filter a')).count()).toEqual(1);
         expect(element(by.id('escaped-html')).element(by.binding('snippet')).getText())
             .toBe('new http://link.');
       });

     it('should work with the target property', function() {
        expect(element(by.id('linky-target')).
            element(by.binding("snippetWithTarget | linky:'_blank'")).getText()).
            toBe('http://angularjs.org/');
        expect(element(by.css('#linky-target a')).getAttribute('target')).toEqual('_blank');
       });
     </file>
     </example>
     */
    angular.module('ngSanitize').filter('linky', ['$sanitize', function($sanitize) {
        var LINKY_URL_REGEXP =
                /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s.;,(){}<>]/,
            MAILTO_REGEXP = /^mailto:/;

        return function(text, target) {
            if (!text) return text;
            var match;
            var raw = text;
            var html = [];
            var url;
            var i;
            while ((match = raw.match(LINKY_URL_REGEXP))) {
                // We can not end in these as they are sometimes found at the end of the sentence
                url = match[0];
                // if we did not match ftp/http/mailto then assume mailto
                if (match[2] == match[3]) url = 'mailto:' + url;
                i = match.index;
                addText(raw.substr(0, i));
                addLink(url, match[0].replace(MAILTO_REGEXP, ''));
                raw = raw.substring(i + match[0].length);
            }
            addText(raw);
            return $sanitize(html.join(''));

            function addText(text) {
                if (!text) {
                    return;
                }
                html.push(sanitizeText(text));
            }

            function addLink(url, text) {
                html.push('<a ');
                if (angular.isDefined(target)) {
                    html.push('target="');
                    html.push(target);
                    html.push('" ');
                }
                html.push('href="');
                html.push(url);
                html.push('">');
                addText(text);
                html.push('</a>');
            }
        };
    }]);


})(window, window.angular);
/**
 * Enhanced Select2 Dropmenus
 *
 * @AJAX Mode - When in this mode, your value will be an object (or array of objects) of the data used by Select2
 *     This change is so that you do not have to do an additional query yourself on top of Select2's own query
 * @params [options] {object} The configuration options passed to $.fn.select2(). Refer to the documentation
 */
angular.module('ui.select2', []).value('uiSelect2Config', {}).directive('uiSelect2', ['uiSelect2Config', '$timeout', function (uiSelect2Config, $timeout) {
    var options = {};
    if (uiSelect2Config) {
        angular.extend(options, uiSelect2Config);
    }
    return {
        require: 'ngModel',
        priority: 1,
        compile: function (tElm, tAttrs) {
            var watch,
                repeatOption,
                repeatAttr,
                isSelect = tElm.is('select'),
                isMultiple = angular.isDefined(tAttrs.multiple);

            // Enable watching of the options dataset if in use
            if (tElm.is('select')) {
                repeatOption = tElm.find( 'optgroup[ng-repeat], optgroup[data-ng-repeat], option[ng-repeat], option[data-ng-repeat]');

                if (repeatOption.length) {
                    repeatAttr = repeatOption.attr('ng-repeat') || repeatOption.attr('data-ng-repeat');
                    watch = jQuery.trim(repeatAttr.split('|')[0]).split(' ').pop();
                }
            }

            return function (scope, elm, attrs, controller) {
                // instance-specific options
                var opts = angular.extend({}, options, scope.$eval(attrs.uiSelect2));

                /*
                 Convert from Select2 view-model to Angular view-model.
                 */
                var convertToAngularModel = function(select2_data) {
                    var model;
                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(select2_data, function(value, index) {
                            model.push(value.id);
                        });
                    } else {
                        model = select2_data;
                    }
                    return model;
                };

                /*
                 Convert from Angular view-model to Select2 view-model.
                 */
                var convertToSelect2Model = function(angular_data) {
                    var model = [];
                    if (!angular_data) {
                        return model;
                    }

                    if (opts.simple_tags) {
                        model = [];
                        angular.forEach(
                            angular_data,
                            function(value, index) {
                                model.push({'id': value, 'text': value});
                            });
                    } else {
                        model = angular_data;
                    }
                    return model;
                };

                if (isSelect) {
                    // Use <select multiple> instead
                    delete opts.multiple;
                    delete opts.initSelection;
                } else if (isMultiple) {
                    opts.multiple = true;
                }

                if (controller) {
                    // Watch the model for programmatic changes
                    scope.$watch(tAttrs.ngModel, function(current, old) {
                        if (!current) {
                            return;
                        }
                        if (current === old) {
                            return;
                        }
                        controller.$render();
                    }, true);
                    controller.$render = function () {
                        if (isSelect) {
                            elm.select2('val', controller.$viewValue);
                        } else {
                            if (opts.multiple) {
                                var viewValue = controller.$viewValue;
                                if (angular.isString(viewValue)) {
                                    viewValue = viewValue.split(',');
                                }
                                elm.select2(
                                    'data', convertToSelect2Model(viewValue));
                            } else {
                                if (angular.isObject(controller.$viewValue)) {
                                    elm.select2('data', controller.$viewValue);
                                } else if (!controller.$viewValue) {
                                    elm.select2('data', null);
                                } else {
                                    elm.select2('val', controller.$viewValue);
                                }
                            }
                        }
                    };

                    // Watch the options dataset for changes
                    if (watch) {
                        scope.$watch(watch, function (newVal, oldVal, scope) {
                            if (angular.equals(newVal, oldVal)) {
                                return;
                            }
                            // Delayed so that the options have time to be rendered
                            $timeout(function () {
                                elm.select2('val', controller.$viewValue);
                                // Refresh angular to remove the superfluous option
                                elm.trigger('change');
                                if(newVal && !oldVal && controller.$setPristine) {
                                    controller.$setPristine(true);
                                }
                            });
                        });
                    }

                    // Update valid and dirty statuses
                    controller.$parsers.push(function (value) {
                        var div = elm.prev();
                        div
                            .toggleClass('ng-invalid', !controller.$valid)
                            .toggleClass('ng-valid', controller.$valid)
                            .toggleClass('ng-invalid-required', !controller.$valid)
                            .toggleClass('ng-valid-required', controller.$valid)
                            .toggleClass('ng-dirty', controller.$dirty)
                            .toggleClass('ng-pristine', controller.$pristine);
                        return value;
                    });

                    if (!isSelect) {
                        // Set the view and model value and update the angular template manually for the ajax/multiple select2.
                        elm.bind("change", function (e) {
                            e.stopImmediatePropagation();

                            if (scope.$$phase || scope.$root.$$phase) {
                                return;
                            }
                            scope.$apply(function () {
                                controller.$setViewValue(
                                    convertToAngularModel(elm.select2('data')));
                            });
                        });

                        if (opts.initSelection) {
                            var initSelection = opts.initSelection;
                            opts.initSelection = function (element, callback) {
                                initSelection(element, function (value) {
                                    var isPristine = controller.$pristine;
                                    controller.$setViewValue(convertToAngularModel(value));
                                    callback(value);
                                    if (isPristine) {
                                        controller.$setPristine();
                                    }
                                    elm.prev().toggleClass('ng-pristine', controller.$pristine);
                                });
                            };
                        }
                    }
                }

                elm.bind("$destroy", function() {
                    elm.select2("destroy");
                });

                attrs.$observe('disabled', function (value) {
                    elm.select2('enable', !value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.select2('readonly', !!value);
                });

                if (attrs.ngMultiple) {
                    scope.$watch(attrs.ngMultiple, function(newVal) {
                        attrs.$set('multiple', !!newVal);
                        elm.select2(opts);
                    });
                }

                // Initialize the plugin late so that the injected DOM does not disrupt the template compiler
                $timeout(function () {
                    elm.select2(opts);

                    // Set initial value - I'm not sure about this but it seems to need to be there
                    elm.select2('data', controller.$modelValue);
                    // important!
                    controller.$render();

                    // Not sure if I should just check for !isSelect OR if I should check for 'tags' key
                    if (!opts.initSelection && !isSelect) {
                        var isPristine = controller.$pristine;
                        controller.$setViewValue(
                            convertToAngularModel(elm.select2('data'))
                        );
                        if (isPristine) {
                            controller.$setPristine();
                        }
                        elm.prev().toggleClass('ng-pristine', controller.$pristine);
                    }
                });
            };
        }
    };
}]);
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
/*! angular-gantt 23-10-2014 */
var gantt=angular.module("gantt",[]);gantt.directive("gantt",["Gantt","dateFunctions","mouseOffset","debounce","keepScrollPos",function(a,b,c,d,e){return{restrict:"EA",replace:!0,templateUrl:function(a,b){return void 0===b.templateUrl?"template/gantt.tmpl.html":b.templateUrl},scope:{sortMode:"=?",viewScale:"=?",columnWidth:"=?",columnSubScale:"=?",allowTaskMoving:"=?",allowTaskResizing:"=?",allowRowSorting:"=?",fromDate:"=?",toDate:"=?",firstDayOfWeek:"=?",weekendDays:"=?",showWeekends:"=?",workHours:"=?",showNonWorkHours:"=?",autoExpand:"=?",maxHeight:"=?",labelsWidth:"=?",data:"=?",loadData:"&",removeData:"&",clearData:"&",centerDate:"&",onGanttReady:"&",onRowAdded:"&",onRowClicked:"&",onRowUpdated:"&",onScroll:"&",onTaskClicked:"&",onTaskUpdated:"&"},controller:["$scope","$element",function(f,g){void 0===f.sortMode&&(f.sortMode="name"),void 0===f.viewScale&&(f.viewScale="hour"),void 0===f.columnWidth&&(f.columnWidth=2),void 0===f.columnSubScale&&(f.columnSubScale=4),void 0===f.allowTaskMoving&&(f.allowTaskMoving=!0),void 0===f.allowTaskResizing&&(f.allowTaskResizing=!0),void 0===f.allowRowSorting&&(f.allowRowSorting=!0),void 0===f.firstDayOfWeek&&(f.firstDayOfWeek=1),void 0===f.weekendDays&&(f.weekendDays=[0,6]),void 0===f.showWeekends&&(f.showWeekends=!0),void 0===f.workHours&&(f.workHours=[8,9,10,11,12,13,14,15,16]),void 0===f.showNonWorkHours&&(f.showNonWorkHours=!0),void 0===f.maxHeight&&(f.maxHeight=0),void 0===f.autoExpand&&(f.autoExpand=!1),void 0===f.labelsWidth&&(f.labelsWidth=0),f.gantt=new a(f.viewScale,f.columnWidth,f.columnSubScale,f.firstDayOfWeek,f.weekendDays,f.showWeekends,f.workHours,f.showNonWorkHours),f.gantt.expandDefaultDateRange(f.fromDate,f.toDate),f.ganttScroll=angular.element(g.children()[2]),f.getGantt=function(){return f.gantt},f.$watch("sortMode",function(a,b){angular.equals(a,b)||f.sortRows()}),f.$watch("data",function(a,b){angular.equals(a,b)||(f.removeAllData(),f.setData(a))}),f.$watch("viewScale+columnWidth+columnSubScale+fromDate+toDate+firstDayOfWeek+weekendDays+showWeekends+workHours+showNonWorkHours",function(a,b){angular.equals(a,b)||(f.gantt.setViewScale(f.viewScale,f.columnWidth,f.columnSubScale,f.firstDayOfWeek,f.weekendDays,f.showWeekends,f.workHours,f.showNonWorkHours),f.gantt.reGenerateColumns())}),f.$watch("fromDate+toDate",function(a,b){angular.equals(a,b)||f.gantt.expandDefaultDateRange(f.fromDate,f.toDate)}),f.getPxToEmFactor=function(){return f.ganttScroll.children()[0].offsetWidth/f.gantt.width},f.swapRows=function(a,b){f.gantt.swapRows(a,b),f.raiseRowUpdatedEvent(a),f.raiseRowUpdatedEvent(b),"custom"!==f.sortMode?f.sortMode="custom":f.sortRows()},f.sortRows=function(){f.gantt.sortRows(f.sortMode)},f.scrollTo=function(a){f.ganttScroll[0].scrollLeft=a,f.ganttScroll.triggerHandler("scroll")},f.scrollLeft=function(a){f.ganttScroll[0].scrollLeft-=a,f.ganttScroll.triggerHandler("scroll")},f.scrollRight=function(a){f.ganttScroll[0].scrollLeft+=a,f.ganttScroll.triggerHandler("scroll")},f.scrollToDate=function(a){var b=f.gantt.getColumnByDate(a);if(void 0!==b){var c=(b.left+b.width/2)*f.getPxToEmFactor();f.ganttScroll[0].scrollLeft=c-f.ganttScroll[0].offsetWidth/2}},f.autoExpandColumns=e(f,function(a,c,d){if(f.autoExpand===!0){var e,g,h=1,i=31;"left"===d?(e="hour"===f.viewScale?b.addDays(c,-h,!0):b.addDays(c,-i,!0),g=c):(e=c,g="hour"===f.viewScale?b.addDays(c,h,!0):b.addDays(c,i,!0)),f.gantt.expandDefaultDateRange(e,g)}}),f.raiseRowAddedEvent=function(a){f.onRowAdded({event:{row:a}})},f.raiseDOMRowClickedEvent=function(a,b){var d=c.getOffset(a).x,e=d/f.getPxToEmFactor(),g=f.gantt.getColumnByPosition(e),h=f.gantt.getDateByPosition(e);taskHasBeenMoved===!1&&f.raiseRowClickedEvent(b,g,h),a.stopPropagation(),a.preventDefault()},f.raiseRowClickedEvent=function(a,b,c){f.taskUpdated?f.taskUpdated=!1:f.onRowClicked({event:{row:a,column:b.clone(),date:c}})},f.raiseRowUpdatedEvent=function(a){f.onRowUpdated({event:{row:a}})},f.raiseScrollEvent=d(function(){var a,b,c=f.ganttScroll[0];0===c.scrollLeft?(a="left",b=f.gantt.getDateRange().from):c.offsetWidth+c.scrollLeft>=c.scrollWidth&&(a="right",b=f.gantt.getDateRange().to),void 0!==b&&(f.autoExpandColumns(c,b,a),f.onScroll({event:{date:b,direction:a}}))},5),f.raiseDOMTaskClickedEvent=function(a,b){var d=c.getOffset(a).x,e=d/f.getPxToEmFactor(),g=f.gantt.getPositionByDate(b.from),h=f.gantt.getDateByPosition(e+g);f.raiseTaskClickedEvent(a,b,h),a.stopPropagation(),a.preventDefault()},f.raiseTaskClickedEvent=function(a,b,c){f.taskUpdated?f.taskUpdated=!1:f.onTaskClicked({event:{event:a,task:b,date:c}})},f.raiseTaskUpdatedEvent=function(a){f.onTaskUpdated({event:{task:a}}),f.taskUpdated=!0},f.setData=e(f,function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b],e=f.gantt.addRow(d),g=f.gantt.rowsMap[d.id];e===!0?f.raiseRowUpdatedEvent(g):f.raiseRowAddedEvent(g)}f.sortRows()}),f.removeData({fn:function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];if(void 0!==d.tasks&&d.tasks.length>0){if(d.id in f.gantt.rowsMap){for(var e=f.gantt.rowsMap[d.id],g=0,h=d.tasks.length;h>g;g++)e.removeTask(d.tasks[g].id);f.raiseRowUpdatedEvent(e)}}else f.gantt.removeRow(d.id)}f.sortRows()}}),f.removeAllData=function(){f.gantt.removeRows()},f.ganttScroll.bind("scroll",f.raiseScrollEvent),f.loadData({fn:f.setData}),f.clearData({fn:f.removeAllData}),f.centerDate({fn:f.scrollToDate}),f.onGanttReady({gantt:f.gantt})}]}}]),gantt.factory("Column",["dateFunctions",function(a){var b=function(a,b,c){return Math.round(b/a.width*c/(b/a.subScale))*(b/a.subScale)},c=function(a,b,c,d,e,f){var g;return g=b-a.date>0&&e!==f?1:Math.round(d/c*a.subScale)/a.subScale,Math.round(10*(a.left+a.width*g))/10},d=function(a,b,c,e){var f=this;f.date=a,f.left=b,f.width=c,f.subScale=e,f.clone=function(){return new d(f.date,f.left,f.width,f.subScale)},f.equals=function(a){return f.date===a.date}},e=function(e,f,g,h){var i=new d(e,f,g,h);return i.daysInMonth=a.getDaysInMonth(i.date),i.clone=function(){return new d(i.date,i.left,i.width,i.subScale)},i.getDateByPosition=function(c){0>c&&(c=0),c>i.width&&(c=i.width);var d=a.clone(i.date);return d.setDate(1+b(i,i.daysInMonth,c)),d},i.getPositionByDate=function(a){return c(i,a,i.daysInMonth,a.getDate(),a.getMonth(),i.date.getMonth())},i},f=function(e,f,g,h,i){var j=new d(e,f,g,h);j.week=a.getWeek(e),j.firstDayOfWeek=i,j.daysInWeek=7,j.clone=function(){var a=new d(j.date,j.left,j.width,j.subScale);return a.week=j.week,a};var k=function(a){return(j.daysInWeek-j.firstDayOfWeek+a)%j.daysInWeek},l=function(a){return(j.firstDayOfWeek+a)%j.daysInWeek};return j.getDateByPosition=function(c){0>c&&(c=0),c>j.width&&(c=j.width);var d=a.clone(j.date),e=Math.round(b(j,j.daysInWeek,c)),f=7!==e&&e<j.firstDayOfWeek?-1:1;return a.setToDayOfWeek(d,7!==e?l(e):l(e)+7,!1,f),d},j.getPositionByDate=function(b){return c(j,b,j.daysInWeek,k(b.getDay()),a.getWeek(b),a.getWeek(j.date))},j},g=function(e,f,g,h,i){var j=new d(e,f,g,h);return j.isWeekend=i,j.clone=function(){var a=new d(j.date,j.left,j.width,j.subScale);return a.isWeekend=j.isWeekend,a},j.getDateByPosition=function(c){0>c&&(c=0),c>j.width&&(c=j.width);var d=a.clone(j.date);return d.setHours(b(j,24,c)),d},j.getPositionByDate=function(a){return c(j,a,24,a.getHours(),a.getDate(),j.date.getDate())},j},h=function(e,f,g,h,i,j){var k=new d(e,f,g,h);return k.isWeekend=i,k.isWorkHour=j,k.clone=function(){var a=new d(k.date,k.left,k.width,k.subScale);return a.isWeekend=k.isWeekend,a.isWorkHour=k.isWorkHour,a},k.getDateByPosition=function(c){0>c&&(c=0),c>k.width&&(c=k.width);var d=a.clone(k.date);return d.setMinutes(b(k,60,c)),d},k.getPositionByDate=function(a){return c(k,a,60,a.getMinutes(),a.getHours(),k.date.getHours())},k},i=function(e,f,g,h,i,j){var k=new d(e,f,g,h);return k.isWeekend=i,k.isWorkHour=j,k.clone=function(){var a=new d(k.date,k.left,k.width,k.subScale);return a.isWeekend=k.isWeekend,a.isWorkHour=k.isWorkHour,a},k.getDateByPosition=function(c){0>c&&(c=0),c>k.width&&(c=k.width);var d=a.clone(k.date);return d.setMinutes(b(k,60,c)),d},k.getPositionByDate=function(a){return c(k,a,60,a.getMinutes(),a.getHours(),k.date.getHours())},k};return{QuarterHour:i,Hour:h,Day:g,Week:f,Month:e}}]),gantt.factory("ColumnGenerator",["Column","dateFunctions",function(a,b){var c=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1},d=function(a,b){for(var c=0,d=a.length;d>c;c++)if(a[c]===b)return!0;return!1},e=function(e,f,g,h,i,j){this.generate=function(k,l){var m=b.isTimeZero(l);k=b.setTimeZero(k,!0),l=b.setTimeZero(l,!0);for(var n=b.clone(k),o=[],p=0;m&&l-n>0||!m&&l-n>=0;){for(var q=c(g,n.getDay()),r=0;24>r;r++)for(var s=d(i,r),t=0;60>t;t+=15){var u=new Date(n.getFullYear(),n.getMonth(),n.getDate(),r,t,0);console.log(u),(q&&h||!q)&&(!s&&j||s)&&(o.push(new a.Hour(u,p,e,f,q,s)),p+=e)}n=b.addDays(n,1)}return o}},f=function(e,f,g,h,i,j){this.generate=function(k,l){var m=b.isTimeZero(l);k=b.setTimeZero(k,!0),l=b.setTimeZero(l,!0);for(var n=b.clone(k),o=[],p=0;m&&l-n>0||!m&&l-n>=0;){for(var q=c(g,n.getDay()),r=0;24>r;r++){var s=new Date(n.getFullYear(),n.getMonth(),n.getDate(),r,0,0),t=d(i,r);(q&&h||!q)&&(!t&&j||t)&&(o.push(new a.Hour(s,p,e,f,q,t)),p+=e)}n=b.addDays(n,1)}return o}},g=function(d,e,f,g){this.generate=function(h,i){var j=b.isTimeZero(i);h=b.setTimeZero(h,!0),i=b.setTimeZero(i,!0);for(var k=b.clone(h),l=[],m=0;j&&i-k>0||!j&&i-k>=0;){var n=c(f,k.getDay());(n&&g||!n)&&(l.push(new a.Day(b.clone(k),m,d,e,n)),m+=d),k=b.addDays(k,1)}return l}},h=function(c,d,e){this.generate=function(f,g){var h=g.getDay()===e&&b.isTimeZero(g);f=b.setToDayOfWeek(b.setTimeZero(f,!0),e,!1),g=b.setToDayOfWeek(b.setTimeZero(g,!0),e,!1);for(var i=b.clone(f),j=[],k=0;h&&g-i>0||!h&&g-i>=0;)j.push(new a.Week(b.clone(i),k,c,d,e)),k+=c,i=b.addWeeks(i,1);return j}},i=function(c,d){this.generate=function(e,f){var g=1===f.getDate()&&b.isTimeZero(f);e=b.setToFirstDayOfMonth(b.setTimeZero(e,!0),!1),f=b.setToFirstDayOfMonth(b.setTimeZero(f,!0),!1);for(var h=b.clone(e),i=[],j=0;g&&f-h>0||!g&&f-h>=0;)i.push(new a.Month(b.clone(h),j,c,d)),j+=c,h=b.addMonths(h,1);return i}};return{QuarterHourGenerator:e,HourGenerator:f,DayGenerator:g,WeekGenerator:h,MonthGenerator:i}}]),gantt.factory("Gantt",["Row","ColumnGenerator","HeaderGenerator","dateFunctions","binarySearch",function(a,b,c,d,e){var f=function(f,g,h,i,j,k,l,m){var n=this;n.rowsMap={},n.rows=[],n.columns=[],n.headers={},n.width=0;var o;n.setViewScale=function(a,d,e,f,g,h,i,j){switch(a){case"hour":n.columnGenerator=new b.HourGenerator(d,e,g,h,i,j);break;case"day":n.columnGenerator=new b.DayGenerator(d,e,g,h);break;case"week":n.columnGenerator=new b.WeekGenerator(d,e,f);break;case"month":n.columnGenerator=new b.MonthGenerator(d,e);break;default:throw"Unsupported view scale: "+a}n.headerGenerator=new c.instance(a)},n.setViewScale(f,g,h,i,j,k,l,m),n.expandDefaultDateRange=function(a,b){void 0!==a&&void 0!==b&&(p(a,b),r())},n.setDefaultDateRange=function(a,b){void 0!==a&&void 0!==b&&(q(a,b),n.reGenerateColumns())};var p=function(a,b){a=d.clone(a),b=d.clone(b),void 0===o?(o={},o.from=a,o.to=b):(a<o.from&&(o.from=a),b>o.to&&(o.to=b))},q=function(a,b){a=d.clone(a),b=d.clone(b),void 0===o&&(o={}),o.from=a,o.to=b};n.toJSON=function(){for(var a={rows:[]},b=0,c=n.rows.length;c>b;b++)a.rows.push(n.rows[b].toJSON());return a};var r=function(){if(void 0===o)throw"From and to date range cannot be undefined";if(0===n.columns.length)s(o.from,o.to);else if(n.getFirstColumn().date>o.from||n.getLastColumn().date<o.to){var a=n.getFirstColumn().date>o.from?o.from:n.getFirstColumn().date,b=n.getLastColumn().date<o.to?o.to:n.getLastColumn().date;s(a,b)}},s=function(a,b){n.columns=n.columnGenerator.generate(a,b),n.headers=n.headerGenerator.generate(n.columns),n.updateTasksPosAndSize();var c=n.getLastColumn();n.width=void 0!==c?c.left+c.width:0};n.reGenerateColumns=function(){n.columns=[],r()},n.updateTasksPosAndSize=function(){for(var a=0,b=n.rows.length;b>a;a++)for(var c=0,d=n.rows[a].tasks.length;d>c;c++)n.rows[a].tasks[c].updatePosAndSize()},n.getLastColumn=function(){return n.columns.length>0?n.columns[n.columns.length-1]:void 0},n.getFirstColumn=function(){return n.columns.length>0?n.columns[0]:void 0},n.getColumnByDate=function(a){return e.get(n.columns,a,function(a){return a.date})[0]},n.getColumnByPosition=function(a){return e.get(n.columns,a,function(a){return a.left})[0]},n.getDateByPosition=function(a){var b=n.getColumnByPosition(a);return void 0!==b?b.getDateByPosition(a-b.left):void 0},n.getPositionByDate=function(a){var b=n.getColumnByDate(a);return void 0!==b?b.getPositionByDate(a):void 0},n.getDateRange=function(){return void 0===o?void 0:{from:d.clone(o.from),to:d.clone(o.to)}},n.getTasksDateRange=function(){if(0===n.rows.length)return void 0;for(var a,b,c=0,d=n.rows.length;d>c;c++){var e=n.rows[c];(void 0===a||e.minFromDate<a)&&(a=e.minFromDate),(void 0===b||e.maxToDate>b)&&(b=e.maxToDate)}return{from:a,to:b}},n.getActiveHeadersCount=function(){var a,b=0;for(a in n.headers)n.headers.hasOwnProperty(a)&&b++;return b},n.addRow=function(b){var c,d=!1;if(b.id in n.rowsMap)c=n.rowsMap[b.id],c.copy(b),d=!0;else{var e=b.order;void 0===e&&(e=n.highestRowOrder),e>=n.highestRowOrder&&(n.highestRowOrder=e+1),c=new a(b.id,n,b.description,e,b.data),n.rowsMap[b.id]=c,n.rows.push(c)}if(void 0!==b.tasks){for(var f=0,g=b.tasks.length;g>f;f++){var h=c.addTask(b.tasks[f]);if(p(h.from,h.to),h.updatePosAndSize(),void 0!==b.tasks[f].child)for(var i=0,j=b.tasks[f].child.length;j>i;i++){var k=b.tasks[f].child[i];k.data.parent=h,k=h.row.addTask(k),h.child.push(k),k.updatePosAndSize()}}r()}return d},n.removeRow=function(a){if(a in n.rowsMap){delete n.rowsMap[a];for(var b=0,c=n.rows.length;c>b;b++){var d=n.rows[b];if(d.id===a)return n.rows.splice(b,1),d}}return void 0},n.removeRows=function(){n.rowsMap={},n.rows=[],n.highestRowOrder=0,n.columns=[],o=void 0},n.swapRows=function(a,b){var c=a.order;a.order=b.order,b.order=c};var t=function(a,b){return void 0===a.minFromDate&&void 0===b.minFromDate?u(a,b):void 0===a.minFromDate?1:void 0===b.minFromDate?-1:a.minFromDate-b.minFromDate},u=function(a,b){return a.description===b.description?0:a.description<b.description?-1:1},v=function(a,b){return void 0===a.order&&void 0===b.order?u(a,b):void 0===a.order?1:void 0===b.order?-1:a.order-b.order};n.sortRows=function(a){switch(a){case"name":n.rows.sort(u);break;case"custom":n.rows.sort(v);break;default:n.rows.sort(t)}}};return f}]),gantt.factory("HeaderGenerator",["Column","dateFunctions",function(a,b){var c=function(c){var d=[];console.log(c);for(var e,f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getHours()!==h.date.getHours()?(e=new a.QuarterHour(b.clone(h.date),h.left,h.width,h.isWeekend,h.isWorkHour),d.push(e)):e.width+=h.width}return d},d=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getHours()!==h.date.getHours()?(d=new a.Hour(b.clone(h.date),h.left,h.width,h.isWeekend,h.isWorkHour),e.push(d)):d.width+=h.width}return e},e=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getDay()!==h.date.getDay()?(d=new a.Day(b.clone(h.date),h.left,h.width,h.isWeekend),e.push(d)):d.width+=h.width}return e},f=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||b.getWeek(c[f-1].date)!==b.getWeek(h.date)?(d=new a.Week(b.clone(h.date),h.left,h.width,b.getWeek(h.date)),e.push(d)):d.width+=h.width}return e},g=function(c){for(var d,e=[],f=0,g=c.length;g>f;f++){var h=c[f];0===f||c[f-1].date.getMonth()!==h.date.getMonth()?(d=new a.Month(b.clone(h.date),h.left,h.width),e.push(d)):d.width+=h.width}return e};return{instance:function(a){this.generate=function(b){var h={};switch(a){case"quarter hour":h.quarterhour=c(b),h.hour=d(b),h.day=e(b);break;case"hour":h.hour=d(b),h.day=e(b);break;case"day":h.day=e(b),h.week=f(b),h.month=g(b);break;case"week":h.week=f(b),h.month=g(b);break;case"month":h.month=g(b);break;default:throw"Unsupported view scale: "+a}return h}}}}]),gantt.factory("Row",["Task","dateFunctions",function(a,b){var c=function(d,e,f,g,h){var i=this;i.id=d,i.gantt=e,i.description=f,i.order=g,i.tasksMap={},i.tasks=[],i.data=h,i.addTask=function(b){var c;return b.id in i.tasksMap?(c=i.tasksMap[b.id],c.copy(b)):(c=new a(b.id,i,b.subject,b.color,b.from,b.to,b.data),i.tasksMap[b.id]=c,i.tasks.push(c)),i.sortTasks(),i.setMinMaxDateByTask(c),c},i.toJSON=function(){for(var a={id:i.id,description:i.description,data:i.data,tasks:[]},b=0,c=i.tasks.length;c>b;b++)i.tasks[b].data.parent===!1&&a.tasks.push(i.tasks[b].toJSON());return a},i.moveTaskToRow=function(a){if(!a.data.locked){for(var b=0;b<a.child.length;b++)i.moveTaskToRow(a.child[b]);a.row.removeTask(a.id),i.tasksMap[a.id]=a,i.tasks.push(a),i.setTasksMinMaxDate(),a.row=i,a.updatePosAndSize()}},i.removeTask=function(a){if(a in i.tasksMap){delete i.tasksMap[a];for(var b=0,c=i.tasks.length;c>b;b++){var d=i.tasks[b];if(d.id===a){if(d.data.parent===!1)for(var e=0;e<d.child.length;e++)i.removeTask(d.child[e].id);return i.tasks.splice(b,1),(i.minFromDate-d.from===0||i.maxToDate-d.to===0)&&i.setTasksMinMaxDate(),d}}}},i.setTasksMinMaxDate=function(){i.minFromDate=void 0,i.maxToDate=void 0;for(var a=0,b=i.tasks.length;b>a;a++)i.setMinMaxDateByTask(i.tasks[a])},i.setMinMaxDateByTask=function(a){void 0===i.minFromDate?i.minFromDate=b.clone(a.from):a.from<i.minFromDate&&(i.minFromDate=b.clone(a.from)),void 0===i.maxToDate?i.maxToDate=b.clone(a.to):a.to>i.maxToDate&&(i.maxToDate=b.clone(a.to))},i.sortTasks=function(){i.tasks.sort(function(a,b){return a.left-b.left})},i.copy=function(a){i.description=a.description,i.data=a.data,void 0!==a.order&&(i.order=a.order)},i.clone=function(){for(var a=new c(i.id,i.gantt,i.description,i.order,i.data),b=0,d=i.tasks.length;d>b;b++)a.addTask(i.tasks[b].clone());return a}};return c}]),gantt.factory("Task",["dateFunctions",function(a){var b=function(c,d,e,f,g,h,i){var j=this;j.id=c,j.gantt=d.gantt,j.row=d,j.subject=e,j.color=f,j.from=a.clone(g),j.to=a.clone(h),j.data=i,j.child=[],"undefined"==typeof j.data?j.data={parent:!1,locked:!1}:("undefined"==typeof j.data.parent&&(j.data.parent=!1),"undefined"==typeof j.data.locked&&(j.data.locked=!1)),j.toJSON=function(){var a={subject:j.subject,id:c,from:j.from.valueOf(),to:j.to.valueOf(),data:j.objectClone(j.data),child:[]};a.data.parent=!1;for(var b=0,d=j.child.length;d>b;b++)a.child.push(j.child[b].toJSON());return a},j.checkIfMilestone=function(){j.isMilestone=j.from-j.to===0},j.checkIfMilestone(),j.updatePosAndSize=function(){j.left=j.gantt.getPositionByDate(j.from),j.width=Math.round(10*(j.gantt.getPositionByDate(j.to)-j.left))/10},j.setFrom=function(a){if(!j.data.locked){j.data.parent===!1?a>j.left+j.width?a=j.left+j.width:0>a&&(a=0):a>j.left+j.width?a=j.left+j.width:a<j.data.parent.left&&(a=j.data.parent.left);for(var b=0;b<j.child.length;b++)a>j.child[b].left&&(a=j.child[b].left);j.from=j.gantt.getDateByPosition(a),j.row.setMinMaxDateByTask(j),j.updatePosAndSize(),j.checkIfMilestone()}},j.setTo=function(a){if(!j.data.locked){j.data.parent===!1?a<j.left?a=j.left:a>j.gantt.width&&(a=j.gantt.width):a<j.left?a=j.left:a>j.data.parent.width+j.data.parent.left&&(a=j.data.parent.width+j.data.parent.left);for(var b=0;b<j.child.length;b++)a<j.child[b].left+j.child[b].width&&(a=j.child[b].left+j.child[b].width);j.to=j.gantt.getDateByPosition(a),j.row.setMinMaxDateByTask(j),j.updatePosAndSize(),j.checkIfMilestone()}},j.updateZIndex=function(a){$.each(j.row.tasks,function(b,c){c[a+"ZIndex"]()})},j.removeFromParent=function(){for(var a=j.data.parent,b=0;b<a.child.length;b++)a.child[b].id===j.id&&a.child.splice(b,1)},j.boostZIndex=function(){"undefined"!=typeof j.data.zIndex&&(j.data.tempZIndex=j.data.zIndex,j.data.zIndex+=1e3)},j.clearZIndex=function(){"undefined"!=typeof j.data.tempZIndex&&(j.data.zIndex=j.data.tempZIndex,delete j.data.tempZIndex)},j.moveTo=function(a){j.data.locked||(j.data.parent===!1?0>a?a=0:a+j.width>=j.gantt.width&&(a=j.gantt.width-j.width):a<j.data.parent.left?a=j.data.parent.left:a+j.width>=j.data.parent.width+j.data.parent.left&&(a=j.data.parent.left+j.data.parent.width-j.width),j.from=j.gantt.getDateByPosition(a),j.left=j.gantt.getPositionByDate(j.from),j.to=j.gantt.getDateByPosition(j.left+j.width),j.width=Math.round(10*(j.gantt.getPositionByDate(j.to)-j.left))/10,j.row.setMinMaxDateByTask(j))},j.copy=function(b){j.subject=b.subject,j.color=b.color,j.from=a.clone(b.from),j.to=a.clone(b.to),j.data=b.data,j.isMilestone=b.isMilestone},j.clone=function(){return new b(j.id,j.row,j.subject,j.color,j.from,j.to,j.data)},j.objectClone=function(a){var b={};return angular.forEach(a,function(a,c){b[c]=a}),b}};return b}]),gantt.service("binarySearch",[function(){return{getIndicesOnly:function(a,b,c){for(var d=-1,e=a.length;e-d>1;){var f=Math.floor((d+e)/2);c(a[f])<=b?d=f:e=f}return void 0!==a[d]&&c(a[d])===b&&(e=d),[d,e]},get:function(a,b,c){var d=this.getIndicesOnly(a,b,c);return[a[d[0]],a[d[1]]]}}}]),gantt.service("dateFunctions",[function(){return{isNumber:function(a){return!isNaN(parseFloat(a))&&isFinite(a)},isString:function(a){return"string"==typeof a||"object"==typeof a&&a.constructor===String},clone:function(a){return new Date(this.isString(a)?Date.parse(a):this.isNumber(a)?a:a.getTime())},setTimeZero:function(a,b){var c=b===!0?this.clone(a):a;return c.setHours(0),c.setMinutes(0),c.setMilliseconds(0),c},setTimeComponent:function(a,b){return new Date(a.getFullYear(),a.getMonth(),a.getDate(),0,0,0,b)},setToFirstDayOfMonth:function(a,b){var c=b===!0?this.clone(a):a;return c.setDate(1),c},setToDayOfWeek:function(a,b,c,d){var e=c===!0?this.clone(a):a;if(e.getDay()===b)return e;d=d||-1;var f=(b-e.getDay()+7*(d||1))%7;return this.addDays(e,0===f?f+=7*(d||1):f)},addMonths:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(1),d.setMonth(d.getMonth()+b),d},addWeeks:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(d.getDate()+7*b),d},addDays:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setDate(d.getDate()+b),d},addHours:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setHours(d.getHours()+b),d},addMinutes:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setMinutes(d.getMinutes()+b),d},addMilliseconds:function(a,b,c){var d=c===!0?this.clone(a):a;return d.setMilliseconds(d.getMilliseconds()+b),d},isTimeZero:function(a){return 0===a.getHours()&&0===a.getMinutes()&&0===a.getMinutes()&&0===a.getMilliseconds()},getDaysInMonth:function(a){return new Date(a.getYear(),a.getMonth()+1,0).getDate()},getWeek:function(a){var b,c,d,e,f,g,h,i,j,k,l,m,n;return b=a.getFullYear(),c=a.getMonth()+1,d=a.getDate(),2>=c?(e=b-1,f=(e/4|0)-(e/100|0)+(e/400|0),g=((e-1)/4|0)-((e-1)/100|0)+((e-1)/400|0),m=f-g,i=0,j=d-1+31*(c-1)):(e=b,f=(e/4|0)-(e/100|0)+(e/400|0),g=((e-1)/4|0)-((e-1)/100|0)+((e-1)/400|0),m=f-g,i=m+1,j=d+(153*(c-3)+2)/5+58+m),k=(e+f)%7,h=(j+k-i)%7,l=j+3-h|0,n=0>l?53-((k-m)/5|0):l>364+m?1:(l/7|0)+1,b=c=d=null,n}}}]),gantt.filter("ganttColumnLimit",["binarySearch",function(a){return function(b,c,d){var e=function(a){return a.left},f=a.getIndicesOnly(b,c,e)[0],g=a.getIndicesOnly(b,c+d,e)[1];return b.slice(f,g)}}]),gantt.directive("ganttLimitUpdater",["$timeout",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){var d=c[0],e=function(){b.scroll_start=d.scrollLeft/b.getPxToEmFactor(),b.scroll_width=d.offsetWidth/b.getPxToEmFactor()};c.bind("scroll",function(){b.$apply(function(){e()})}),b.$watch("gantt.width",function(){a(function(){e()},20,!0)})}]}}]),gantt.filter("ganttTaskLimit",[function(){return function(a,b,c){for(var d=[],e=0,f=a.length;f>e;e++){var g=a[e];(g.left>=b&&g.left<=b+c||g.left+g.width>=b&&g.left+g.width<=b+c||g.left<b&&g.left+g.width>b+c)&&d.push(g)}return d}}]),gantt.directive("ganttLabelResizable",["$document","debounce","mouseOffset",function(a,b,c){return{restrict:"A",scope:{width:"=ganttLabelResizable",minWidth:"=resizeMin"},controller:["$scope","$element",function(d,e){var f,g=5,h="ew-resize";e.bind("mousedown",function(a){j(a)&&(k(a),a.preventDefault())}),e.bind("mousemove",function(a){j(a)?e.css("cursor",h):e.css("cursor","")});var i=function(a){0===d.width&&(d.width=e[0].offsetWidth),d.width+=a-f,d.width<d.minWidth&&(d.width=d.minWidth),f=a},j=function(a){var b=c.getOffset(a).x;return b>e[0].offsetWidth-g},k=function(c){f=c.screenX,angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:h});var d=b(function(a){i(a.screenX)},5);angular.element(a[0].body).bind("mousemove",d),angular.element(a[0].body).one("mouseup",function(){angular.element(a[0].body).unbind("mousemove",d),l()})},l=function(){e.css("cursor",""),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:""})}}]}}]);var taskHasBeenMoved=!1;gantt.directive("ganttTaskMoveable",["$document","$timeout","debounce","dateFunctions","mouseOffset",function(a,b,c,d,e){return{restrict:"A",controller:["$scope","$element",function(d,f){var g,h,i,j=10,k=6,l=15,m=1,n=angular.element(a[0].body),o=f.parent().parent(),p=o.parent().parent();f.bind("mousedown",function(a){var b=v(a);""!==b&&(x(b,a),a.preventDefault())}),f.bind("mousemove",function(a){var b=v(a);""!==b&&"M"!==b?f.css("cursor",w(b)):f.css("cursor","")});var q=function(a,b){d.task.isMoving!==!1&&(r(a,b),s(a,b))},r=function(a,b){var c=b.x/d.getPxToEmFactor(),e=0;if("M"===a){var f=d.task.child;if(d.task.data.parent===!1){var h=u(b.y);if(void 0!==h&&d.task.row.id!==h.id)for(h.moveTaskToRow(d.task),e=0;e<d.task.child.length;e++)h.moveTaskToRow(d.task.child[e])}var i=d.task.left;for(d.task.moveTo(c-g),d.task.child=f,e=0;e<d.task.child.length;e++){var j=d.task.child[e].left-i;d.task.child[e].moveTo(d.task.left+j)}}else"E"===a?d.task.setTo(c):d.task.setFrom(c);taskHasBeenMoved=!0},s=function(a,c){var e=p[0].scrollLeft;if(c.x<h)c.x<=e+m&&(c.x-=l,d.scrollLeft(l),i=b(function(){q(a,c)},100,!0));else{var f=p[0].offsetWidth,g=e+f;c.x>=g-m&&(c.x+=l,d.scrollRight(l),i=b(function(){q(a,c)},100,!0))}},t=function(){void 0!==i&&(b.cancel(i),i=void 0)},u=function(a){var b=o[0].offsetHeight/d.task.row.gantt.rows.length,c=Math.floor(a/b);return d.task.row.gantt.rows[c]},v=function(a){var b=e.getOffset(a).x,c=0;return d.allowTaskResizing&&(c=f[0].offsetWidth<10?k:j),d.allowTaskResizing&&b>f[0].offsetWidth-c?"E":d.allowTaskResizing&&c>b?"W":d.allowTaskMoving&&b>=c&&b<=f[0].offsetWidth-c?"M":""},w=function(a){switch(a){case"E":return"e-resize";case"W":return"w-resize";case"M":return"move"}},x=function(b,f){d.task.isMoving=!0,h=e.getOffsetForElement(o[0],f).x;var i=h/d.getPxToEmFactor();g=i-d.task.left,angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:w(b)});var j=c(function(a){var c=e.getOffsetForElement(o[0],a);t(),q(b,c)},5);n.bind("mousemove",j),n.one("mouseup",function(){n.unbind("mousemove",j),y(f)})},y=function(){d.task.isMoving=!1,t(),taskHasBeenMoved===!0&&(d.task.row.sortTasks(),d.raiseTaskUpdatedEvent(d.task),taskHasBeenMoved=!1),f.css("cursor",""),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:""})}}]}}]),gantt.directive("ganttHorizontalScrollReceiver",["scrollManager",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){a.horizontal.push(c[0])}]}}]),gantt.service("scrollManager",[function(){return{vertical:[],horizontal:[]}}]),gantt.directive("ganttScrollSender",["scrollManager","$timeout",function(a,b){return{restrict:"A",controller:["$scope","$element",function(c,d){var e=d[0],f=function(){var b,c;for(b=0,c=a.vertical.length;c>b;b++){var d=a.vertical[b];d.style.top!==-e.scrollTop&&(d.style.top=-e.scrollTop+"px")}for(b=0,c=a.horizontal.length;c>b;b++){var f=a.horizontal[b];f.style.left!==-e.scrollLeft&&(f.style.left=-e.scrollLeft+"px")}};d.bind("scroll",f),c.$watch("gantt.width",function(a){0===a&&b(function(){f()},20,!0)})}]}}]),gantt.directive("ganttVerticalScrollReceiver",["scrollManager",function(a){return{restrict:"A",controller:["$scope","$element",function(b,c){a.vertical.push(c[0])}]}}]),gantt.service("sortManager",[function(){return{startRow:void 0}}]),gantt.directive("ganttSortable",["$document","sortManager",function(a,b){return{restrict:"E",template:"<div ng-transclude></div>",replace:!0,transclude:!0,scope:{row:"=ngModel",swap:"&",active:"=?"},controller:["$scope","$element",function(c,d){d.bind("mousedown",function(){if(c.active===!0){f();var b=function(){c.$apply(function(){angular.element(a[0].body).unbind("mouseup",b),g()})};angular.element(a[0].body).bind("mouseup",b)}}),d.bind("mousemove",function(d){if(e()){var f=angular.element(a[0].elementFromPoint(d.clientX,d.clientY)),g=f.controller("ngModel").$modelValue;c.$apply(function(){c.swap({a:g,b:b.startRow})})}});var e=function(){return void 0!==b.startRow&&!angular.equals(c.row,b.startRow)},f=function(){b.startRow=c.row,d.css("cursor","move"),angular.element(a[0].body).css({"-moz-user-select":"-moz-none","-webkit-user-select":"none","-ms-user-select":"none","user-select":"none",cursor:"no-drop"})},g=function(){b.startRow=void 0,d.css("cursor","pointer"),angular.element(a[0].body).css({"-moz-user-select":"","-webkit-user-select":"","-ms-user-select":"","user-select":"",cursor:"auto"})}}]}}]),gantt.directive("ganttTooltip",["$timeout","$document","debounce","smartEvent",function(a,b,c,d){return{restrict:"E",template:"<div ng-mouseenter='mouseEnter($event)' ng-mouseleave='mouseLeave($event)'><div ng-if='visible' class='gantt-task-info' ng-style='css'><div class='gantt-task-info-content'>{{ task.subject }}</br><small>{{ task.isMilestone === true && (task.from | date:'MMM d, HH:mm') || (task.from | date:'MMM d, HH:mm') + ' - ' + (task.to | date:'MMM d, HH:mm') }}</small></div></div><div ng-transclude></div></div>",replace:!0,transclude:!0,scope:{task:"=ngModel"},controller:["$scope","$element",function(e,f){var g=angular.element(b[0].body);e.visible=!1,e.css={},e.mouseEnter=function(a){e.task.isMoving||j(a.clientX)},e.mouseLeave=function(){e.task.isMoving||l()};var h=d(e,g,"mousemove",c(function(a){e.visible===!0?k(a.clientX):j(a.clientX)},1));e.$watch("task.isMoving",function(a){a===!0?h.bind():a===!1&&(h.unbind(),l())});var i=function(){var a=b[0];return a.documentElement.clientWidth||a.documentElement.getElementById("body")[0].clientWidth},j=function(b){e.task.updateZIndex("boost"),e.visible=!0,a(function(){var a=angular.element(f.children()[0]);k(b),e.css.top=f[0].getBoundingClientRect().top+"px",e.css.marginTop=-a[0].offsetHeight-8+"px",e.css.opacity=1},1,!0)},k=function(a){var b=angular.element(f.children()[0]);b.removeClass("gantt-task-infoArrow"),b.removeClass("gantt-task-infoArrowR"),a+b[0].offsetWidth>i()?(e.css.left=a+20-b[0].offsetWidth+"px",b.addClass("gantt-task-infoArrowR")):(e.css.left=a-20+"px",b.addClass("gantt-task-infoArrow"))},l=function(){e.task.updateZIndex("clear"),e.css.opacity=0,e.visible=!1}}]}}]),gantt.factory("debounce",["$timeout",function(a){function b(b,c){var d=0;return function(){var e=this,f=arguments;d++;var g=function(a){return function(){return a===d?b.apply(e,f):void 0}}(d);return a(g,c,!0)}}return b}]),gantt.factory("keepScrollPos",["$timeout",function(a){function b(b,c){return function(){var d=b.ganttScroll[0],e=d.scrollLeft,f=b.gantt.getFirstColumn(),g=b.getPxToEmFactor();c.apply(this,arguments),f=void 0===f?0:b.gantt.getColumnByDate(f.date).left*g,d.scrollLeft=f+e,d.scrollLeft!=f+e&&a(function(){d.scrollLeft=f+e},0,!1)}}return b}]),gantt.service("mouseOffset",[function(){return{getOffset:function(a){return a.offsetX&&a.offsetY?{x:a.offsetX,y:a.offsetY}:a.layerX&&a.layerY?{x:a.layerX,y:a.layerY}:this.getOffsetForElement(a.target,a)},getOffsetForElement:function(a,b){var c=a.getBoundingClientRect();return{x:b.clientX-c.left,y:b.clientY-c.top}}}}]),gantt.factory("smartEvent",[function(){function a(a,b,c,d){return a.$on("$destroy",function(){b.unbind(c,d)}),{bindOnce:function(){b.one(c,d)},bind:function(){b.bind(c,d)
},unbind:function(){b.unbind(c,d)}}}return a}]);
/*
Copyright 2014 Igor Vaynberg

Version: 3.4.6 Timestamp: Sat Mar 22 22:30:15 EDT 2014

This software is licensed under the Apache License, Version 2.0 (the "Apache License") or the GNU
General Public License version 2 (the "GPL License"). You may choose either license to govern your
use of this software only upon the condition that you accept all of the terms of either the Apache
License or the GPL License.

You may obtain a copy of the Apache License and the GPL License at:

http://www.apache.org/licenses/LICENSE-2.0
http://www.gnu.org/licenses/gpl-2.0.html

Unless required by applicable law or agreed to in writing, software distributed under the Apache License
or the GPL Licesnse is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
either express or implied. See the Apache License and the GPL License for the specific language governing
permissions and limitations under the Apache License and the GPL License.
*/
!function(a){"undefined"==typeof a.fn.each2&&a.extend(a.fn,{each2:function(b){for(var c=a([0]),d=-1,e=this.length;++d<e&&(c.context=c[0]=this[d])&&b.call(c[0],d,c)!==!1;);return this}})}(jQuery),function(a,b){"use strict";function n(b){var c=a(document.createTextNode(""));b.before(c),c.before(b),c.remove()}function o(a){var b,c,d,e;if(!a||a.length<1)return a;for(b="",c=0,d=a.length;d>c;c++)e=a.charAt(c),b+=m[e]||e;return b}function p(a,b){for(var c=0,d=b.length;d>c;c+=1)if(r(a,b[c]))return c;return-1}function q(){var b=a(l);b.appendTo("body");var c={width:b.width()-b[0].clientWidth,height:b.height()-b[0].clientHeight};return b.remove(),c}function r(a,c){return a===c?!0:a===b||c===b?!1:null===a||null===c?!1:a.constructor===String?a+""==c+"":c.constructor===String?c+""==a+"":!1}function s(b,c){var d,e,f;if(null===b||b.length<1)return[];for(d=b.split(c),e=0,f=d.length;f>e;e+=1)d[e]=a.trim(d[e]);return d}function t(a){return a.outerWidth(!1)-a.width()}function u(c){var d="keyup-change-value";c.on("keydown",function(){a.data(c,d)===b&&a.data(c,d,c.val())}),c.on("keyup",function(){var e=a.data(c,d);e!==b&&c.val()!==e&&(a.removeData(c,d),c.trigger("keyup-change"))})}function v(c){c.on("mousemove",function(c){var d=i;(d===b||d.x!==c.pageX||d.y!==c.pageY)&&a(c.target).trigger("mousemove-filtered",c)})}function w(a,c,d){d=d||b;var e;return function(){var b=arguments;window.clearTimeout(e),e=window.setTimeout(function(){c.apply(d,b)},a)}}function x(a){var c,b=!1;return function(){return b===!1&&(c=a(),b=!0),c}}function y(a,b){var c=w(a,function(a){b.trigger("scroll-debounced",a)});b.on("scroll",function(a){p(a.target,b.get())>=0&&c(a)})}function z(a){a[0]!==document.activeElement&&window.setTimeout(function(){var d,b=a[0],c=a.val().length;a.focus();var e=b.offsetWidth>0||b.offsetHeight>0;e&&b===document.activeElement&&(b.setSelectionRange?b.setSelectionRange(c,c):b.createTextRange&&(d=b.createTextRange(),d.collapse(!1),d.select()))},0)}function A(b){b=a(b)[0];var c=0,d=0;if("selectionStart"in b)c=b.selectionStart,d=b.selectionEnd-c;else if("selection"in document){b.focus();var e=document.selection.createRange();d=document.selection.createRange().text.length,e.moveStart("character",-b.value.length),c=e.text.length-d}return{offset:c,length:d}}function B(a){a.preventDefault(),a.stopPropagation()}function C(a){a.preventDefault(),a.stopImmediatePropagation()}function D(b){if(!h){var c=b[0].currentStyle||window.getComputedStyle(b[0],null);h=a(document.createElement("div")).css({position:"absolute",left:"-10000px",top:"-10000px",display:"none",fontSize:c.fontSize,fontFamily:c.fontFamily,fontStyle:c.fontStyle,fontWeight:c.fontWeight,letterSpacing:c.letterSpacing,textTransform:c.textTransform,whiteSpace:"nowrap"}),h.attr("class","select2-sizer"),a("body").append(h)}return h.text(b.val()),h.width()}function E(b,c,d){var e,g,f=[];e=b.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0===this.indexOf("select2-")&&f.push(this)})),e=c.attr("class"),e&&(e=""+e,a(e.split(" ")).each2(function(){0!==this.indexOf("select2-")&&(g=d(this),g&&f.push(g))})),b.attr("class",f.join(" "))}function F(a,b,c,d){var e=o(a.toUpperCase()).indexOf(o(b.toUpperCase())),f=b.length;return 0>e?(c.push(d(a)),void 0):(c.push(d(a.substring(0,e))),c.push("<span class='select2-match'>"),c.push(d(a.substring(e,e+f))),c.push("</span>"),c.push(d(a.substring(e+f,a.length))),void 0)}function G(a){var b={"\\":"&#92;","&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;","/":"&#47;"};return String(a).replace(/[&<>"'\/\\]/g,function(a){return b[a]})}function H(c){var d,e=null,f=c.quietMillis||100,g=c.url,h=this;return function(i){window.clearTimeout(d),d=window.setTimeout(function(){var d=c.data,f=g,j=c.transport||a.fn.select2.ajaxDefaults.transport,k={type:c.type||"GET",cache:c.cache||!1,jsonpCallback:c.jsonpCallback||b,dataType:c.dataType||"json"},l=a.extend({},a.fn.select2.ajaxDefaults.params,k);d=d?d.call(h,i.term,i.page,i.context):null,f="function"==typeof f?f.call(h,i.term,i.page,i.context):f,e&&"function"==typeof e.abort&&e.abort(),c.params&&(a.isFunction(c.params)?a.extend(l,c.params.call(h)):a.extend(l,c.params)),a.extend(l,{url:f,dataType:c.dataType,data:d,success:function(a){var b=c.results(a,i.page);i.callback(b)}}),e=j.call(h,l)},f)}}function I(b){var d,e,c=b,f=function(a){return""+a.text};a.isArray(c)&&(e=c,c={results:e}),a.isFunction(c)===!1&&(e=c,c=function(){return e});var g=c();return g.text&&(f=g.text,a.isFunction(f)||(d=g.text,f=function(a){return a[d]})),function(b){var g,d=b.term,e={results:[]};return""===d?(b.callback(c()),void 0):(g=function(c,e){var h,i;if(c=c[0],c.children){h={};for(i in c)c.hasOwnProperty(i)&&(h[i]=c[i]);h.children=[],a(c.children).each2(function(a,b){g(b,h.children)}),(h.children.length||b.matcher(d,f(h),c))&&e.push(h)}else b.matcher(d,f(c),c)&&e.push(c)},a(c().results).each2(function(a,b){g(b,e.results)}),b.callback(e),void 0)}}function J(c){var d=a.isFunction(c);return function(e){var f=e.term,g={results:[]};a(d?c():c).each(function(){var a=this.text!==b,c=a?this.text:this;(""===f||e.matcher(f,c))&&g.results.push(a?this:{id:this,text:this})}),e.callback(g)}}function K(b,c){if(a.isFunction(b))return!0;if(!b)return!1;if("string"==typeof b)return!0;throw new Error(c+" must be a string, function, or falsy value")}function L(b){if(a.isFunction(b)){var c=Array.prototype.slice.call(arguments,1);return b.apply(null,c)}return b}function M(b){var c=0;return a.each(b,function(a,b){b.children?c+=M(b.children):c++}),c}function N(a,c,d,e){var h,i,j,k,l,f=a,g=!1;if(!e.createSearchChoice||!e.tokenSeparators||e.tokenSeparators.length<1)return b;for(;;){for(i=-1,j=0,k=e.tokenSeparators.length;k>j&&(l=e.tokenSeparators[j],i=a.indexOf(l),!(i>=0));j++);if(0>i)break;if(h=a.substring(0,i),a=a.substring(i+l.length),h.length>0&&(h=e.createSearchChoice.call(this,h,c),h!==b&&null!==h&&e.id(h)!==b&&null!==e.id(h))){for(g=!1,j=0,k=c.length;k>j;j++)if(r(e.id(h),e.id(c[j]))){g=!0;break}g||d(h)}}return f!==a?a:void 0}function O(b,c){var d=function(){};return d.prototype=new b,d.prototype.constructor=d,d.prototype.parent=b.prototype,d.prototype=a.extend(d.prototype,c),d}if(window.Select2===b){var c,d,e,f,g,h,j,k,i={x:0,y:0},c={TAB:9,ENTER:13,ESC:27,SPACE:32,LEFT:37,UP:38,RIGHT:39,DOWN:40,SHIFT:16,CTRL:17,ALT:18,PAGE_UP:33,PAGE_DOWN:34,HOME:36,END:35,BACKSPACE:8,DELETE:46,isArrow:function(a){switch(a=a.which?a.which:a){case c.LEFT:case c.RIGHT:case c.UP:case c.DOWN:return!0}return!1},isControl:function(a){var b=a.which;switch(b){case c.SHIFT:case c.CTRL:case c.ALT:return!0}return a.metaKey?!0:!1},isFunctionKey:function(a){return a=a.which?a.which:a,a>=112&&123>=a}},l="<div class='select2-measure-scrollbar'></div>",m={"\u24b6":"A","\uff21":"A","\xc0":"A","\xc1":"A","\xc2":"A","\u1ea6":"A","\u1ea4":"A","\u1eaa":"A","\u1ea8":"A","\xc3":"A","\u0100":"A","\u0102":"A","\u1eb0":"A","\u1eae":"A","\u1eb4":"A","\u1eb2":"A","\u0226":"A","\u01e0":"A","\xc4":"A","\u01de":"A","\u1ea2":"A","\xc5":"A","\u01fa":"A","\u01cd":"A","\u0200":"A","\u0202":"A","\u1ea0":"A","\u1eac":"A","\u1eb6":"A","\u1e00":"A","\u0104":"A","\u023a":"A","\u2c6f":"A","\ua732":"AA","\xc6":"AE","\u01fc":"AE","\u01e2":"AE","\ua734":"AO","\ua736":"AU","\ua738":"AV","\ua73a":"AV","\ua73c":"AY","\u24b7":"B","\uff22":"B","\u1e02":"B","\u1e04":"B","\u1e06":"B","\u0243":"B","\u0182":"B","\u0181":"B","\u24b8":"C","\uff23":"C","\u0106":"C","\u0108":"C","\u010a":"C","\u010c":"C","\xc7":"C","\u1e08":"C","\u0187":"C","\u023b":"C","\ua73e":"C","\u24b9":"D","\uff24":"D","\u1e0a":"D","\u010e":"D","\u1e0c":"D","\u1e10":"D","\u1e12":"D","\u1e0e":"D","\u0110":"D","\u018b":"D","\u018a":"D","\u0189":"D","\ua779":"D","\u01f1":"DZ","\u01c4":"DZ","\u01f2":"Dz","\u01c5":"Dz","\u24ba":"E","\uff25":"E","\xc8":"E","\xc9":"E","\xca":"E","\u1ec0":"E","\u1ebe":"E","\u1ec4":"E","\u1ec2":"E","\u1ebc":"E","\u0112":"E","\u1e14":"E","\u1e16":"E","\u0114":"E","\u0116":"E","\xcb":"E","\u1eba":"E","\u011a":"E","\u0204":"E","\u0206":"E","\u1eb8":"E","\u1ec6":"E","\u0228":"E","\u1e1c":"E","\u0118":"E","\u1e18":"E","\u1e1a":"E","\u0190":"E","\u018e":"E","\u24bb":"F","\uff26":"F","\u1e1e":"F","\u0191":"F","\ua77b":"F","\u24bc":"G","\uff27":"G","\u01f4":"G","\u011c":"G","\u1e20":"G","\u011e":"G","\u0120":"G","\u01e6":"G","\u0122":"G","\u01e4":"G","\u0193":"G","\ua7a0":"G","\ua77d":"G","\ua77e":"G","\u24bd":"H","\uff28":"H","\u0124":"H","\u1e22":"H","\u1e26":"H","\u021e":"H","\u1e24":"H","\u1e28":"H","\u1e2a":"H","\u0126":"H","\u2c67":"H","\u2c75":"H","\ua78d":"H","\u24be":"I","\uff29":"I","\xcc":"I","\xcd":"I","\xce":"I","\u0128":"I","\u012a":"I","\u012c":"I","\u0130":"I","\xcf":"I","\u1e2e":"I","\u1ec8":"I","\u01cf":"I","\u0208":"I","\u020a":"I","\u1eca":"I","\u012e":"I","\u1e2c":"I","\u0197":"I","\u24bf":"J","\uff2a":"J","\u0134":"J","\u0248":"J","\u24c0":"K","\uff2b":"K","\u1e30":"K","\u01e8":"K","\u1e32":"K","\u0136":"K","\u1e34":"K","\u0198":"K","\u2c69":"K","\ua740":"K","\ua742":"K","\ua744":"K","\ua7a2":"K","\u24c1":"L","\uff2c":"L","\u013f":"L","\u0139":"L","\u013d":"L","\u1e36":"L","\u1e38":"L","\u013b":"L","\u1e3c":"L","\u1e3a":"L","\u0141":"L","\u023d":"L","\u2c62":"L","\u2c60":"L","\ua748":"L","\ua746":"L","\ua780":"L","\u01c7":"LJ","\u01c8":"Lj","\u24c2":"M","\uff2d":"M","\u1e3e":"M","\u1e40":"M","\u1e42":"M","\u2c6e":"M","\u019c":"M","\u24c3":"N","\uff2e":"N","\u01f8":"N","\u0143":"N","\xd1":"N","\u1e44":"N","\u0147":"N","\u1e46":"N","\u0145":"N","\u1e4a":"N","\u1e48":"N","\u0220":"N","\u019d":"N","\ua790":"N","\ua7a4":"N","\u01ca":"NJ","\u01cb":"Nj","\u24c4":"O","\uff2f":"O","\xd2":"O","\xd3":"O","\xd4":"O","\u1ed2":"O","\u1ed0":"O","\u1ed6":"O","\u1ed4":"O","\xd5":"O","\u1e4c":"O","\u022c":"O","\u1e4e":"O","\u014c":"O","\u1e50":"O","\u1e52":"O","\u014e":"O","\u022e":"O","\u0230":"O","\xd6":"O","\u022a":"O","\u1ece":"O","\u0150":"O","\u01d1":"O","\u020c":"O","\u020e":"O","\u01a0":"O","\u1edc":"O","\u1eda":"O","\u1ee0":"O","\u1ede":"O","\u1ee2":"O","\u1ecc":"O","\u1ed8":"O","\u01ea":"O","\u01ec":"O","\xd8":"O","\u01fe":"O","\u0186":"O","\u019f":"O","\ua74a":"O","\ua74c":"O","\u01a2":"OI","\ua74e":"OO","\u0222":"OU","\u24c5":"P","\uff30":"P","\u1e54":"P","\u1e56":"P","\u01a4":"P","\u2c63":"P","\ua750":"P","\ua752":"P","\ua754":"P","\u24c6":"Q","\uff31":"Q","\ua756":"Q","\ua758":"Q","\u024a":"Q","\u24c7":"R","\uff32":"R","\u0154":"R","\u1e58":"R","\u0158":"R","\u0210":"R","\u0212":"R","\u1e5a":"R","\u1e5c":"R","\u0156":"R","\u1e5e":"R","\u024c":"R","\u2c64":"R","\ua75a":"R","\ua7a6":"R","\ua782":"R","\u24c8":"S","\uff33":"S","\u1e9e":"S","\u015a":"S","\u1e64":"S","\u015c":"S","\u1e60":"S","\u0160":"S","\u1e66":"S","\u1e62":"S","\u1e68":"S","\u0218":"S","\u015e":"S","\u2c7e":"S","\ua7a8":"S","\ua784":"S","\u24c9":"T","\uff34":"T","\u1e6a":"T","\u0164":"T","\u1e6c":"T","\u021a":"T","\u0162":"T","\u1e70":"T","\u1e6e":"T","\u0166":"T","\u01ac":"T","\u01ae":"T","\u023e":"T","\ua786":"T","\ua728":"TZ","\u24ca":"U","\uff35":"U","\xd9":"U","\xda":"U","\xdb":"U","\u0168":"U","\u1e78":"U","\u016a":"U","\u1e7a":"U","\u016c":"U","\xdc":"U","\u01db":"U","\u01d7":"U","\u01d5":"U","\u01d9":"U","\u1ee6":"U","\u016e":"U","\u0170":"U","\u01d3":"U","\u0214":"U","\u0216":"U","\u01af":"U","\u1eea":"U","\u1ee8":"U","\u1eee":"U","\u1eec":"U","\u1ef0":"U","\u1ee4":"U","\u1e72":"U","\u0172":"U","\u1e76":"U","\u1e74":"U","\u0244":"U","\u24cb":"V","\uff36":"V","\u1e7c":"V","\u1e7e":"V","\u01b2":"V","\ua75e":"V","\u0245":"V","\ua760":"VY","\u24cc":"W","\uff37":"W","\u1e80":"W","\u1e82":"W","\u0174":"W","\u1e86":"W","\u1e84":"W","\u1e88":"W","\u2c72":"W","\u24cd":"X","\uff38":"X","\u1e8a":"X","\u1e8c":"X","\u24ce":"Y","\uff39":"Y","\u1ef2":"Y","\xdd":"Y","\u0176":"Y","\u1ef8":"Y","\u0232":"Y","\u1e8e":"Y","\u0178":"Y","\u1ef6":"Y","\u1ef4":"Y","\u01b3":"Y","\u024e":"Y","\u1efe":"Y","\u24cf":"Z","\uff3a":"Z","\u0179":"Z","\u1e90":"Z","\u017b":"Z","\u017d":"Z","\u1e92":"Z","\u1e94":"Z","\u01b5":"Z","\u0224":"Z","\u2c7f":"Z","\u2c6b":"Z","\ua762":"Z","\u24d0":"a","\uff41":"a","\u1e9a":"a","\xe0":"a","\xe1":"a","\xe2":"a","\u1ea7":"a","\u1ea5":"a","\u1eab":"a","\u1ea9":"a","\xe3":"a","\u0101":"a","\u0103":"a","\u1eb1":"a","\u1eaf":"a","\u1eb5":"a","\u1eb3":"a","\u0227":"a","\u01e1":"a","\xe4":"a","\u01df":"a","\u1ea3":"a","\xe5":"a","\u01fb":"a","\u01ce":"a","\u0201":"a","\u0203":"a","\u1ea1":"a","\u1ead":"a","\u1eb7":"a","\u1e01":"a","\u0105":"a","\u2c65":"a","\u0250":"a","\ua733":"aa","\xe6":"ae","\u01fd":"ae","\u01e3":"ae","\ua735":"ao","\ua737":"au","\ua739":"av","\ua73b":"av","\ua73d":"ay","\u24d1":"b","\uff42":"b","\u1e03":"b","\u1e05":"b","\u1e07":"b","\u0180":"b","\u0183":"b","\u0253":"b","\u24d2":"c","\uff43":"c","\u0107":"c","\u0109":"c","\u010b":"c","\u010d":"c","\xe7":"c","\u1e09":"c","\u0188":"c","\u023c":"c","\ua73f":"c","\u2184":"c","\u24d3":"d","\uff44":"d","\u1e0b":"d","\u010f":"d","\u1e0d":"d","\u1e11":"d","\u1e13":"d","\u1e0f":"d","\u0111":"d","\u018c":"d","\u0256":"d","\u0257":"d","\ua77a":"d","\u01f3":"dz","\u01c6":"dz","\u24d4":"e","\uff45":"e","\xe8":"e","\xe9":"e","\xea":"e","\u1ec1":"e","\u1ebf":"e","\u1ec5":"e","\u1ec3":"e","\u1ebd":"e","\u0113":"e","\u1e15":"e","\u1e17":"e","\u0115":"e","\u0117":"e","\xeb":"e","\u1ebb":"e","\u011b":"e","\u0205":"e","\u0207":"e","\u1eb9":"e","\u1ec7":"e","\u0229":"e","\u1e1d":"e","\u0119":"e","\u1e19":"e","\u1e1b":"e","\u0247":"e","\u025b":"e","\u01dd":"e","\u24d5":"f","\uff46":"f","\u1e1f":"f","\u0192":"f","\ua77c":"f","\u24d6":"g","\uff47":"g","\u01f5":"g","\u011d":"g","\u1e21":"g","\u011f":"g","\u0121":"g","\u01e7":"g","\u0123":"g","\u01e5":"g","\u0260":"g","\ua7a1":"g","\u1d79":"g","\ua77f":"g","\u24d7":"h","\uff48":"h","\u0125":"h","\u1e23":"h","\u1e27":"h","\u021f":"h","\u1e25":"h","\u1e29":"h","\u1e2b":"h","\u1e96":"h","\u0127":"h","\u2c68":"h","\u2c76":"h","\u0265":"h","\u0195":"hv","\u24d8":"i","\uff49":"i","\xec":"i","\xed":"i","\xee":"i","\u0129":"i","\u012b":"i","\u012d":"i","\xef":"i","\u1e2f":"i","\u1ec9":"i","\u01d0":"i","\u0209":"i","\u020b":"i","\u1ecb":"i","\u012f":"i","\u1e2d":"i","\u0268":"i","\u0131":"i","\u24d9":"j","\uff4a":"j","\u0135":"j","\u01f0":"j","\u0249":"j","\u24da":"k","\uff4b":"k","\u1e31":"k","\u01e9":"k","\u1e33":"k","\u0137":"k","\u1e35":"k","\u0199":"k","\u2c6a":"k","\ua741":"k","\ua743":"k","\ua745":"k","\ua7a3":"k","\u24db":"l","\uff4c":"l","\u0140":"l","\u013a":"l","\u013e":"l","\u1e37":"l","\u1e39":"l","\u013c":"l","\u1e3d":"l","\u1e3b":"l","\u017f":"l","\u0142":"l","\u019a":"l","\u026b":"l","\u2c61":"l","\ua749":"l","\ua781":"l","\ua747":"l","\u01c9":"lj","\u24dc":"m","\uff4d":"m","\u1e3f":"m","\u1e41":"m","\u1e43":"m","\u0271":"m","\u026f":"m","\u24dd":"n","\uff4e":"n","\u01f9":"n","\u0144":"n","\xf1":"n","\u1e45":"n","\u0148":"n","\u1e47":"n","\u0146":"n","\u1e4b":"n","\u1e49":"n","\u019e":"n","\u0272":"n","\u0149":"n","\ua791":"n","\ua7a5":"n","\u01cc":"nj","\u24de":"o","\uff4f":"o","\xf2":"o","\xf3":"o","\xf4":"o","\u1ed3":"o","\u1ed1":"o","\u1ed7":"o","\u1ed5":"o","\xf5":"o","\u1e4d":"o","\u022d":"o","\u1e4f":"o","\u014d":"o","\u1e51":"o","\u1e53":"o","\u014f":"o","\u022f":"o","\u0231":"o","\xf6":"o","\u022b":"o","\u1ecf":"o","\u0151":"o","\u01d2":"o","\u020d":"o","\u020f":"o","\u01a1":"o","\u1edd":"o","\u1edb":"o","\u1ee1":"o","\u1edf":"o","\u1ee3":"o","\u1ecd":"o","\u1ed9":"o","\u01eb":"o","\u01ed":"o","\xf8":"o","\u01ff":"o","\u0254":"o","\ua74b":"o","\ua74d":"o","\u0275":"o","\u01a3":"oi","\u0223":"ou","\ua74f":"oo","\u24df":"p","\uff50":"p","\u1e55":"p","\u1e57":"p","\u01a5":"p","\u1d7d":"p","\ua751":"p","\ua753":"p","\ua755":"p","\u24e0":"q","\uff51":"q","\u024b":"q","\ua757":"q","\ua759":"q","\u24e1":"r","\uff52":"r","\u0155":"r","\u1e59":"r","\u0159":"r","\u0211":"r","\u0213":"r","\u1e5b":"r","\u1e5d":"r","\u0157":"r","\u1e5f":"r","\u024d":"r","\u027d":"r","\ua75b":"r","\ua7a7":"r","\ua783":"r","\u24e2":"s","\uff53":"s","\xdf":"s","\u015b":"s","\u1e65":"s","\u015d":"s","\u1e61":"s","\u0161":"s","\u1e67":"s","\u1e63":"s","\u1e69":"s","\u0219":"s","\u015f":"s","\u023f":"s","\ua7a9":"s","\ua785":"s","\u1e9b":"s","\u24e3":"t","\uff54":"t","\u1e6b":"t","\u1e97":"t","\u0165":"t","\u1e6d":"t","\u021b":"t","\u0163":"t","\u1e71":"t","\u1e6f":"t","\u0167":"t","\u01ad":"t","\u0288":"t","\u2c66":"t","\ua787":"t","\ua729":"tz","\u24e4":"u","\uff55":"u","\xf9":"u","\xfa":"u","\xfb":"u","\u0169":"u","\u1e79":"u","\u016b":"u","\u1e7b":"u","\u016d":"u","\xfc":"u","\u01dc":"u","\u01d8":"u","\u01d6":"u","\u01da":"u","\u1ee7":"u","\u016f":"u","\u0171":"u","\u01d4":"u","\u0215":"u","\u0217":"u","\u01b0":"u","\u1eeb":"u","\u1ee9":"u","\u1eef":"u","\u1eed":"u","\u1ef1":"u","\u1ee5":"u","\u1e73":"u","\u0173":"u","\u1e77":"u","\u1e75":"u","\u0289":"u","\u24e5":"v","\uff56":"v","\u1e7d":"v","\u1e7f":"v","\u028b":"v","\ua75f":"v","\u028c":"v","\ua761":"vy","\u24e6":"w","\uff57":"w","\u1e81":"w","\u1e83":"w","\u0175":"w","\u1e87":"w","\u1e85":"w","\u1e98":"w","\u1e89":"w","\u2c73":"w","\u24e7":"x","\uff58":"x","\u1e8b":"x","\u1e8d":"x","\u24e8":"y","\uff59":"y","\u1ef3":"y","\xfd":"y","\u0177":"y","\u1ef9":"y","\u0233":"y","\u1e8f":"y","\xff":"y","\u1ef7":"y","\u1e99":"y","\u1ef5":"y","\u01b4":"y","\u024f":"y","\u1eff":"y","\u24e9":"z","\uff5a":"z","\u017a":"z","\u1e91":"z","\u017c":"z","\u017e":"z","\u1e93":"z","\u1e95":"z","\u01b6":"z","\u0225":"z","\u0240":"z","\u2c6c":"z","\ua763":"z"};j=a(document),g=function(){var a=1;return function(){return a++}}(),j.on("mousemove",function(a){i.x=a.pageX,i.y=a.pageY}),d=O(Object,{bind:function(a){var b=this;return function(){a.apply(b,arguments)}},init:function(c){var d,e,f=".select2-results";this.opts=c=this.prepareOpts(c),this.id=c.id,c.element.data("select2")!==b&&null!==c.element.data("select2")&&c.element.data("select2").destroy(),this.container=this.createContainer(),this.liveRegion=a("<span>",{role:"status","aria-live":"polite"}).addClass("select2-hidden-accessible").appendTo(document.body),this.containerId="s2id_"+(c.element.attr("id")||"autogen"+g()).replace(/([;&,\-\.\+\*\~':"\!\^#$%@\[\]\(\)=>\|])/g,"\\$1"),this.containerSelector="#"+this.containerId,this.container.attr("id",this.containerId),this.body=x(function(){return c.element.closest("body")}),E(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.attr("style",c.element.attr("style")),this.container.css(L(c.containerCss)),this.container.addClass(L(c.containerCssClass)),this.elementTabIndex=this.opts.element.attr("tabindex"),this.opts.element.data("select2",this).attr("tabindex","-1").before(this.container).on("click.select2",B),this.container.data("select2",this),this.dropdown=this.container.find(".select2-drop"),E(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(L(c.dropdownCssClass)),this.dropdown.data("select2",this),this.dropdown.on("click",B),this.results=d=this.container.find(f),this.search=e=this.container.find("input.select2-input"),this.queryCount=0,this.resultsPage=0,this.context=null,this.initContainer(),this.container.on("click",B),v(this.results),this.dropdown.on("mousemove-filtered touchstart touchmove touchend",f,this.bind(this.highlightUnderEvent)),this.dropdown.on("touchend",f,this.bind(this.selectHighlighted)),this.dropdown.on("touchmove",f,this.bind(this.touchMoved)),this.dropdown.on("touchstart touchend",f,this.bind(this.clearTouchMoved)),y(80,this.results),this.dropdown.on("scroll-debounced",f,this.bind(this.loadMoreIfNeeded)),a(this.container).on("change",".select2-input",function(a){a.stopPropagation()}),a(this.dropdown).on("change",".select2-input",function(a){a.stopPropagation()}),a.fn.mousewheel&&d.mousewheel(function(a,b,c,e){var f=d.scrollTop();e>0&&0>=f-e?(d.scrollTop(0),B(a)):0>e&&d.get(0).scrollHeight-d.scrollTop()+e<=d.height()&&(d.scrollTop(d.get(0).scrollHeight-d.height()),B(a))}),u(e),e.on("keyup-change input paste",this.bind(this.updateResults)),e.on("focus",function(){e.addClass("select2-focused")}),e.on("blur",function(){e.removeClass("select2-focused")}),this.dropdown.on("mouseup",f,this.bind(function(b){a(b.target).closest(".select2-result-selectable").length>0&&(this.highlightUnderEvent(b),this.selectHighlighted(b))})),this.dropdown.on("click mouseup mousedown focusin",function(a){a.stopPropagation()}),this.nextSearchTerm=b,a.isFunction(this.opts.initSelection)&&(this.initSelection(),this.monitorSource()),null!==c.maximumInputLength&&this.search.attr("maxlength",c.maximumInputLength);var h=c.element.prop("disabled");h===b&&(h=!1),this.enable(!h);var i=c.element.prop("readonly");i===b&&(i=!1),this.readonly(i),k=k||q(),this.autofocus=c.element.prop("autofocus"),c.element.prop("autofocus",!1),this.autofocus&&this.focus(),this.search.attr("placeholder",c.searchInputPlaceholder)},destroy:function(){var a=this.opts.element,c=a.data("select2");this.close(),this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),c!==b&&(c.container.remove(),c.liveRegion.remove(),c.dropdown.remove(),a.removeClass("select2-offscreen").removeData("select2").off(".select2").prop("autofocus",this.autofocus||!1),this.elementTabIndex?a.attr({tabindex:this.elementTabIndex}):a.removeAttr("tabindex"),a.show())},optionToData:function(a){return a.is("option")?{id:a.prop("value"),text:a.text(),element:a.get(),css:a.attr("class"),disabled:a.prop("disabled"),locked:r(a.attr("locked"),"locked")||r(a.data("locked"),!0)}:a.is("optgroup")?{text:a.attr("label"),children:[],element:a.get(),css:a.attr("class")}:void 0},prepareOpts:function(c){var d,e,f,h,i=this;if(d=c.element,"select"===d.get(0).tagName.toLowerCase()&&(this.select=e=c.element),e&&a.each(["id","multiple","ajax","query","createSearchChoice","initSelection","data","tags"],function(){if(this in c)throw new Error("Option '"+this+"' is not allowed for Select2 when attached to a <select> element.")}),c=a.extend({},{populateResults:function(d,e,f){var h,j=this.opts.id,k=this.liveRegion;h=function(d,e,l){var m,n,o,p,q,r,s,t,u,v;for(d=c.sortResults(d,e,f),m=0,n=d.length;n>m;m+=1)o=d[m],q=o.disabled===!0,p=!q&&j(o)!==b,r=o.children&&o.children.length>0,s=a("<li></li>"),s.addClass("select2-results-dept-"+l),s.addClass("select2-result"),s.addClass(p?"select2-result-selectable":"select2-result-unselectable"),q&&s.addClass("select2-disabled"),r&&s.addClass("select2-result-with-children"),s.addClass(i.opts.formatResultCssClass(o)),s.attr("role","presentation"),t=a(document.createElement("div")),t.addClass("select2-result-label"),t.attr("id","select2-result-label-"+g()),t.attr("role","option"),v=c.formatResult(o,t,f,i.opts.escapeMarkup),v!==b&&(t.html(v),s.append(t)),r&&(u=a("<ul></ul>"),u.addClass("select2-result-sub"),h(o.children,u,l+1),s.append(u)),s.data("select2-data",o),e.append(s);k.text(c.formatMatches(d.length))},h(e,d,0)}},a.fn.select2.defaults,c),"function"!=typeof c.id&&(f=c.id,c.id=function(a){return a[f]}),a.isArray(c.element.data("select2Tags"))){if("tags"in c)throw"tags specified as both an attribute 'data-select2-tags' and in options of Select2 "+c.element.attr("id");c.tags=c.element.data("select2Tags")}if(e?(c.query=this.bind(function(a){var f,g,h,c={results:[],more:!1},e=a.term;h=function(b,c){var d;b.is("option")?a.matcher(e,b.text(),b)&&c.push(i.optionToData(b)):b.is("optgroup")&&(d=i.optionToData(b),b.children().each2(function(a,b){h(b,d.children)}),d.children.length>0&&c.push(d))},f=d.children(),this.getPlaceholder()!==b&&f.length>0&&(g=this.getPlaceholderOption(),g&&(f=f.not(g))),f.each2(function(a,b){h(b,c.results)}),a.callback(c)}),c.id=function(a){return a.id}):"query"in c||("ajax"in c?(h=c.element.data("ajax-url"),h&&h.length>0&&(c.ajax.url=h),c.query=H.call(c.element,c.ajax)):"data"in c?c.query=I(c.data):"tags"in c&&(c.query=J(c.tags),c.createSearchChoice===b&&(c.createSearchChoice=function(b){return{id:a.trim(b),text:a.trim(b)}}),c.initSelection===b&&(c.initSelection=function(b,d){var e=[];a(s(b.val(),c.separator)).each(function(){var b={id:this,text:this},d=c.tags;a.isFunction(d)&&(d=d()),a(d).each(function(){return r(this.id,b.id)?(b=this,!1):void 0}),e.push(b)}),d(e)}))),"function"!=typeof c.query)throw"query function not defined for Select2 "+c.element.attr("id");if("top"===c.createSearchChoicePosition)c.createSearchChoicePosition=function(a,b){a.unshift(b)};else if("bottom"===c.createSearchChoicePosition)c.createSearchChoicePosition=function(a,b){a.push(b)};else if("function"!=typeof c.createSearchChoicePosition)throw"invalid createSearchChoicePosition option must be 'top', 'bottom' or a custom function";return c},monitorSource:function(){var c,d,a=this.opts.element;a.on("change.select2",this.bind(function(){this.opts.element.data("select2-change-triggered")!==!0&&this.initSelection()})),c=this.bind(function(){var c=a.prop("disabled");c===b&&(c=!1),this.enable(!c);var d=a.prop("readonly");d===b&&(d=!1),this.readonly(d),E(this.container,this.opts.element,this.opts.adaptContainerCssClass),this.container.addClass(L(this.opts.containerCssClass)),E(this.dropdown,this.opts.element,this.opts.adaptDropdownCssClass),this.dropdown.addClass(L(this.opts.dropdownCssClass))}),a.on("propertychange.select2",c),this.mutationCallback===b&&(this.mutationCallback=function(a){a.forEach(c)}),d=window.MutationObserver||window.WebKitMutationObserver||window.MozMutationObserver,d!==b&&(this.propertyObserver&&(delete this.propertyObserver,this.propertyObserver=null),this.propertyObserver=new d(this.mutationCallback),this.propertyObserver.observe(a.get(0),{attributes:!0,subtree:!1}))},triggerSelect:function(b){var c=a.Event("select2-selecting",{val:this.id(b),object:b});return this.opts.element.trigger(c),!c.isDefaultPrevented()},triggerChange:function(b){b=b||{},b=a.extend({},b,{type:"change",val:this.val()}),this.opts.element.data("select2-change-triggered",!0),this.opts.element.trigger(b),this.opts.element.data("select2-change-triggered",!1),this.opts.element.click(),this.opts.blurOnChange&&this.opts.element.blur()},isInterfaceEnabled:function(){return this.enabledInterface===!0},enableInterface:function(){var a=this._enabled&&!this._readonly,b=!a;return a===this.enabledInterface?!1:(this.container.toggleClass("select2-container-disabled",b),this.close(),this.enabledInterface=a,!0)},enable:function(a){a===b&&(a=!0),this._enabled!==a&&(this._enabled=a,this.opts.element.prop("disabled",!a),this.enableInterface())},disable:function(){this.enable(!1)},readonly:function(a){a===b&&(a=!1),this._readonly!==a&&(this._readonly=a,this.opts.element.prop("readonly",a),this.enableInterface())},opened:function(){return this.container.hasClass("select2-dropdown-open")},positionDropdown:function(){var t,u,v,w,x,b=this.dropdown,c=this.container.offset(),d=this.container.outerHeight(!1),e=this.container.outerWidth(!1),f=b.outerHeight(!1),g=a(window),h=g.width(),i=g.height(),j=g.scrollLeft()+h,l=g.scrollTop()+i,m=c.top+d,n=c.left,o=l>=m+f,p=c.top-f>=g.scrollTop(),q=b.outerWidth(!1),r=j>=n+q,s=b.hasClass("select2-drop-above");s?(u=!0,!p&&o&&(v=!0,u=!1)):(u=!1,!o&&p&&(v=!0,u=!0)),v&&(b.hide(),c=this.container.offset(),d=this.container.outerHeight(!1),e=this.container.outerWidth(!1),f=b.outerHeight(!1),j=g.scrollLeft()+h,l=g.scrollTop()+i,m=c.top+d,n=c.left,q=b.outerWidth(!1),r=j>=n+q,b.show()),this.opts.dropdownAutoWidth?(x=a(".select2-results",b)[0],b.addClass("select2-drop-auto-width"),b.css("width",""),q=b.outerWidth(!1)+(x.scrollHeight===x.clientHeight?0:k.width),q>e?e=q:q=e,r=j>=n+q):this.container.removeClass("select2-drop-auto-width"),"static"!==this.body().css("position")&&(t=this.body().offset(),m-=t.top,n-=t.left),r||(n=c.left+this.container.outerWidth(!1)-q),w={left:n,width:e},u?(w.top=c.top-f,w.bottom="auto",this.container.addClass("select2-drop-above"),b.addClass("select2-drop-above")):(w.top=m,w.bottom="auto",this.container.removeClass("select2-drop-above"),b.removeClass("select2-drop-above")),w=a.extend(w,L(this.opts.dropdownCss)),b.css(w)},shouldOpen:function(){var b;return this.opened()?!1:this._enabled===!1||this._readonly===!0?!1:(b=a.Event("select2-opening"),this.opts.element.trigger(b),!b.isDefaultPrevented())},clearDropdownAlignmentPreference:function(){this.container.removeClass("select2-drop-above"),this.dropdown.removeClass("select2-drop-above")},open:function(){return this.shouldOpen()?(this.opening(),!0):!1},opening:function(){var f,b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.container.addClass("select2-dropdown-open").addClass("select2-container-active"),this.clearDropdownAlignmentPreference(),this.dropdown[0]!==this.body().children().last()[0]&&this.dropdown.detach().appendTo(this.body()),f=a("#select2-drop-mask"),0==f.length&&(f=a(document.createElement("div")),f.attr("id","select2-drop-mask").attr("class","select2-drop-mask"),f.hide(),f.appendTo(this.body()),f.on("mousedown touchstart click",function(b){n(f);var d,c=a("#select2-drop");c.length>0&&(d=c.data("select2"),d.opts.selectOnBlur&&d.selectHighlighted({noFocus:!0}),d.close(),b.preventDefault(),b.stopPropagation())})),this.dropdown.prev()[0]!==f[0]&&this.dropdown.before(f),a("#select2-drop").removeAttr("id"),this.dropdown.attr("id","select2-drop"),f.show(),this.positionDropdown(),this.dropdown.show(),this.positionDropdown(),this.dropdown.addClass("select2-drop-active");var g=this;this.container.parents().add(window).each(function(){a(this).on(d+" "+c+" "+e,function(){g.positionDropdown()})})},close:function(){if(this.opened()){var b=this.containerId,c="scroll."+b,d="resize."+b,e="orientationchange."+b;this.container.parents().add(window).each(function(){a(this).off(c).off(d).off(e)}),this.clearDropdownAlignmentPreference(),a("#select2-drop-mask").hide(),this.dropdown.removeAttr("id"),this.dropdown.hide(),this.container.removeClass("select2-dropdown-open").removeClass("select2-container-active"),this.results.empty(),this.clearSearch(),this.search.removeClass("select2-active"),this.opts.element.trigger(a.Event("select2-close"))}},externalSearch:function(a){this.open(),this.search.val(a),this.updateResults(!1)},clearSearch:function(){},getMaximumSelectionSize:function(){return L(this.opts.maximumSelectionSize)},ensureHighlightVisible:function(){var c,d,e,f,g,h,i,b=this.results;if(d=this.highlight(),!(0>d)){if(0==d)return b.scrollTop(0),void 0;c=this.findHighlightableChoices().find(".select2-result-label"),e=a(c[d]),f=e.offset().top+e.outerHeight(!0),d===c.length-1&&(i=b.find("li.select2-more-results"),i.length>0&&(f=i.offset().top+i.outerHeight(!0))),g=b.offset().top+b.outerHeight(!0),f>g&&b.scrollTop(b.scrollTop()+(f-g)),h=e.offset().top-b.offset().top,0>h&&"none"!=e.css("display")&&b.scrollTop(b.scrollTop()+h)}},findHighlightableChoices:function(){return this.results.find(".select2-result-selectable:not(.select2-disabled):not(.select2-selected)")},moveHighlight:function(b){for(var c=this.findHighlightableChoices(),d=this.highlight();d>-1&&d<c.length;){d+=b;var e=a(c[d]);if(e.hasClass("select2-result-selectable")&&!e.hasClass("select2-disabled")&&!e.hasClass("select2-selected")){this.highlight(d);break}}},highlight:function(b){var d,e,c=this.findHighlightableChoices();return 0===arguments.length?p(c.filter(".select2-highlighted")[0],c.get()):(b>=c.length&&(b=c.length-1),0>b&&(b=0),this.removeHighlight(),d=a(c[b]),d.addClass("select2-highlighted"),this.search.attr("aria-activedescendant",d.find(".select2-result-label").attr("id")),this.ensureHighlightVisible(),this.liveRegion.text(d.text()),e=d.data("select2-data"),e&&this.opts.element.trigger({type:"select2-highlight",val:this.id(e),choice:e}),void 0)},removeHighlight:function(){this.results.find(".select2-highlighted").removeClass("select2-highlighted")},touchMoved:function(){this._touchMoved=!0},clearTouchMoved:function(){this._touchMoved=!1},countSelectableResults:function(){return this.findHighlightableChoices().length},highlightUnderEvent:function(b){var c=a(b.target).closest(".select2-result-selectable");if(c.length>0&&!c.is(".select2-highlighted")){var d=this.findHighlightableChoices();this.highlight(d.index(c))}else 0==c.length&&this.removeHighlight()},loadMoreIfNeeded:function(){var c,a=this.results,b=a.find("li.select2-more-results"),d=this.resultsPage+1,e=this,f=this.search.val(),g=this.context;
0!==b.length&&(c=b.offset().top-a.offset().top-a.height(),c<=this.opts.loadMorePadding&&(b.addClass("select2-active"),this.opts.query({element:this.opts.element,term:f,page:d,context:g,matcher:this.opts.matcher,callback:this.bind(function(c){e.opened()&&(e.opts.populateResults.call(this,a,c.results,{term:f,page:d,context:g}),e.postprocessResults(c,!1,!1),c.more===!0?(b.detach().appendTo(a).text(L(e.opts.formatLoadMore,d+1)),window.setTimeout(function(){e.loadMoreIfNeeded()},10)):b.remove(),e.positionDropdown(),e.resultsPage=d,e.context=c.context,this.opts.element.trigger({type:"select2-loaded",items:c}))})})))},tokenize:function(){},updateResults:function(c){function m(){d.removeClass("select2-active"),h.positionDropdown(),e.find(".select2-no-results,.select2-selection-limit,.select2-searching").length?h.liveRegion.text(e.text()):h.liveRegion.text(h.opts.formatMatches(e.find(".select2-result-selectable").length))}function n(a){e.html(a),m()}var g,i,l,d=this.search,e=this.results,f=this.opts,h=this,j=d.val(),k=a.data(this.container,"select2-last-term");if((c===!0||!k||!r(j,k))&&(a.data(this.container,"select2-last-term",j),c===!0||this.showSearchInput!==!1&&this.opened())){l=++this.queryCount;var o=this.getMaximumSelectionSize();if(o>=1&&(g=this.data(),a.isArray(g)&&g.length>=o&&K(f.formatSelectionTooBig,"formatSelectionTooBig")))return n("<li class='select2-selection-limit'>"+L(f.formatSelectionTooBig,o)+"</li>"),void 0;if(d.val().length<f.minimumInputLength)return K(f.formatInputTooShort,"formatInputTooShort")?n("<li class='select2-no-results'>"+L(f.formatInputTooShort,d.val(),f.minimumInputLength)+"</li>"):n(""),c&&this.showSearch&&this.showSearch(!0),void 0;if(f.maximumInputLength&&d.val().length>f.maximumInputLength)return K(f.formatInputTooLong,"formatInputTooLong")?n("<li class='select2-no-results'>"+L(f.formatInputTooLong,d.val(),f.maximumInputLength)+"</li>"):n(""),void 0;f.formatSearching&&0===this.findHighlightableChoices().length&&n("<li class='select2-searching'>"+L(f.formatSearching)+"</li>"),d.addClass("select2-active"),this.removeHighlight(),i=this.tokenize(),i!=b&&null!=i&&d.val(i),this.resultsPage=1,f.query({element:f.element,term:d.val(),page:this.resultsPage,context:null,matcher:f.matcher,callback:this.bind(function(g){var i;if(l==this.queryCount){if(!this.opened())return this.search.removeClass("select2-active"),void 0;if(this.context=g.context===b?null:g.context,this.opts.createSearchChoice&&""!==d.val()&&(i=this.opts.createSearchChoice.call(h,d.val(),g.results),i!==b&&null!==i&&h.id(i)!==b&&null!==h.id(i)&&0===a(g.results).filter(function(){return r(h.id(this),h.id(i))}).length&&this.opts.createSearchChoicePosition(g.results,i)),0===g.results.length&&K(f.formatNoMatches,"formatNoMatches"))return n("<li class='select2-no-results'>"+L(f.formatNoMatches,d.val())+"</li>"),void 0;e.empty(),h.opts.populateResults.call(this,e,g.results,{term:d.val(),page:this.resultsPage,context:null}),g.more===!0&&K(f.formatLoadMore,"formatLoadMore")&&(e.append("<li class='select2-more-results'>"+h.opts.escapeMarkup(L(f.formatLoadMore,this.resultsPage))+"</li>"),window.setTimeout(function(){h.loadMoreIfNeeded()},10)),this.postprocessResults(g,c),m(),this.opts.element.trigger({type:"select2-loaded",items:g})}})})}},cancel:function(){this.close()},blur:function(){this.opts.selectOnBlur&&this.selectHighlighted({noFocus:!0}),this.close(),this.container.removeClass("select2-container-active"),this.search[0]===document.activeElement&&this.search.blur(),this.clearSearch(),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus")},focusSearch:function(){z(this.search)},selectHighlighted:function(a){if(this._touchMoved)return this.clearTouchMoved(),void 0;var b=this.highlight(),c=this.results.find(".select2-highlighted"),d=c.closest(".select2-result").data("select2-data");d?(this.highlight(b),this.onSelect(d,a)):a&&a.noFocus&&this.close()},getPlaceholder:function(){var a;return this.opts.element.attr("placeholder")||this.opts.element.attr("data-placeholder")||this.opts.element.data("placeholder")||this.opts.placeholder||((a=this.getPlaceholderOption())!==b?a.text():b)},getPlaceholderOption:function(){if(this.select){var a=this.select.children("option").first();if(this.opts.placeholderOption!==b)return"first"===this.opts.placeholderOption&&a||"function"==typeof this.opts.placeholderOption&&this.opts.placeholderOption(this.select);if(""===a.text()&&""===a.val())return a}},initContainerWidth:function(){function c(){var c,d,e,f,g,h;if("off"===this.opts.width)return null;if("element"===this.opts.width)return 0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px";if("copy"===this.opts.width||"resolve"===this.opts.width){if(c=this.opts.element.attr("style"),c!==b)for(d=c.split(";"),f=0,g=d.length;g>f;f+=1)if(h=d[f].replace(/\s/g,""),e=h.match(/^width:(([-+]?([0-9]*\.)?[0-9]+)(px|em|ex|%|in|cm|mm|pt|pc))/i),null!==e&&e.length>=1)return e[1];return"resolve"===this.opts.width?(c=this.opts.element.css("width"),c.indexOf("%")>0?c:0===this.opts.element.outerWidth(!1)?"auto":this.opts.element.outerWidth(!1)+"px"):null}return a.isFunction(this.opts.width)?this.opts.width():this.opts.width}var d=c.call(this);null!==d&&this.container.css("width",d)}}),e=O(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container"}).html(["<a href='javascript:void(0)' class='select2-choice' tabindex='-1'>","   <span class='select2-chosen'>&nbsp;</span><abbr class='select2-search-choice-close'></abbr>","   <span class='select2-arrow' role='presentation'><b role='presentation'></b></span>","</a>","<label for='' class='select2-offscreen'></label>","<input class='select2-focusser select2-offscreen' type='text' aria-haspopup='true' role='button' />","<div class='select2-drop select2-display-none'>","   <div class='select2-search'>","       <label for='' class='select2-offscreen'></label>","       <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input' role='combobox' aria-expanded='true'","       aria-autocomplete='list' />","   </div>","   <ul class='select2-results' role='listbox'>","   </ul>","</div>"].join(""));return b},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.focusser.prop("disabled",!this.isInterfaceEnabled())},opening:function(){var c,d,e;this.opts.minimumResultsForSearch>=0&&this.showSearch(!0),this.parent.opening.apply(this,arguments),this.showSearchInput!==!1&&this.search.val(this.focusser.val()),this.search.focus(),c=this.search.get(0),c.createTextRange?(d=c.createTextRange(),d.collapse(!1),d.select()):c.setSelectionRange&&(e=this.search.val().length,c.setSelectionRange(e,e)),""===this.search.val()&&this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.search.select()),this.focusser.prop("disabled",!0).val(""),this.updateResults(!0),this.opts.element.trigger(a.Event("select2-open"))},close:function(){this.opened()&&(this.parent.close.apply(this,arguments),this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus())},focus:function(){this.opened()?this.close():(this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus())},isFocused:function(){return this.container.hasClass("select2-container-active")},cancel:function(){this.parent.cancel.apply(this,arguments),this.focusser.prop("disabled",!1),this.opts.shouldFocusInput(this)&&this.focusser.focus()},destroy:function(){a("label[for='"+this.focusser.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var b,h,d=this.container,e=this.dropdown,f=g();this.opts.minimumResultsForSearch<0?this.showSearch(!1):this.showSearch(!0),this.selection=b=d.find(".select2-choice"),this.focusser=d.find(".select2-focusser"),b.find(".select2-chosen").attr("id","select2-chosen-"+f),this.focusser.attr("aria-labelledby","select2-chosen-"+f),this.results.attr("id","select2-results-"+f),this.search.attr("aria-owns","select2-results-"+f),this.focusser.attr("id","s2id_autogen"+f),h=a("label[for='"+this.opts.element.attr("id")+"']"),this.focusser.prev().text(h.text()).attr("for",this.focusser.attr("id"));var i=this.opts.element.attr("title");this.opts.element.attr("title",i||h.text()),this.focusser.attr("tabindex",this.elementTabIndex),this.search.attr("id",this.focusser.attr("id")+"_search"),this.search.prev().text(a("label[for='"+this.focusser.attr("id")+"']").text()).attr("for",this.search.attr("id")),this.search.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()){if(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)return B(a),void 0;switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),B(a),void 0;case c.ENTER:return this.selectHighlighted(),B(a),void 0;case c.TAB:return this.selectHighlighted({noFocus:!0}),void 0;case c.ESC:return this.cancel(a),B(a),void 0}}})),this.search.on("blur",this.bind(function(){document.activeElement===this.body().get(0)&&window.setTimeout(this.bind(function(){this.opened()&&this.search.focus()}),0)})),this.focusser.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()&&a.which!==c.TAB&&!c.isControl(a)&&!c.isFunctionKey(a)&&a.which!==c.ESC){if(this.opts.openOnEnter===!1&&a.which===c.ENTER)return B(a),void 0;if(a.which==c.DOWN||a.which==c.UP||a.which==c.ENTER&&this.opts.openOnEnter){if(a.altKey||a.ctrlKey||a.shiftKey||a.metaKey)return;return this.open(),B(a),void 0}return a.which==c.DELETE||a.which==c.BACKSPACE?(this.opts.allowClear&&this.clear(),B(a),void 0):void 0}})),u(this.focusser),this.focusser.on("keyup-change input",this.bind(function(a){if(this.opts.minimumResultsForSearch>=0){if(a.stopPropagation(),this.opened())return;this.open()}})),b.on("mousedown touchstart","abbr",this.bind(function(a){this.isInterfaceEnabled()&&(this.clear(),C(a),this.close(),this.selection.focus())})),b.on("mousedown touchstart",this.bind(function(c){n(b),this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.opened()?this.close():this.isInterfaceEnabled()&&this.open(),B(c)})),e.on("mousedown touchstart",this.bind(function(){this.search.focus()})),b.on("focus",this.bind(function(a){B(a)})),this.focusser.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active")})).on("blur",this.bind(function(){this.opened()||(this.container.removeClass("select2-container-active"),this.opts.element.trigger(a.Event("select2-blur")))})),this.search.on("focus",this.bind(function(){this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active")})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.setPlaceholder()},clear:function(b){var c=this.selection.data("select2-data");if(c){var d=a.Event("select2-clearing");if(this.opts.element.trigger(d),d.isDefaultPrevented())return;var e=this.getPlaceholderOption();this.opts.element.val(e?e.val():""),this.selection.find(".select2-chosen").empty(),this.selection.removeData("select2-data"),this.setPlaceholder(),b!==!1&&(this.opts.element.trigger({type:"select2-removed",val:this.id(c),choice:c}),this.triggerChange({removed:c}))}},initSelection:function(){if(this.isPlaceholderOptionSelected())this.updateSelection(null),this.close(),this.setPlaceholder();else{var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.setPlaceholder(),c.nextSearchTerm=c.opts.nextSearchTerm(a,c.search.val()))})}},isPlaceholderOptionSelected:function(){var a;return this.getPlaceholder()?(a=this.getPlaceholderOption())!==b&&a.prop("selected")||""===this.opts.element.val()||this.opts.element.val()===b||null===this.opts.element.val():!1},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments),c=this;return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(a,b){var d=a.find("option").filter(function(){return this.selected&&!this.disabled});b(c.optionToData(d))}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=c.val(),f=null;b.query({matcher:function(a,c,d){var g=r(e,b.id(d));return g&&(f=d),g},callback:a.isFunction(d)?function(){d(f)}:a.noop})}),b},getPlaceholder:function(){return this.select&&this.getPlaceholderOption()===b?b:this.parent.getPlaceholder.apply(this,arguments)},setPlaceholder:function(){var a=this.getPlaceholder();if(this.isPlaceholderOptionSelected()&&a!==b){if(this.select&&this.getPlaceholderOption()===b)return;this.selection.find(".select2-chosen").html(this.opts.escapeMarkup(a)),this.selection.addClass("select2-default"),this.container.removeClass("select2-allowclear")}},postprocessResults:function(a,b,c){var d=0,e=this;if(this.findHighlightableChoices().each2(function(a,b){return r(e.id(b.data("select2-data")),e.opts.element.val())?(d=a,!1):void 0}),c!==!1&&(b===!0&&d>=0?this.highlight(d):this.highlight(0)),b===!0){var g=this.opts.minimumResultsForSearch;g>=0&&this.showSearch(M(a.results)>=g)}},showSearch:function(b){this.showSearchInput!==b&&(this.showSearchInput=b,this.dropdown.find(".select2-search").toggleClass("select2-search-hidden",!b),this.dropdown.find(".select2-search").toggleClass("select2-offscreen",!b),a(this.dropdown,this.container).toggleClass("select2-with-searchbox",b))},onSelect:function(a,b){if(this.triggerSelect(a)){var c=this.opts.element.val(),d=this.data();this.opts.element.val(this.id(a)),this.updateSelection(a),this.opts.element.trigger({type:"select2-selected",val:this.id(a),choice:a}),this.nextSearchTerm=this.opts.nextSearchTerm(a,this.search.val()),this.close(),b&&b.noFocus||!this.opts.shouldFocusInput(this)||this.focusser.focus(),r(c,this.id(a))||this.triggerChange({added:a,removed:d})}},updateSelection:function(a){var d,e,c=this.selection.find(".select2-chosen");this.selection.data("select2-data",a),c.empty(),null!==a&&(d=this.opts.formatSelection(a,c,this.opts.escapeMarkup)),d!==b&&c.append(d),e=this.opts.formatSelectionCssClass(a,c),e!==b&&c.addClass(e),this.selection.removeClass("select2-default"),this.opts.allowClear&&this.getPlaceholder()!==b&&this.container.addClass("select2-allowclear")},val:function(){var a,c=!1,d=null,e=this,f=this.data();if(0===arguments.length)return this.opts.element.val();if(a=arguments[0],arguments.length>1&&(c=arguments[1]),this.select)this.select.val(a).find("option").filter(function(){return this.selected}).each2(function(a,b){return d=e.optionToData(b),!1}),this.updateSelection(d),this.setPlaceholder(),c&&this.triggerChange({added:d,removed:f});else{if(!a&&0!==a)return this.clear(c),void 0;if(this.opts.initSelection===b)throw new Error("cannot call val() if initSelection() is not defined");this.opts.element.val(a),this.opts.initSelection(this.opts.element,function(a){e.opts.element.val(a?e.id(a):""),e.updateSelection(a),e.setPlaceholder(),c&&e.triggerChange({added:a,removed:f})})}},clearSearch:function(){this.search.val(""),this.focusser.val("")},data:function(a){var c,d=!1;return 0===arguments.length?(c=this.selection.data("select2-data"),c==b&&(c=null),c):(arguments.length>1&&(d=arguments[1]),a?(c=this.data(),this.opts.element.val(a?this.id(a):""),this.updateSelection(a),d&&this.triggerChange({added:a,removed:c})):this.clear(d),void 0)}}),f=O(d,{createContainer:function(){var b=a(document.createElement("div")).attr({"class":"select2-container select2-container-multi"}).html(["<ul class='select2-choices'>","  <li class='select2-search-field'>","    <label for='' class='select2-offscreen'></label>","    <input type='text' autocomplete='off' autocorrect='off' autocapitalize='off' spellcheck='false' class='select2-input'>","  </li>","</ul>","<div class='select2-drop select2-drop-multi select2-display-none'>","   <ul class='select2-results'>","   </ul>","</div>"].join(""));return b},prepareOpts:function(){var b=this.parent.prepareOpts.apply(this,arguments),c=this;return"select"===b.element.get(0).tagName.toLowerCase()?b.initSelection=function(a,b){var d=[];a.find("option").filter(function(){return this.selected&&!this.disabled}).each2(function(a,b){d.push(c.optionToData(b))}),b(d)}:"data"in b&&(b.initSelection=b.initSelection||function(c,d){var e=s(c.val(),b.separator),f=[];b.query({matcher:function(c,d,g){var h=a.grep(e,function(a){return r(a,b.id(g))}).length;return h&&f.push(g),h},callback:a.isFunction(d)?function(){for(var a=[],c=0;c<e.length;c++)for(var g=e[c],h=0;h<f.length;h++){var i=f[h];if(r(g,b.id(i))){a.push(i),f.splice(h,1);break}}d(a)}:a.noop})}),b},selectChoice:function(a){var b=this.container.find(".select2-search-choice-focus");b.length&&a&&a[0]==b[0]||(b.length&&this.opts.element.trigger("choice-deselected",b),b.removeClass("select2-search-choice-focus"),a&&a.length&&(this.close(),a.addClass("select2-search-choice-focus"),this.opts.element.trigger("choice-selected",a)))},destroy:function(){a("label[for='"+this.search.attr("id")+"']").attr("for",this.opts.element.attr("id")),this.parent.destroy.apply(this,arguments)},initContainer:function(){var d,b=".select2-choices";this.searchContainer=this.container.find(".select2-search-field"),this.selection=d=this.container.find(b);var e=this;this.selection.on("click",".select2-search-choice:not(.select2-locked)",function(){e.search[0].focus(),e.selectChoice(a(this))}),this.search.attr("id","s2id_autogen"+g()),this.search.prev().text(a("label[for='"+this.opts.element.attr("id")+"']").text()).attr("for",this.search.attr("id")),this.search.on("input paste",this.bind(function(){this.isInterfaceEnabled()&&(this.opened()||this.open())})),this.search.attr("tabindex",this.elementTabIndex),this.keydowns=0,this.search.on("keydown",this.bind(function(a){if(this.isInterfaceEnabled()){++this.keydowns;var b=d.find(".select2-search-choice-focus"),e=b.prev(".select2-search-choice:not(.select2-locked)"),f=b.next(".select2-search-choice:not(.select2-locked)"),g=A(this.search);if(b.length&&(a.which==c.LEFT||a.which==c.RIGHT||a.which==c.BACKSPACE||a.which==c.DELETE||a.which==c.ENTER)){var h=b;return a.which==c.LEFT&&e.length?h=e:a.which==c.RIGHT?h=f.length?f:null:a.which===c.BACKSPACE?this.unselect(b.first())&&(this.search.width(10),h=e.length?e:f):a.which==c.DELETE?this.unselect(b.first())&&(this.search.width(10),h=f.length?f:null):a.which==c.ENTER&&(h=null),this.selectChoice(h),B(a),h&&h.length||this.open(),void 0}if((a.which===c.BACKSPACE&&1==this.keydowns||a.which==c.LEFT)&&0==g.offset&&!g.length)return this.selectChoice(d.find(".select2-search-choice:not(.select2-locked)").last()),B(a),void 0;if(this.selectChoice(null),this.opened())switch(a.which){case c.UP:case c.DOWN:return this.moveHighlight(a.which===c.UP?-1:1),B(a),void 0;case c.ENTER:return this.selectHighlighted(),B(a),void 0;case c.TAB:return this.selectHighlighted({noFocus:!0}),this.close(),void 0;case c.ESC:return this.cancel(a),B(a),void 0}if(a.which!==c.TAB&&!c.isControl(a)&&!c.isFunctionKey(a)&&a.which!==c.BACKSPACE&&a.which!==c.ESC){if(a.which===c.ENTER){if(this.opts.openOnEnter===!1)return;if(a.altKey||a.ctrlKey||a.shiftKey||a.metaKey)return}this.open(),(a.which===c.PAGE_UP||a.which===c.PAGE_DOWN)&&B(a),a.which===c.ENTER&&B(a)}}})),this.search.on("keyup",this.bind(function(){this.keydowns=0,this.resizeSearch()})),this.search.on("blur",this.bind(function(b){this.container.removeClass("select2-container-active"),this.search.removeClass("select2-focused"),this.selectChoice(null),this.opened()||this.clearSearch(),b.stopImmediatePropagation(),this.opts.element.trigger(a.Event("select2-blur"))})),this.container.on("click",b,this.bind(function(b){this.isInterfaceEnabled()&&(a(b.target).closest(".select2-search-choice").length>0||(this.selectChoice(null),this.clearPlaceholder(),this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.open(),this.focusSearch(),b.preventDefault()))})),this.container.on("focus",b,this.bind(function(){this.isInterfaceEnabled()&&(this.container.hasClass("select2-container-active")||this.opts.element.trigger(a.Event("select2-focus")),this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"),this.clearPlaceholder())})),this.initContainerWidth(),this.opts.element.addClass("select2-offscreen"),this.clearSearch()},enableInterface:function(){this.parent.enableInterface.apply(this,arguments)&&this.search.prop("disabled",!this.isInterfaceEnabled())},initSelection:function(){if(""===this.opts.element.val()&&""===this.opts.element.text()&&(this.updateSelection([]),this.close(),this.clearSearch()),this.select||""!==this.opts.element.val()){var c=this;this.opts.initSelection.call(null,this.opts.element,function(a){a!==b&&null!==a&&(c.updateSelection(a),c.close(),c.clearSearch())})}},clearSearch:function(){var a=this.getPlaceholder(),c=this.getMaxSearchWidth();a!==b&&0===this.getVal().length&&this.search.hasClass("select2-focused")===!1?(this.search.val(a).addClass("select2-default"),this.search.width(c>0?c:this.container.css("width"))):this.search.val("").width(10)},clearPlaceholder:function(){this.search.hasClass("select2-default")&&this.search.val("").removeClass("select2-default")},opening:function(){this.clearPlaceholder(),this.resizeSearch(),this.parent.opening.apply(this,arguments),this.focusSearch(),""===this.search.val()&&this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.search.select()),this.updateResults(!0),this.search.focus(),this.opts.element.trigger(a.Event("select2-open"))},close:function(){this.opened()&&this.parent.close.apply(this,arguments)},focus:function(){this.close(),this.search.focus()},isFocused:function(){return this.search.hasClass("select2-focused")},updateSelection:function(b){var c=[],d=[],e=this;a(b).each(function(){p(e.id(this),c)<0&&(c.push(e.id(this)),d.push(this))}),b=d,this.selection.find(".select2-search-choice").remove(),a(b).each(function(){e.addSelectedChoice(this)}),e.postprocessResults()},tokenize:function(){var a=this.search.val();a=this.opts.tokenizer.call(this,a,this.data(),this.bind(this.onSelect),this.opts),null!=a&&a!=b&&(this.search.val(a),a.length>0&&this.open())},onSelect:function(a,c){this.triggerSelect(a)&&(this.addSelectedChoice(a),this.opts.element.trigger({type:"selected",val:this.id(a),choice:a}),this.nextSearchTerm=this.opts.nextSearchTerm(a,this.search.val()),this.clearSearch(),this.updateResults(),(this.select||!this.opts.closeOnSelect)&&this.postprocessResults(a,!1,this.opts.closeOnSelect===!0),this.opts.closeOnSelect?(this.close(),this.search.width(10)):this.countSelectableResults()>0?(this.search.width(10),this.resizeSearch(),this.getMaximumSelectionSize()>0&&this.val().length>=this.getMaximumSelectionSize()?this.updateResults(!0):this.nextSearchTerm!=b&&(this.search.val(this.nextSearchTerm),this.updateResults(),this.search.select()),this.positionDropdown()):(this.close(),this.search.width(10)),this.triggerChange({added:a}),c&&c.noFocus||this.focusSearch())},cancel:function(){this.close(),this.focusSearch()},addSelectedChoice:function(c){var j,k,d=!c.locked,e=a("<li class='select2-search-choice'>    <div></div>    <a href='#' class='select2-search-choice-close' tabindex='-1'></a></li>"),f=a("<li class='select2-search-choice select2-locked'><div></div></li>"),g=d?e:f,h=this.id(c),i=this.getVal();j=this.opts.formatSelection(c,g.find("div"),this.opts.escapeMarkup),j!=b&&g.find("div").replaceWith("<div>"+j+"</div>"),k=this.opts.formatSelectionCssClass(c,g.find("div")),k!=b&&g.addClass(k),d&&g.find(".select2-search-choice-close").on("mousedown",B).on("click dblclick",this.bind(function(b){this.isInterfaceEnabled()&&(this.unselect(a(b.target)),this.selection.find(".select2-search-choice-focus").removeClass("select2-search-choice-focus"),B(b),this.close(),this.focusSearch())})).on("focus",this.bind(function(){this.isInterfaceEnabled()&&(this.container.addClass("select2-container-active"),this.dropdown.addClass("select2-drop-active"))})),g.data("select2-data",c),g.insertBefore(this.searchContainer),i.push(h),this.setVal(i)},unselect:function(b){var d,e,c=this.getVal();if(b=b.closest(".select2-search-choice"),0===b.length)throw"Invalid argument: "+b+". Must be .select2-search-choice";if(d=b.data("select2-data")){var f=a.Event("select2-removing");if(f.val=this.id(d),f.choice=d,this.opts.element.trigger(f),f.isDefaultPrevented())return!1;for(;(e=p(this.id(d),c))>=0;)c.splice(e,1),this.setVal(c),this.select&&this.postprocessResults();return b.remove(),this.opts.element.trigger({type:"select2-removed",val:this.id(d),choice:d}),this.triggerChange({removed:d}),!0}},postprocessResults:function(a,b,c){var d=this.getVal(),e=this.results.find(".select2-result"),f=this.results.find(".select2-result-with-children"),g=this;e.each2(function(a,b){var c=g.id(b.data("select2-data"));p(c,d)>=0&&(b.addClass("select2-selected"),b.find(".select2-result-selectable").addClass("select2-selected"))}),f.each2(function(a,b){b.is(".select2-result-selectable")||0!==b.find(".select2-result-selectable:not(.select2-selected)").length||b.addClass("select2-selected")}),-1==this.highlight()&&c!==!1&&g.highlight(0),!this.opts.createSearchChoice&&!e.filter(".select2-result:not(.select2-selected)").length>0&&(!a||a&&!a.more&&0===this.results.find(".select2-no-results").length)&&K(g.opts.formatNoMatches,"formatNoMatches")&&this.results.append("<li class='select2-no-results'>"+L(g.opts.formatNoMatches,g.search.val())+"</li>")},getMaxSearchWidth:function(){return this.selection.width()-t(this.search)},resizeSearch:function(){var a,b,c,d,e,f=t(this.search);a=D(this.search)+10,b=this.search.offset().left,c=this.selection.width(),d=this.selection.offset().left,e=c-(b-d)-f,a>e&&(e=c-f),40>e&&(e=c-f),0>=e&&(e=a),this.search.width(Math.floor(e))},getVal:function(){var a;return this.select?(a=this.select.val(),null===a?[]:a):(a=this.opts.element.val(),s(a,this.opts.separator))},setVal:function(b){var c;this.select?this.select.val(b):(c=[],a(b).each(function(){p(this,c)<0&&c.push(this)}),this.opts.element.val(0===c.length?"":c.join(this.opts.separator)))},buildChangeDetails:function(a,b){for(var b=b.slice(0),a=a.slice(0),c=0;c<b.length;c++)for(var d=0;d<a.length;d++)r(this.opts.id(b[c]),this.opts.id(a[d]))&&(b.splice(c,1),c>0&&c--,a.splice(d,1),d--);return{added:b,removed:a}},val:function(c,d){var e,f=this;if(0===arguments.length)return this.getVal();if(e=this.data(),e.length||(e=[]),!c&&0!==c)return this.opts.element.val(""),this.updateSelection([]),this.clearSearch(),d&&this.triggerChange({added:this.data(),removed:e}),void 0;if(this.setVal(c),this.select)this.opts.initSelection(this.select,this.bind(this.updateSelection)),d&&this.triggerChange(this.buildChangeDetails(e,this.data()));else{if(this.opts.initSelection===b)throw new Error("val() cannot be called if initSelection() is not defined");this.opts.initSelection(this.opts.element,function(b){var c=a.map(b,f.id);f.setVal(c),f.updateSelection(b),f.clearSearch(),d&&f.triggerChange(f.buildChangeDetails(e,f.data()))})}this.clearSearch()},onSortStart:function(){if(this.select)throw new Error("Sorting of elements is not supported when attached to <select>. Attach to <input type='hidden'/> instead.");this.search.width(0),this.searchContainer.hide()},onSortEnd:function(){var b=[],c=this;this.searchContainer.show(),this.searchContainer.appendTo(this.searchContainer.parent()),this.resizeSearch(),this.selection.find(".select2-search-choice").each(function(){b.push(c.opts.id(a(this).data("select2-data")))}),this.setVal(b),this.triggerChange()},data:function(b,c){var e,f,d=this;return 0===arguments.length?this.selection.children(".select2-search-choice").map(function(){return a(this).data("select2-data")}).get():(f=this.data(),b||(b=[]),e=a.map(b,function(a){return d.opts.id(a)}),this.setVal(e),this.updateSelection(b),this.clearSearch(),c&&this.triggerChange(this.buildChangeDetails(f,this.data())),void 0)}}),a.fn.select2=function(){var d,e,f,g,h,c=Array.prototype.slice.call(arguments,0),i=["val","destroy","opened","open","close","focus","isFocused","container","dropdown","onSortStart","onSortEnd","enable","disable","readonly","positionDropdown","data","search"],j=["opened","isFocused","container","dropdown"],k=["val","data"],l={search:"externalSearch"};return this.each(function(){if(0===c.length||"object"==typeof c[0])d=0===c.length?{}:a.extend({},c[0]),d.element=a(this),"select"===d.element.get(0).tagName.toLowerCase()?h=d.element.prop("multiple"):(h=d.multiple||!1,"tags"in d&&(d.multiple=h=!0)),e=h?new window.Select2["class"].multi:new window.Select2["class"].single,e.init(d);else{if("string"!=typeof c[0])throw"Invalid arguments to select2 plugin: "+c;if(p(c[0],i)<0)throw"Unknown method: "+c[0];if(g=b,e=a(this).data("select2"),e===b)return;if(f=c[0],"container"===f?g=e.container:"dropdown"===f?g=e.dropdown:(l[f]&&(f=l[f]),g=e[f].apply(e,c.slice(1))),p(c[0],j)>=0||p(c[0],k)&&1==c.length)return!1}}),g===b?this:g},a.fn.select2.defaults={width:"copy",loadMorePadding:0,closeOnSelect:!0,openOnEnter:!0,containerCss:{},dropdownCss:{},containerCssClass:"",dropdownCssClass:"",formatResult:function(a,b,c,d){var e=[];return F(a.text,c.term,e,d),e.join("")},formatSelection:function(a,c,d){return a?d(a.text):b},sortResults:function(a){return a},formatResultCssClass:function(a){return a.css},formatSelectionCssClass:function(){return b},formatMatches:function(a){return a+" results are available, use up and down arrow keys to navigate."},formatNoMatches:function(){return"No matches found"},formatInputTooShort:function(a,b){var c=b-a.length;return"Please enter "+c+" or more character"+(1==c?"":"s")},formatInputTooLong:function(a,b){var c=a.length-b;return"Please delete "+c+" character"+(1==c?"":"s")},formatSelectionTooBig:function(a){return"You can only select "+a+" item"+(1==a?"":"s")},formatLoadMore:function(){return"Loading more results\u2026"},formatSearching:function(){return"Searching\u2026"},minimumResultsForSearch:0,minimumInputLength:0,maximumInputLength:null,maximumSelectionSize:0,id:function(a){return a==b?null:a.id},matcher:function(a,b){return o(""+b).toUpperCase().indexOf(o(""+a).toUpperCase())>=0},separator:",",tokenSeparators:[],tokenizer:N,escapeMarkup:G,blurOnChange:!1,selectOnBlur:!1,adaptContainerCssClass:function(a){return a},adaptDropdownCssClass:function(){return null},nextSearchTerm:function(){return b},searchInputPlaceholder:"",createSearchChoicePosition:"top",shouldFocusInput:function(a){return a.opts.minimumResultsForSearch<0?!1:!0}},a.fn.select2.ajaxDefaults={transport:a.ajax,params:{type:"GET",cache:!1,dataType:"json"}},window.Select2={query:{ajax:H,local:I,tags:J},util:{debounce:w,markMatch:F,escapeMarkup:G,stripDiacritics:o},"class":{"abstract":d,single:e,multi:f}}}}(jQuery);
var scheduleApp = angular.module('scheduleApp', ['ngSanitize', 'gantt', 'ui.select2'], function($interpolateProvider) {
    $interpolateProvider.startSymbol('<&');
    $interpolateProvider.endSymbol('&>');
});

scheduleApp.controller('scheduleCtrl', function ($scope, $rootScope, dataService, taskService) {
    window.my_scope = $scope;
    $scope.mode = "custom";
    $scope.firstDay = 1;
    $scope.weekendDays = [0,6];
    $scope.maxHeight = 0;
    $scope.showWeekends = true;
    $scope.date = moment().format("YYYY-MM-DD");
    $scope.timezone_offset = 0;
    $scope.schedule_series = {};
    $scope.curr_id = 1000;
    $scope.available_tasks = dataService.getAvailableTasks();
    $scope.available_roles = [];
    $scope.selected_task = {};
    $scope.selected_role = {};
    $scope.users = [];
    $scope.gantt = undefined;
    $scope.schedule = {};
    $scope.selected_scale = {
        value: 'day'
    };

    $scope.saving = false;

    $scope.getInitialData = function() {
        var from = $scope.setFromDate($scope.selected_scale.value);
        var to = $scope.setToDate($scope.selected_scale.value);

        dataService.getAvailableUsers($scope.date, $scope.selected_role.id).then(function(response) {
            $scope.users = response.availableUsers;
            $scope.gantt.users = $scope.filteredUsers;

            dataService.getRoleSchedule($scope.date, $scope.selected_role.id, from, to).then(function(gantt_response) {
                $scope.timezone_offset = gantt_response.timezone;
                $scope.gantt.setDefaultDateRange(from, to);

                $scope.curr_id++;

                $scope.schedule = gantt_response.schedule;
                $scope.loadData(gantt_response.initial_tasks);

                angular.forEach($scope.gantt.rows, function(row, key) {
                    angular.forEach($scope.users, function(user, key) {
                        if(row.tasks[0].data.db_id === user.initial_task_id) {
                            row.tasks[0].data.selected_user = user;
                        }
                    })
                });
            });
        });
    };

    $scope.initializePage = function(gantt) {
        $scope.gantt = gantt;
        $scope.getAvailableRoles();
    };

    $scope.getAvailableRoles = function() {
        dataService.getAvailableRoles().then(function(response) {
            $scope.available_roles = response;
            $scope.selected_role = response[0];
            $scope.getInitialData();
        });
    };

    $scope.changeWeek = function() {
        if($scope.gantt !== undefined) {
            if($scope.gantt.rows.length > 0) {
                $scope.clearData();
            }
        }
        $scope.getInitialData();
    };

    $scope.saveSchedule = function() {
        $scope.saving = true;
        $.post(
            "roster/roster-from-schedule",
            {
                rows: $scope.gantt.toJSON(),
                date: $scope.date
            },
            function(returnedData) {
                $scope.saving = false;
            }
        );
    };

    $scope.filteredUsers = function(row) {
        var users = Array.apply(this, $scope.users);
        var shift_start = moment(row.tasks[0].from);
        var shift_end = moment(row.tasks[0].to);

        angular.forEach($scope.gantt.rows, function(other_row, key) {
            if(other_row != row) {
                if(typeof other_row.tasks[0].data.selected_user !== 'undefined') users.remove(other_row.tasks[0].data.selected_user);
            }
        });

        angular.forEach(users, function(user, key) {
            var avail;

            if(user.availgeneral.length > 0) {
                var avail_start = moment($scope.date + " " + user.availgeneral[0].start_time);
                var avail_end = moment($scope.date + " " + user.availgeneral[0].end_time);
                avail = moment().range(avail_start, avail_end);
                if(!(avail.contains(shift_start) && avail.contains(shift_end))) users.remove(user);
            }

            if(user.availspecific.length > 0) {
                var avail_spec = user.availspecific[0],
                    spec_start,
                    spec_end;

                if(avail_spec.all_day) {
                    spec_start = moment(avail_spec.start_date, "YYYY-MM-DD").startOf('day');
                    spec_end = moment(avail_spec.end_date, "YYYY-MM-DD").endOf('day');
                } else {
                    spec_start = moment(avail_spec.start_date + " " + avail_spec.start_time);
                    spec_end = moment(avail_spec.end_date + " " + avail_spec.end_time);
                }

                if(moment().range(spec_start, spec_end).overlaps(moment().range(shift_start, shift_end))){
                    users.remove(user);
                }
            }
        });

        return users;
    };

    $scope.addRow = function(event) {};

    $scope.rowEvent = function(event) {
        // A row has been added, updated or clicked. Use this event to save back the updated row e.g. after a user re-ordered it.
    };

    $scope.scrollEvent = function(event) {
        if (angular.equals(event.direction, "left")) {
            // Raised if the user scrolled to the left side of the Gantt. Use this event to load more data.
        } else if (angular.equals(event.direction, "right")) {
            // Raised if the user scrolled to the right side of the Gantt. Use this event to load more data.
        }
    };

    $scope.taskEvent = function(event) {
        // A task has been updated or clicked.
    };

    $scope.setFromDate = function(type) {
        if(type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).startOf('isoWeek').format("YYYY-MM-DD");
        }
    };
    $scope.setToDate = function(type) {
        if(type == 'day') {
            return moment($scope.date).format("YYYY-MM-DD");
        } else {
            return moment($scope.date).endOf('isoWeek').format("YYYY-MM-DD");
        }

    };
    $scope.start_date = $scope.setFromDate($scope.selected_scale.value);
    $scope.end_date = $scope.setToDate($scope.selected_scale.value);
});

function AvailableTask(task) {
    this.name = task.name;
    this.identifier = task.identifier;
    this.available = task.available;
    this.paid =  task.paid;
    this.color = '#' + task.color;
    this.times_added = 0;
}

scheduleApp.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];

        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                }
            });
        } else {
            // Let the output be the input untouched
            out = items;
        }

        return out;
    }
});

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};


scheduleApp.factory("dataService", function($q) {
    function _getRoleSchedule(date, selected_role, from, to) {
        var defer = $q.defer();
        $.getJSON('schedule/new-schedule', {role_id: selected_role, date: date}, function(allData) {
            var schedule = allData.data;
            var shifts = schedule.scheduledshift;
            var row_array = [];
            var timezone = allData.data.timezone;
            var schedule_obj = {
                "id": schedule.id,
                "role_id": schedule.role_id,
                "date_start": schedule.start_date,
                "date_ending": schedule.end_date
            };


            angular.forEach(shifts, function(val, key) {
                if(moment(val.start_time).isAfter(moment(from).startOf('day')) && moment(val.end_time).isBefore(moment(to).endOf('day'))) {
                    var task = {
                        "id": val.id,
                        "subject": 'Shift',
                        "color": '#00BA98',
                        "from": +moment(val.start_time),
                        "to": +moment(val.end_time),
                        "child": [],
                        "data": {
                            "db_id": val.id,
                            "zIndex": 997
                        }
                    };

                    angular.forEach(val.task, function(val, key) {
                        task.child.push({
                            "id": task.id + " " + val.pivot.id,
                            "subject": val.name,
                            "color": "#" + val.color,
                            "from": +moment(val.pivot.start_time),
                            "to": +moment(val.pivot.end_time),
                            "data": {
                                available: val.available,
                                paid: val.available,
                                planned: val.planned,
                                "db_id": val.pivot.id,
                                "identifier": val.identifier,
                                "zIndex": 998
                            }
                        });
                    });
                    row_array.push({
                        "id": val.id,
                        "description": "Shift",
                        "order": "0",
                        "tasks": [task]
                        }
                    );
                }
            });

            defer.resolve({"initial_tasks": row_array, "schedule": schedule_obj, "timezone": timezone});
        });

        return defer.promise;
    }

    function _getAvailableTasks() {
        var tasks = {};
        $.getJSON('task/schedulable-tasks', {}, function(allData) {
            angular.forEach(allData.data, function(val, key) {
                tasks[val.identifier] = new AvailableTask(val);
            });
        });
        return tasks;
    }

    function _getAvailableUsers(date, selected_role) {
        var defer = $q.defer();
        $.getJSON('roster/available-users-by-role', {role_id: selected_role, date: date}, function(allData) {
            var availableUsers = [];
            angular.forEach(allData.data, function(user, key) {
                availableUsers.push({
                    id: user.id,
                    name: user.first_name + " " + user.last_name,
                    team: user.team.name,
                    team_id: user.team.id,
                    availgeneral: user.availgeneral,
                    availspecific: user.availspecific,
                    initial_task_id: user.rosteredshift.length > 0 && user.rosteredshift[0].scheduledshift.length > 0 ?
                        user.rosteredshift[0].scheduledshift[0].id :
                        null
                })
            });

            return defer.resolve({availableUsers: availableUsers});
        });

        return defer.promise;
    }

    function _getAvailableRoles() {
        var defer = $q.defer();
        var roles = [];
        $.getJSON('role/available-roles', {}, function(allData) {
            angular.forEach(allData.data, function(val, key) {
                roles.push({
                    id: key,
                    name: val
                })
            });
            defer.resolve(roles);
        });
        return defer.promise;
    }

    function _getForecastData(role_id, start_time, end_time, interval) {
        var data = {
            role_id: role_id,
            start_time: start_time,
            end_time: end_time,
            interval: interval
        };
        var x_axis = [];
        var number_of_agents = [];
        var defer = $q.defer();

        $.getJSON("forecast/role-forecast", data, function(allData) {
            if(allData['result'] == 0) {
                $.each(allData.data, function(key, val) {
                    var wait_time = val.workstream.wait_time_threshold;
                    var period_length = 900; //15 minute periods (in seconds)
                    $.each(val.data, function(key, val) {
                        var point = moment(val.prediction_start_time, 'YYYY-MM-DD HH:mm:ss').unix()*1000,
                            array_key = arraySearch(x_axis, point),
                            num_agents = calculateNumAgents(val.expected_volume, val.expected_average_handle_time, wait_time, period_length);
                        if(array_key === false) {
                            x_axis.push(point);
                            number_of_agents.push(num_agents);
                        } else {
                            number_of_agents[array_key] += num_agents;
                        }
                    });
                });
            }

            var chart_data = createSeries(x_axis, number_of_agents);

            defer.resolve(chart_data);
        });

        return defer.promise;
    }

    return {
        getRoleSchedule: _getRoleSchedule,
        getAvailableTasks: _getAvailableTasks,
        getAvailableRoles: _getAvailableRoles,
        getForecastData: _getForecastData,
        getAvailableUsers: _getAvailableUsers
    };
});

function dayAvails(avail_generals, current_day) {
    var day = false;

    angular.forEach(avail_generals, function(val, key) {
        if(val.day === current_day.format('dddd')) day = val;
    });

    return day;
}

function createSeries(xValues, yValues) {
    var chart_data = [];
    for(var i = 0; i < yValues.length; i++) {
        chart_data[i] = [xValues[i], yValues[i]];
    }

    return chart_data;
}

function arraySearch(arr,val) {
    for (var i=0; i<arr.length; i++)
        if (arr[i] === val)
            return i;
    return false;
}
scheduleApp.factory("taskService", function() {

    function _addTask($scope, row, date) {
        var fromDate = new Date(date);
        var toDate = new Date(date);
        toDate.setHours(date.getHours()+8);
        var taskRange = moment().range(fromDate, toDate);

        angular.forEach(row.tasks, function(val,key) {
            var otherTask = moment().range(moment(val.from), moment(val.to));
            taskRange = taskRange.subtract(otherTask)[0];
        });

        var taskData = {
            id: $scope.curr_id,
            subject: "Shift",
            color: "#00BA98",
            from: +taskRange.start,
            to: +taskRange.end,
            parent: null,
            zIndex: 997
        };
        var newTask = row.addTask(taskData);
        $scope.updateScheduleSeries(newTask);
        chart.xAxis[0].setExtremes(moment(fromDate).unix()*1000, moment(toDate).unix()*1000);
        $scope.updateHighChart();
        $scope.curr_id++;
        row.gantt.updateTasksPosAndSize();
    }

    function _addSubTask($scope, task, date, selected_task) {
        if(!task.data.parent && selected_task !== undefined && task.subject !== "Not Available" && task.subject !== "Leave") {
            $scope.available_tasks[$scope.selected_task].times_added++;
            var fromDate = new Date(date);
            var toDate = new Date(date);
            toDate.setMinutes(date.getMinutes()+30);
            var taskData = {
                id: $scope.curr_id,
                subject: selected_task.name,
                color: selected_task.color,
                from: fromDate,
                to: toDate,
                data: {
                    parent: event.task,
                    "zIndex": 998
                }
            };
            var newTask = task.row.addTask(taskData);
            newTask.data.identifier = selected_task.identifier;
            newTask.data.available = selected_task.available;
            newTask.data.paid = selected_task.paid;
            newTask.data.parent = task;

            task.child.push(newTask);
            if(newTask.data.parent == false || newTask.data.available == false) {
                $scope.updateScheduleSeries(newTask);
            }
            $scope.curr_id++;
            task.gantt.updateTasksPosAndSize();
        }
    }

    return {
        addTask: _addTask,
        addSubTask: _addSubTask
    }
});
//# sourceMappingURL=roster-from-schedule.js.map
