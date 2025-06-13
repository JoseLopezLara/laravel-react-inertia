// types/todo.ts

export type Priority = 'low' | 'medium' | 'high';

export type TodoStatus = 'all' | 'completed' | 'pending' | 'overdue' | 'due_today';

export type SortOption = 'default' | 'title' | 'priority' | 'due_date' | 'created';

export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  // Computed attributes from Laravel
  is_overdue: boolean;
  is_due_today: boolean;
  priority_level: number;
}

export interface TodoStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  due_today: number;
  high_priority: number;
}

export interface TodoFilters {
  status?: TodoStatus;
  priority?: Priority;
  search?: string;
  sort?: SortOption;
}

export interface TodoFormData {
  title: string;
  description?: string;
  priority: Priority;
  due_date?: string;
  completed?: boolean;
}

// Para la paginación de Laravel
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: Array<{
    url: string | null;
    label: string;
    active: boolean;
  }>;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export type PaginatedTodos = PaginatedResponse<Todo>;

// Props para componentes
export interface TodoListProps {
  todos: PaginatedTodos;
  stats: TodoStats;
  filters: TodoFilters;
}

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onUpdate: (id: number, data: Partial<TodoFormData>) => void;
  onDelete: (id: number) => void;
}

export interface TodoFormProps {
  onSubmit: (data: TodoFormData) => void;
  initialData?: Partial<TodoFormData>;
  isLoading?: boolean;
}

export interface TodoFiltersProps {
  filters: TodoFilters;
  stats: TodoStats;
  onFilterChange: (filters: Partial<TodoFilters>) => void;
}

// Para manejar errores
export interface TodoError {
  message: string;
  errors?: Record<string, string[]>;
}