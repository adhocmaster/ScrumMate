import styled from '@xstyled/styled-components';

const grid = 8;
const borderRadius = 2;

// $ExpectError - not sure why
export default styled.h4`
  padding: ${grid}px;
  transition: background-color ease 0.2s;
  flex-grow: 1;
  user-select: none;
  position: relative;
  &:focus {
    outline: 2px solid #998dd9;
    outline-offset: 2px;
  }
`;
