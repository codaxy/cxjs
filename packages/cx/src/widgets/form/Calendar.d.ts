import * as Cx from '../../core';
import { FieldProps } from './Field';

interface CalendarProps extends FieldProps {
   value?:
   refDate?:
   disabled?:
   minValue?:
   minExclusive?:
   maxValue?:
   maxExclusive?:

   baseClass?: string,
   highlihtToday?: boolean,
   maxValueErrorText?: string,
   maxExclusiveErrorText?: string,
   minValueErrorText?: string, 
   minExclusiveErrorText?: string

}

export class Calendar extends Cx.Widget<CalendarProps> {}
