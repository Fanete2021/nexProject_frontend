import { Modal, ValidationListDirections } from '@/shared/ui';
import CreateTeamForm, { CreateTeamFormProps } from './CreateTeamForm';
import styles from './CreateTeamForm.module.scss';

export interface CreateTeamFormModalProps extends CreateTeamFormProps {
  onClose: () => void;
  isOpen: boolean;
}

const CreateTeamFormModal: React.FC<CreateTeamFormModalProps> = (props) => {
  const { onClose, isOpen, ...rest } = props;

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <div className={styles.CreateTeamFormModal}>
        <CreateTeamForm {...rest} validationListDirection={ValidationListDirections.VERTICAL}/>
      </div>
    </Modal>
  );
};

export default CreateTeamFormModal;
