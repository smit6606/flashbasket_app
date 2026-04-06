import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Stack, 
  TextField,
  Avatar,
  Chip
} from '@mui/material';
import { Add as AddIcon, Category as SubIcon } from '@mui/icons-material';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import SelectDropdown from '../components/SelectDropdown';
import api from '../services/api';
import PageWrapper from '../components/PageWrapper';
import { responseHandler, errorHandler } from '../utils/responseHandler';

export default function Subcategories() {
  const [subcategories, setSubcategories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [formData, setFormData] = useState({ name: '', categoryId: '', image: '' });

  const fetchSubcategories = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('subcategories');
      const data = responseHandler(res);
      setSubcategories(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    } finally {
      setFetchLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get('categories');
      const data = responseHandler(res);
      setCategories(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    }
  };

  useEffect(() => {
    fetchSubcategories();
    fetchCategories();
  }, []);

  const handleOpenModal = (subcategory = null) => {
    if (subcategory) {
      setEditingId(subcategory.id);
      setFormData({ 
        name: subcategory.name || '',
        categoryId: subcategory.categoryId || '',
        image: subcategory.image || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', categoryId: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId)
      };

      if (editingId) {
        await api.put(`subcategory/${editingId}`, submitData);
      } else {
        await api.post('subcategory', submitData);
      }
      setIsModalOpen(false);
      fetchSubcategories();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (subcategory) => {
    if (window.confirm('Are you sure you want to delete this subcategory?')) {
      try {
        await api.delete(`subcategory/${subcategory.id}`);
        fetchSubcategories();
      } catch (err) {
        alert(errorHandler(err));
      }
    }
  };

  const columns = [
    { 
      header: 'Subcategory', 
      render: row => (
        <Stack direction="row" spacing={2} alignItems="center">
          <Avatar 
            src={row.image} 
            variant="rounded" 
            sx={{ width: 44, height: 44, bgcolor: 'secondary.light', borderRadius: '12px' }}
          >
            <SubIcon />
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              ID: #{row.id}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { 
      header: 'Parent Category', 
      render: row => (
        <Chip 
          label={row.category?.name || 'Unlinked'} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            bgcolor: 'primary.light', 
            color: 'primary.main',
            borderRadius: '8px'
          }} 
        />
      )
    },
    {
      header: 'Last Update',
      render: row => (
        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          {new Date(row.updatedAt).toLocaleDateString()}
        </Typography>
      )
    }
  ];

  return (
    <PageWrapper>
      <Box sx={{ mb: 5, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1px' }}>Subcategories</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 600 }}>Refine and granularize your product organization.</Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
          sx={{ borderRadius: '12px', px: 4, py: 1.2 }}
        >
          Add Subcategory
        </Button>
      </Box>

      {fetchLoading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing... </Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={subcategories} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
          keyExtractor={(item) => item.id}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Modify Subcategory' : 'New Subcategory'}
        onSubmit={handleSubmit}
        loading={loading}
      >
        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
          <SelectDropdown
            label="Parent Category"
            required
            options={categories.map(c => ({ label: c.name, value: c.id }))}
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
          />
          <TextField
            fullWidth
            label="Image URL"
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
          />
        </Stack>
      </FormModal>
    </PageWrapper>
  );
}
