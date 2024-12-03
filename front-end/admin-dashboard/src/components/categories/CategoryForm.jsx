import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField
  } from '@mui/material';
  
  const CategoryForm = ({ open, onClose, formData, setFormData, onSubmit, editId }) => {
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>
          {editId ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên danh mục"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
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
  
  export default CategoryForm;