import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Dialogs.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getChatDialogs } from '../../model/selectors/getChatDialogs.ts';
import DialogItem from './ui/dialog-item/DialogItem.tsx';
import { icons, Scrollbar, SvgIcon } from '@/shared/ui';
import DialogItemSkeleton from './ui/dialog-item/DialogItemSkeleton.tsx';
import { getChatIsLoadingDialogs } from '../../model/selectors/getChatIsLoadingDialogs.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import CreatorGroup from './ui/creator-group/CreatorGroup.tsx';
import { chatActions } from '../../model/slice/chatSlice.ts';
import { Scrollbars } from 'react-custom-scrollbars-2';
import { useTranslation } from 'react-i18next';
import { useSidebar } from '@/shared/lib/hooks/useSidebar.ts';
import { Contact, ContactSearcher } from '@/entities/contact';

export interface ChatListProps {
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
  const { className } = props;
    
  const { t } = useTranslation();
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ChatTypes>(ChatTypes.ALL);
  const underlineRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const selectedChat = useSelector(getChatSelectedChat);
  const [isOpenCreatorGroup, setIsOpenCreatorGroup] = useState<boolean>(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [currentPageDialogs, setCurrentPageDialogs] = useState<number>(1);
  const [allPagesDialogs, setAllPagesDialogs] = useState<number>(1);

  const dialogs = useSelector(getChatDialogs);
  const isLoadingDialogs = useSelector(getChatIsLoadingDialogs);

  const closeCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(false), []);
  const toggleCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(prev => !prev), []);

  const { openSidebar } = useSidebar();

  const handleFilterClick = (filter: ChatTypes, event: React.MouseEvent) => {
    setActiveFilter(filter);

    const target = event.target as HTMLDivElement;
    if (underlineRef.current && target) {
      const { offsetLeft, offsetWidth } = target;

      underlineRef.current.style.transform = `translateX(${offsetLeft}px)`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  };

  useEffect(() => {
    const initialFilter = filterRefs.current[0];
    if (underlineRef.current && initialFilter) {
      const { offsetLeft, offsetWidth } = initialFilter;
      underlineRef.current.style.transform = `translateX(${offsetLeft}px)`;
      underlineRef.current.style.width = `${offsetWidth}px`;
    }
  }, [filterRefs]);

  const loadChats = async (shouldRewriteChats: boolean) => {
    try {
      const newCurrentPage = currentPageDialogs + 1;

      const response = await dispatch(fetchChats({
        filterMode: activeFilter,
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
  }, [activeFilter]);

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

  return (
    <div className={classNames(styles.Dialogs, [className])}>
      <div className={styles.header}>
        <div className={styles.title}>{t('Чаты') as string}</div>

        <SvgIcon
          iconName={icons.MENU}
          className={styles.iconSidebar}
          onClick={openSidebar}
          important
        />

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
        <div 
          className={styles.filter}
          style={{
            display: !searchedValue ? 'flex' : 'none' //Чтобы корректно устанавливалась underline
          }}
        >
          <div
            ref={underlineRef}
            className={styles.underline}
          ></div>

          {filters.map((filter, index) => (
            <div
              key={filter.value}
              className={classNames(styles.item, [], {
                [styles.active]: activeFilter === filter.value,
              })}
              ref={(el) => (filterRefs.current[index] = el)}
              onClick={(event) => handleFilterClick(filter.value, event)}
            >
              {t(filter.name) as string}
            </div>
          ))}
        </div>

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
                  <DialogItem key={dialog.chatId} chatData={dialog} className={styles.dialog}/>
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

      <CreatorGroup onClose={closeCreatorGroupHandler} isOpen={isOpenCreatorGroup} />
    </div>
  );
};

export default Dialogs;
