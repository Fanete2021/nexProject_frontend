import { Modal } from '@/shared/ui/index.ts';
import ContactPicker, { ContactPickerProps } from './ContactPicker.tsx';
import styles from './ContactPicker.module.scss';

export interface ContactPickerModalProps extends ContactPickerProps {
  onClose: () => void;
  isOpen: boolean;
}

const ContactPickerModal: React.FC<ContactPickerModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.ContactPickerModal}>
        <ContactPicker {...rest} />
      </div>
    </Modal>
  );
};

export default ContactPickerModal;
