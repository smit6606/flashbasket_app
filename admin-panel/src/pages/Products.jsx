import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Chip, 
  Avatar, 
  Stack, 
  TextField,
  InputAdornment,
  Grid,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  AddOutlined as AddIcon, 
  SearchOutlined as SearchIcon,
  Inventory2Outlined as ProductIcon
} from '@mui/icons-material';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';
import SelectDropdown from '../components/SelectDropdown';
import PageWrapper from '../components/PageWrapper';
import api from '../services/api';
import { responseHandler, errorHandler } from '../utils/responseHandler';


export default function Products() {
  const theme = useTheme();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    categoryId: '',
    subcategoryId: '',
    stock: '',
    discount: '',
    image: '',
    description: '',
    weight: ''
  });

  const fetchProducts = async () => {
    try {
      setFetchLoading(true);
      const res = await api.get('products');
      const data = responseHandler(res);
      // Backend productService.getProducts returns { data: rows, total, ... }
      // responseHandler(res) returns res.data
      // So res.data.data is { data: rows, total, ... }
      setProducts(data.data?.data || data.data || []);
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

  const fetchSubcategories = async () => {
    try {
      const res = await api.get('subcategories');
      const data = responseHandler(res);
      setSubcategories(data.data || []);
    } catch (err) {
      console.error(errorHandler(err));
    }
  };

  useEffect(() => {
    document.title = "Inventory | FlashBasket Admin";
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, []);

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({
        name: product.name || '',
        price: product.price || '',
        categoryId: product.categoryId || '',
        subcategoryId: product.subcategoryId || '',
        stock: product.stock || '',
        discount: product.discount || '',
        image: product.image || '',
        description: product.description || '',
        weight: product.weight || ''
      });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', categoryId: '', subcategoryId: '', stock: '', discount: '', image: '', description: '', weight: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Ensure IDs are numbers for the backend
      const submitData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        subcategoryId: formData.subcategoryId ? parseInt(formData.subcategoryId) : null,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        discount: formData.discount ? parseInt(formData.discount) : 0,
      };

      if (editingId) {
        await api.put(`product/${editingId}`, submitData);
      } else {
        await api.post('product', submitData);
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      alert(errorHandler(err));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`product/${product.id}`);
        fetchProducts();
      } catch (err) {
        alert(errorHandler(err));
      }
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    { 
      header: 'Product', 
      render: (row) => (
        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar 
            src={row.image} 
            variant="rounded" 
            sx={{ 
              width: 50, 
              height: 50, 
              bgcolor: '#f8fafc', 
              borderRadius: '12px',
              border: '1px solid rgba(0,0,0,0.05)',
            }}
          >
            <ProductIcon sx={{ color: '#94a3b8' }} />
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800, color: 'text.primary' }}>{row.name}</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 700 }}>
              {row.weight || 'N/A'}
            </Typography>
          </Box>
        </Stack>
      )
    },
    { 
      header: 'Category', 
      render: (row) => (
        <Chip 
          label={row.category?.name || 'Unassigned'} 
          size="small" 
          sx={{ 
            fontWeight: 800, 
            bgcolor: alpha(theme.palette.secondary.main, 0.08), 
            color: 'secondary.main',
            borderRadius: '8px'
          }} 
        />
      )
    },
    { 
      header: 'Price', 
      render: (row) => (
        <Typography variant="subtitle2" sx={{ fontWeight: 900, color: 'primary.main' }}>
          ₹{Number(row.price).toLocaleString()}
        </Typography>
      )
    },
    { 
      header: 'Stock', 
      render: (row) => (
        <Box sx={{ 
          px: 1, 
          py: 0.5, 
          borderRadius: '6px', 
          bgcolor: row.stock > 10 ? alpha(theme.palette.success.main, 0.1) : alpha(theme.palette.error.main, 0.1),
          color: row.stock > 10 ? 'success.main' : 'error.main',
          fontSize: '0.7rem',
          fontWeight: 900,
          display: 'inline-block'
        }}>
          {row.stock} UNITS
        </Box>
      )
    },
    { 
      header: 'Offer', 
      render: (row) => (row.discount > 0 ? (
        <Chip 
          label={`${row.discount}% OFF`} 
          size="small" 
          sx={{ bgcolor: alpha(theme.palette.warning.main, 0.1), color: 'warning.main', fontWeight: 900, borderRadius: '6px' }} 
        />
      ) : (
        <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary' }}>Standard</Typography>
      ))
    },
  ];

  const availableSubcategories = subcategories.filter(s => s.categoryId === parseInt(formData.categoryId));

  return (
    <PageWrapper>
      <Box sx={{ mb: 6, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, gap: 3 }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, letterSpacing: '-1.5px' }}>
            Inventory Management
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Manage your products, stock and pricing.</Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <TextField
            placeholder="Search products..."
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ borderRadius: '12px', px: 3 }}
          >
            Add Product
          </Button>
        </Stack>
      </Box>

      {fetchLoading ? (
        <Box sx={{ p: 10, textAlign: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 600 }}>Syncing data...</Typography>
        </Box>
      ) : (
        <DataTable 
          columns={columns} 
          data={filteredProducts} 
          onEdit={handleOpenModal} 
          onDelete={handleDelete} 
          keyExtractor={(item) => item.id}
        />
      )}

      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingId ? 'Edit Product' : 'Add New Product'}
        onSubmit={handleSubmit}
        loading={loading}
        submitText={editingId ? 'Update Listing' : 'Publish Product'}
      >
        <Box sx={{ mt: 2 }}>
          {/* Section 1: Basic Information */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, color: 'primary.main', opacity: 0.8 }}>
             BASIC INFORMATION
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Product Name"
                placeholder="e.g. Organic Bananas"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Weight/Unit"
                placeholder="e.g. 1kg or 500g"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Section 2: Pricing & Inventory */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 4, mb: 2, color: 'primary.main', opacity: 0.8 }}>
             PRICING & STOCK
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price (₹)"
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Discount (%)"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                InputProps={{ endAdornment: <InputAdornment position="start">%</InputAdornment> }}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Stock Level"
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              />
            </Grid>
          </Grid>

          {/* Section 3: Organization */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 4, mb: 2, color: 'primary.main', opacity: 0.8 }}>
             ORGANIZATION
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <SelectDropdown
                label="Category"
                required
                options={categories.map(c => ({ label: c.name, value: c.id }))}
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value, subcategoryId: '' })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <SelectDropdown
                label="Subcategory"
                options={availableSubcategories.map(s => ({ label: s.name, value: s.id }))}
                value={formData.subcategoryId}
                onChange={(e) => setFormData({ ...formData, subcategoryId: e.target.value })}
                disabled={!formData.categoryId}
              />
            </Grid>
          </Grid>

          {/* Section 4: Visuals */}
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mt: 4, mb: 2, color: 'primary.main', opacity: 0.8 }}>
             VISUALS & CONTENT
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={formData.image ? 8 : 12}>
              <TextField
                fullWidth
                label="Image URL or Base64"
                placeholder="https://... or data:image/..."
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                multiline={formData.image?.length > 100}
                maxRows={4}
              />
            </Grid>
            {formData.image && (
              <Grid item xs={12} sm={4}>
                <Box sx={{ 
                  width: '100%', 
                  height: 120, 
                  borderRadius: '16px', 
                  border: '2px solid rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  bgcolor: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <img src={formData.image} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                placeholder="Describe your product highlights..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>
      </FormModal>
    </PageWrapper>
  );
}
