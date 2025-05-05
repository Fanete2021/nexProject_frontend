import { Contact, ContactPickerModal } from '@/entities/contact';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { getChatSelectedChat } from '../../../../model/selectors/getChatSelectedChat.ts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { addUserToGroup } from '@/features/chat';

export interface AddToGroupProps {
  onClose: () => void;
  isOpen: boolean;
}

const AddUsersToGroupModal: React.FC<AddToGroupProps> = (props) => {
  const { isOpen, onClose } = props;
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const selectedChat = useSelector(getChatSelectedChat)!;
  const dispatch = useAppDispatch();

  const addToGroupHandler = (contacts: Contact[]) => {
    dispatch(addUserToGroup({
      memberIds: contacts.map(c => c.userId),
      chatId: selectedChat.chatId
    }));

    setSelectedContacts([]);
    onClose();
  };

  return (
    <ContactPickerModal
      filterIds={selectedChat.members.map(m => m.memberId)}
      headerText={
        `Добавить участников ${selectedContacts.length ? `(+${selectedContacts.length})` : ''}`
      }
      footerText='Добавить'
      pickHandler={addToGroupHandler}
      setSelectedContacts={setSelectedContacts}
      selectedContacts={selectedContacts}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
};

export default AddUsersToGroupModal;
