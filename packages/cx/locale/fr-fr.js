import { Localization } from 'cx/ui';

var c = 'fr-fr';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Ce champ est requis.',
   validatingText: 'La validation est en cours ...',
   validationExceptionText: "Une erreur s'est produite lors de la validation des entrées. Consultez le journal pour plus de détails."
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Chargement...',
   queryErrorText: "Une erreur s'est produite lors de l'interrogation des données de recherche.",
   noResultsText: 'Aucun résultat trouvé.',
   minQueryLengthMessageText: 'Tapez au moins {0} caractère (s).'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Sélectionnez {0:d} ou avant.',
   maxExclusiveErrorText: 'Sélectionnez une date avant {0:d}.',
   minValueErrorText: 'Sélectionnez {0:d} ou plus tard.',
   minExclusiveErrorText: 'Sélectionnez une date après {0:d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Date invalide entrée.' 
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
   minExclusiveErrorText: 'Entrez un nombre supérieur à {0: n}.',
   inputErrorText: 'Numéro invalide entré.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: "La valeur entrée n'est pas valide.",
   minLengthValidationErrorText: 'Entrez {[{0} - {1}]} plus de caractères.',
   maxLengthValidationErrorText: 'Utilisez {0} caractères ou moins.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'Le téléchargement est en cours.'
});
