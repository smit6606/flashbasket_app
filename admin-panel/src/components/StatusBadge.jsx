import { Chip } from '@mui/material';
import { alpha } from '@mui/material/styles';

export default function StatusBadge({ status }) {
  const getStatusConfig = () => {
    const s = status.toLowerCase();
    if (s.includes('delivered') || s === 'active' || s === 'success') {
      return { color: 'success', label: status };
    }
    if (s === 'pending') {
      return { color: 'warning', label: status };
    }
    if (s === 'packed') {
      return { color: 'info', label: status };
    }
    if (s.includes('delivery')) {
      return { color: 'secondary', label: status };
    }
    if (s === 'failed' || s === 'cancelled' || s === 'inactive') {
      return { color: 'error', label: status };
    }
    return { color: 'default', label: status };
  };

  const config = getStatusConfig();

  return (
    <Chip 
      label={config.label} 
      color={config.color} 
      size="small"
      variant="filled"
      sx={{ 
        fontWeight: 700, 
        borderRadius: 1.5,
        textTransform: 'capitalize',
        fontSize: '0.7rem',
        px: 0.5,
        bgcolor: (theme) => alpha(theme.palette[config.color]?.main || theme.palette.grey[500], 0.12),
        color: (theme) => theme.palette[config.color]?.dark || theme.palette.grey[700],
        border: 'none'
      }} 
    />
  );
}
