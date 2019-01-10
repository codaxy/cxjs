import { Localization } from 'cx/ui';

var c = 'nl-nl';


// Field
Localization.localize(c, 'cx/widgets/Field', {
    requiredText: 'Dit veld is verplicht.',
    validatingText: 'Validatie is bezig ...',
    validationExceptionText: 'Er is een probleem opgetreden bij het valideren van de gegevens. Controleer het logboek voor meer details '
 });
 
 // LookupField
 Localization.localize(c, 'cx/widgets/LookupField', {
    loadingText: 'Bezig met laden ...'
   ,
    queryErrorText: 'Er is een fout opgetreden bij het weergeven van gegevens.' ,
    noResultsText: 'Geen resultaten gevonden',
    minQueryLengthMessageText: 'Voer minimaal {0} tekens in.'
 });
 
 // In common for Calendar and MonthPicker
 const calendarErrorMessages = {
    maxValueErrorText: 'De geselecteerde datum is later dan de laatst toegestane datum {0: d}',
    maxExclusiveErrorText: 'De geselecteerde datum moet vóór {0: d}' ,
    minValueErrorText: 'De geselecteerde datum is eerder dan {0: d}',
    minExclusiveErrorText: 'De geselecteerde datum moet later zijn dan {0: d}',
 };
 // Calendar
 Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
 // MonthPicker
 Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);
 
 // In common for DateField and MonthField
 const dateFieldErrorMessages = {
    ...calendarErrorMessages,
    inputErrorText: 'Ongeldige datum.'
 };
 // MonthField
 Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
 // DateField
 Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);
 
 // NumberField
 Localization.localize(c, 'cx/widgets/NumberField', {
    maxValueErrorText: 'Voer {0: n} of minder in.',
    maxExclusiveErrorText: 'Voer een nummer in dat kleiner is dan {0: n}.',
    minValueErrorText:'Voer {0: n} of meer in.' ,
    minExclusiveErrorText: 'Voer een getal in dat groter is dan {0: n}.',
    inputErrorText: 'Ongeldig nummer.'
 });
 
 // TextField
 Localization.localize(c, 'cx/widgets/TextField', {
    validationErrorText: 'De ingevoerde waarde is ongeldig.',
    minLengthValidationErrorText: 'Vul {[{0} - {1}]} extra karakters in.',
    maxLengthValidationErrorText: 'Gebruik {0} tekens of minder.'
 });
 
 // UploadButton
 Localization.localize(c, 'cx/widgets/UploadButton', {
    validationErrorText: 'Upload is bezig.'
 });

 // MsgBox
Localization.localize(c, 'cx/widgets/MsgBox', {
   yesText:"Ja",
   noText: "Nee"
});