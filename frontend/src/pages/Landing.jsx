import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid } from '@mui/material';
import heroImage from '../assets/hero.jpg';

const Landing = () => {
  return (
    <>
      <Box
        sx={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          height: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <Box sx={{ backgroundColor: 'rgba(0,0,0,0.5)', p: 4, borderRadius: 2 }}>
          <Typography variant="h2" component="h1" gutterBottom>
            ReWear - Sustainable Fashion Exchange
          </Typography>
          <Typography variant="h5" gutterBottom>
            Swap clothes, save money, and reduce waste
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/items"
            sx={{ mt: 3 }}
          >
            Start Swapping
          </Button>
        </Box>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          How It Works
        </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>1. List Your Items</Typography>
            <Typography>
              Upload photos and details of clothes you no longer wear but are still in good condition.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>2. Browse & Request</Typography>
            <Typography>
              Find items you love and request swaps with other members or redeem using points.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" gutterBottom>3. Swap & Save</Typography>
            <Typography>
              Arrange the swap and enjoy your new-to-you items while reducing textile waste.
            </Typography>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            component={Link}
            to="/register"
          >
            Join Now
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Landing;