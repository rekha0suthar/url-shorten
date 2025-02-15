import {
  Container,
  Box,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Stack,
} from '@mui/material';
import CreateUrlForm from '../components/CreateUrlForm';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
  const navigate = useNavigate();
  const { fetchUrls, selectedTopic, setSelectedTopic } = useAuth();

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
    navigate(`/topic/${e.target.value}`);
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
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
          </Stack>
        </Box>
        <CreateUrlForm onUrlCreated={fetchUrls} />
      </Box>
    </Container>
  );
};

export default Dashboard;
