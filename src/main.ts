import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppServerModule } from './app/app.module.server';


platformBrowserDynamic().bootstrapModule(AppServerModule)
  .catch(err => console.error(err));