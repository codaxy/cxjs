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
   noResultsText: 'Für die gegebene Suchanfrage wurden keine Ergebnisse gefunden.',
   minQueryLengthMessageText: 'Bitte geben Sie mindestens {0} Zeichen ein, um die Suche zu starten.'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Das gewählte Datum ist nach dem spätestmöglichen Datum ({0:d}).',
   maxExclusiveErrorText: 'Das gewählte Datum sollte vor dem {0:d} liegen.',
   minValueErrorText: 'Das gewählte Datum ist vor dem frühestmöglichen Datum ({0:d}).',
   minExclusiveErrorText: 'Das gewählte Datum sollte nach dem {0:d} liegen.',
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
   maxValueErrorText: 'Die Zahl sollte nicht größer als {0:n} sein.',
   maxExclusiveErrorText: 'Die Zahl sollte kleiner als {0:n} sein.',
   minValueErrorText: 'Die Zahl sollte nicht kleiner als {0:n} sein.',
   minExclusiveErrorText: 'Die Zahl sollte größer als {0:n} sein.',
   inputErrorText: 'Ungültige Zahl eingegeben.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'Ungültige Eingabe.',
   minLengthValidationErrorText: 'Bitte tragen Sie noch {[{0}-{1}]} Zeichen ein.',
   maxLengthValidationErrorText: 'Die Textlänge ist größer als die maximal zulässige Zeichenanzahl ({0}).'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Wird hochgeladen...'
});