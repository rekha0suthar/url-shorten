import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { getTopicAnalyticsApi } from '../apis/index';
import AnalyticsChart from '../components/AnalyticsChart';

const TopicAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { topic } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [topic]);

  const fetchAnalytics = async () => {
    try {
      const data = await getTopicAnalyticsApi(topic);
      setAnalytics(data);
    } catch (error) {
      console.log(error);
      toast.error('Failed to fetch topic analytics');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/')}
          sx={{ mb: 3 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" component="h1" gutterBottom>
          {topic.charAt(0).toUpperCase() + topic.slice(1)} Analytics
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Overview
              </Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Total Clicks"
                    secondary={analytics.totalClicks}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Unique Users"
                    secondary={analytics.uniqueUsers}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <AnalyticsChart
                data={analytics.clicksInWeek}
                title="Clicks Over Time"
              />
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                URLs in this Topic
              </Typography>
              <List>
                {analytics.urls.map((url) => (
                  <ListItem key={url.shortUrl}>
                    <ListItemText
                      primary={url.shortUrl}
                      secondary={`${url.totalClicks} clicks (${url.uniqueUsers} unique users)`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TopicAnalytics;
