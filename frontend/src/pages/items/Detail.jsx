import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Chip,
  Divider,
  Alert,
  CircularProgress
} from '@mui/material';
import { getItemById, requestSwap } from '../../services/itemService';
import { useAuth } from '../../context/AuthContext';

const ItemDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [swapLoading, setSwapLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('swap');

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await getItemById(id);
        setItem(data);
      } catch (err) {
        setError('Failed to fetch item details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchItem();
  }, [id]);

  const handleSwapRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    try {
      setSwapLoading(true);
      await requestSwap({
        requestedItemId: item._id,
        pointsOffered: selectedOption === 'points' ? item.pointsValue : 0
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to request swap');
      console.error(err);
    } finally {
      setSwapLoading(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!item) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">{error || 'Item not found'}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2,
            '& img': {
              width: '100%',
              borderRadius: 2,
              objectFit: 'cover'
            }
          }}>
            {item.images.map((img, index) => (
              <img 
                key={index} 
                src={`http://localhost:5000/${img}`} 
                alt={`${item.title} ${index + 1}`}
              />
            ))}
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Typography variant="h3" gutterBottom>{item.title}</Typography>
          <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
            <Chip label={item.category} color="primary" />
            <Chip label={item.type} />
            <Chip label={item.size} />
            <Chip label={`${item.pointsValue} points`} color="secondary" />
          </Box>
          
          <Typography variant="body1" paragraph>{item.description}</Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Condition</Typography>
          <Typography variant="body1" paragraph>{item.condition}</Typography>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>Owner</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            {item.owner.profilePhoto ? (
              <img 
                src={`http://localhost:5000/${item.owner.profilePhoto}`} 
                alt={item.owner.name}
                style={{ width: 50, height: 50, borderRadius: '50%' }}
              />
            ) : (
              <Box sx={{ 
                width: 50, 
                height: 50, 
                borderRadius: '50%', 
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {item.owner.name.charAt(0)}
              </Box>
            )}
            <Typography>{item.owner.name}</Typography>
          </Box>
          
          {item.owner._id !== user?.id && (
            <Paper elevation={3} sx={{ p: 3, mt: 4 }}>
              <Typography variant="h6" gutterBottom>Request This Item</Typography>
              
              <Box sx={{ mb: 3 }}>
                <Button
                  variant={selectedOption === 'swap' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedOption('swap')}
                  sx={{ mr: 2 }}
                >
                  Swap with My Item
                </Button>
                <Button
                  variant={selectedOption === 'points' ? 'contained' : 'outlined'}
                  onClick={() => setSelectedOption('points')}
                >
                  Redeem with Points
                </Button>
              </Box>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleSwapRequest}
                disabled={swapLoading}
              >
                {swapLoading ? (
                  <>
                    <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
                    Processing...
                  </>
                ) : (
                  selectedOption === 'swap' ? 'Request Swap' : `Redeem for ${item.pointsValue} Points`
                )}
              </Button>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default ItemDetail;