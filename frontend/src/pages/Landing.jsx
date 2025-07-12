import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CircularProgress
} from '@mui/material';
import heroImage from '../assets/hero.jpg';
import Slider from 'react-slick';
import API from '../services/api'; // adjust this path if needed

const Landing = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await API.get('/items');
        const availableItems = res.data.filter(item => item.status === 'available');
        setItems(availableItems);
      } catch (err) {
        console.error('Error fetching items:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(3, items.length),
    slidesToScroll: 1,
    responsive: [
      { breakpoint: 960, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } }
    ]
  };

  return (
    <>
      {/* Hero Section */}
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

      {/* How it Works */}
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

        {/* Carousel Section */}
        <Box sx={{ mt: 10 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Featured Items for Swap
          </Typography>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : items.length === 0 ? (
            <Typography align="center" sx={{ mt: 2 }}>
              No items currently available for swap.
            </Typography>
          ) : (
            <Slider {...sliderSettings}>
              {items.map(item => (
                <Box key={item._id} sx={{ px: 1 }}>
                  <Card>
                    <CardMedia
  component="img"
  sx={{ height: 60, width: 60, objectFit: 'cover', borderRadius: 1 }}
  image={`http://localhost:5000/uploads/items/${item.images[0]}`}
  alt={item.title}
/>

                    <CardContent>
                      <Typography variant="h6" noWrap>{item.title}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.pointsValue} pts
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              ))}
            </Slider>
          )}
        </Box>

        {/* CTA */}
        <Box sx={{ mt: 10, textAlign: 'center' }}>
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
