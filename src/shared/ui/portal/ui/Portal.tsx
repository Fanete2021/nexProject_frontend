import { FC } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  container?: HTMLElement;
  children: React.ReactNode;
}

export const Portal: FC<PortalProps> = (props) => {
  const {
    container = document.body,
    children
  } = props;

  return createPortal(children, container);
};

export default Portal;
