import { Localization } from 'cx/ui';

var c = 'fr-fr';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Ce champ est obligatoire.',
   validatingText: 'La validation est en cours ...',
   validationExceptionText: 'Un problème est survenu lors de la validation des données. Consultez le journal pour plus de détails'
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Chargement...',
   queryErrorText: "Une erreur s'est produite lors de l'obtention des données pour l'affichage.",
   noResultsText: 'Aucun résultat trouvé.',
   minQueryLengthMessageText: 'Entrez au moins {0} caractère (s).'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'La date sélectionnée est postérieure à la dernière date autorisée {0: d}.',
   maxExclusiveErrorText: 'La date sélectionnée doit être antérieure à {0: d}.',
   minValueErrorText: 'La date sélectionnée est antérieure à {0: d}.',
   minExclusiveErrorText: 'La date sélectionnée doit être postérieure à {0: d}.',
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
