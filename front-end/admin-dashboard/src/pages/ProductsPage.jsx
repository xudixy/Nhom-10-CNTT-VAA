import { useState, useEffect } from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Typography, Alert, Snackbar } from '@mui/material';
import axios from 'axios';
import ProductForm from '../components/products/ProductForm';
import ProductList from '../components/products/ProductList';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    size: [],
    categoryId: '',
    images: []
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const processProducts = (products) => {
    return products.map(product => {
      const processedProduct = {
        _id: product._id,
        name: product.name,
        description: product.description,
        price: Number(product.price),
        categoryName: product.categoryId?.name || 'Chưa phân loại',
        sizeDisplay: (product.size || []).join(', '),
        imageUrl: product.images?.[0]?.url 
          ? `http://localhost:5000${product.images[0].url}`
          : 'https://via.placeholder.com/50',
        size: product.size,
        categoryId: product.categoryId,
        images: product.images
      };
      return processedProduct;
    });
  };

  const fetchProducts = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      };
      const response = await axios.get('http://localhost:5000/api/products', { headers });
      const processedProducts = processProducts(response.data);
      setProducts(processedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Không thể tải danh sách sản phẩm');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        };

        const [productsRes, categoriesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products', { headers }),
          axios.get('http://localhost:5000/api/categories', { headers })
        ]);
        const processedProducts = processProducts(productsRes.data);
        setProducts(processedProducts);
        setCategories(categoriesRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Không thể tải dữ liệu');
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      setError('');
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('categoryId', formData.categoryId);
      
      // Xử lý size array
      if (Array.isArray(formData.size)) {
        formData.size.forEach(size => {
          formDataToSend.append('size', size);
        });
      }

      // Xử lý images
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          formDataToSend.append('images', file);
        });
      }

      // Thêm keepExistingImages nếu cần
      formDataToSend.append('keepExistingImages', 'true');

      const token = localStorage.getItem('token');
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }

      // Log để debug
      console.log('Form Data Contents:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0], pair[1]);
      }

      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data'
        }
      };

      try {
        let response;
        if (editId) {
          console.log('Sending PUT request to:', `http://localhost:5000/api/products/${editId}`);
          response = await axios.put(
            `http://localhost:5000/api/products/${editId}`,
            formDataToSend,
            axiosConfig
          );
        } else {
          response = await axios.post(
            'http://localhost:5000/api/products',
            formDataToSend,
            axiosConfig
          );
        }

        console.log('API Response:', response.data);
        await fetchProducts();
        handleClose();
        setSnackbar({ open: true, message: 'Sản phẩm đã được lưu thành công', severity: 'success' });
      } catch (error) {
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });

        setError(error.response?.data?.message || 'Có lỗi xảy ra khi lưu sản phẩm');
        setSnackbar({ open: true, message: 'Có lỗi xảy ra khi lưu sản phẩm', severity: 'error' });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setError('Có lỗi xảy ra khi lưu sản phẩm');
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: parseInt(product.price) || '',
      size: product.size || [],
      categoryId: typeof product.categoryId === 'object' 
        ? product.categoryId?._id 
        : product.categoryId || '',
      images: product.images || []
    });
    setEditId(product._id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        };
        await axios.delete(`http://localhost:5000/api/products/${id}`, { headers });
        await fetchProducts(); // Refresh product list
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Không thể xóa sản phẩm');
      }
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      name: '',
      description: '',
      price: '',
      size: [],
      categoryId: '',
      images: []
    });
    setSelectedFiles([]);
    setEditId(null);
    setError('');
  };

  const handleFileChange = (event) => {
    setSelectedFiles(Array.from(event.target.files));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Quản lý sản phẩm</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>
          <AddIcon /> Thêm sản phẩm
        </Button>
      </Box>

      <ProductList 
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductForm
        open={open}
        onClose={handleClose}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        categories={categories}
        editId={editId}
        handleFileChange={handleFileChange}
      />

      <Snackbar 
        open={!!error || snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
      >
        <Alert severity={snackbar.severity || 'error'} onClose={() => setError('')}>
          {error || snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ProductsPage;