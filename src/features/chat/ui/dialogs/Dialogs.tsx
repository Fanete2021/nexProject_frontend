import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Dialogs.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useSelector } from 'react-redux';
import { getChatDialogs } from '../../model/selectors/getChatDialogs.ts';
import DialogItem from './ui/dialog-item/DialogItem.tsx';
import { CustomInput, icons, SvgIcon } from '@/shared/ui';
import { InputAdornment } from '@mui/material';
import DialogItemSkeleton from './ui/dialog-item/DialogItemSkeleton.tsx';
import { getChatIsLoadingDialogs } from '../../model/selectors/getChatIsLoadingDialogs.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { searchContacts } from '../../model/service/searchContacts.ts';
import { Contact } from '../../model/types/contact.ts';
import { ChatTypes } from '../../model/types/chatTypes.ts';
import { fetchChats } from '../../model/service/fetchChats.ts';
import { getChatSelectedChat } from '../../model/selectors/getChatSelectedChat.ts';
import { useDebounce } from '@/shared/lib/hooks/useDebounce.ts';

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

const Dialogs: React.FC<ChatListProps> = (props) => {
  const { className } = props;
    
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<ChatTypes>(ChatTypes.ALL);
  const underlineRef = useRef<HTMLDivElement>(null);
  const filterRefs = useRef<(HTMLDivElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const selectedChat = useSelector(getChatSelectedChat);
  const debouncedSearchValue = useDebounce(searchedValue, 1000);
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);

  console.log(isLoadingSearch)

  const dialogs = useSelector(getChatDialogs);
  const isLoadingDialogs = useSelector(getChatIsLoadingDialogs);

  const clearSearch = useCallback(() => {
    setSearchedValue('');
    setSearchedContacts([]);
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

  const searchHandler = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchedValue(e.target.value);
    setIsLoadingSearch(true);
  };

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

  useEffect(() => {
    dispatch(fetchChats({ filterMode: activeFilter }));
  }, [activeFilter]);

  useEffect(() => {
    clearSearch();
  }, [selectedChat]);

  return (
    <div className={classNames(styles.Dialogs, [className])}>
      <div className={styles.header}>
        <div className={styles.title}>Chats</div>

        <CustomInput
          startAdornment={
            <InputAdornment position="start">
              <SvgIcon
                iconName={icons.SEARCH}
                applyHover={false}
                important={Boolean(searchedValue)}
                applyStroke
                applyFill={false}
              />
            </InputAdornment>
          }
          endAdornment={searchedValue &&
            <InputAdornment position="end">
              <SvgIcon
                iconName={icons.CROSS}
                applyHover={false}
                important={Boolean(searchedValue)}
                applyStroke
                className={styles.clearSearch}
                onClick={clearSearch}
              />
            </InputAdornment>
          }
          placeholder="Search"
          fullWidth
          classes={{
            root: styles.searchWrapper,
            input: styles.searchInput
          }}
          value={searchedValue}
          onChange={searchHandler}
        />
      </div>

      <div
        className={styles.content}
        style={{
          overflow: (isLoadingDialogs || isLoadingSearch) ? 'hidden' : 'auto'
        }}
      >
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
        </div>
      </div>

      <button className={styles.newChat}>
        New chat
      </button>
    </div>
  );
};

export default Dialogs;
