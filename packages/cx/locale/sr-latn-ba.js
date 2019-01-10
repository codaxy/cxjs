import { Localization } from 'cx/ui';

var c = 'sr-latn-ba';


// Field
Localization.localize(c, 'cx/widgets/Field', {
    requiredText: 'Ovo polje je obavezno.',
    validatingText: 'Validacija je u toku...',
    validationExceptionText: 'Došlo je do problema prilikom validacije podataka. Provjerite log za više detalja'
 });
 
 // LookupField
 Localization.localize(c, 'cx/widgets/LookupField', {
    loadingText: 'Učitavanje...',
    queryErrorText: 'Došlo je do greške kod pribavljanja podataka za prikaz.',
    noResultsText: 'Rezultati nisu pronađeni',
    minQueryLengthMessageText: 'Unesite najmanje {0} karakter(a).'
 });
 
 // In common for Calendar and MonthPicker
 const calendarErrorMessages = {
    maxValueErrorText: 'Izabrani datum je kasniji od posljednjeg dozvoljenog datuma {0:d}',
    maxExclusiveErrorText: 'Izabrani datum bi trebao biti prije {0:d}',
    minValueErrorText: 'Izabrani datum je raniji od {0:d}',
    minExclusiveErrorText: 'Izabrani datum bi trebao biti kasniji od {0:d}',
 };
 // Calendar
 Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
 // MonthPicker
 Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);
 
 // In common for DateField and MonthField
 const dateFieldErrorMessages = {
    ...calendarErrorMessages,
    inputErrorText: 'Neispravan datum.' 
 };
 // MonthField
 Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
 // DateField
 Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);
 
 // NumberField
 Localization.localize(c, 'cx/widgets/NumberField', {
    maxValueErrorText: 'Unesite {0:n} ili manje.',
    maxExclusiveErrorText: 'Unesite broj manji od {0:n}.',
    minValueErrorText: 'Unesite {0:n} ili više.',
    minExclusiveErrorText: 'Unesite broj veći od {0:n}.',
    inputErrorText: 'Neispravan broj.'
 });
 
 // TextField
 Localization.localize(c, 'cx/widgets/TextField', {
    validationErrorText: 'Unešena vrijednost nije validna.',
    minLengthValidationErrorText: 'Unesite {[{0}-{1}]} dodatnih karaktera.',
    maxLengthValidationErrorText: 'Koristite {0} karaktera ili manje.'
 });
 
 // UploadButton
 Localization.localize(c, 'cx/widgets/UploadButton', {
    validationErrorText: 'Otpremanje je u toku.'
 });

 // MsgBox
Localization.localize(c, 'cx/widgets/MsgBox', {
   yesText:"Da",
   noText: "Ne"
});