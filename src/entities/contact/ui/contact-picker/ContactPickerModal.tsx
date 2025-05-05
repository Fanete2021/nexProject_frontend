import { Modal } from '@/shared/ui/index.ts';
import ContactPicker, { ContactPickerProps } from './ContactPicker.tsx';

export interface ContactPickerModalProps extends ContactPickerProps {
  onClose: () => void;
  isOpen: boolean;
}

const ContactPickerModal: React.FC<ContactPickerModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;


  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ContactPicker {...rest} />
    </Modal>
  );
};

export default ContactPickerModal;
