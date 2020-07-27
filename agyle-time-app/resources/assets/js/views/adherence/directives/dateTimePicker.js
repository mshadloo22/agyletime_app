adherenceApp.directive('dateTimePicker', function() {
    return {
        restrict: 'AE',
        require: '?ngModel',
        link: function($scope, element, attrs) {
            $(element).datetimepicker({
                pickDate: false,
                pick12HourFormat: false,
                useCurrent: false,
                format: 'HH:mm:ss',
                minDate: attrs.minDate,
                maxDate: attrs.maxDate,
                useSeconds: true
            });
            $(element).data("DateTimePicker").setDate(attrs.default);
        }
    };
});
