import { useEffect } from 'react';
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
import CreateUrlForm from '../components/CreateUrlForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchUrls, selectedTopic, setSelectedTopic } = useAuth();

  // Fetch URLs from the API when the component mounts/renders
  useEffect(() => {
    fetchUrls();
  }, [selectedTopic]);

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    navigate(`/topic/${e.target.value}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener Dashboard
        </Typography>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button
            variant="outlined"
            sx={{ mr: 1, p: 1.5 }}
            onClick={() => navigate('/analytics/overall')}
          >
            Overall Analytics
          </Button>
          <Button
            variant="outlined"
            sx={{ mr: 1, p: 1.5 }}
            onClick={() => navigate('/history')}
          >
            History
          </Button>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel id="topic-select-label">Filter by Topic</InputLabel>
            <Select
              labelId="topic-select-label"
              id="topic-select"
              value={selectedTopic}
              label="Filter by Topic"
              onChange={handleTopicChange}
            >
              <MenuItem value="acquisition">Acquisition</MenuItem>
              <MenuItem value="activation">Activation</MenuItem>
              <MenuItem value="retention">Retention</MenuItem>
              <MenuItem value="others">Others</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <CreateUrlForm onUrlCreated={fetchUrls} />
      </Box>
    </Container>
  );
};

export default Dashboard;
