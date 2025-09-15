import { useState } from 'react';
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  TextField,
  MenuItem,
  Button,
  Divider,
} from '@mui/material';
import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import {
  listTrips,
  getStats,
  createTrip,
  type Mode,
} from '../api/client';

// Register chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function Dashboard() {
  const qc = useQueryClient();

  // Queries
  const tripsQ = useQuery({ queryKey: ['trips'], queryFn: listTrips });
  const statsQ = useQuery({ queryKey: ['stats'], queryFn: getStats });

  // Mutation
  const mutation = useMutation({
    mutationFn: (t: {
      origin: string;
      destination: string;
      distanceKm: number;
      mode: Mode;
    }) => createTrip(t),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trips'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
    },
  });

  // Form state
  const [form, setForm] = useState({
    origin: '',
    destination: '',
    distanceKm: 0,
    mode: 'TRAIN' as Mode,
  });

  // Chart data
  const byMode = statsQ.data?.byMode ?? [];
  const chartData = {
    labels: byMode.map((b) => b.mode),
    datasets: [
      {
        label: 'kg CO₂e',
        data: byMode.map((b) => b._sum.emissionsKg ?? 0),
        backgroundColor: ['#2e7d32', '#0277bd', '#f57c00'],
      },
    ],
  };

  return (
    <Grid container spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
      {/* Total emissions */}
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Emissions</Typography>
            <Typography variant="h3">
              {(statsQ.data?.totalKg ?? 0).toFixed(1)} kg CO₂e
            </Typography>
            <Typography color="text.secondary">
              Across {tripsQ.data?.length ?? 0} trips
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Chart */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: 300 }}>
          <CardContent sx={{ height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Emissions by Mode
            </Typography>
            <Bar data={chartData} />
          </CardContent>
        </Card>
      </Grid>

      {/* Trip form */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add a Trip
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                mutation.mutate(form);
                setForm((f) => ({
                  ...f,
                  origin: '',
                  destination: '',
                  distanceKm: 0,
                }));
              }}
            >
              <TextField
                label="Origin"
                value={form.origin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, origin: e.target.value }))
                }
                required
              />
              <TextField
                label="Destination"
                value={form.destination}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destination: e.target.value }))
                }
                required
              />
              <TextField
                type="number"
                label="Distance (km)"
                value={form.distanceKm}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    distanceKm: Number(e.target.value),
                  }))
                }
                inputProps={{ min: 1 }}
                required
              />
              <TextField
                select
                label="Mode"
                value={form.mode}
                onChange={(e) =>
                  setForm((f) => ({ ...f, mode: e.target.value as Mode }))
                }
              >
                {['TRAIN', 'FLIGHT', 'CAR'].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                type="submit"
                variant="contained"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? 'Saving…' : 'Add Trip'}
              </Button>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
