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
  Pagination,
} from '@mui/material';
import { Analytics as AnalyticsIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { ArrowBack } from '@mui/icons-material';
import { useEffect, useState } from 'react';

const BASE_URL = import.meta.env.VITE_API_URL;

const UrlList = () => {
  const navigate = useNavigate();
  const { loading, urls, fetchUrls, totalUrls } = useAuth();
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const limit = 7; // Number of URLs per page

  useEffect(() => {
    fetchUrls({ page, limit });
  }, [page]);

  useEffect(() => {
    if (totalUrls && limit) {
      setPages(Math.ceil(totalUrls / limit));
    }
  }, [totalUrls, limit]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

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
            {urls.length > 0 &&
              urls.map((url) => (
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
            {urls.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No URLs found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={pages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
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
  totalUrls: PropTypes.number.isRequired,
};

export default UrlList;
