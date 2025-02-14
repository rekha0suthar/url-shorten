import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Link,
  Typography,
  Button,
} from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { ArrowBack } from '@mui/icons-material';
import { useEffect } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

const UrlList = () => {
  const navigate = useNavigate();
  const { loading, urls, fetchUrls, selectedTopic } = useAuth();

  useEffect(() => {
    fetchUrls();
  }, [selectedTopic]);

  return loading ? (
    <Typography>Loading...</Typography>
  ) : (
    <>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 3 }}
      >
        Back to Dashboard
      </Button>
      <Typography variant="h4" component="h1" gutterBottom>
        Urls History
      </Typography>
      <TableContainer className="url-list" component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Short URL</TableCell>
              <TableCell>Original URL</TableCell>
              <TableCell>Topic</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {urls.map((url) => (
              <TableRow key={url.shortUrl}>
                <TableCell>
                  <Link
                    href={`${BASE_URL}/shorten/${url.shortUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {url.shortUrl}
                  </Link>
                </TableCell>
                <TableCell>
                  <Box
                    component="div"
                    sx={{
                      maxWidth: 300,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    <Link
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {url.originalUrl}
                    </Link>
                  </Box>
                </TableCell>
                <TableCell>
                  {url.topic && (
                    <Chip
                      label={url.topic}
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {new Date(url.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => navigate(`/analytics/${url.shortUrl}`)}
                    color="primary"
                    title="View Analytics"
                  >
                    <AnalyticsIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

UrlList.propTypes = {
  urls: PropTypes.arrayOf(
    PropTypes.shape({
      shortUrl: PropTypes.string.isRequired,
      originalUrl: PropTypes.string.isRequired,
      topic: PropTypes.string,
      createdAt: PropTypes.string.isRequired,
      // Add other properties if necessary
    })
  ).isRequired,
};

export default UrlList;
