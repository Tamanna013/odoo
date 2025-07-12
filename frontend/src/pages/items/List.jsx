import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Typography,
  Button,
  Box
} from '@mui/material';
import ItemCard from '../../components/ItemCard';
import { getItems } from '../../services/itemService';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await getItems({ search: searchTerm, category, type });
        setItems(data || []);
      } catch (err) {
        console.error('Failed to fetch items:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItems();
  }, [searchTerm, category, type]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4">Browse Items</Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/items/create"
        >
          List an Item
        </Button>
      </Box>
      
      <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Items"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            label="Category"
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="men">Men</MenuItem>
            <MenuItem value="women">Women</MenuItem>
            <MenuItem value="kids">Kids</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="top">Top</MenuItem>
            <MenuItem value="bottom">Bottom</MenuItem>
            <MenuItem value="dress">Dress</MenuItem>
            <MenuItem value="outerwear">Outerwear</MenuItem>
            <MenuItem value="shoes">Shoes</MenuItem>
            <MenuItem value="accessories">Accessories</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Grid container spacing={4}>
        {items.length > 0 ? (
          items.map((item) => (
            <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
              <ItemCard item={item} />
            </Grid>
          ))
        ) : (
          <Typography variant="h6" sx={{ width: '100%', textAlign: 'center', mt: 4 }}>
            No items found. Try adjusting your search filters.
          </Typography>
        )}
      </Grid>
    </Container>
  );
};

export default ItemList;