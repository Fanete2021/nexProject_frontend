import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Dialogs.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getChatDialogs } from '../../../../model/selectors/getChatDialogs.ts';
import { ActionMenu, ActionMenuPosition, icons, Scrollbar, SvgIcon, Tabs } from '@/shared/ui';
import { getChatIsLoadingDialogs } from '../../../../model/selectors/getChatIsLoadingDialogs.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { ChatTypes } from '../../../../model/types/chatTypes.ts';
import { fetchChats } from '../../../../model/service/fetchChats.ts';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { chatActions } from '../../../../model/slice/chatSlice.ts';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { Contact } from '@/entities/contact';
import CreatorGroupModal from '../creator-group-modal/CreatorGroupModal.tsx';
import { getChatDialogsFilter } from '../../../../model/selectors/getChatDialogsFilter.ts';
import { Chat } from '../../../../model/types/chat.ts';
import { deletePrivateChat } from '../../../../model/service/deletePrivateChat.ts';
import DialogItem from './components/dialog-item/DialogItem.tsx';
import DialogItemSkeleton from './components/dialog-item/DialogItemSkeleton.tsx';
import { SidebarOpener } from '@/widgets/sidebar-opener';
import { ContactSearcher } from '@/widgets/contact-searcher';

export interface ChatListProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
}

const filters = [
  {
    name: 'Все',
    value: ChatTypes.ALL,
  },
  {
    name: 'Контакты',
    value: ChatTypes.PRIVATE,
  },
  {
    name: 'Группы',
    value: ChatTypes.PUBLIC
  }
];

const DIALOGS_PAGE_SIZE = 20;

const Dialogs: React.FC<ChatListProps> = (props) => {
  const { className, ...rest } = props;
    
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const [searchedValue, setSearchedValue] = useState<string>('');
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const [isOpenCreatorGroup, setIsOpenCreatorGroup] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [currentPageDialogs, setCurrentPageDialogs] = useState<number>(1);
  const [allPagesDialogs, setAllPagesDialogs] = useState<number>(1);
  const [actionMenuPosition, setActionMenuPosition] = useState<ActionMenuPosition | null>(null);
  const [actionMenuChat, setActionMenuChat] = useState<Chat | null>(null);

  const dialogsFilter = useSelector(getChatDialogsFilter);
  const selectedChat = useSelector(getChatSelectedChat);
  const dialogs = useSelector(getChatDialogs);
  const isLoadingDialogs = useSelector(getChatIsLoadingDialogs);

  const scrollbarRef = useRef<Scrollbars>(null);

  const closeCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(false), []);
  const toggleCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(prev => !prev), []);

  const filterChangeValueHandler = useCallback((filter: string) => {
    dispatch(chatActions.setDialogsFilter(filter as ChatTypes));
  }, []);

  const loadChats = async (shouldRewriteChats: boolean) => {
    try {
      const newCurrentPage = currentPageDialogs + 1;

      const response = await dispatch(fetchChats({
        filterMode: dialogsFilter,
        pageSize: DIALOGS_PAGE_SIZE,
        pageNumber: shouldRewriteChats ? 1 : newCurrentPage
      })).unwrap();
      setAllPagesDialogs(response.pageCount);

      if (shouldRewriteChats) {
        dispatch(chatActions.setDialogs(response.chats));
        setCurrentPageDialogs(1);
      } else {
        dispatch(chatActions.addDialogs(response.chats));
        setCurrentPageDialogs(newCurrentPage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadChats(true);
  }, [dialogsFilter]);

  useEffect(() => {
    setSearchedValue('');
  }, [selectedChat]);

  const scrollHandler = () => {
    if (!scrollbarRef.current) return;

    const scrollTop = scrollbarRef.current.getScrollTop();
    const scrollHeight = scrollbarRef.current.getScrollHeight();
    const clientHeight = scrollbarRef.current.getClientHeight();

    if (scrollTop + clientHeight >= scrollHeight && currentPageDialogs < allPagesDialogs) {
      loadChats(false);
    }
  };

  const openActionMenuHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, chat: Chat) => {
    event.preventDefault();
    setActionMenuPosition({ x: event.clientX, y: event.clientY });
    setActionMenuChat(chat);
  };

  const closeActionMenuHandler = () => {
    setActionMenuPosition(null);
    setActionMenuChat(null);
  };

  const deleteMessageHandler = () => {
    dispatch(deletePrivateChat({ chatId: actionMenuChat!.chatId }));
    closeActionMenuHandler();
  };

  return (
    <div className={classNames(styles.Dialogs, [className])} {...rest}>
      <div className={styles.header}>
        <div className={styles.title}>{t('Чаты') as string}</div>

        <SidebarOpener className={styles.iconSidebar} />

        <div className={styles.searchWrapper}>
          <ContactSearcher
            searchedValue={searchedValue}
            setSearchedValue={setSearchedValue}
            setSearchedContacts={setSearchedContacts}
            setIsLoadingSearch={setIsLoadingSearch}
          />
        </div>

        <SvgIcon
          className={styles.iconCreateGroup}
          onClick={toggleCreatorGroupHandler}
          iconName={icons.CREATE_GROUP}
          important
        />
      </div>

      <div className={styles.content}>
        {!searchedValue &&
          <Tabs
            value={dialogsFilter}
            onChange={filterChangeValueHandler}
            items={filters}
            className={styles.filter}
          />
        }

        <div className={styles.dialogs}>
          <Scrollbar
            autoHide
            onScroll={scrollHandler}
            ref={scrollbarRef}
          >
            {((isLoadingSearch && searchedValue) || isLoadingDialogs) &&
              <>
                {Array.from({ length: 15 }).map((_, index) => (
                  <DialogItemSkeleton key={index} className={styles.dialogSkeleton} />
                ))}
              </>
            }

            {!searchedValue && !isLoadingDialogs &&
              <>
                {dialogs.map(dialog => (
                  <DialogItem
                    key={dialog.chatId}
                    chatData={dialog}
                    className={styles.dialog}
                    openContextMenu={openActionMenuHandler}
                  />
                ))}
              </>
            }

            {searchedValue &&
              <>
                {searchedContacts.map(contact => (
                  <DialogItem key={contact.userId} contactData={contact} className={styles.dialog} />
                ))}
              </>
            }
          </Scrollbar>
        </div>
      </div>

      <button
        className={styles.newChat}
        onClick={toggleCreatorGroupHandler}
      >
        {t('Новый чат') as string}
      </button>

      <CreatorGroupModal onClose={closeCreatorGroupHandler} isOpen={isOpenCreatorGroup} />

      <ActionMenu
        deleteHandler={deleteMessageHandler}
        onClose={closeActionMenuHandler}
        position={actionMenuPosition}
      />
    </div>
  );
};

export default Dialogs;
