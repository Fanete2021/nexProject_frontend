import { Modal } from '@/shared/ui';
import CreateTeamForm, { CreateTeamFormProps } from './CreateTeamForm';
import styles from './CreateTeamForm.module.scss';

export interface ContactPickerModalProps extends CreateTeamFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateTeamFormModal: React.FC<ContactPickerModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.CreateTeamFormModal}>
        <CreateTeamForm {...rest} />
      </div>
    </Modal>
  );
};

export default CreateTeamFormModal;
