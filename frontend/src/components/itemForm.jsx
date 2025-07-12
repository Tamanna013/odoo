// src/components/ItemForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, Box } from '@mui/material';
import api from '../services/api';

const ItemForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    condition: '',
    price: '',
    images: []
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({...formData, images: files});
    
    // Create preview URLs
    const previews = files.map(file => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('condition', formData.condition);
      formDataToSend.append('price', formData.price);
      
      formData.images.forEach(image => {
        formDataToSend.append('images', image);
      });

      const response = await api.post('/items', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      navigate(`/items/${response.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list item');
      console.error('Listing error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <TextField
        fullWidth
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        required
        sx={{ mb: 2 }}
      />
      
      <TextField
        fullWidth
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        multiline
        rows={4}
        required
        sx={{ mb: 2 }}
      />
      
      <Select
        fullWidth
        name="category"
        value={formData.category}
        onChange={handleChange}
        displayEmpty
        required
        sx={{ mb: 2 }}
      >
        <MenuItem value="" disabled>Select Category</MenuItem>
        <MenuItem value="electronics">Electronics</MenuItem>
        <MenuItem value="clothing">Clothing</MenuItem>
        <MenuItem value="furniture">Furniture</MenuItem>
      </Select>
      
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id="raised-button-file"
        multiple
        type="file"
        onChange={handleImageChange}
      />
      <label htmlFor="raised-button-file">
        <Button variant="contained" component="span" sx={{ mb: 2 }}>
          Upload Images
        </Button>
      </label>
      
      {previewImages.length > 0 && (
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {previewImages.map((src, index) => (
            <img 
              key={index} 
              src={src} 
              alt={`Preview ${index}`}
              style={{ height: 100, borderRadius: 4 }}
            />
          ))}
        </Box>
      )}
      
      {error && <Box color="error.main" sx={{ mb: 2 }}>{error}</Box>}
      
      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? 'Listing Item...' : 'List Item'}
      </Button>
    </Box>
  );
};

export default ItemForm;