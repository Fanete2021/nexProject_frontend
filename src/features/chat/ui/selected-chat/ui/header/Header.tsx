import React from 'react';
import { ChatInfo } from '../../../../model/types/chatInfo.ts';

export interface HeaderProps {
  chatInfo: ChatInfo;
}

const Header: React.FC<HeaderProps> = (props) => {
    const { chatInfo } = props;

    return (
        <div>
          Header
        </div>
    );
};

export default Header;
