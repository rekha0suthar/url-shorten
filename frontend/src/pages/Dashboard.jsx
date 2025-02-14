import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { toast } from 'react-toastify';
import CreateUrlForm from '../components/CreateUrlForm';
import UrlList from '../components/UrlList';
import { getUrlsApi } from '../apis/index.js';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [urls, setUrls] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');
  const { loading, setLoading } = useAuth();

  // Fetch URLs from the API when the component mounts/renders
  useEffect(() => {
    fetchUrls();
  }, [selectedTopic]);

  // Fetch URLs from the API with optional topic filtering
  const fetchUrls = async () => {
    try {
      const data = await getUrlsApi(selectedTopic);
      setUrls(data);
    } catch (error) {
      toast.error('Failed to fetch URLs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener Dashboard
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button variant="outlined" sx={{ mr: 2 }}>
            Overall Analytics
          </Button>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="topic-select-label">Filter by Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Filter by Topic"
            >
              <MenuItem value="acquisition">Acquisition</MenuItem>
              <MenuItem value="activation">Activation</MenuItem>
              <MenuItem value="retention">Retention</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <CreateUrlForm onUrlCreated={fetchUrls} />
        {loading ? (
          <Typography>Loading...</Typography>
        ) : (
          <UrlList urls={urls} />
        )}
      </Box>
    </Container>
  );
};

export default Dashboard;
