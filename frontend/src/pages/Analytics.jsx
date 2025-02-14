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
import { getOverallAnalyticsApi, getUrlAnalyticsApi } from '../apis/index';
import AnalyticsChart from '../components/AnalyticsChart';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shortUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAnalytics();
  }, [shortUrl]);

  const fetchAnalytics = async () => {
    try {
      if (shortUrl === 'overall') {
        const data = await getOverallAnalyticsApi();
        setAnalytics(data);
      } else {
        const data = await getUrlAnalyticsApi(shortUrl);
        setAnalytics(data);
      }
    } catch {
      toast.error('Failed to fetch analytics');
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
          {shortUrl === 'overall'
            ? 'Overall Analytics'
            : `Analytics for ${shortUrl}`}
        </Typography>

        <Grid container spacing={3}>
          {/* Conditional Rendering Based on Analytics Type */}
          {shortUrl === 'overall' ? (
            <>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Total URLs
                  </Typography>
                  <Typography variant="h4">{analytics.totalUrls}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Total Clicks
                  </Typography>
                  <Typography variant="h4">{analytics.totalClicks}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Unique Users
                  </Typography>
                  <Typography variant="h4">{analytics.uniqueUsers}</Typography>
                </Paper>
              </Grid>
            </>
          ) : (
            <>
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
            </>
          )}

          {/* Clicks Over Time */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Clicks Over Time
              </Typography>
              <AnalyticsChart
                data={analytics.clicksInWeek}
                title="Clicks Over Time"
              />
            </Paper>
          </Grid>

          {/* Operating Systems */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Operating Systems
              </Typography>
              <List>
                {analytics.osType.map((os) => (
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

          {/* Device Types */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Device Types
              </Typography>
              <List>
                {analytics.deviceType.map((device) => (
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
        </Grid>
      </Box>
    </Container>
  );
};

export default Analytics;
