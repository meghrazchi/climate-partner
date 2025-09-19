// src/pages/Home.tsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Leaf,
  LineChart,
  Gauge,
  Route,
  ShieldCheck,
  Sparkles,
  Rocket,
} from 'lucide-react';

const MotionButton = motion(Button);
const MotionCard = motion(Card);

const fadeInUp = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 },
};

const features = [
  {
    icon: <LineChart size={20} />,
    title: 'Actionable Insights',
    desc: 'See emissions by trip and mode with clear, decision-ready numbers.',
  },
  {
    icon: <Gauge size={20} />,
    title: 'Targets & Progress',
    desc: 'Track monthly progress against reduction goals.',
  },
  {
    icon: <Route size={20} />,
    title: 'Frictionless Logging',
    desc: 'Add trips in seconds—no spreadsheets, no headaches.',
  },
  {
    icon: <ShieldCheck size={20} />,
    title: 'Privacy & Security',
    desc: 'JWT-based auth and role-ready architecture.',
  },
];

const steps = [
  { step: '1', title: 'Log a Trip', desc: 'Add origin, destination, distance, and mode.' },
  { step: '2', title: 'See Impact', desc: 'Instant CO₂e estimates and savings vs. baseline.' },
  { step: '3', title: 'Take Action', desc: 'Identify low-carbon alternatives and track progress.' },
];

export default function Home() {
  return (
    <Box
      sx={{
        // subtle radial gradient background
        background:
          'radial-gradient(1200px 500px at 10% -10%, rgba(46,125,50,0.08), transparent), radial-gradient(1000px 500px at 90% -20%, rgba(2,119,189,0.07), transparent)',
      }}
    >
      {/* Hero */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6} alignItems="center">
          <Grid  size={{ xs: 12, md: 7 }}>
            <Stack spacing={2} component={motion.div} {...fadeInUp}>
              <Chip
                icon={<Sparkles size={16} />}
                color="primary"
                variant="outlined"
                label="Make climate action measurable"
                sx={{ alignSelf: 'flex-start' }}
              />
              <Stack direction="row" spacing={1} alignItems="center">
                <Leaf />
                <Typography variant="h3" fontWeight={700}>
                  Green Travel Tracker
                </Typography>
              </Stack>
              <Typography color="text.secondary" variant="h6">
                Log business travel, quantify emissions instantly, and turn insights into action.
                Designed with a scalable MUI-based system and a NestJS API.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={1}>
                <MotionButton
                  component={Link}
                  to="/dashboard"
                  variant="contained"
                  size="large"
                  startIcon={<Rocket />}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Open Dashboard
                </MotionButton>
                <Button component={Link} to="/login" variant="outlined" size="large">
                  Sign in
                </Button>
              </Stack>

              <Stack direction="row" spacing={3} mt={3}>
                <Stack>
                  <Typography variant="h5" fontWeight={700}>
                    3x
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Faster reporting
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5" fontWeight={700}>
                    &lt; 30s
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Avg. trip entry
                  </Typography>
                </Stack>
                <Stack>
                  <Typography variant="h5" fontWeight={700}>
                    Ready
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    MUI Design System
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Grid>

          <Grid  size={{ xs: 12, md: 5 }}>
            <MotionCard
              elevation={0}
              sx={{
                borderRadius: 3,
                border: '1px solid',
                borderColor: 'divider',
                background:
                  'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.95))',
                backdropFilter: 'blur(6px)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              <CardContent>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Preview
                </Typography>
                <Stack spacing={2}>
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ p: 2, borderRadius: 2, bgcolor: 'action.hover' }}
                  >
                    <Typography variant="body2">Total Emissions</Typography>
                    <Typography variant="h5" fontWeight={700}>
                      412.6 kg CO₂e
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={2}>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        TRAIN
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        86.2
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        FLIGHT
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        289.0
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 2,
                        border: '1px dashed',
                        borderColor: 'divider',
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        CAR
                      </Typography>
                      <Typography variant="h6" fontWeight={700}>
                        37.4
                      </Typography>
                    </Box>
                  </Stack>

                  <Divider />

                  <Stack spacing={1}>
                    <Typography variant="subtitle2">Suggested Actions</Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Choose train for trips under 500 km
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Batch meetings to reduce frequent flights
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      • Prefer economy class on unavoidable flights
                    </Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </MotionCard>
          </Grid>
        </Grid>
      </Container>

      {/* Features */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Typography variant="overline" color="text.secondary">
          Why Green Travel Tracker
        </Typography>
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3 }}>
          Designed for clarity, speed, and real climate impact
        </Typography>

        <Grid container spacing={2}>
          {features.map((f, i) => (
            <Grid size={{ xs: 12, md: 4, sm:6 }} key={f.title}>
              <MotionCard
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <CardContent>
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                    {f.icon}
                    <Typography variant="subtitle1" fontWeight={700}>
                      {f.title}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {f.desc}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* How it works */}
      <Container maxWidth="lg" sx={{ pb: { xs: 6, md: 10 } }}>
        <Typography variant="overline" color="text.secondary">
          How it works
        </Typography>
        <Grid container spacing={2}>
          {steps.map((s, i) => (
            <Grid size={{ xs: 12, md: 4 }} key={s.step}>
              <MotionCard
                elevation={0}
                sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', height: '100%' }}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.35, delay: i * 0.05 }}
              >
                <CardContent>
                  <Chip label={`Step ${s.step}`} size="small" sx={{ mb: 1 }} />
                  <Typography variant="subtitle1" fontWeight={700}>
                    {s.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {s.desc}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to action */}
      <Box sx={{ bgcolor: 'background.paper', borderTop: '1px solid', borderColor: 'divider' }}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Stack
            spacing={2}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
          >
            <Stack spacing={0.5}>
              <Typography variant="h6" fontWeight={700}>
                Ready to reduce travel emissions?
              </Typography>
              <Typography color="text.secondary">
                Start logging trips and track your climate impact in minutes.
              </Typography>
            </Stack>
            <Stack direction="row" spacing={2}>
              <MotionButton
                component={Link}
                to="/dashboard"
                variant="contained"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Open Dashboard
              </MotionButton>
              <Button component={Link} to="/login" variant="outlined">
                Sign in
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
}
