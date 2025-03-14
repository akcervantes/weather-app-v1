import React from 'react';
import { Alert, Box } from '@mui/material';

function ErrorMessage({ message }) {
  return (
    <Box sx={{ mb: 3 }}>
      <Alert severity="error">{message}</Alert>
    </Box>
  );
}

export default ErrorMessage;