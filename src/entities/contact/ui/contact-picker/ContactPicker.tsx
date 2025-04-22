import React, { useEffect, useState } from 'react';
import { Avatar, CustomCheckbox, Scrollbar } from '@/shared/ui';
import { Skeleton } from '@mui/material';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import styles from './ContactPicker.module.scss';
import ContactSearcher from '../contact-searcher/ContactSearcher.tsx';
import { Contact } from '../../model/types/contact.ts';
import { fetchInterlocutors } from '../../model/service/fetchInterlocutors.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';

export interface ContactPicker {
  className?: string;
  setSelectedContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
  selectedContacts: Contact[];
  filterIds?: string[];
}

const ContactPicker: React.FC<ContactPicker> = (props) => {
  const { className, selectedContacts, setSelectedContacts, filterIds } = props;
  const [myContacts, setMyContacts] = useState<Contact[]>([]);
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const initContacts = async () => {
      const response = await dispatch(fetchInterlocutors({})).unwrap();

      setMyContacts(response);
    };

    initContacts();
  }, []);

  useEffect(() => {
    const filteredContacts = (searchedValue ? searchedContacts : myContacts).filter(
      (contact) => !filterIds?.includes(contact.userId)
    );

    setContacts(filteredContacts);
  }, [searchedValue, searchedContacts, myContacts, filterIds]);

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts( prev =>
      prev.some((c) => c.userId === contact.userId)
        ? prev.filter((c) => c.userId !== contact.userId)
        : [...prev, contact]
    );
  };

  return (
    <div className={classNames(styles.ContactPicker, [className])}>
      <ContactSearcher
        setSearchedContacts={setSearchedContacts}
        setIsLoadingSearch={setIsLoadingSearch}
        searchedValue={searchedValue}
        setSearchedValue={setSearchedValue}
      />

      <Scrollbar>
        <div className={styles.contactsList}>
          {isLoadingSearch
            ?
            Array.from({ length: 10 }).map((_, index) => (
              <div key={index} className={styles.contactItem}>
                <Skeleton
                  variant="circular"
                  width={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
                  height={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
                  classes={{ root: 'skeleton' }}
                  animation='wave'
                />

                <Skeleton
                  variant="text"
                  width={'75%'}
                  classes={{ root: 'skeleton' }}
                  animation='wave'
                />

                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  classes={{ root: 'skeleton' }}
                  animation='wave'
                  className={classNames(styles.checkbox, [styles.checkboxSkeleton])}
                />
              </div>
            ))
            :
            contacts.map((contact) => (
              <div
                key={contact.userId}
                className={classNames(
                  styles.contactItem,
                  [],
                  {
                    [styles.selected]: selectedContacts.some(c => c.userId === contact.userId)
                  }
                )}
                onClick={() => toggleContactSelection(contact)}
              >
                <Avatar
                  text={contact.username}
                  width={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
                  height={windowWidth > MOBILE_MAX_BREAKPOINT ? 40 : 50}
                />

                <div className={styles.name}>
                  {contact.username}
                </div>

                <CustomCheckbox
                  setRounded
                  className={styles.checkbox}
                  checked={selectedContacts.some(c => c.userId === contact.userId)}
                  onChange={() => toggleContactSelection(contact)}
                />
              </div>
            ))
          }
        </div>
      </Scrollbar>
    </div>
  );
};

export default ContactPicker;
