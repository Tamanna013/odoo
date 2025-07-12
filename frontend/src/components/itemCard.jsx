import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Chip, Box } from '@mui/material';

const ItemCard = ({ item }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        sx={{
          height: 180,
          width: '100%',
          objectFit: 'cover',
          borderRadius: 1
        }}
        image={`http://localhost:5000/uploads/items/${item.images[0]}`}
        alt={item.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h3">
          <Link to={`/items/${item._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {item.title}
          </Link>
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
          <Chip label={item.category} size="small" color="primary" />
          <Chip label={item.type} size="small" />
          <Chip label={`${item.pointsValue} pts`} size="small" color="secondary" />
        </Box>
        <Typography variant="body2" color="text.secondary" noWrap>
          {item.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ItemCard;