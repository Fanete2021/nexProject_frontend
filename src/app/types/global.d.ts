import { AnyAction, AsyncThunkAction } from '@reduxjs/toolkit';

declare module '*.module.scss' {
  interface IClassNames {
    [className: string]: string
  }
  const classNames: IClassNames;
  export = classNames;
}

declare module'*.scss';

//example two
declare module'*.scss' {
  const content: any;
  export default content;
}

//example three
declare module'*.scss' {
  const content: Record<string, string>;
  export default content;
}

//example four
declare module'*.scss' {
  const content: {[key: string]: any}
  export = content
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

type DeepPartial<T> = T extends object ? {
  [P in keyof T]?: DeepPartial<T[P]>
} : T;

/* eslint-disable */
declare module 'redux' {
  interface Dispatch<A extends AnyAction = AnyAction> {
    <ReturnType = any, State = any, ExtraThunkArg = any>(
      asyncAction: AsyncThunkAction<ReturnType, State, ExtraThunkArg>
    ): any;
  }
}
/* eslint-enable */
