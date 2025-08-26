import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { CreateRequest } from './components/create-request/create-request';
import { ViewRequest } from './components/view-request/view-request';
import { SubsectionDetail } from './components/subsection-detail/subsection-detail';
import { RequestDetail } from './components/request-detail/request-detail';
import { DocumentEditor } from './components/document-editor/document-editor';
import { MainLayout } from './components/main-layout/main-layout';
import { QuillEditor } from './components/quill-editor/quill-editor';


export const routes: Routes = [
  {
    path: '',
    component: MainLayout, // This wraps all your main components
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: Dashboard },
      { path: 'create-request', component: CreateRequest },
      {
        path: 'view-request',
        component: ViewRequest,
        children: [
          { path: 'requests/:requestId', component: RequestDetail },
          {
            path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
            component: SubsectionDetail,
          },
        ],
      },
      { path: 'editor', component: DocumentEditor },
      { path: 'quill-editor', component: QuillEditor }
    ]
  }
];



// export const routes: Routes = [
//   {
//     path: '',
//     component: Dashboard,
//     children: [
//       { path: 'create-request', component: CreateRequest },
//       { path: 'main-layout', component: MainLayout },
//       { path: '', pathMatch: 'full', redirectTo: 'main-layout' }, // shows empty by default
//       {
//         path: 'view-request',
//         // data: { breadcrumb: 'View Request' },
//         component: ViewRequest,
//         children: [
//           {
//             path: 'requests/:requestId',
//             // data: { breadcrumb: 'Request :requestId' },
//             component: RequestDetail,
//           },
//           {
//             path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
//             // data: { breadcrumb: 'Subsection :subsectionId' },
//             component: SubsectionDetail,
//           },
//         ],
//       },
//     ],
//   },
//   // {
//   //   path: '',
//   //   component: MainLayout,
//   //   children: [
//   //     { path: '', redirectTo: 'create-request', pathMatch: 'full' },
//   //     { path: 'create-request', component: CreateRequest },
//   //     { path: 'dashboard', component: Dashboard},
//   //     // add other pages here
//   //   ],
//   // },

//   // { path: '', data: { breadcrumb: 'Dashboard' }, component: Dashboard },
//   // {
//   //   path: 'create-request',
//   //   data: { breadcrumb: 'Create Request' },
//   //   component: CreateRequest,
//   // },

//   { path: 'editor', component: DocumentEditor },
// ];

// import { Routes } from '@angular/router';
// import { Dashboard } from './components/dashboard/dashboard';
// import { CreateRequest } from './components/create-request/create-request';
// import { ViewRequest } from './components/view-request/view-request';
// import { SubsectionDetail } from './components/subsection-detail/subsection-detail';
// import { RequestDetail } from './components/request-detail/request-detail';

// export const routes: Routes = [
//   { path: '', data: { breadcrumb: 'Dashboard' }, component: Dashboard },
//   {
//     path: 'create-request',
//     data: { breadcrumb: 'Create Request' },
//     component: CreateRequest,
//   },
//   {
//     path: 'view-request',
//     data: { breadcrumb: 'View Request' },
//     component: ViewRequest,
//     children: [
//       {
//         path: 'requests/:requestId',
//         data: { breadcrumb: 'Request :requestId' },
//         component: RequestDetail,
//       },
//       {
//         path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
//         data: { breadcrumb: 'Subsection :subsectionId' },
//         component: SubsectionDetail,
//       },
//     ],
//   },
// ];

// export const routes: Routes = [
//   { path: '', data: { breadcrumb: 'Dashboard' }, component: Dashboard },
//   {
//     path: 'create-request',
//     data: { breadcrumb: 'Dashboard / Create Request' },
//     component: CreateRequest,
//   },
//   {
//     path: 'view-request',
//     data: { breadcrumb: 'Dashboard / View Request' },
//     component: ViewRequest,
//     children: [
//       {
//         path: 'requests/:requestId',
//         data: { breadcrumb: 'Dashboard / View Request / Request :requestId' },
//         component: RequestDetail,
//       },
//       {
//         path: 'requests/:requestId/sections/:sectionId/subsections/:subsectionId',
//         data: {
//           breadcrumb:
//             'Dashboard / View Request / Request :requestId / Section :sectionId / Subsection :subsectionId',
//         },
//         component: SubsectionDetail,
//       },
//     ],
//   },
// ];
