import * as React from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { SearchTable } from "../../components/search-table/SearchTable";

const Proposition: React.FC = React.memo(() => {
  return (
    <Container>
      <Header>
        <Title>案件情報</Title>
      </Header>
      <Content>
        <SearchTable
          placeholder="案件名・電話番号・代表者名で検索"
          tableHeaders={["案件名", "企業名", "住所", "開始日", "終了日"]}
        />
      </Content>
    </Container>
  );
});

const Container = styled.div`
  max-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing * 2}px;
  padding: ${theme.spacing * 3}px ${theme.spacing * 4}px;
`;
const Header = styled.div`
  display: flex;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: ${theme.spacing * 2}px 0;
`;
const Title = styled.div`
  font-size: ${theme.typography.fontSize.twenty}px;
`;
export default Proposition;
