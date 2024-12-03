import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

const ProductList = ({ products, onEdit, onDelete }) => {
  const columns = [
    { 
      field: 'imageUrl', 
      headerName: 'Hình ảnh', 
      width: 130,
      renderCell: (params) => (
        <img
          src={params.value}
          alt="product"
          style={{ width: 50, height: 50, objectFit: 'cover' }}
        />
      )
    },
    { field: 'name', headerName: 'Tên sản phẩm', width: 200 },
    { 
      field: 'price', 
      headerName: 'Giá', 
      width: 150,
      renderCell: (params) => {
        const price = params.row.price || 0;
        return new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(price);
      }
    },
    { field: 'categoryName', headerName: 'Danh mục', width: 130 },
    { field: 'sizeDisplay', headerName: 'Kích cỡ', width: 130 },
    {
      field: 'actions',
      headerName: 'Thao tác',
      width: 130,
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
      rows={products}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[5, 10, 25]}
      getRowId={(row) => row._id}
      autoHeight
      disableSelectionOnClick
      loading={products.length === 0}
    />
  );
};

export default ProductList;