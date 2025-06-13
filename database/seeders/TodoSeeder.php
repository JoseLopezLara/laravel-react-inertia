<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Todo;

class TodoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear algunos todos específicos para testing
        Todo::create([
            'title' => 'Aprender React con Inertia',
            'description' => 'Dominar los conceptos básicos de React usando Inertia.js',
            'priority' => 'high',
            'due_date' => now()->addDays(7),
        ]);

        Todo::create([
            'title' => 'Configurar TypeScript',
            'description' => 'Establecer la configuración correcta de TypeScript para el proyecto',
            'priority' => 'medium',
            'completed' => true,
        ]);

        Todo::create([
            'title' => 'Implementar componentes reutilizables',
            'description' => 'Crear una biblioteca de componentes React reutilizables',
            'priority' => 'medium',
            'due_date' => now()->addDays(3),
        ]);

        // Crear datos aleatorios
        Todo::factory(15)->create();
        
        // Crear algunos casos específicos
        Todo::factory(3)->overdue()->create();
        Todo::factory(2)->dueToday()->create();
        Todo::factory(5)->completed()->create();
        Todo::factory(3)->highPriority()->create();
    }
}