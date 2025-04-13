import React, { useEffect, useState } from 'react';
import { Modal } from '@/shared/ui';
import { Contact } from '../../../../model/types/contact.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { useSelector } from 'react-redux';
import { getUserData } from '@/entities/user/model/selectors/getUserData.ts';
import styles from './CreatorGroup.module.scss';
import { fetchMyContacts } from '../../../../model/service/fetchMyContacts.ts';
import {createGroup} from "@/features/chat";

export interface CreatorGroupProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatorGroup: React.FC<CreatorGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const user = useSelector(getUserData)!;
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [groupName, setGroupName] = useState<string>('');
  const dispatch = useAppDispatch();

  useEffect(() => {
    const initContacts = async () => {
      const response = await dispatch(fetchMyContacts()).unwrap();

      setContacts(response);
    };
    
    if (isOpen) {
      initContacts();
    }
  }, [isOpen]);

  const toggleContactSelection = (contact: Contact) => {
    setSelectedContacts((prev) =>
      prev.some((c) => c === contact.userId)
        ? prev.filter((c) => c !== contact.userId)
        : [...prev, contact.userId]
    );
  };

  const createGroupHandler = () => {
    if (!groupName.trim()) {
      return;
    }

    dispatch(createGroup({
      chatName: groupName,
      memberIds: [user.userId, ...selectedContacts]
    }));
  };

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
    >
      <div className={styles.CreatorGroup}>
        <h2>Создание группы</h2>

        <input
          type="text"
          placeholder="Введите имя группы"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          className={styles.groupNameInput}
        />

        <div className={styles.contactsList}>
          {contacts.map((contact) => (
            <div
              key={contact.userId}
              className={`${styles.contactItem} ${
                selectedContacts.some((c) => c === contact.userId) ? styles.selected : ''
              }`}
              onClick={() => toggleContactSelection(contact)}
            >
              {contact.username}
            </div>
          ))}
        </div>
        <button
          className={styles.saveButton}
          onClick={() => createGroupHandler()}
        >
          Сохранить
        </button>
      </div>
    </Modal>
  );
};

export default CreatorGroup;
