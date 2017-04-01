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
   noResultsText: 'No results found.',
   minQueryLengthMessageText: 'Type in at least {0} character(s).'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Select {0:d} or before.',
   maxExclusiveErrorText: 'Select a date before {0:d}.',
   minValueErrorText: 'Select {0:d} or later.',
   minExclusiveErrorText: 'Select a date after {0:d}.',
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
   maxValueErrorText: 'Enter {0:n} or less.',
   maxExclusiveErrorText: 'Enter a number less than {0:n}.',
   minValueErrorText: 'Enter {0:n} or more.',
   minExclusiveErrorText: 'Enter a number greater than {0:n}.',
   inputErrorText: 'Invalid number entered.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'The entered value is not valid.',
   minLengthValidationErrorText: 'Enter {[{0}-{1}]} more character(s).',
   maxLengthValidationErrorText: 'Use {0} characters or fewer.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Upload is in progress.'
});