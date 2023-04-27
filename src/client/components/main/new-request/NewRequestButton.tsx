import React from 'react';

interface Props {
  onClick: () => void;
}

const NewRequestButton: React.FC<Props> = ({ onClick }) => (
  <button
    className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
    onClick={onClick}
    type="button"
    style={{ margin: '10px' }}
  >
    Add to Workspace
  </button>
);

export default NewRequestButton;


// import React from 'react';

// const NewRequestButton = ({ onClick }) => (
//   <button
//     className="button is-normal is-primary-100 add-request-button is-vertical-align-center is-justify-content-center no-border-please"
//     onClick={onClick}
//     type="button"
//     style={{margin: '10px'}}
//   >
//     Add to Workspace
//   </button>
// );

// export default NewRequestButton;
