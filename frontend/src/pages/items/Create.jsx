import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Grid } from '@mui/material';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress
} from '@mui/material';
import { createItem } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';

const categories = ['men', 'women', 'kids'];
const types = ['top', 'bottom', 'dress', 'outerwear', 'shoes', 'accessories'];
const conditions = ['new', 'like new', 'good', 'fair', 'poor'];

const CreateItem = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      category: '',
      type: '',
      size: '',
      condition: '',
      tags: '',
      pointsValue: 100
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Required'),
      description: Yup.string().required('Required'),
      category: Yup.string().required('Required'),
      type: Yup.string().required('Required'),
      size: Yup.string().required('Required'),
      condition: Yup.string().required('Required'),
      pointsValue: Yup.number().min(10, 'Minimum 10 points').required('Required')
    }),
    onSubmit: async (values) => {
      if (images.length === 0) {
        setError('Please upload at least one image');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        const formData = new FormData();
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('category', values.category);
        formData.append('type', values.type);
        formData.append('size', values.size);
        formData.append('condition', values.condition);
        formData.append('tags', values.tags);
        formData.append('pointsValue', values.pointsValue);
        images.forEach(image => {
          formData.append('images', image);
        });

        await createItem(formData);
        navigate('/dashboard');
      } catch (err) {
        setError(err.response?.data?.msg || 'Failed to create item');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  });

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom sx={{ mt: 4 }}>
        List a New Item
      </Typography>
      
      {error && (
        <Box sx={{ mb: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}
      
      <form onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Item Images
              </Typography>
              <input
                accept="image/*"
                style={{ display: 'none' }}
                id="raised-button-file"
                multiple
                type="file"
                onChange={handleImageChange}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" component="span" fullWidth>
                  Upload Images
                </Button>
              </label>
              {images.length > 0 && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {images.length} image(s) selected
                </Typography>
              )}
            </Box>
            
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              sx={{ mb: 3 }}
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category"
                value={formik.values.category}
                label="Category"
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="type-label">Type</InputLabel>
              <Select
                labelId="type-label"
                id="type"
                name="type"
                value={formik.values.type}
                label="Type"
                onChange={formik.handleChange}
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                {types.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              id="size"
              name="size"
              label="Size"
              value={formik.values.size}
              onChange={formik.handleChange}
              error={formik.touched.size && Boolean(formik.errors.size)}
              helperText={formik.touched.size && formik.errors.size}
              sx={{ mb: 3 }}
            />
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="condition-label">Condition</InputLabel>
              <Select
                labelId="condition-label"
                id="condition"
                name="condition"
                value={formik.values.condition}
                label="Condition"
                onChange={formik.handleChange}
                error={formik.touched.condition && Boolean(formik.errors.condition)}
              >
                {conditions.map((cond) => (
                  <MenuItem key={cond} value={cond}>
                    {cond}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              id="tags"
              name="tags"
              label="Tags (comma separated)"
              value={formik.values.tags}
              onChange={formik.handleChange}
              sx={{ mb: 3 }}
            />
            
            <TextField
              fullWidth
              id="pointsValue"
              name="pointsValue"
              label="Points Value"
              type="number"
              value={formik.values.pointsValue}
              onChange={formik.handleChange}
              error={formik.touched.pointsValue && Boolean(formik.errors.pointsValue)}
              helperText={formik.touched.pointsValue && formik.errors.pointsValue}
              sx={{ mb: 3 }}
            />
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Listing Item...
              </>
            ) : (
              'List Item'
            )}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default CreateItem;