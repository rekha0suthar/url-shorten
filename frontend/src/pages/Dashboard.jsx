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
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import CreateUrlForm from '../components/CreateUrlForm';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import { setSelectedTopic } from '../redux/slices/analyticsSlice';
import { fetchUrls } from '../redux/slices/urlSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedTopic } = useSelector((state) => state.analytics);
  const { loading } = useSelector((state) => state.url);

  useEffect(() => {
    dispatch(fetchUrls());
  }, [dispatch]);

  const handleTopicChange = (e) => {
    dispatch(setSelectedTopic(e.target.value));
    navigate(`/topic/${e.target.value}`);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Container maxWidth={false} sx={{ maxWidth: '2000px' }}>
      <Box
        sx={{
          mt: 4,
          mb: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Box
          sx={{
            width: '100%',
            mb: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={2}
            sx={{
              width: '100%',
              maxWidth: {
                xs: '100%',
                sm: '600px',
                md: '900px',
                lg: '1200px',
                xl: '1600px',
              },
              justifyContent: 'start',
            }}
          >
            <Button
              variant="outlined"
              sx={{
                mr: { xs: 0, md: 1 },
                p: 1.5,
                minWidth: { xs: '100%', md: '250px' },
                fontSize: { md: '1.1rem' },
              }}
              onClick={() => navigate('/analytics/overall')}
            >
              Overall Analytics
            </Button>
            <Button
              variant="outlined"
              sx={{
                mr: { xs: 0, md: 1 },
                p: 1.5,
                minWidth: { xs: '100%', md: '250px' },
                fontSize: { md: '1.1rem' },
              }}
              onClick={() => navigate('/history')}
            >
              History
            </Button>
            <FormControl sx={{ minWidth: { xs: '100%', md: '250px' } }}>
              <InputLabel id="topic-select-label">Filter by Topic</InputLabel>
              <Select
                labelId="topic-select-label"
                id="topic-select"
                value={selectedTopic}
                label="Filter by Topic"
                onChange={handleTopicChange}
                sx={{ fontSize: { md: '1.1rem' } }}
              >
                <MenuItem value="acquisition">Acquisition</MenuItem>
                <MenuItem value="activation">Activation</MenuItem>
                <MenuItem value="retention">Retention</MenuItem>
                <MenuItem value="others">Others</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Box>
        <Box
          sx={{
            width: '100%',
            maxWidth: {
              xs: '100%',
              sm: '600px',
              md: '900px',
              lg: '1200px',
              xl: '1600px',
            },
          }}
        >
          <CreateUrlForm />
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
