import { Localization } from 'cx/ui';

var c = 'en-us';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'This field is required.',
   validatingText: 'Validation is in progress...',
   validationExceptionText: 'Something went wrong during input validation. Check log for more details.'
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Loading...',
   queryErrorText: 'Error occurred while querying for lookup data.',
   noResultsText: 'No results found matching the given criteria.',
   minQueryLengthMessageText: 'Please type in at least {0} character(s) to start the search.'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Selected date is after the latest allowed date of {0:d}.',
   maxExclusiveErrorText: 'Selected date should be before {0:d}.',
   minValueErrorText: 'Selected date is before the earliest allowed date of {0:d}.',
   minExclusiveErrorText: 'Selected date should be after {0:d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Invalid date entered.' 
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
// DateField
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

// NumberField
Localization.localize(c, 'cx/widgets/NumberField', {
   maxValueErrorText: 'The number should be at most {0:n}.',
   maxExclusiveErrorText: 'The number should be less than {0:n}.',
   minValueErrorText: 'The number should be at least {0:n}.',
   minExclusiveErrorText: 'The number should be greater than {0:n}.',
   inputErrorText: 'Invalid number entered.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'The entered value is not valid.',
   minLengthValidationErrorText: 'Please enter {[{0}-{1}]} more character(s).',
   maxLengthValidationErrorText: 'The entered text is longer than the maximum allowed {0} characters.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Upload is in progress.'
});