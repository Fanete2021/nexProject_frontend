import { Modal } from '@/shared/ui';
import CreateOrganizationForm , { CreateOrganizationFormProps } from './CreateOrganizationForm';
import styles from './CreateOrganizationForm.module.scss';

export interface ContactPickerModalProps extends CreateOrganizationFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateOrganizationFormModal: React.FC<ContactPickerModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.CreateOrganizationFormModal}>
        <CreateOrganizationForm {...rest} />
      </div>
    </Modal>
  );
};

export default CreateOrganizationFormModal;
