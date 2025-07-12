import { Button, Card, CardContent, Typography, Box, Avatar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { respondToSwap } from '../services/swapService';
import { useAuth } from '../context/AuthContext'; 


const SwapCard = ({ swap, currentUserId }) => {
  const navigate = useNavigate();
  const { user } = useAuth(); 

  const isRequester = swap.requester._id === currentUserId;
  const otherUser = isRequester ? swap.recipient : swap.requester;
  const requestedItem = swap.requestedItem;
  const offeredItem = swap.offeredItem;

  const handleRespond = async (action) => {
    try {
      await respondToSwap(swap._id, action);  
      navigate(0); 
    } catch (err) {
      console.error('Failed to respond to swap:', err);
    }
  };

  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            src={otherUser.profilePhoto ? `http://localhost:5000/${otherUser.profilePhoto}` : undefined}
            sx={{ mr: 2 }}
          >
            {otherUser.name.charAt(0)}
          </Avatar>
          <Typography variant="h6">
            {isRequester ? 'You requested' : `${swap.requester.name} requested`}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box sx={{ flex: 1, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>Requested Item</Typography>
            <Typography>{requestedItem.title}</Typography>
            <Chip label={`${requestedItem.pointsValue} pts`} size="small" sx={{ mt: 1 }} />
          </Box>
          
          {offeredItem ? (
            <Box sx={{ flex: 1, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Offered Item</Typography>
              <Typography>{offeredItem.title}</Typography>
              <Chip label={`${offeredItem.pointsValue} pts`} size="small" sx={{ mt: 1 }} />
            </Box>
          ) : (
            <Box sx={{ flex: 1, border: '1px solid #eee', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" gutterBottom>Points Offered</Typography>
              <Typography>{swap.pointsOffered} points</Typography>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Chip 
            label={swap.status} 
            color={
              swap.status === 'pending' ? 'default' :
              swap.status === 'accepted' ? 'primary' :
              swap.status === 'completed' ? 'success' : 'error'
            } 
          />
          
          {swap.status === 'pending' && !isRequester && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                size="small" 
                color="success"
                onClick={() => handleRespond('accept')}
              >
                Accept
              </Button>
              <Button 
                variant="outlined" 
                size="small" 
                color="error"
                onClick={() => handleRespond('reject')}
              >
                Reject
              </Button>
            </Box>
          )}
          
          {swap.status === 'pending' && (isRequester || user?.isAdmin) && (
            <Button 
              variant="outlined" 
              size="small" 
              color="error"
              onClick={async () => {
                try {
                  await cancelSwap(swap._id);
                  navigate(0);
                } catch (err) {
                console.error('Failed to cancel swap:', err);
               }
          }}
        >
          Cancel
        </Button>
      )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SwapCard;
