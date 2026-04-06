import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  TextField,
  Paper,
  Avatar
} from '@mui/material';
import { Add as AddIcon, Category as CategoryIcon } from '@mui/icons-material';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';
import { responseHandler, errorHandler } from '../utils/responseHandler';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', image: '' });

  const fetchCategories = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('categories');
      const data = responseHandler(res);
      setCategories(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setFetchLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingId(category.id);
      setFormData({ 
        name: category.name || '',
        image: category.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`category/${editingId}`, formData);
      } else {
        await api.post('category', formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (category) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`category/${category.id}`);
        fetchCategories();
      } catch (err) {
        alert(errorHandler(err));
      }
    }
  };

  const columns = [
    { 
      header: 'ID', 
      render: row => (
        <Typography variant="body2" sx={{ fontFamily: 'monospace', color: 'text.secondary', fontWeight: 700 }}>
          #{row.id}
        </Typography>
      ) 
    },
    { 
      header: 'Category', 
      render: row => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src={row.image} 
            variant="rounded" 
            sx={{ width: 44, height: 44, bgcolor: 'primary.light', borderRadius: '12px' }}
          >
            <CategoryIcon />
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
            {row.name}
          </Typography>
        </Stack>
      )
    },
    {
      header: 'Created At',
      render: row => (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {new Date(row.createdAt).toLocaleDateString()}
        </Typography>
      )
    }
  ];

  return (
    <PageWrapper>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Categories</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>Organize your products into logical sections.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: '12px', px: 4, py: 1.2 }}
        >
          Add Category
        </Button>
      </Box>

      {fetchLoading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing categories...</Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={categories} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
          keyExtractor={(item) => item.id}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Category' : 'Create Category'}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <Box sx={{ mt: 1 }}>
          <Typography variant="overline" sx={{ fontWeight: 900, color: 'primary.main', mb: 2 }}>
            CATEGORY REPRESENTATION
          </Typography>
          <Stack spacing={3}>
            <TextField
              fullWidth
              label="Display Name"
              required
              placeholder="e.g. Vegetables & Fruits"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Web Asset URL (Image)"
              placeholder="https://..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </Stack>
        </Box>
      </FormModal>
    </PageWrapper>
  );
}
