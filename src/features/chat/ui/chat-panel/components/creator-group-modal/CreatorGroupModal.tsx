import React, { useCallback, useState } from 'react';
import { Avatar, Button, CustomInput, icons, Modal, Scrollbar, SvgIcon } from '@/shared/ui';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import styles from './CreatorGroupModal.module.scss';
import { createGroup } from '../../../../model/service/createGroup.ts';
import { InputAdornment } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import useWindowWidth from '@/shared/lib/hooks/useWindowWidth.ts';
import { MOBILE_MAX_BREAKPOINT } from '@/shared/const/WindowBreakpoints.ts';
import { Contact } from '@/entities/contact';
import { ContactPicker } from '@/widgets/pickers/contact-picker';

export interface CreatorGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorGroupModal: React.FC<CreatorGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation();
  const [groupName, setGroupName] = useState<string>('');
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();

  const removeFromSelectedContact = (contact: Contact) => {
    setSelectedContacts((prev) => prev.filter((c) => c.userId !== contact.userId));
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
      {isOpen && 
        <div className={styles.CreatorGroup}>
          <SvgIcon
            iconName={windowWidth > MOBILE_MAX_BREAKPOINT ? icons.CROSS : icons.ARROW}
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

          <ContactPicker
            className={styles.contacts}
            setSelectedContacts={setSelectedContacts}
            selectedContacts={selectedContacts}
          />

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
                    onClick={() => removeFromSelectedContact(contact)}
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

          <Button
            className={styles.saveButton}
            onClick={() => createGroupHandler()}
            disabled={selectedContacts.length === 0 || groupName === ''}
            variant={'secondary'}
          >
            {t('Создать') as string}
          </Button>
        </div>
      }
    </Modal>
  );
};

export default CreatorGroupModal;
