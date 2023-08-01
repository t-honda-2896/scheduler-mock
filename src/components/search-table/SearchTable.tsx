import React, { useContext } from "react";
import styled from "styled-components";
import theme from "../../styles/Theme";
import { SearchBox } from "../input/SearchBox";
import { SAMPLE_CONSTRUCTION_SITES } from "../../constants/demo-data-constants";
import { format } from "date-fns";
import { Button } from "../button/Button";
import { Path } from "../../contexts/path-context";
import { PathNameEnum } from "../../enum/path-enum";

export interface Labels {
  [option: string]: string;
}

interface P {
  placeholder: string;
  tableHeaders: string[];
  onChange?(value: string): void;
}
export const SearchTable: React.FC<P> = React.memo((props) => {
  const { placeholder, tableHeaders } = props;
  const { linkTo } = useContext(Path);
  const tableData = SAMPLE_CONSTRUCTION_SITES.concat();
  tableData.shift();
  return (
    <Container>
      <SearchArea>
        <SearchFunctions>
          <SearchBox placeholder={placeholder} />
        </SearchFunctions>
      </SearchArea>
      <TableArea>
        {tableData && tableData.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                {tableHeaders.map((head, idx) => (
                  <Th key={`th${idx}`}>{head}</Th>
                ))}
                <Th>リンク</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData.map((row, idx) => (
                <Tr key={`row${idx}`}>
                  <Td>{row.name}</Td>
                  <Td>{row.companyName}</Td>
                  <Td>{row.address}</Td>
                  <Td>{format(row.startDate, "yyyy/MM/dd")}</Td>
                  <Td>{format(row.endDate, "yyyy/MM/dd")}</Td>
                  <Td>
                    <Button
                      text="出面表"
                      onClick={() => {
                        linkTo(PathNameEnum.SCHEDULE);
                      }}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </TableArea>
    </Container>
  );
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  gap: ${theme.spacing}px;
  * {
    overflow: visible;
  }
`;
const SearchArea = styled.div`
  display: flex;
  justify-content: space-between;
`;
const SearchFunctions = styled.div`
  display: flex;
  gap: ${theme.spacing * 2}px;
  overflow: visible;
`;
const TableArea = styled.div`
  flex: 1;
  width: 100%;
`;

const Table = styled.table`
  width: 100%;
`;
const Thead = styled.thead`
  border-bottom: 2px solid ${theme.border.gray};
`;
const Th = styled.th`
  font-weight: 400;
  font-size: 14px;
  color: ${theme.typography.fontColor.gray};
  padding: ${theme.spacing * 2}px ${theme.spacing * 3}px ${theme.spacing * 2}px
    ${theme.spacing}px;
`;
const Tbody = styled.tbody``;
const Tr = styled.tr`
  border-bottom: 1px solid ${theme.border.lightGray};
`;
const Td = styled.td`
  font-weight: 400;
  vertical-align: middle;
  font-size: ${theme.typography.fontSize.sixteen}px;
  color: ${theme.typography.fontColor.gray};
  padding: ${theme.spacing * 2}px ${theme.spacing * 3}px ${theme.spacing * 2}px
    ${theme.spacing}px;
`;
