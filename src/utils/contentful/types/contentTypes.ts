import type z from 'zod';
import type schemas from '../schemas';

export type ContentTypeFieldsMap = {
  [key in keyof typeof schemas]: z.infer<typeof schemas[key]>;
};
