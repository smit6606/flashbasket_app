import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  FormHelperText,
  Typography,
  Box
} from '@mui/material';

export default function SelectDropdown({ label, options, value, onChange, placeholder, disabled = false, required = false }) {
  return (
    <Box sx={{ width: '100%' }}>
      <FormControl fullWidth disabled={disabled} required={required} size="medium">
        {label && (
          <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, color: 'text.primary' }}>
            {label} {required && <span style={{ color: '#d32f2f' }}>*</span>}
          </Typography>
        )}
        <Select
          labelId={`${label}-label`}
          value={value}
          onChange={onChange}
          displayEmpty
          sx={{ 
            borderRadius: 2,
            bgcolor: disabled ? 'rgba(0,0,0,0.02)' : 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#e0e0e0',
              borderWidth: '1.5px'
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'primary.main',
            }
          }}
        >
          <MenuItem value="" disabled>
            <span style={{ color: '#999' }}>{placeholder || 'Select an option'}</span>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
