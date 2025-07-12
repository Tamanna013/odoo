import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  CircularProgress,
  Button
} from '@mui/material';
import SwapCard from '../components/SwapCard';
import { getSwaps } from '../services/swapService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const data = await getSwaps();
        setSwaps(data);
      } catch (err) {
        console.error('Failed to fetch swaps:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSwaps();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredSwaps = swaps.filter(swap => {
    if (tabValue === 0) return swap.status === 'pending';
    if (tabValue === 1) return swap.status === 'accepted';
    return swap.status === 'completed' || swap.status === 'rejected';
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>My Dashboard</Typography>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography variant="h6">
          Points Balance: <strong>{user?.points || 0}</strong>
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          href="/items/create"
        >
          List New Item
        </Button>
      </Box>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 4 }}
      >
        <Tab label="Pending" />
        <Tab label="Accepted" />
        <Tab label="History" />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredSwaps.length > 0 ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredSwaps.map(swap => (
            <SwapCard 
              key={swap._id} 
              swap={swap} 
              currentUserId={user?.id} 
            />
          ))}
        </Box>
      ) : (
        <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
          No swaps found in this category.
        </Typography>
      )}
    </Container>
  );
};

export default Dashboard;