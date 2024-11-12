export const isTaskCompleted = (task) => {
    return (task?.actualCompletionDate && task?.actualCompletionDate !== null && task?.actualCompletionDate !== '' && task?.actualCompletionDate !== 'null') || (task?.pfMonthly_filedate || task?.esi_fileDate || task?.pft_fileDate || task?.gstMonthly_filedate);
  }
