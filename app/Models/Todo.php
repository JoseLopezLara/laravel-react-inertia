<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;


class Todo extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'completed',
        'priority',
        'due_date',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'datetime',
    ];

    // Solo scopes básicos y reutilizables
    public function scopeCompleted(Builder $query): void
    {
        $query->where('completed', true);
    }

    public function scopePending(Builder $query): void
    {
        $query->where('completed', false);
    }

    public function scopeByPriority(Builder $query, string $priority): void
    {
        $query->where('priority', $priority);
    }

    // Accessors para propiedades calculadas
    public function getIsOverdueAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date->isPast() && 
               !$this->completed;
    }

    public function getIsDueTodayAttribute(): bool
    {
        return $this->due_date && 
               $this->due_date->isToday() && 
               !$this->completed;
    }

    public function getPriorityLevelAttribute(): int
    {
        return match($this->priority) {
            'high' => 3,
            'medium' => 2,
            'low' => 1,
            default => 2
        };
    }

    // Sin global scope - mejor manejar ordenamiento en controlador
    // para tener más control y flexibilidad
}
