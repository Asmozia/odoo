import styled from 'styled-components';

/* eslint-disable-next-line */
export interface ReactOdooProps {}

const StyledReactOdoo = styled.div`
  color: pink;
`;

export function ReactOdoo(props: ReactOdooProps) {
  return (
    <StyledReactOdoo>
      <h1>Welcome to ReactOdoo!</h1>
    </StyledReactOdoo>
  );
}

export default ReactOdoo;
