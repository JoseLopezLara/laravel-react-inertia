<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class TodoController extends Controller
{
    /**
     * Display the todo list page
     */
    public function index(Request $request): Response
    {
        // Construir la query base
        $query = Todo::query();

        // Aplicar filtros basados en parámetros de request
        $this->applyFilters($query, $request);

        // Aplicar ordenamiento
        $this->applySorting($query, $request);

        // Obtener todos con paginación
        $todos = $query->paginate(15)->withQueryString();

        // Obtener estadísticas para el dashboard
        $stats = $this->getTodoStats();

        return Inertia::render('Todos/Index', [
            'todos' => $todos,
            'stats' => $stats,
            'filters' => $request->only(['status', 'priority', 'search', 'sort']),
        ]);
    }

    /**
     * Store a new todo
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'nullable|date|after:now',
        ]);

        Todo::create($validated);

        return redirect()->back()->with('success', 'Todo creado exitosamente.');
    }

    /**
     * Update an existing todo
     */
    public function update(Request $request, Todo $todo): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'priority' => ['required', Rule::in(['low', 'medium', 'high'])],
            'due_date' => 'nullable|date',
            'completed' => 'boolean',
        ]);

        $todo->update($validated);

        return redirect()->back()->with('success', 'Todo actualizado exitosamente.');
    }

    /**
     * Toggle completion status
     */
    public function toggleComplete(Todo $todo): RedirectResponse
    {
        $todo->update(['completed' => !$todo->completed]);

        $message = $todo->completed ? 'Todo marcado como completado.' : 'Todo marcado como pendiente.';
        
        return redirect()->back()->with('success', $message);
    }

    /**
     * Delete a todo
     */
    public function destroy(Todo $todo): RedirectResponse
    {
        $todo->delete();

        return redirect()->back()->with('success', 'Todo eliminado exitosamente.');
    }

    /**
     * Bulk actions for multiple todos
     */
    public function bulkAction(Request $request): RedirectResponse
    {
        $request->validate([
            'action' => 'required|in:complete,incomplete,delete',
            'todo_ids' => 'required|array',
            'todo_ids.*' => 'exists:todos,id',
        ]);

        $todos = Todo::whereIn('id', $request->todo_ids);

        switch ($request->action) {
            case 'complete':
                $todos->update(['completed' => true]);
                $message = 'Todos marcados como completados.';
                break;
            case 'incomplete':
                $todos->update(['completed' => false]);
                $message = 'Todos marcados como pendientes.';
                break;
            case 'delete':
                $todos->delete();
                $message = 'Todos eliminados exitosamente.';
                break;
        }

        return redirect()->back()->with('success', $message);
    }

    /**
     * Apply filters to the query
     */
    private function applyFilters($query, Request $request): void
    {
        // Filtro por estado
        if ($request->filled('status')) {
            match ($request->status) {
                'completed' => $query->completed(),
                'pending' => $query->pending(),
                'overdue' => $query->where('due_date', '<', now())->pending(),
                'due_today' => $query->whereDate('due_date', today())->pending(),
                default => null,
            };
        }

        // Filtro por prioridad
        if ($request->filled('priority')) {
            $query->byPriority($request->priority);
        }

        // Búsqueda por texto
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
    }
    
    /**
     * Apply sorting to the query
     * @param \Illuminate\Database\Eloquent\Builder|\Illuminate\Database\Query\Builder $query
     */
    private function applySorting($query, Request $request): void
    {
        $sort = $request->get('sort', 'default');

        // La expresión CASE para ordenar por prioridad de forma personalizada
        $priorityOrderSql = "CASE priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 WHEN 'low' THEN 3 ELSE 4 END";

        match ($sort) {
            'title' => $query->orderBy('title'),
            'priority' => $query->orderByRaw($priorityOrderSql), // Usamos la sentencia CASE
            'due_date' => $query->orderBy('due_date', 'asc'),
            'created' => $query->orderBy('created_at', 'desc'),
            default => $query->orderBy('completed', 'asc')
                              ->orderByRaw($priorityOrderSql) // Usamos la sentencia CASE
                              ->orderBy('due_date', 'asc')
                              ->orderBy('created_at', 'desc'),
        };
    }

    /**
     * Get todo statistics for dashboard
     */
    private function getTodoStats(): array
    {
        return [
            'total' => Todo::count(),
            'completed' => Todo::completed()->count(),
            'pending' => Todo::pending()->count(),
            'overdue' => Todo::where('due_date', '<', now())->pending()->count(),
            'due_today' => Todo::whereDate('due_date', today())->pending()->count(),
            'high_priority' => Todo::byPriority('high')->pending()->count(),
        ];
    }
}