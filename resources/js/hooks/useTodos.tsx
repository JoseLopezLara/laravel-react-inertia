
// hooks/useTodos.ts

import { useCallback } from 'react';
import { router } from '@inertiajs/react';
import { TodoFormData, TodoFilters } from '../types/todo';

export const useTodos = () => {
  // Crear nuevo todo
  const createTodo = useCallback((data: TodoFormData) => {
    router.post('/todos', data, {
      preserveScroll: true,
      onSuccess: () => {
        // El éxito se maneja automáticamente por Inertia con flash messages
      },
      onError: (errors) => {
        console.error('Error creating todo:', errors);
      }
    });
  }, []);

  // Actualizar todo existente
  const updateTodo = useCallback((id: number, data: Partial<TodoFormData>) => {
    router.patch(`/todos/${id}`, data, {
      preserveScroll: true,
      onSuccess: () => {
        // Success handled by flash messages
      },
      onError: (errors) => {
        console.error('Error updating todo:', errors);
      }
    });
  }, []);

  // Toggle completion status
  const toggleTodo = useCallback((id: number) => {
    router.patch(`/todos/${id}/toggle`, {}, {
      preserveScroll: true,
      onSuccess: () => {
        // Success handled by flash messages
      },
      onError: (errors) => {
        console.error('Error toggling todo:', errors);
      }
    });
  }, []);

  // Eliminar todo
  const deleteTodo = useCallback((id: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este todo?')) {
      router.delete(`/todos/${id}`, {
        preserveScroll: true,
        onSuccess: () => {
          // Success handled by flash messages
        },
        onError: (errors) => {
          console.error('Error deleting todo:', errors);
        }
      });
    }
  }, []);

  // Bulk actions
  const bulkAction = useCallback((action: 'complete' | 'incomplete' | 'delete', todoIds: number[]) => {
    if (todoIds.length === 0) {
      alert('Por favor selecciona al menos un todo.');
      return;
    }

    const confirmMessages = {
      complete: '¿Marcar todos los seleccionados como completados?',
      incomplete: '¿Marcar todos los seleccionados como pendientes?',
      delete: '¿Estás seguro de que quieres eliminar todos los seleccionados?'
    };

    if (confirm(confirmMessages[action])) {
      router.post('/todos/bulk-action', {
        action,
        todo_ids: todoIds
      }, {
        preserveScroll: true,
        onSuccess: () => {
          // Success handled by flash messages
        },
        onError: (errors) => {
          console.error('Error in bulk action:', errors);
        }
      });
    }
  }, []);

  // Aplicar filtros
  const applyFilters = useCallback((filters: Partial<TodoFilters>) => {
    router.get('/todos', filters, {
      preserveState: true,
      preserveScroll: true,
      replace: true, // Replace history entry instead of adding new one
    });
  }, []);

  // Clear specific filter
//   const clearFilter = useCallback((filterKey: keyof TodoFilters) => {
//     router.get('/todos', {}, {
//       preserveState: true,
//       preserveScroll: true,
//       replace: true,
//       only: ['todos', 'stats'], // Only reload these props
//       data: {
//         [filterKey]: undefined
//       }
//     });
//   }, []);

  // Clear specific filter
const clearFilter = useCallback((filterKey: keyof TodoFilters) => {
    router.get(
      '/todos',
      { // Este es el objeto de datos que se enviará como parámetros de URL
        [filterKey]: undefined // Mueve esto aquí
      },
      { // Este es el objeto de opciones
        preserveState: true,
        preserveScroll: true,
        replace: true,
        only: ['todos', 'stats'], // Solo recargar estas propiedades
      }
    );
  }, []);

  // Reset all filters
  const resetFilters = useCallback(() => {
    router.get('/todos', {}, {
      preserveState: true,
      preserveScroll: true,
      replace: true,
    });
  }, []);

  return {
    // CRUD operations
    createTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    bulkAction,
    
    // Filter operations
    applyFilters,
    clearFilter,
    resetFilters,
  };
};