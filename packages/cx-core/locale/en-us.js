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

// MonthField, DateField, Calendar
let dateFieldErrorMessages = {
   maxValueErrorText: 'Selected date is after the latest allowed date of {0:d}.',
   maxExclusiveErrorText: 'Selected date should be before {0:d}.',
   minValueErrorText: 'Selected date is before the earliest allowed date of {0:d}.',
   minExclusiveErrorText: 'Selected date should be after {0:d}.',
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', { 
   ...dateFieldErrorMessages, 
   inputErrorText: 'Invalid date entered.'
});
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);
Localization.localize(c, 'cx/widgets/Calendar', dateFieldErrorMessages);


