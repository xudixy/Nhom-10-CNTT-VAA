import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';

const CategoryList = ({ categories, onEdit, onDelete }) => {
  const columns = [
    { field: 'name', headerName: 'Tên danh mục', width: 200 },
    { field: 'description', headerName: 'Mô tả', width: 300 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" onClick={() => onEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => onDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <DataGrid
      rows={categories}
      columns={columns}
      pageSize={5}
      rowsPerPageOptions={[5, 10, 25]}
      getRowId={(row) => row._id}
      autoHeight
    />
  );
};

export default CategoryList;