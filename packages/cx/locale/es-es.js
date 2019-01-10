import { Localization } from 'cx/ui';

var c = 'es-es';

// Field
Localization.localize(c, 'cx/widgets/Field', {
   requiredText: 'Este campo es requerido.',
   validatingText: 'La validación está en progreso...',
   validationExceptionText: 'Algo salió mal durante la validación de entrada. Revise el registro para más detalles.'
});

// LookupField
Localization.localize(c, 'cx/widgets/LookupField', {
   loadingText: 'Cargando...',
   queryErrorText: 'Se produjo un error al consultar los datos de búsqueda.',
   noResultsText: 'No se han encontrado resultados.',
   minQueryLengthMessageText: 'Escriba al menos {0} caracteres.'
});

// In common for Calendar and MonthPicker
const calendarErrorMessages = {
   maxValueErrorText: 'Seleccione {0: d} o antes.',
   maxExclusiveErrorText: 'Seleccione una fecha antes {0:d}.',
   minValueErrorText: 'Seleccione {0: d} o posterior',
   minExclusiveErrorText: 'Seleccione una fecha después de {0: d}.',
};
// Calendar
Localization.localize(c, 'cx/widgets/Calendar', calendarErrorMessages);
// MonthPicker
Localization.localize(c, 'cx/widgets/MonthPicker', calendarErrorMessages);

// In common for DateField and MonthField
const dateFieldErrorMessages = {
   ...calendarErrorMessages,
   inputErrorText: 'Fecha introducida no es válida.' 
};
// MonthField
Localization.localize(c, 'cx/widgets/MonthField', dateFieldErrorMessages);
// DateField
Localization.localize(c, 'cx/widgets/DateField', dateFieldErrorMessages);

// NumberField
Localization.localize(c, 'cx/widgets/NumberField', {
   maxValueErrorText: 'Ingrese {0: n} o menos.',
   maxExclusiveErrorText: 'Ingrese un número menor que {0: n}.',
   minValueErrorText: 'Ingrese {0: n} o más.',
   minExclusiveErrorText: 'Ingrese un número mayor que {0: n}.',
   inputErrorText: 'Número inválido ingresado.'
});

// TextField
Localization.localize(c, 'cx/widgets/TextField', {
   validationErrorText: 'El valor ingresado no es válido.',
   minLengthValidationErrorText: 'Ingrese {[{0} - {1}]} más caracteres.',
   maxLengthValidationErrorText: 'Use {0} caracteres o menos.'
});

// UploadButton
Localization.localize(c, 'cx/widgets/UploadButton', {
   validationErrorText: 'La carga está en progreso.'
});

// MsgBox
Localization.localize(c, 'cx/widgets/MsgBox', {
   yesText:"Sí",
   noText: "No"
});