import DataTable from '../admin/DataTable';
import { mockCategories } from '@/lib/mockData';

export default function DataTableExample() {
  return (
    <DataTable
      data={mockCategories}
      columns={[
        { key: 'name', header: 'Name' },
        { key: 'nameEs', header: 'Spanish' },
        { key: 'nameFr', header: 'French' },
        { key: 'order', header: 'Order' },
      ]}
      onEdit={(item) => console.log('Edit:', item)}
      onDelete={(item) => console.log('Delete:', item)}
      testIdPrefix="category"
    />
  );
}
