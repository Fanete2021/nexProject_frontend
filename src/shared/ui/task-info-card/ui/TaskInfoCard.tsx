import React from 'react';
import { TaskInfo } from '@/entities/task';
import styles from './TaskInfoCard.module.scss';
import { classNames } from '@/shared/lib/utils/classNames.ts';
import { useTranslation } from 'react-i18next';
import { getPriorityElement } from '@/shared/lib/utils/getPriorityElement.tsx';
import { Avatar } from '@/shared/ui';
import {formatTimeLocalized} from "@/shared/lib/utils/formatTimeLocalized.ts";

export interface TaskInfoCardProps {
  className?: string;
  taskInfo: TaskInfo;
}

const TaskInfoCard: React.FC<TaskInfoCardProps> = (props) => {
  const { taskInfo, className } = props;

  const { t } = useTranslation();

  return (
    <div className={classNames(styles.TaskInfoCard, [className])}>
      <div className={styles.header}>
        {taskInfo.taskName}
      </div>

      <div className={styles.info}>
        <div className={styles.details}>
          <b>Детали задачи</b>

          <div><b>Статус:</b> {t(taskInfo.status.statusName) as string}</div>

          <div className={styles.priority}>
            <b>Приоритет:</b>
            <span>{getPriorityElement(taskInfo.priority)} {t(taskInfo.priority) as string}</span>
          </div>
        </div>

        <div className={styles.people}>
          <b>Люди</b>

          <div className={styles.author}>
            <b>Автор:</b>

            <Avatar
              text={taskInfo.authorName}
              width={25}
              height={25}
            />

            {taskInfo.authorName}
          </div>

          <div className={styles.executor}>
            <b>Исполнитель:</b>

            {taskInfo.executorId
              ?
              <>
                <Avatar
                  text={taskInfo.executorName}
                  width={25}
                  height={25}
                />

                {taskInfo.executorName}
              </>
              :
              '-'
            }
          </div>
        </div>

        <div className={styles.dates}>
          <b>Даты</b>

          <div><b>Создано:</b> {formatTimeLocalized(taskInfo.createdAt, { includeDate: true })}</div>

          {taskInfo.updatedAt &&
            <div><b>Обновлено:</b> {formatTimeLocalized(taskInfo.updatedAt, { includeDate: true })}</div>
          }

          {taskInfo.completedAt &&
            <div><b>Заверешено:</b> {formatTimeLocalized(taskInfo.completedAt, { includeDate: true })}</div>
          }
        </div>
      </div>

      {taskInfo.taskDescription &&
        <div className={styles.description}>
          <b>Описание</b>

          <div>
            {taskInfo.taskDescription}
          </div>
        </div>
      }
    </div>
  );
};

export default TaskInfoCard;
