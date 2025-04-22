import { Contact, ContactPicker } from '@/entities/contact';
import { useState } from 'react';
import { Button, Modal } from '@/shared/ui';
import styles from './AddUsersToGroup.module.scss';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { addUserToGroup } from '@/features/chat';

export interface AddToGroupProps {
  onClose: () => void;
  isOpen: boolean;
}

const AddUsersToGroup: React.FC<AddToGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const selectedChat = useSelector(getChatSelectedChat)!;
  const dispatch = useAppDispatch();

  const addToGroupHandler = () => {
    for (const contact of selectedContacts) {
      console.log(contact);
      dispatch(addUserToGroup({ userId: contact.userId, chatId: selectedChat.chatId }));
    }

    setSelectedContacts([]);
    onClose();
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.AddToGroup}>
        <div className={styles.title}>
          Добавить участника
        </div>

        <ContactPicker
          selectedContacts={selectedContacts}
          setSelectedContacts={setSelectedContacts}
          className={styles.picker}
          filterIds={selectedChat.members.map(m => m.memberId)}
        />

        <Button
          variant={'secondary'}
          className={styles.add}
          onClick={addToGroupHandler}
        >
          Добавить
        </Button>
      </div>
    </Modal>
  );
};

export default AddUsersToGroup;
