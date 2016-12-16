import { Localization } from '../ui';

var c = 'sr-latn-ba';

Localization.localize(c, 'Cx.ui.form.Field', {
   requiredText: 'Ovo polje je obavezno.',
});

Localization.localize(c, 'Cx.ui.form.DateField', {
   maxValueErrorText: 'Izabrani datum je kasniji od posljednjeg dozvoljenog datuma {0:d}.',
   maxExclusiveErrorText: 'Izabrani datum bi trebao biti prije {0:d}.',
   minValueErrorText: 'Izbrani datum je raniji od {0:d}.',
   minExclusiveErrorText: 'Izabrani datum bi trebao biti kasniji od {0:d}.',
});
