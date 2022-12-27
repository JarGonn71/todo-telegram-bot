export const showList = (todos) =>
  `${todos
    .map((todo) => (todo.isCompleted ? '✅' : '⭕️') + ' ' + todo.name + '\n\n')
    .join('')}`;
