import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Tabs, 
  Tab, 
  Box, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Button,
  CircularProgress
} from '@mui/material';
import { getUsers, getItems, getSwaps } from '../services/adminService';
import { useAuth } from '../context/AuthContext';

const Admin = () => {
  const [tabValue, setTabValue] = useState(0);
  const [users, setUsers] = useState([]);
  const [items, setItems] = useState([]);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (!user?.isAdmin) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        if (tabValue === 0) {
          const data = await getUsers();
          setUsers(data);
        } else if (tabValue === 1) {
          const data = await getItems();
          setItems(data);
        } else {
          const data = await getSwaps();
          setSwaps(data);
        }
      } catch (err) {
        console.error('Failed to fetch admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [tabValue, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (!user?.isAdmin) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          You must be an administrator to view this page.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Admin Dashboard</Typography>
      
      <Tabs 
        value={tabValue} 
        onChange={handleTabChange} 
        sx={{ mb: 4 }}
      >
        <Tab label="Users" />
        <Tab label="Items" />
        <Tab label="Swaps" />
      </Tabs>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {tabValue === 0 && (
                  <>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                )}
                {tabValue === 1 && (
                  <>
                    <TableCell>Title</TableCell>
                    <TableCell>Owner</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                )}
                {tabValue === 2 && (
                  <>
                    <TableCell>Requester</TableCell>
                    <TableCell>Recipient</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {tabValue === 0 && users.map(user => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.points}</TableCell>
                  <TableCell>
                    <Button size="small" color="error">Ban</Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {tabValue === 1 && items.map(item => (
                <TableRow key={item._id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.owner.name}</TableCell>
                  <TableCell>{item.status}</TableCell>
                  <TableCell>
                    <Button size="small" color="error">Remove</Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {tabValue === 2 && swaps.map(swap => (
                <TableRow key={swap._id}>
                  <TableCell>{swap.requester.name}</TableCell>
                  <TableCell>{swap.recipient.name}</TableCell>
                  <TableCell>{swap.status}</TableCell>
                  <TableCell>
                    <Button size="small" color="error">Cancel</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default Admin;