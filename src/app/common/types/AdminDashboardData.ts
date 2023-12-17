export default interface AdminDashboardData {
  description?: string;
  // An array of column configurations
  columns: {
    title: string;
    dataKey: string;
    sortable?: boolean;
    render?: (dataItem: any) => JSX.Element;
  }[];
  // An array of data objects, where each object represents a row in the table
  data: {
    [key: string]: any;
  }[];
  actionButton?: JSX.Element;
}