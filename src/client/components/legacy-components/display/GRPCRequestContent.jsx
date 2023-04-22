// import React from 'react';
// import CodeMirror from '@uiw/react-codemirror';
// import ContentReqRow from './ContentReqRow';
// import { EditorView } from "@codemirror/view"
// import { json } from '@codemirror/lang-json';



// function GRPCRequestContent({ request, rpc, service, servicesObj }) {
//   const {
//     headers, // refers to meta-data in a GRPC request
//     body, // "body Content text"
//     rawType,
//     testContent,
//   } = request;

//   // CREATE META-DATA COMPONENTS
//   const metadataRows = headers.map((header, index) => (
//     <ContentReqRow data={header} key={`h${index}`} />
//   ));

//   return (
//     <div>
//       {/* REQUEST DETAILS */}
//       <div className="p-3">
//         {/* METADATA */}
//         {metadataRows.length > 0 && <div className="is-size-7">Metadata</div>}
//         {metadataRows}
//         {/* REQUEST / SERVICE */}
//         <div className="is-size-7">Service / Request</div>
//         <div className="is-flex">
//           <input
//             className="input"
//             type="text"
//             value={`Service: ${service}`}
//             className="is-justify-content-center is-flex-grow-1 p-1"
//             readOnly
//           />
//           <input
//             className="input"
//             type="text"
//             value={`Request: ${rpc}`}
//             className="is-justify-content-center is-flex-grow-1 p-1"
//             readOnly
//           />
//         </div>
//         {/* BODY */}
//         <div>
//           <div className="is-size-7">Body</div>
//           <CodeMirror
//             value={body}
//             extensions={[
//               json(),
//               EditorView.lineWrapping,
//             ]}
//             theme = 'dark'
//             readOnly= 'true'
//             height="100%"
//             width = "100%"
//             maxWidth='400px'
//             maxHeight='300px'
//           />
//         </div>
//         {testContent.length > 0 && (
//           <div>
//             <div className="is-size-7">Tests</div>
//             <CodeMirror
//               value={testContent}
//               theme = 'dark'
//               readOnly= 'true'
//               extensions={[
//                 EditorView.lineWrapping,
//               ]}
//               height="100%"
//               width = "100%"
//               maxWidth='400px'
//               maxHeight='300px'
//             />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// export default GRPCRequestContent;
