import { Localization } from 'cx/ui';

var c = 'de-de';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Dieses Feld wird benötigt.',
   validatingText: 'Wird validiert...',
   validationExceptionText: 'Bei der Eingabevalidierung ist ein Fehler aufgetreten. Überprüfen Sie das Log für weitere Details.'
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Wird geladen...',
   queryErrorText: 'Bei der Abfrage der gesuchten Daten ist ein Felhler aufgetreten.',
   noResultsText: 'Keine Ergebnisse gefunden.',
   minQueryLengthMessageText: 'Geben Sie mindestens {0} Zeichen ein.'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Wählen Sie {0:d} oder vorher.',
   maxExclusiveErrorText: 'Wählen Sie ein Datum vor dem {0:d}.',
   minValueErrorText: 'Wählen Sie {0:d} oder später.',
   minExclusiveErrorText: 'Wählen Sie ein Datum nach dem {0:d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Ungültiges Datum eingegeben.' 
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
// DateField
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

// NumberField
Localization.localize(c, 'cx/widgets/NumberField', {
   maxValueErrorText: 'Geben Sie {0:n} oder weniger ein.',
   maxExclusiveErrorText: 'Geben Sie eine Zahl kleiner als {0:n} ein.',
   minValueErrorText: 'Geben Sie {0:n} oder mehr ein.',
   minExclusiveErrorText: 'Geben Sie eine Zahl größer als {0:n} ein.',
   inputErrorText: 'Ungültige Zahl eingegeben.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'Ungültige Eingabe.',
   minLengthValidationErrorText: 'Bitte tragen Sie noch {[{0}-{1}]} Zeichen ein.',
   maxLengthValidationErrorText: 'Benutzen Sie {0} oder weniger Zeichen.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Wird hochgeladen...'
});