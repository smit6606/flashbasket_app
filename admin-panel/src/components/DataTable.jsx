import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  IconButton, 
  Tooltip,
  Typography,
  Box,
  Fade,
  useTheme
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { 
  EditRounded as EditIcon, 
  DeleteRounded as DeleteIcon,
  Inventory2Rounded as NoDataIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

export default function DataTable({ columns, data, onEdit, onDelete, keyExtractor = (item) => item.id }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  if (!data || data.length === 0) {
    return (
      <Fade in={true} timeout={600}>
        <Box 
          sx={{ 
            py: 12, 
            px: 4,
            textAlign: 'center', 
            borderRadius: '32px',
            border: `2px dashed ${theme.palette.divider}`,
            bgcolor: alpha(theme.palette.background.paper, 0.4),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2.5,
            mt: 4
          }}
        >
          <Box sx={{ 
            width: 72, 
            height: 72, 
            borderRadius: '24px', 
            bgcolor: alpha(theme.palette.primary.main, 0.08),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'primary.main',
            boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.1)}`
          }}>
            <NoDataIcon sx={{ fontSize: 36 }} />
          </Box>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 900, mb: 0.5 }}>
              No Records Found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, maxWidth: 350 }}>
              Your search didn't return any results. Try adjusting your filters or add a new entry.
            </Typography>
          </Box>
        </Box>
      </Fade>
    );
  }

  return (
    <TableContainer 
      component={Box} 
      sx={{ 
        overflow: 'visible',
        maxWidth: '100%'
      }}
    >
      <Table sx={{ minWidth: 800, borderCollapse: 'separate', borderSpacing: '0 10px' }}>
        <TableHead>
          <TableRow sx={{ '& th': { border: 'none', px: 3, pb: 1 } }}>
            {columns.map((col, idx) => (
              <TableCell 
                key={idx} 
                sx={{ 
                  fontWeight: 800, 
                  color: 'text.disabled', 
                  fontSize: '0.65rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px' 
                }}
              >
                {col.header}
              </TableCell>
            ))}
            {(onEdit || onDelete) && (
              <TableCell 
                align="right" 
                sx={{ 
                  fontWeight: 800, 
                  color: 'text.disabled', 
                  fontSize: '0.65rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '1.5px' 
                }}
              >
                Operational Control
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <AnimatePresence mode='popLayout'>
            {data.map((row, index) => (
              <TableRow 
                key={keyExtractor(row)} 
                component={motion.tr}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, delay: index * 0.04 }}
                sx={{ 
                  '& td': { 
                    border: 'none', 
                    bgcolor: isDark ? alpha(theme.palette.background.paper, 0.6) : '#ffffff',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:first-of-type': { 
                      borderRadius: '16px 0 0 16px',
                      borderLeft: `1px solid ${theme.palette.divider}`
                    },
                    '&:last-of-type': { 
                      borderRadius: '0 16px 16px 0',
                      borderRight: `1px solid ${theme.palette.divider}`
                    }
                  },
                  '&:hover td': { 
                    bgcolor: isDark ? alpha(theme.palette.primary.main, 0.05) : alpha(theme.palette.primary.main, 0.025),
                    borderColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'translateY(-1px)',
                  },
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.02))'
                }}
              >
                {columns.map((col, idx) => (
                  <TableCell key={idx} sx={{ py: 2, px: 3 }}>
                    {col.render ? col.render(row) : (
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {row[col.accessor] || '—'}
                      </Typography>
                    )}
                  </TableCell>
                ))}
                {(onEdit || onDelete) && (
                  <TableCell align="right" sx={{ py: 2, px: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                      {onEdit && (
                        <Tooltip title="Modify Entity">
                          <IconButton 
                            onClick={() => onEdit(row)}
                            size="small"
                            sx={{ 
                              color: 'primary.main',
                              bgcolor: alpha(theme.palette.primary.main, 0.08),
                              borderRadius: '10px',
                              '&:hover': { bgcolor: 'primary.main', color: 'white', transform: 'scale(1.1)' }
                            }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {onDelete && (
                        <Tooltip title="Terminate Record">
                          <IconButton 
                            onClick={() => onDelete(row)}
                            size="small"
                            sx={{ 
                              color: 'error.main',
                              bgcolor: alpha(theme.palette.error.main, 0.08),
                              borderRadius: '10px',
                              '&:hover': { bgcolor: 'error.main', color: 'white', transform: 'scale(1.1)' }
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
