import { Localization } from 'cx/ui';

var c = 'pt-pt';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Este campo é obrigatório.',
   validatingText: 'A validação está em andamento ...',
   validationExceptionText: 'Algo deu errado durante a validação de entrada. Verifique o log para mais detalhes.'
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Carregando...',
   queryErrorText: 'Ocorreu um erro ao consultar os dados de pesquisa.',
   noResultsText: 'Nenhum resultado encontrado.',
   minQueryLengthMessageText: 'Digite pelo menos {0} caractere(s).'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Selecione {0:d} ou antes.',
   maxExclusiveErrorText: 'Selecione uma data antes de {0:d}.',
   minValueErrorText: 'Selecione {0:d} ou posterior.',
   minExclusiveErrorText: 'Selecione uma data após {0:d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Data inválida inserida.' 
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
// DateField
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

// NumberField
Localization.localize(c, 'cx/widgets/NumberField', {
   maxValueErrorText: 'Digite {0:n} ou menos.',
   maxExclusiveErrorText: 'Digite um número menor que {0:n}.',
   minValueErrorText: 'Digite {0:n} ou mais.',
   minExclusiveErrorText: 'Digite um número maior que {0:n}.',
   inputErrorText: 'Número inválido digitado.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'O valor inserido não é válido.',
   minLengthValidationErrorText: 'Digite {[{0}-{1}]} mais caractere(s).',
   maxLengthValidationErrorText: 'Use {0} caracteres ou menos.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'O upload está em andamento.'
});