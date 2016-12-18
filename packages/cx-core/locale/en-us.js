import { Localization } from 'cx/ui';

var c = 'en-us';

Localization.localize(c, 'Cx.ui.form.Field', {
   requiredText: 'This field is required.',
});

Localization.localize(c, 'Cx.ui.form.DateField', {
   maxValueErrorText: 'Selected date is after the latest allowed date of {0:d}.',
   maxExclusiveErrorText: 'Selected date should be before {0:d}.',
   minValueErrorText: 'Selected date is after the latest allowed date of {0:d}.',
   minExclusiveErrorText: 'Selected date should be before {0:d}.',
});
