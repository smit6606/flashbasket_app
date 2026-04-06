import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton, 
  Typography, 
  Box,
  CircularProgress
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { Close as CloseIcon } from '@mui/icons-material';

export default function FormModal({ isOpen, onClose, title, children, onSubmit, submitText = 'Execute Action', loading = false, hideFooter = false }) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      TransitionProps={{ unmountOnExit: true }}
      PaperProps={{
        sx: { 
          borderRadius: '32px', 
          p: 1.5, 
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.12)',
          bgcolor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }
      }}
    >
      <DialogTitle sx={{ m: 0, p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.5px' }}>
          {title}
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ 
            color: 'text.disabled',
            bgcolor: 'rgba(0,0,0,0.03)',
            borderRadius: '12px',
            '&:hover': { bgcolor: 'rgba(239, 68, 68, 0.08)', color: 'error.main' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <form onSubmit={onSubmit}>
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3.5 }}>
            {children}
          </Box>
        </DialogContent>
        
        {!hideFooter && (
          <DialogActions sx={{ p: 3, pt: 2, gap: 2 }}>
            <Button 
              onClick={onClose} 
              variant="text" 
              sx={{ px: 4, py: 1.5, fontWeight: 800, color: 'text.secondary' }}
            >
              Discard
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={loading}
              sx={{ 
                px: 5, 
                py: 1.5, 
                borderRadius: '16px',
                fontWeight: 900,
                boxShadow: (theme) => `0 10px 20px ${alpha(theme.palette.primary.main, 0.2)}`
              }}
            >
              {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : submitText}
            </Button>
          </DialogActions>
        )}
      </form>
    </Dialog>
  );
}
