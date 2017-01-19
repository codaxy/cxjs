import { Localization } from 'cx/ui';

var c = 'en-us';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'This field is required.',
   validatingText: 'Validation is in progress...',
   validationExceptionText: 'Something went wrong during input validation. Check log for more details.'
});

let dateFieldErrorMessages = {
   maxValueErrorText: 'Selected date is after the latest allowed date of {0:d}.',
   maxExclusiveErrorText: 'Selected date should be before {0:d}.',
   minValueErrorText: 'Selected date is before the latest allowed date of {0:d}.',
   minExclusiveErrorText: 'Selected date should be after {0:d}.',
};

Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

Localization.localize(c, 'cx/widgets/Calendar', dateFieldErrorMessages);


