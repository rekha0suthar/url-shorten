import { Box, CircularProgress, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const Loading = ({ message = 'Loading...' }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}
    >
      <CircularProgress sx={{ mb: 2 }} />
      <Typography>{message}</Typography>
    </Box>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

Loading.defaultProps = {
  message: 'Loading...',
};

export default Loading;
