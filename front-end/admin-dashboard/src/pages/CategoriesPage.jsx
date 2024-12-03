// src/pages/CategoriesPage.jsx
import { useState, useEffect } from 'react';
import { Box, Button, Snackbar, Alert } from '@mui/material';
import axios from 'axios';
import CategoryForm from '../components/categories/CategoryForm';
import CategoryList from '../components/categories/CategoryList';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Không thể tải danh sách danh mục');
      setSnackbar({ 
        open: true, 
        message: 'Không thể tải danh sách danh mục', 
        severity: 'error' 
      });
    }
  };

  const handleSubmit = async () => {
    try {
      setError('');
      
      // Validate required fields
      if (!formData.name) {
        setError('Vui lòng nhập tên danh mục');
        setSnackbar({ 
          open: true, 
          message: 'Vui lòng nhập tên danh mục', 
          severity: 'error' 
        });
        return;
      }

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      const config = {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/categories/${editId}`, 
          formData,
          config
        );
        setSnackbar({ 
          open: true, 
          message: 'Cập nhật danh mục thành công', 
          severity: 'success' 
        });
      } else {
        await axios.post(
          'http://localhost:5000/api/categories', 
          formData,
          config
        );
        setSnackbar({ 
          open: true, 
          message: 'Thêm danh mục thành công', 
          severity: 'success' 
        });
      }
      
      fetchCategories();
      handleClose();
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi lưu danh mục';
      setError(errorMessage);
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    }
  };

  const handleEdit = (category) => {
    setFormData({ 
      name: category.name, 
      description: category.description 
    });
    setEditId(category._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
          return;
        }

        await axios.delete(`http://localhost:5000/api/categories/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setSnackbar({ 
          open: true, 
          message: 'Xóa danh mục thành công', 
          severity: 'success' 
        });
        fetchCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra khi xóa danh mục';
        setError(errorMessage);
        setSnackbar({ 
          open: true, 
          message: errorMessage, 
          severity: 'error' 
        });
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ name: '', description: '' });
    setEditId(null);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
    setError('');
  };

  return (
    <Box>
      <Button 
        variant="contained" 
        onClick={() => setOpen(true)}
        sx={{ mb: 2 }}
      >
        Thêm danh mục
      </Button>

      <CategoryList
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CategoryForm
        open={open}
        onClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        editId={editId}
      />

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleSnackbarClose}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
        >
          {snackbar.message || error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CategoriesPage;