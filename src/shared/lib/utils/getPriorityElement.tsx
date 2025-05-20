import { TaskPriorities } from '@/entities/task';
import { Arrow, ArrowDirections, icons, SvgIcon } from '@/shared/ui';

export const getPriorityElement = (priority: TaskPriorities) => {
  switch (priority) {
    case TaskPriorities.LOW:
      return <Arrow direction={ArrowDirections.DOWN} />;
    case TaskPriorities.MEDIUM:
      return (
        <SvgIcon
          iconName={icons.MEDIUM}
          applyHover={false}
        />
      );
    case TaskPriorities.HIGH:
      return <Arrow direction={ArrowDirections.UP} />;
    default:
      return null;
  }
};
