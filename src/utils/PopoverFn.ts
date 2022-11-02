import { Popover } from '@headlessui/react';
import React from 'react';

class PopoverSignatureExtractor<TTag extends React.ElementType<any> = 'div'> {
  resolved = Popover<TTag>;
}

export type PopoverParameters<TTag extends React.ElementType<any>> = Parameters<
  PopoverSignatureExtractor<TTag>['resolved']
>;
