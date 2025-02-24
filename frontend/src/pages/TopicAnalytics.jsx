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
import Loading from '../components/Loading';

const TopicAnalytics = () => {
  const [topicAnalytics, setTopicAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { topic } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopicAnalytics();
  }, []);

  const fetchTopicAnalytics = async () => {
    try {
      const data = await getTopicAnalyticsApi(topic);
      setTopicAnalytics(data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch topic analytics');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !topicAnalytics) {
    return <Loading />;
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
                    primary="Total URLs"
                    secondary={topicAnalytics.urlCount || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Total Clicks"
                    secondary={topicAnalytics.totalClicks || 0}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Unique Users"
                    secondary={topicAnalytics.uniqueUsers || 0}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Clicks Over Time Chart */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Clicks Over Time
              </Typography>
              <Box sx={{ width: '100%', height: 300 }}>
                <AnalyticsChart
                  data={topicAnalytics.clicksInWeek || []}
                  title="Clicks Over Time"
                />
              </Box>
            </Paper>
          </Grid>

          {/* Operating Systems */}
          {topicAnalytics.osType && topicAnalytics.osType.length > 0 && (
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Operating Systems
                </Typography>
                <List>
                  {topicAnalytics.osType.map((os) => (
                    <ListItem key={os.osName}>
                      <ListItemText
                        primary={os.osName || 'Unknown'}
                        secondary={`${os.uniqueClicks} clicks (${os.uniqueUsers} unique users)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}

          {/* Device Types */}
          {topicAnalytics.deviceType &&
            topicAnalytics.deviceType.length > 0 && (
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Device Types
                  </Typography>
                  <List>
                    {topicAnalytics.deviceType.map((device) => (
                      <ListItem key={device.deviceName}>
                        <ListItemText
                          primary={device.deviceName || 'Unknown'}
                          secondary={`${device.uniqueClicks} clicks (${device.uniqueUsers} unique users)`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>
            )}

          {/* URLs List */}
          {topicAnalytics.urlList && topicAnalytics.urlList.length > 0 && (
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  URLs in this Topic
                </Typography>
                <List>
                  {topicAnalytics.urlList.map((url) => (
                    <ListItem key={url.shortUrl}>
                      <ListItemText
                        primary={url.shortUrl}
                        secondary={`${url.originalUrl} (${url.clicks} clicks)`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default TopicAnalytics;
