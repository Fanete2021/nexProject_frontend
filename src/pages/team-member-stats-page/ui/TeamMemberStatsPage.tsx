import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch.ts';
import { getUserCompletingTasks, getUserTasks, getUserTasksComplete } from '@/entities/task-board-stats';

const TeamMemberStatsPage = () => {
  const { teamId, userId } = useParams<{ teamId: string, userId: string }>();
  const dispatch = useAppDispatch();

  const [employeeTasks, setEmployeeTasks] = useState([]);
  const [completedTasksData, setCompletedTasksData] = useState(null);
  const [timeSpentData, setTimeSpentData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7);
    return date;
  });
  const [endDate, setEndDate] = useState(new Date());

  const handleStartDateChange = (event) => {
    setStartDate(new Date(event.target.value));
  };

  const handleEndDateChange = (event) => {
    setEndDate(new Date(event.target.value));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!teamId || !userId) return;
        const promises = [];

        promises.push(dispatch(getUserTasks({
          teamId: teamId,
          userId: userId
        })).then((response) => {
          setEmployeeTasks(response.payload.tasks.flatMap(board => board.userTasks));
        }));

        promises.push(dispatch(getUserCompletingTasks({
          teamId: teamId,
          userId: userId
        })).then((response) => {
          setTimeSpentData(response.payload);
        }));

        await Promise.all(promises);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teamId, userId]);

  useEffect(() => {
    if (!teamId || !userId || !startDate || !endDate) return;

    dispatch(getUserTasksComplete({
      teamId: teamId,
      userId: userId,
      startDate: startDate.getTime(),
      endDate: endDate.getTime()
    })).then((response) => {
      setCompletedTasksData(response.payload);
    });
  }, [teamId, userId, startDate, endDate]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  const boardsData = completedTasksData?.boards?.map(board => ({
    name: board.boardName,
    'Количество задач': board.tasksCompletedCount
  })) || [];

  const tasksTimeData = timeSpentData?.tasks?.flatMap(board =>
    board.completedTasks.map(task => ({
      name: task.taskName,
      'Время выполнения': task.timeSpentOnCompletingTask / (1000 * 60 * 60) // Преобразование миллисекунд в часы
    }))
  ) || [];

  return (
    <div>
      <h1>Статистика участника команды</h1>
      <p>Team ID: {teamId}</p>
      <p>User ID: {userId}</p>

      <div>
        <label>
          Начальная дата:
          <input
            type="date"
            value={startDate.toISOString().split('T')[0]}
            onChange={handleStartDateChange}
          />
        </label>
      </div>

      <div>
        <label>
          Конечная дата:
          <input
            type="date"
            value={endDate.toISOString().split('T')[0]}
            onChange={handleEndDateChange}
          />
        </label>
      </div>

      <Paper elevation={3} style={{ padding: '20px', margin: '20px' }}>
        <Typography variant="h5" gutterBottom>
          Мониторинг эффективности сотрудника
        </Typography>

        <Typography variant="h6" gutterBottom>
          Всего задач у сотрудника: {employeeTasks.length}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Количество успешно решенных задач: {completedTasksData?.totalTasksCompletedCount || 0}
        </Typography>

        <Typography variant="h6" gutterBottom>
          Успешно решенные задачи по доскам:
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={boardsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Количество задач" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>

        <Typography variant="h6" gutterBottom>
          Время, потраченное на задачи в часах
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={tasksTimeData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Время выполнения" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </div>
  );
};

export default TeamMemberStatsPage;
