import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Dialogs.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getChatDialogs } from '../../model/selectors/getChatDialogs.ts';
import DialogItem from './ui/dialog-item/DialogItem.tsx';
import { Scrollbar, Search } from '@/shared/ui';
import DialogItemSkeleton from './ui/dialog-item/DialogItemSkeleton.tsx';
import { getChatIsLoadingDialogs } from '../../model/selectors/getChatIsLoadingDialogs.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { searchContacts } from '../../model/service/searchContacts.ts';
import { Contact } from '../../model/types/contact.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts';
import CreatorGroup from './ui/creator-group/CreatorGroup.tsx';
import { chatActions } from '../../model/slice/chatSlice.ts';
import { Scrollbars } from 'react-custom-scrollbars-2';

export interface ChatListProps {
  className?: string;
}

const filters = [
  {
    name: 'All',
    value: ChatTypes.ALL,
  },
  {
    name: 'Contacts',
    value: ChatTypes.PRIVATE,
  },
  {
    name: 'Group chats',
    value: ChatTypes.PUBLIC
  }
];

const COUNT_DIALOGS = 15;

const Dialogs: React.FC<ChatListProps> = (props) => {
  const { className } = props;
    
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ChatTypes>(ChatTypes.ALL);
  const underlineRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const selectedChat = useSelector(getChatSelectedChat);
  const [isOpenCreatorGroup, setIsOpenCreatorGroup] = useState<boolean>(false);
  const debouncedSearchValue = useDebounce(searchedValue, 1000);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const scrollbarRef = useRef<Scrollbars>(null);
  const [currentPageDialogs, setCurrentPageDialogs] = useState<number>(1);
  const [allPagesDialogs, setAllPagesDialogs] = useState<number>(1);

  const dialogs = useSelector(getChatDialogs);
  const isLoadingDialogs = useSelector(getChatIsLoadingDialogs);

  const closeCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(false), []);
  const toggleCreatorGroupHandler = useCallback(() => setIsOpenCreatorGroup(prev => !prev), []);

  const clearSearch = useCallback(() => {
    setSearchedValue('');
    setSearchedContacts([]);
  }, []);

  const searchHandler = useCallback(async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchedContacts([]);
    setSearchedValue(e.target.value);
    setIsLoadingSearch(true);
  }, []);

  useEffect(() => {
    if (debouncedSearchValue) {
      setIsLoadingSearch(true);

      const fetchContacts = async () => {
        try {
          const response = await dispatch(searchContacts(debouncedSearchValue)).unwrap();
          setSearchedContacts(response.searchUsers);
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoadingSearch(false);
        }
      };

      fetchContacts();
    } else {
      setSearchedContacts([]);
      setIsLoadingSearch(false);
    }
  }, [debouncedSearchValue, dispatch]);

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
        pageSize: COUNT_DIALOGS,
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
    clearSearch();
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
        <div className={styles.title}>Chats</div>

        <div className={styles.searchWrapper}>
          <Search
            searchHandler={searchHandler}
            value={searchedValue}
            clearSearch={clearSearch}
          />
        </div>
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
              {filter.name}
            </div>
          ))}
        </div>

        <div className={styles.dialogs}>
          <Scrollbar
            autoHide
            onScroll={scrollHandler}
            ref={scrollbarRef}
          >
            {(isLoadingSearch || isLoadingDialogs) &&
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
        New chat
      </button>

      <CreatorGroup onClose={closeCreatorGroupHandler} isOpen={isOpenCreatorGroup} />
    </div>
  );
};

export default Dialogs;
