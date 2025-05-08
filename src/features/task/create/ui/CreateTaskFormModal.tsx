import { Modal } from '@/shared/ui';
import CreateTaskForm, { CreateTaskFormProps } from './CreateTaskForm.tsx';
import styles from './CreateTaskForm.module.scss';

export interface CreateTaskFormModalProps extends CreateTaskFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateTaskFormModal: React.FC<CreateTaskFormModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.CreateTaskFormModal}>
        <CreateTaskForm {...rest} />
      </div>
    </Modal>
  );
};

export default CreateTaskFormModal;
