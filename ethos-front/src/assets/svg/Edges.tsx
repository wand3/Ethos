import React from 'react';

interface EdgesProps {
  className?: string;
}

const Edges: React.FC<EdgesProps> = ({ className }) => {
  const defaultClassName = 'small-corner is-top-left w-embed animate-ping duration-300';
  const appliedClassName = className || defaultClassName;

  return (
    <>
      <div className={appliedClassName}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
          <path d="M3.10795 23.5L1.02687 23.5C0.410659 23.5 -0.000150645 23.099 -0.000150593 22.4975L-0.000147359 7.31825C-0.000147306 6.71675 0.359311 6.2155 0.975526 6.06512L4.15931 5.21299C4.77552 5.06261 5.23768 4.61149 5.39174 4.00998L6.26471 0.95234C6.41876 0.350836 6.93227 -4.15027e-05 7.54849 -4.14488e-05L22.473 -4.01441e-05C23.0892 -4.00902e-05 23.5 0.400963 23.5 1.00247L23.5 2.95986C23.5 3.56136 23.0892 3.96236 22.473 3.96236L7.49714 3.96236C6.21335 3.96236 4.13498 6.015 4.13498 7.26813L4.13497 22.4975C4.13497 23.099 3.72417 23.5 3.10795 23.5Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className={className || 'small-corner is-top-right w-embed'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 17 16" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
          <path d="M0.499998 2.11601L0.499998 0.699102C0.499998 0.27955 0.77302 -0.000151121 1.18256 -0.000151139L11.5174 -0.000150292C11.9269 -0.00015031 12.2682 0.244588 12.3706 0.66414L12.9508 2.83183C13.0531 3.25138 13.3603 3.56604 13.7698 3.67093L15.8516 4.26529C16.2612 4.37018 16.5001 4.71981 16.5001 5.13936L16.5001 15.3007C16.5001 15.7203 16.2271 16 15.8175 16L14.4848 16C14.0753 16 13.8023 15.7203 13.8023 15.3007L13.8023 5.1044C13.8023 4.23033 12.4047 2.81526 11.5515 2.81526L1.18256 2.81526C0.77302 2.81526 0.499998 2.53556 0.499998 2.11601Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className={className || 'small-corner is-bottom-left w-embed'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 17" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
          <path d="M2.11601 0.5L0.699102 0.5C0.27955 0.5 -0.000151086 0.773022 -0.00015105 1.18256L-0.000148848 11.5174C-0.000148812 11.9269 0.244589 12.2682 0.664142 12.3706L2.83183 12.9508C3.25138 13.0532 3.56604 13.3603 3.67093 13.7698L4.2653 15.8516C4.37018 16.2612 4.71981 16.5001 5.13936 16.5001L15.3007 16.5001C15.7203 16.5001 16 16.2271 16 15.8175L16 14.4848C16 14.0753 15.7203 13.8023 15.3007 13.8023L5.1044 13.8023C4.23033 13.8023 2.81526 12.4047 2.81526 11.5515L2.81526 1.18256C2.81526 0.773022 2.53556 0.5 2.11601 0.5Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className={className || 'small-corner is-bottom-right w-embed animate-ping duration-300'}>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 16 16" fill="none" preserveAspectRatio="xMidYMid meet" aria-hidden="true" role="img">
          <path d="M-1.91477e-06 13.8839L-2.00646e-06 15.3008C-2.0248e-06 15.7204 0.273019 16.0001 0.682554 16.0001L11.0173 16.0001C11.4269 16.0001 11.7682 15.7553 11.8705 15.3358L12.4507 13.1681C12.5531 12.7486 12.8602 12.4339 13.2698 12.329L15.3516 11.7347C15.7611 11.6298 16 11.2801 16 10.8606L16 0.699252C16 0.279701 15.727 6.87448e-07 15.3174 6.69547e-07L13.9848 5.81532e-07C13.5752 5.63631e-07 13.3022 0.279701 13.3022 0.699252L13.3022 10.8956C13.3022 11.7696 11.9047 13.1847 11.0515 13.1847L0.682554 13.1847C0.273019 13.1847 -1.89643e-06 13.4644 -1.91477e-06 13.8839Z" fill="currentColor"></path>
        </svg>
      </div>
    </>
  );
};

export default Edges;
