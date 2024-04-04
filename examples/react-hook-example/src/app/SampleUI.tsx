import styled from 'styled-components';

export const Page = styled.div`
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
`;

export const Card = styled.div`
  width: fit-content;
  padding: 20px;
  margin: 20px 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const CardHeader = styled.div`
  font-size: 1.2em;
  font-weight: bold;
  margin-bottom: 10px;
  border-bottom: 1px solid #ddd;
`;

export const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.5em;
  color: #333;
`;

export const CardBody = styled.div`
  font-size: 1em;
  color: #333;
  line-height: 1.5;
  margin-bottom: 10px;
`;

export const Pre = styled.pre`
  padding: 10px;
  background-color: #f5f5f5;
  border-radius: 4px;
  overflow-x: auto;
`;
