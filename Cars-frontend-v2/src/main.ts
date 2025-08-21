// src/main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { registerLicense } from '@syncfusion/ej2-base';
import { importProvidersFrom } from '@angular/core';
// import { DocumentEditorModule } from '@syncfusion/ej2-angular-documenteditor';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';


// Replace with your actual license key
registerLicense('ORg4AjUWIQA/Gnt3VVhhQlJDfVZdXGFWfFN0QHNfdV54flBDcC0sT3RfQFhjQX9QdkNiUHtWeXxWQmtfUQ==');


bootstrapApplication(App, {
  ...appConfig, // spread existing appConfig (like routing, etc.)
  providers: [
     importProvidersFrom(DocumentEditorContainerModule),
    ...(appConfig.providers || []), // retain existing providers from appConfig
    provideHttpClient(),       
  ]
}).catch(err => console.error(err));
