import { Localization } from 'cx/ui';

var c = 'fr-fr';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Ce champ est obligatoire.',
   validatingText: 'La validation est en cours...',
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
   maxValueErrorText: 'La date sélectionnée est postérieure à la dernière date autorisée {0:d}.',
   maxExclusiveErrorText: 'La date sélectionnée doit être antérieure à {0:d}.',
   minValueErrorText: 'La date sélectionnée est antérieure à {0:d}.',
   minExclusiveErrorText: 'La date sélectionnée doit être postérieure à {0:d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Date invalide.' 
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
// DateField
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

// NumberField
Localization.localize(c, 'cx/widgets/NumberField', {
   maxValueErrorText: 'Entrez {0:n} ou moins.',
   maxExclusiveErrorText: 'Entrez un nombre inférieur à {0:n}.',
   minValueErrorText: 'Entrez {0:n} ou plus.',
   minExclusiveErrorText: 'Entrez un nombre supérieur à {0:n}.',
   inputErrorText: 'Numéro invalide.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: "La valeur entrée n'est pas valide.",
   minLengthValidationErrorText: 'Entrez {[{0}-{1}]} caractères supplémentaires.',
   maxLengthValidationErrorText: 'Utilisez {0} caractères ou moins.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Le téléchargement est en cours.'
});
