import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'observables',
        loadComponent: () => import('./observe/observe').then(m => m.Observe)
    },
    {
        path: 'filter',
        loadComponent: () => import('./filter/filter').then(m => m.Filter)
    },
    {
        path: 'signals',
        loadComponent: () => import('./signal/signal').then(m => m.Signal)
    },
    {
        path: 'dynamic-component',
        loadComponent: () => import('./dynamic-comp-container/dynamic-comp-container').then(m => m.DynamicCompContainer)
    },
    {
        path: 'forms',
        loadComponent: () => import('./forms/forms').then(m => m.Forms)
    },
    {
        path: 'dynamic-form',
        loadComponent: () => import('./dynamic-form/dynamic-form').then(m => m.DynamicForm)
    }
];
