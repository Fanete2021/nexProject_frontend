import React, {useCallback, useEffect, useState} from 'react';
import { Avatar, CustomCheckbox, CustomInput, icons, Modal, Scrollbar, Search, SvgIcon } from '@/shared/ui';
import { Contact } from '../../../../model/types/contact.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './CreatorGroup.module.scss';
import { createGroup } from '../../../../model/service/createGroup.ts';
import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { fetchInterlocutors } from '../../../../model/service/fetchInterlocutors.ts';
import { classNames } from '@/shared/lib/utils/classNames.ts';

export interface CreatorGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorGroup: React.FC<CreatorGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initContacts = async () => {
      const response = await dispatch(fetchInterlocutors({})).unwrap();

      setContacts(response);
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
    clearStates();
  };

  const clearStates = useCallback(() => {
    setGroupName('');
    setSelectedContacts([]);
  }, []);

  const closeHandler = () => {
    clearStates();
    onClose();
  };

  return (
    <Modal
      onClose={closeHandler}
      isOpen={isOpen}
    >
      <div className={styles.CreatorGroup}>
        <SvgIcon
          iconName={icons.CROSS}
          important
          applyStroke
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
          <Search />

          <Scrollbar autoHide>
            <div className={styles.contactsList}>
              {contacts.map((contact) => (
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
                  <Avatar text={contact.username} width={40} height={40}/>

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
              ))}
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
                  <Avatar text={contact.username} width={25} height={25}/>

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
          Сохранить
        </button>
      </div>
    </Modal>
  );
};

export default CreatorGroup;
