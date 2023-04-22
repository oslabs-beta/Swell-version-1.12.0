/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import { useSelector } from 'react-redux';

export default function ContentReqRowComposer({
  data,
  changeHandler,
  index,
  deleteItem,
  type,
}) {
  const isDark = useSelector((store) => store.ui.isDark);

  return (
    <div className={`is-flex mt-1 ${type}`} id={`${type}${index}`}>
      <div className={`include-data-checkbox ${isDark ? 'is-dark-200' : ''}`}>
        <input
          type="checkbox"
          id={data.id}
          className="is-checkradio is-black has-no-border"
          checked={data.active}
          onChange={(e) => changeHandler(data.id, 'active', e.target.checked)}
        />
        <label htmlFor={data.id} />
      </div>
      <input
        onChange={(e) => changeHandler(data.id, 'key', e.target.value)}
        placeholder="Key"
        type="text"
        style={{ marginLeft: '15px', width: '20vw' }}
        value={data.key}
        className={`${isDark ? 'is-dark-300' : ''} p-1 key`}
      />
      <input
        onChange={(e) => changeHandler(data.id, 'value', e.target.value)}
        placeholder="Value"
        type="text"
        style={{ marginLeft: '20px', width: '30vw' }}
        value={data.value}
        className={`${isDark ? 'is-dark-300' : ''} p-1 value`}
      />
      <div className="is-flex is-justify-content-center is-align-items-center ml-4">
        <div className="delete m-auto" onClick={() => deleteItem(index)} />
      </div>
    </div>
  );
}
