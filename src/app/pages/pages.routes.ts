import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';
import { WindowDemoComponent } from './window-demo/window-demo.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    component: StarterComponent,
    data: {
      title: 'Starter',
      urls: [
        { title: 'Dashboard', url: '/dashboard' },
        { title: 'Starter' },
      ],
    },
  },
];
