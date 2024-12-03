import { useState, useEffect } from 'react';
import { Grid as Grid2, Paper, Typography, Box } from '@mui/material';
import {
  Inventory,
  Category,
} from '@mui/icons-material';
import axios from 'axios';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [products, categories] = await Promise.all([
          axios.get('http://localhost:5000/api/products'),
          axios.get('http://localhost:5000/api/categories')
        ]);

        setStats({
          totalProducts: products.data.length,
          totalCategories: categories.data.length
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon }) => (
    <Paper
      sx={{
        p: 3,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <Box>
        <Typography variant="h6" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h4">
          {value}
        </Typography>
      </Box>
      <Box sx={{ color: 'primary.main' }}>
        {icon}
      </Box>
    </Paper>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Thống kê
      </Typography>

      <Grid2 container spacing={3}>
        <Grid2 item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng sản phẩm"
            value={stats.totalProducts}
            icon={<Inventory sx={{ fontSize: 40 }} />}
          />
        </Grid2>

        <Grid2 item xs={12} sm={6} md={4}>
          <StatCard
            title="Tổng danh mục"
            value={stats.totalCategories}
            icon={<Category sx={{ fontSize: 40 }} />}
          />
        </Grid2>
      </Grid2>
    </Box>
  );
};

export default DashboardPage;