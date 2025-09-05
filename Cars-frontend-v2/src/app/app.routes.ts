import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { CreateRequest } from './components/create-request/create-request';
import { ViewRequest } from './components/view-request/view-request';
import { SubsectionDetail } from './components/subsection-detail/subsection-detail';
import { RequestDetail } from './components/request-detail/request-detail';
import { DocumentEditor } from './components/document-editor/document-editor';
import { MainLayout } from './components/main-layout/main-layout';
import { QuillEditor } from './components/quill-editor/quill-editor';
import { Comments } from './components/comments/comments';
import { AttachmentUpload } from './components/attachment-upload/attachment-upload';
import { LoginError } from './login-error/login-error';
import { map, switchMap } from 'rxjs';
import { SubsectionResolver } from './resolvers/subsection-resolver';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        component: Dashboard,
        data: { breadcrumb: 'Dashboard' },
      },
      {
        path: 'create-request',
        component: CreateRequest,
        data: { breadcrumb: 'Create Request' },
      },
      {
        path: 'view-request',
        component: ViewRequest,
        data: { breadcrumb: { label: 'View Requests', url: '/view-request' } },
        children: [
          {
            path: '',
            component: RequestDetail,
            data: { breadcrumb: { label: 'All Requests' } }, // /view-request shows All Requests
          },
          {
            path: 'requests/:requestId',
            component: RequestDetail,
            data: {
              breadcrumb: (params: any, services: any) =>
                services.requestService.getRequestName(params.requestId).pipe(
                  map((name) => ({
                    label: name,
                    url: `/view-request/requests/${params.requestId}`, // clickable
                  }))
                ),
            },
          },
          {
            path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
            component: SubsectionDetail,
            resolve: { subsectionData: SubsectionResolver }, // 🔹 Add resolver
            data: {
              breadcrumb: (params: any, services: any) =>
                services.requestService.getRequestName(params.requestId).pipe(
                  switchMap((requestName) =>
                    services.requestService
                      .getSectionOrSubsectionName(
                        params.sectionId,
                        params.subsectionId
                      )
                      .pipe(
                        map((res: { section: string; subsection: string }) => [
                          {
                            label: requestName,
                            url: `/view-request/requests/${params.requestId}`, // clickable request
                          },
                          {
                            label: res.section, // section (plain text only, no url)
                          },
                          {
                            label: res.subsection, // subsection (last breadcrumb)
                          },
                        ])
                      )
                  )
                ),
            },
          },
        ],
      },

      {
        path: 'editor',
        component: DocumentEditor,
        data: { breadcrumb: 'Document Editor' },
      },
      {
        path: 'quill-editor',
        component: QuillEditor,
        data: { breadcrumb: 'Quill Editor' },
      },
      {
        path: 'comments',
        component: Comments,
        data: { breadcrumb: 'Comments' },
      },
      {
        path: 'attachments',
        component: AttachmentUpload,
        data: { breadcrumb: 'Attachments' },
      },
    ],
  },
  {
    path: 'login-error',
    component: LoginError,
    data: { breadcrumb: 'Login Error' },
  },
];

// export const routes: Routes = [
//   {
//     path: '',
//     component: MainLayout, // This wraps all your main components
//     children: [
//       { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
//       { path: 'dashboard', component: Dashboard },
//       { path: 'create-request', component: CreateRequest },

//       {
//         path: 'view-request',
//         component: ViewRequest,
//         children: [
//           { path: '', component: RequestDetail }, // all requests if no requestId
//           { path: 'requests/:requestId', component: RequestDetail },
//           {
//             path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
//             component: SubsectionDetail,
//           },
//         ],
//       },
//       { path: 'editor', component: DocumentEditor },
//       { path: 'quill-editor', component: QuillEditor },
//       { path: 'comments', component: Comments },
//       { path: 'attachments', component: AttachmentUpload },
//     ],
//   },

//   { path: 'login-error', component: LoginError },
// ];
