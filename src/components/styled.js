import styled from 'styled-components';
import { Pagination } from 'antd';

export const Wrapper = styled.section`
  padding: 50px;
  @media only screen and (min-width: 768px) {
    padding-top: 70px;
  }
`;

export const StyledPagination = styled(Pagination) `
  margin-top: 20px;
`;