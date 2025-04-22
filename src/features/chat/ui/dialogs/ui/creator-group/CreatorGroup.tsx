import React, { useCallback, useEffect, useState } from 'react';
import { Avatar, CustomCheckbox, CustomInput, icons, Modal, Scrollbar, SvgIcon } from '@/shared/ui';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './CreatorGroup.module.scss';
import { createGroup } from '../../../../model/service/createGroup.ts';
import {InputAdornment, Skeleton} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchInterlocutors } from '../../../../model/service/fetchInterlocutors.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { Contact, SearchContact } from '@/entities/contact';

export interface CreatorGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorGroup: React.FC<CreatorGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();
  const [myContacts, setMyContacts] = useState<Contact[]>([]);
  const [searchedContacts, setSearchedContacts] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const [searchedValue, setSearchedValue] = useState<string>('');
  const [isLoadingSearch, setIsLoadingSearch] = useState<boolean>(false);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const initContacts = async () => {
      const response = await dispatch(fetchInterlocutors({})).unwrap();

      setMyContacts(response);
    };
    
    if (isOpen) {
      initContacts();
    }
  }, [isOpen]);

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c.userId === contact.userId)
        ? prev.filter((c) => c.userId !== contact.userId)
        : [...prev, contact]
    );
  };

  const createGroupHandler = () => {
    dispatch(createGroup({
      chatName: groupName,
      memberIds: selectedContacts.map((c) => c.userId),
    }));
    closeHandler();
  };

  const clearStates = useCallback(() => {
    setGroupName('');
    setSearchedValue('');
    setSelectedContacts([]);
  }, []);

  const closeHandler = () => {
    clearStates();
    onClose();
  };

  useEffect(() => {
    setContacts(searchedValue ? searchedContacts : myContacts);
  }, [searchedValue, searchedContacts, myContacts]);

  return (
    <Modal
      onClose={closeHandler}
      isOpen={isOpen}
    >
      <div className={styles.CreatorGroup}>
        <SvgIcon
          iconName={windowWidth > MOBILE_MAX_BREAKPOINT ? icons.CROSS : icons.BACK}
          important
          applyStroke={windowWidth > MOBILE_MAX_BREAKPOINT}
          applyFill={windowWidth <= MOBILE_MAX_BREAKPOINT}
          className={styles.iconClose}
          onClick={onClose}
        />
        
        <div className={styles.title}>
          {t('Создать группу') as string}

          <SvgIcon
            iconName={icons.GROUP}
            applyHover={false}
            important
            className={styles.iconGroup}
          />
        </div>

        <div className={styles.groupNameWrapper}>
          <CustomInput
            endAdornment={
              <InputAdornment position="end">
                <SvgIcon
                  className={styles.iconName}
                  iconName={icons.TAG}
                  applyHover={false}
                  important={false}
                  applyStroke
                  applyFill={false}
                />
              </InputAdornment>
            }
            placeholder={t('Имя группы') as string}
            fullWidth
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            type="text"
            classes={{
              root: styles.inputWrapper,
              input: styles.input
            }}
          />
        </div>

        <div className={styles.contacts}>
          <SearchContact 
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

        <div className={styles.selectedContacts}>
          <div className={styles.title}>
            {t('Выбранные люди:') as string}
          </div>

          <Scrollbar autoHide>
            <div className={styles.items}>
              {selectedContacts.map((contact) => (
                <div
                  key={contact.userId}
                  className={classNames(styles.item)}
                  onClick={() => toggleContactSelection(contact)}
                >
                  <Avatar
                    text={contact.username}
                    width={windowWidth > MOBILE_MAX_BREAKPOINT ? 25 : 30}
                    height={windowWidth > MOBILE_MAX_BREAKPOINT ? 25 : 30}
                  />

                  <div className={styles.name}>
                    {contact.username}
                  </div>
                </div>
              ))}
            </div>
          </Scrollbar>
        </div>

        <button
          className={styles.saveButton}
          onClick={() => createGroupHandler()}
          disabled={selectedContacts.length === 0 || groupName === ''}
        >
          {t('Создать') as string}
        </button>
      </div>
    </Modal>
  );
};

export default CreatorGroup;
