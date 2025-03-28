"use client";

const CheckIcon = () => (
  <svg
    className="w-6 h-6 text-green-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

const EmptyCheckIcon = () => (
  <svg
    className="w-6 h-6 text-gray-400"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" strokeWidth="2" />
  </svg>
);

const DeleteIcon = () => (
  <svg
    className="w-5 h-5 text-red-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EditIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

function TodoItem({ todo, toggleTodo, deleteTodo, editTodo, isAuthenticated }) {
  return (
    <li className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200">
      <button
        onClick={() => toggleTodo(todo.id, todo.completed)}
        className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer"
        disabled={!isAuthenticated}
      >
        {todo.completed ? <CheckIcon /> : <EmptyCheckIcon />}
      </button>
      <span
        className={`flex-1 text-base ${
          todo.completed ? "line-through text-gray-600" : "text-gray-800"
        }`}
      >
        {todo.text}
      </span>
      {isAuthenticated && (
        <>
          <button
            onClick={() => editTodo(todo)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer text-blue-500 hover:text-blue-700"
            title="수정"
          >
            <EditIcon />
          </button>
          <button
            onClick={() => deleteTodo(todo.id)}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 cursor-pointer text-red-500 hover:text-red-700"
            title="삭제"
          >
            <DeleteIcon />
          </button>
        </>
      )}
    </li>
  );
}

export default function TodoList({
  todos,
  toggleTodo,
  deleteTodo,
  editTodo,
  isAuthenticated,
}) {
  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  // 할 일이 없을 때 표시
  if (todos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {isAuthenticated
          ? "할 일이 없습니다. 새로운 할 일을 추가해보세요!"
          : "로그인하면 할 일을 추가할 수 있습니다."}
      </div>
    );
  }

  return (
    <>
      {/* 진행중인 할 일 목록 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 px-2 text-gray-800">
          진행중 ({pendingTodos.length})
        </h2>
        {pendingTodos.length > 0 ? (
          <ul className="space-y-3">
            {pendingTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </ul>
        ) : (
          <p className="text-center py-4 text-gray-500">
            완료되지 않은 할 일이 없습니다.
          </p>
        )}
      </div>

      {/* 완료된 할 일 목록 */}
      {completedTodos.length > 0 && (
        <div className="mb-16">
          <h2 className="text-lg font-semibold mb-3 px-2 text-gray-800">
            완료됨 ({completedTodos.length})
          </h2>
          <ul className="space-y-3">
            {completedTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                toggleTodo={toggleTodo}
                deleteTodo={deleteTodo}
                editTodo={editTodo}
                isAuthenticated={isAuthenticated}
              />
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
