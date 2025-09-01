import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { App } from './app/app';
import { appConfig } from './app/app.config';
import { registerLicense } from '@syncfusion/ej2-base';
import { importProvidersFrom } from '@angular/core';
import { DocumentEditorContainerModule } from '@syncfusion/ej2-angular-documenteditor';
import { provideQuillConfig } from 'ngx-quill';
import { provideAnimations } from '@angular/platform-browser/animations';
import Quill from 'quill';
import QuillBetterTable from 'quill-better-table';
// import ImageResize from 'quill-image-resize-module';
import { imageHandler } from './app/core/quill-custom/image-handler';
import { ResizableImage } from './app/core/quill-custom/image-blot';

// Syncfusion license
registerLicense(
  'ORg4AjUWIQA/Gnt3VVhhQlJDfVZdXGFWfFN0QHNfdV54flBDcC0sT3RfQFhjQX9QdkNiUHtWeXxWQmtfUQ=='
);

// Register table plugin
Quill.register({ 'modules/better-table': QuillBetterTable }, true);

Quill.register(ResizableImage);

bootstrapApplication(App, {
  ...appConfig,
  providers: [
    importProvidersFrom(DocumentEditorContainerModule),
    ...(appConfig.providers || []),
    provideHttpClient(),
    provideAnimations(),
    provideQuillConfig({
      modules: {
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ font: [] }],
            // [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            // [{ color: [] }, { background: [] }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ script: 'sub' }, { script: 'super' }],
            [{ align: [] }],
            [{ direction: 'rtl' }],
            // ['blockquote', 'code-block'],
            // ['link', 'image', 'video', 'formula', 'table'],
            ['link', 'table'],
            ['image'],
            ['undo', 'redo'],
            // ['clean']
          ],
          handlers: {
            image: imageHandler,
            table: function () {
              // @ts-ignore
              const tableModule = this.quill.getModule('better-table');
              tableModule.insertTable(3, 3);
            },
            undo: function () {
              (this as any)['quill'].history.undo();
            },
            redo: function () {
              (this as any)['quill'].history.redo();
            },
          },
        },
        formats: [
          'bold',
          'italic',
          'underline',
          'strike',
          'color',
          'background',
          'code-block',
          'link',
          'image',
          'list',
        ],
        // imageResize: {},
        'better-table': {
          operationMenu: {
            items: {
              insertColumnRight: true,
              insertColumnLeft: true,
              insertRowAbove: true,
              insertRowBelow: true,
              deleteColumn: true,
              deleteRow: true,
              deleteTable: true,
            },
          },
        },
        history: {
          delay: 1000,
          maxStack: 100,
          userOnly: true,
        },
      },
      theme: 'snow',
    }),
  ],
}).catch((err) => console.error(err));
