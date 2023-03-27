import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Character } from '../../games/game';

interface DataType extends Character {}

const columns: ColumnsType<DataType> = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '势力',
    dataIndex: 'faction',
    key: 'faction',
  },
  {
    title: '所在城市',
    dataIndex: 'city',
    key: 'city',
  },
  {
    title: '智力',
    dataIndex: 'intelligence',
    key: 'intelligence',
  },
  {
    title: '武力',
    dataIndex: 'power',
    key: 'power',
  },
];

interface CharacterTableProps {
  data: Character[];
  selectCharacter: (character: Character) => void;
}

const CharacterTable = ({ data, selectCharacter }: CharacterTableProps) => {
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   'selectedRows: ',
      //   selectedRows
      // );
      selectCharacter(selectedRows[0]);
    },
    getCheckboxProps: (record: DataType) => ({
      name: record.name,
    }),
  };

  return (
    <Table
      dataSource={data}
      columns={columns}
      rowKey="name"
      pagination={false}
      rowSelection={{
        type: 'radio',
        ...rowSelection,
      }}
    />
  );
};

export default CharacterTable;
