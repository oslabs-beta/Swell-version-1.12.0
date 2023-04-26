"use strict";
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
//Imported from CookieEntryForm && HeadEntryForm
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var react_redux_1 = require("react-redux");
function ContentReqRowComposer(_a) {
    var data = _a.data, changeHandler = _a.changeHandler, index = _a.index, deleteItem = _a.deleteItem, type = _a.type;
    var isDark = (0, react_redux_1.useSelector)(function (store) { return store.ui.isDark; });
    return (<div className={"is-flex mt-1 ".concat(type)} id={"".concat(type).concat(index)}>
      <div className={"include-data-checkbox ".concat(isDark ? 'is-dark-200' : '')}>
        <input type="checkbox" id={data.id} className="is-checkradio is-black has-no-border" checked={data.active} onChange={function (e) { return changeHandler(data.id, 'active', e.target.checked); }}/>
        <label htmlFor={data.id}/>
      </div>
      <input placeholder="Key" type="text" style={{ marginLeft: '15px', width: '20vw' }} value={data.key} className={"".concat(isDark ? 'is-dark-300' : '', " p-1 key")} onChange={function (e) { return changeHandler(data.id, 'key', e.target.value); }}/>
      <input placeholder="Value" type="text" style={{ marginLeft: '20px', width: '30vw' }} value={data.value} className={"".concat(isDark ? 'is-dark-300' : '', " p-1 value")} onChange={function (e) { return changeHandler(data.id, 'value', e.target.value); }}/>
      <div className="is-flex is-justify-content-center is-align-items-center ml-4">
        <div className="delete m-auto" onClick={function () { return deleteItem(index); }}/>
      </div>
    </div>);
}
exports.default = ContentReqRowComposer;
// import React from 'react';
// import { useSelector } from 'react-redux';
// export default function ContentReqRowComposer({
//   data,
//   changeHandler,
//   index,
//   deleteItem,
//   type,
// }) {
//   const isDark = useSelector((store) => store.ui.isDark);
//   return (
//     <div className={`is-flex mt-1 ${type}`} id={`${type}${index}`}>
//       <div className={`include-data-checkbox ${isDark ? 'is-dark-200' : ''}`}>
//         <input
//           type="checkbox"
//           id={data.id}
//           className="is-checkradio is-black has-no-border"
//           checked={data.active}
//           onChange={(e) => changeHandler(data.id, 'active', e.target.checked)}
//         />
//         <label htmlFor={data.id} />
//       </div>
//       <input
//         onChange={(e) => changeHandler(data.id, 'key', e.target.value)}
//         placeholder="Key"
//         type="text"
//         style={{ marginLeft: '15px', width: '20vw' }}
//         value={data.key}
//         className={`${isDark ? 'is-dark-300' : ''} p-1 key`}
//       />
//       <input
//         onChange={(e) => changeHandler(data.id, 'value', e.target.value)}
//         placeholder="Value"
//         type="text"
//         style={{ marginLeft: '20px', width: '30vw' }}
//         value={data.value}
//         className={`${isDark ? 'is-dark-300' : ''} p-1 value`}
//       />
//       <div className="is-flex is-justify-content-center is-align-items-center ml-4">
//         <div className="delete m-auto" onClick={() => deleteItem(index)} />
//       </div>
//     </div>
//   );
// }
