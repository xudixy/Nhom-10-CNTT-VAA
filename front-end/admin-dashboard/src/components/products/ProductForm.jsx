import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid
} from '@mui/material';

const ProductForm = ({ 
  open, 
  onClose, 
  formData, 
  setFormData, 
  onSubmit, 
  categories, 
  editId,
  handleFileChange 
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {editId ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Mô tả"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              fullWidth
              type="number"
              label="Giá"
              value={formData.price || ''}
              onChange={(e) => {
                const value = e.target.value ? parseInt(e.target.value) : '';
                setFormData({ ...formData, price: value });
              }}
              InputProps={{
                inputProps: { min: 0 }
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Danh mục</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                label="Danh mục"
              >
                {categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Kích cỡ</InputLabel>
              <Select
                multiple
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                label="Kích cỡ"
              >
                {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              accept="image/*"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={onSubmit} variant="contained">
          {editId ? 'Cập nhật' : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductForm;