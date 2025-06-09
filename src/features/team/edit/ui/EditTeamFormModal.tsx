import EditTeamForm, { EditTeamFormProps } from './EditTeamForm.tsx';
import styles from './EditTeamForm.module.scss';
import { Modal, ValidationListDirections } from '@/shared/ui';

export interface EditTeamFormModalProps extends EditTeamFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const EditTeamFormModal: React.FC<EditTeamFormModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.EditTeamFormModal}>
        <EditTeamForm {...rest} validationListDirection={ValidationListDirections.VERTICAL}/>
      </div>
    </Modal>
  );
};

export default EditTeamFormModal;
