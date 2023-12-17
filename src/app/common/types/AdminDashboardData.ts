// Identify the data type for the AdminDashboardData component when using it in other components
interface AdminDashboardData<T> {
  // An array of column configurations
  columns: {
    title: string;
    dataKey: keyof T;
    sortable?: boolean;
    render?: (dataItem: any) => JSX.Element;
  }[];
  // An array of data objects, where each object represents a row in the table
  data: T[];
  actionButton?: JSX.Element;
}

export default AdminDashboardData;
