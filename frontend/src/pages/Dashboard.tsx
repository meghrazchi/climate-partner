import { useState, useMemo } from 'react';
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
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
  type Trip,
} from '../api/client';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import type { GridColDef } from '@mui/x-data-grid';

// Register chart.js elements
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

// Helpers
const safeNum = (v: unknown, fallback = 0): number => {
  const n = typeof v === 'number' ? v : Number((v as any) ?? fallback);
  return Number.isFinite(n) ? n : fallback;
};
const fmtDateTime = (iso?: string) => (iso ? new Date(iso).toLocaleString() : '');

export default function Dashboard() {
  const qc = useQueryClient();

  // Queries
  const tripsQ = useQuery({ queryKey: ['trips'], queryFn: listTrips });
  const statsQ = useQuery({ queryKey: ['stats'], queryFn: getStats });

  // Mutation
  const mutation = useMutation({
    mutationFn: (t: { origin: string; destination: string; distanceKm: number; mode: Mode }) =>
      createTrip(t),
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
        data: byMode.map((b) => safeNum(b?._sum?.emissionsKg, 0)),
        backgroundColor: ['#2e7d32', '#0277bd', '#f57c00'],
      },
    ],
  };

  // Columns (format with valueFormatter; no valueGetter)
  const columns = useMemo<Array<GridColDef<Trip>>>(
    () => [
      {
        field: 'createdAt',
        headerName: 'Created',
        flex: 1,
        valueFormatter: (p) => fmtDateTime(p.value as string | undefined),
        sortComparator: (a: unknown, b: unknown) =>
          new Date(String(a)).getTime() - new Date(String(b)).getTime(),
      },
      { field: 'origin', headerName: 'Origin', flex: 1 },
      { field: 'destination', headerName: 'Destination', flex: 1 },
      {
        field: 'distanceKm',
        headerName: 'Distance (km)',
        type: 'number',
        flex: 0.9,
        valueFormatter: (p) => safeNum(p.value, 0).toFixed(0),
      },
      { field: 'mode', headerName: 'Mode', flex: 0.7 },
      {
        field: 'emissionsKg',
        headerName: 'Emissions (kg CO₂e)',
        type: 'number',
        flex: 1,
        valueFormatter: (p) => safeNum(p.value, 0).toFixed(3),
      },
    ],
    []
  );

  return (
    <Grid container spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
      {/* Total emissions */}
      <Grid item xs={12} md={5}>
        <Card>
          <CardContent>
            <Typography variant="h6">Total Emissions</Typography>
            {statsQ.isLoading ? (
              <Typography variant="h3">—</Typography>
            ) : statsQ.isError ? (
              <Alert severity="error" sx={{ mt: 1 }}>
                Failed to load stats
              </Alert>
            ) : (
              <Typography variant="h3">
                {safeNum(statsQ.data?.totalKg, 0).toFixed(1)} kg CO₂e
              </Typography>
            )}
            <Typography color="text.secondary">
              Across {safeNum(tripsQ.data?.length, 0)} trips
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
            {statsQ.isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ height: 220 }}>
                <CircularProgress />
              </Stack>
            ) : statsQ.isError ? (
              <Alert severity="error">Failed to load stats</Alert>
            ) : (
              <Bar data={chartData} />
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Add Trip + Trips list (same card) */}
      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Add a Trip
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {/* Form */}
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              component="form"
              onSubmit={(e) => {
                e.preventDefault();
                if (!form.origin || !form.destination || form.distanceKm <= 0) return;
                mutation.mutate({ ...form, distanceKm: safeNum(form.distanceKm, 0) });
                setForm((f) => ({ ...f, origin: '', destination: '', distanceKm: 0 }));
              }}
            >
              <TextField
                label="Origin"
                value={form.origin}
                onChange={(e) => setForm((f) => ({ ...f, origin: e.target.value }))}
                required
              />
              <TextField
                label="Destination"
                value={form.destination}
                onChange={(e) => setForm((f) => ({ ...f, destination: e.target.value }))}
                required
              />
              <TextField
                type="number"
                label="Distance (km)"
                value={form.distanceKm}
                onChange={(e) => setForm((f) => ({ ...f, distanceKm: safeNum(e.target.value, 0) }))}
                inputProps={{ min: 1 }}
                required
              />
              <TextField
                select
                label="Mode"
                value={form.mode}
                onChange={(e) => setForm((f) => ({ ...f, mode: e.target.value as Mode }))}
              >
                {['TRAIN', 'FLIGHT', 'CAR'].map((m) => (
                  <MenuItem key={m} value={m}>
                    {m}
                  </MenuItem>
                ))}
              </TextField>
              <Button type="submit" variant="contained" disabled={mutation.isPending}>
                {mutation.isPending ? 'Saving…' : 'Add Trip'}
              </Button>
            </Stack>

            {/* Trips list directly under form */}
            <Typography variant="h6" sx={{ mt: 4, mb: 1 }}>
              Trips
            </Typography>

            {tripsQ.isLoading ? (
              <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
                <CircularProgress />
              </Stack>
            ) : tripsQ.isError ? (
              <Alert severity="error">Failed to load trips</Alert>
            ) : (
              <div style={{ width: '100%' }}>
                <DataGrid<Trip>
                  rows={tripsQ.data ?? []}
                  columns={columns}
                  getRowId={(row) => row.id}
                  disableRowSelectionOnClick
                  // Make it roomy & readable
                  autoHeight
                  getRowHeight={() => 'auto'}
                  density="comfortable"
                  sx={{
                    '& .MuiDataGrid-cell': {
                      whiteSpace: 'normal',
                      lineHeight: 1.4,
                      py: 1,
                      alignItems: 'start',
                    },
                    '& .MuiDataGrid-columnHeaders': {
                      position: 'sticky',
                      top: 0,
                      zIndex: 1,
                      backgroundColor: 'background.paper',
                    },
                    mt: 1,
                  }}
                  // Toolbar (filter / columns / export)
                  slots={{ toolbar: GridToolbar }}
                  slotProps={{
                    toolbar: { showQuickFilter: true, quickFilterProps: { debounceMs: 300 } },
                  }}
                  initialState={{
                    pagination: { paginationModel: { pageSize: 10, page: 0 } },
                    sorting: { sortModel: [{ field: 'createdAt', sort: 'desc' }] },
                  }}
                  pageSizeOptions={[5, 10, 25, 50, 100]}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
