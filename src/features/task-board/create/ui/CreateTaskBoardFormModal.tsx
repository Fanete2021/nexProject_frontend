import { Modal, ValidationListDirections } from '@/shared/ui';
import styles from './CreateTaskBoardForm.module.scss';
import CreateTaskBoardForm, { CreateTaskBoardFormProps } from './CreateTaskBoardForm.tsx';

export interface CreateTaskBoardFormModalProps extends CreateTaskBoardFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateTaskBoardFormModal: React.FC<CreateTaskBoardFormModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.CreateBoardFormModal}>
        <CreateTaskBoardForm {...rest} validationListDirection={ValidationListDirections.VERTICAL} />
      </div>
    </Modal>
  );
};

export default CreateTaskBoardFormModal;
