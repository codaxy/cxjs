import { Localization } from 'cx/ui';

var c = 'sr-latn-ba';

Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Ovo polje je obavezno.',
   validatingText: 'Validacija je u toku...'
});

let dateFieldErrorMessages = {
   maxValueErrorText: 'Izabrani datum je kasniji od posljednjeg dozvoljenog datuma {0:d}',
   maxExclusiveErrorText: 'Izabrani datum bi trebao biti prije {0:d}',
   minValueErrorText: 'Izbrani datum je raniji od {0:d}',
   minExclusiveErrorText: 'Izabrani datum bi trebao biti kasniji od {0:d}',
};

Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

Localization.localize(c, 'cx/widgets/Calendar', dateFieldErrorMessages);