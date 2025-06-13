
// Pages/Todos/Index.tsx

import React from 'react';
import { Head } from '@inertiajs/react';
import ErrorBoundary from '../../components/ErrorBoundary';
import { TodoListProps } from '../../types/todo';

// Importaremos estos componentes en los siguientes pasos
// import TodoStats from '../../Components/Todos/TodoStats';
// import TodoFilters from '../../Components/Todos/TodoFilters';
// import TodoForm from '../../Components/Todos/TodoForm';
// import TodoList from '../../Components/Todos/TodoList';

const TodosIndex: React.FC<TodoListProps> = ({ todos, stats, filters }) => {
  return (
    <ErrorBoundary>
      <Head title="Lista de Tareas" />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Lista de Tareas
            </h1>
            <p className="mt-2 text-gray-600">
              Organiza y gestiona tus tareas de manera eficiente
            </p>
          </div>

          {/* Temporary content - will be replaced with actual components */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Stats Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Estadísticas
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{stats.total}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Completadas:</span>
                    <span className="text-green-600 font-semibold">{stats.completed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pendientes:</span>
                    <span className="text-blue-600 font-semibold">{stats.pending}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencidas:</span>
                    <span className="text-red-600 font-semibold">{stats.overdue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vencen hoy:</span>
                    <span className="text-orange-600 font-semibold">{stats.due_today}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alta prioridad:</span>
                    <span className="text-purple-600 font-semibold">{stats.high_priority}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tareas ({todos.total})
                  </h2>
                </div>
                
                <div className="p-6">
                  {todos.data.length > 0 ? (
                    <div className="space-y-4">
                      {todos.data.map((todo) => (
                        <div 
                          key={todo.id} 
                          className="p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {todo.title}
                              </h3>
                              {todo.description && (
                                <p className="mt-1 text-sm text-gray-600">
                                  {todo.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  todo.priority === 'high' ? 'bg-red-100 text-red-800' :
                                  todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {todo.priority}
                                </span>
                                {todo.due_date && (
                                  <span className={
                                    todo.is_overdue ? 'text-red-600' :
                                    todo.is_due_today ? 'text-orange-600' :
                                    'text-gray-500'
                                  }>
                                    {new Date(todo.due_date).toLocaleDateString()}
                                  </span>
                                )}
                                <span className={todo.completed ? 'text-green-600' : 'text-gray-500'}>
                                  {todo.completed ? 'Completada' : 'Pendiente'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        No tienes tareas aún
                      </h3>
                      <p className="text-gray-600">
                        Crea tu primera tarea para comenzar a organizarte
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default TodosIndex;