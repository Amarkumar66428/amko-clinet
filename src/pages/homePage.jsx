import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Box,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Stack,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  Menu as MenuIcon,
  CheckCircle as CheckCircleIcon,
  Web as WebIcon,
  Description as DescriptionIcon,
  ReceiptLong as ReceiptIcon,
  Code as CodeIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import pete from "../assets/pet_e.webp";
import petf from "../assets/pet_f.webp";
import { useNavigate } from "react-router-dom";

const NAV_ITEMS = [
  "Home",
  "Features",
  "Templates",
  "Pricing",
  "Blog",
  "Contact",
];

export default function HomePage() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ bgcolor: "#ffffff", color: "#1e293b", overflowX: "hidden" }}>
      {/* 1. NAVIGATION BAR */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "#ffffff",
          color: "#1e293b",
          borderBottom: "1px solid #f1f5f9",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar
            disableGutters
            sx={{ justifyContent: "space-between", py: 1 }}
          >
            <Stack direction="row" alignItems="center" spacing={1}>
              <img
                src="/amko.png"
                alt="AMKO Logo"
                style={{ width: 35, height: 35 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, letterSpacing: -0.5 }}
              >
                AMKO
              </Typography>
            </Stack>

            {!isMobile ? (
              <Stack direction="row" spacing={3} alignItems="center">
                {NAV_ITEMS.map((item) => (
                  <Button
                    key={item}
                    sx={{
                      color: "#475569",
                      textTransform: "none",
                      fontWeight: 500,
                      "&:hover": { color: "#0f172a" },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Stack>
            ) : null}

            <Stack direction="row" spacing={1.5} alignItems="center">
              <Button
                onClick={() => navigate("/auth/signin")}
                variant="text"
                sx={{
                  textTransform: "none",
                  color: "#0f172a",
                  fontWeight: 600,
                  display: { xs: "none", sm: "inline-flex" },
                }}
              >
                Login
              </Button>
              <Button
                onClick={() => navigate("/amko/builder")}
                variant="contained"
                sx={{
                  textTransform: "none",
                  bgcolor: "#0f172a",
                  color: "#ffffff",
                  fontWeight: 600,
                  px: 2.5,
                  borderRadius: "6px",
                  "&:hover": { bgcolor: "#1e293b" },
                }}
              >
                Get Started
              </Button>
              {isMobile && (
                <IconButton onClick={handleDrawerToggle} color="inherit">
                  <MenuIcon />
                </IconButton>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle}>
        <Box sx={{ width: 250, p: 2 }}>
          <List>
            {NAV_ITEMS.map((item) => (
              <ListItem key={item} disablePadding>
                <ListItemButton onClick={handleDrawerToggle}>
                  <ListItemText primary={item} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      {/* 2. HERO SECTION WITH ASYMMETRICAL DARK CURVED BACKGROUND */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 14 },
        }}
      >
        {/* Navy Angled Overlay */}
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: { xs: "100%", md: "65%" },
            height: "100%",
            bgcolor: "#0b1329",
            clipPath: {
              xs: "none",
              md: "polygon(0 0, 100% 0, 80% 100%, 0% 100%)",
            },
            zIndex: 0,
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Hero Left Content */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ color: "#ffffff", pr: { md: 4 } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: "2.25rem", md: "3.25rem" },
                    lineHeight: 1.15,
                    mb: 2.5,
                    letterSpacing: -1,
                  }}
                >
                  Create Websites, Resumes & Invoices in One Place
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#94a3b8",
                    fontSize: "1.05rem",
                    mb: 4,
                    lineHeight: 1.6,
                  }}
                >
                  Empower your freelance career or business with an all-in-one
                  suite: drag-and-drop website building, LaTeX-precision resume
                  generation, and automated billing workflows.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <Button
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: "#ffffff",
                      color: "#0f172a",
                      fontWeight: 700,
                      px: 3.5,
                      py: 1.3,
                      textTransform: "none",
                      borderRadius: "6px",
                      "&:hover": { bgcolor: "#f1f5f9" },
                    }}
                  >
                    Start Free Trial
                  </Button>
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: "rgba(255,255,255,0.3)",
                      color: "#ffffff",
                      fontWeight: 600,
                      px: 3,
                      py: 1.3,
                      textTransform: "none",
                      borderRadius: "6px",
                      "&:hover": {
                        borderColor: "#ffffff",
                        bgcolor: "rgba(255,255,255,0.05)",
                      },
                    }}
                  >
                    Live Demo
                  </Button>
                </Stack>
              </Box>
            </Grid>

            {/* Hero Right Visual Card */}
            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
                  bgcolor: "#ffffff",
                  border: "1px solid #e2e8f0",
                }}
              >
                <CardMedia
                  component="img"
                  height="340"
                  image="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80"
                  alt="Builder Dashboard Preview"
                  sx={{ borderRadius: "12px", objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 3. CORE SUITE (2x2 FEATURE GRID) */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            {/* Overview text */}
            <Grid size={{ xs: 12, md: 5 }}>
              <Typography
                variant="overline"
                sx={{ color: "#64748b", fontWeight: 700, letterSpacing: 1.2 }}
              >
                COMPLETE TOOLKIT
              </Typography>
              <Typography
                variant="h4"
                sx={{ fontWeight: 800, mt: 1, mb: 2, letterSpacing: -0.5 }}
              >
                Engineered for Creators, Freelancers & Businesses
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748b", mb: 3.5, lineHeight: 1.6 }}
              >
                Stop toggling between 5 different subscriptions. Build your
                high-converting portfolio, compile clean LaTeX resumes, and send
                invoices with instant payment links.
              </Typography>
              <Button
                variant="contained"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  bgcolor: "#0f172a",
                  color: "#ffffff",
                  textTransform: "none",
                  px: 3,
                  py: 1,
                  fontWeight: 600,
                  borderRadius: "6px",
                }}
              >
                Explore All Tools
              </Button>
            </Grid>

            {/* 2x2 Grid Cards */}
            <Grid size={{ xs: 12, md: 7 }}>
              <Grid container spacing={2.5}>
                {/* Highlighted Card (Dark) */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      bgcolor: "#0b1329",
                      color: "#ffffff",
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <WebIcon
                        sx={{ fontSize: 32, mb: 1.5, color: "#38bdf8" }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        No-Code Web Builder
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#94a3b8", lineHeight: 1.6 }}
                      >
                        Drag-and-drop live components with instant responsive
                        previews and zero server setup.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Light Card 1 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      bgcolor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <CodeIcon
                        sx={{ fontSize: 32, mb: 1.5, color: "#0f172a" }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        LaTeX Resume Engine
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", lineHeight: 1.6 }}
                      >
                        Generate ATS-proof PDF resumes using real-time LaTeX
                        compilation or visual form editors.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Light Card 2 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    onClick={() => navigate("/amko/billing")}
                    sx={{
                      bgcolor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <ReceiptIcon
                        sx={{ fontSize: 32, mb: 1.5, color: "#0f172a" }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        Smart Bill Maker
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", lineHeight: 1.6 }}
                      >
                        Professional invoice templates with automatic tax
                        computation and client tracking.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Light Card 3 */}
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Card
                    sx={{
                      bgcolor: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <SpeedIcon
                        sx={{ fontSize: 32, mb: 1.5, color: "#0f172a" }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        1-Click Deployment
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{ color: "#64748b", lineHeight: 1.6 }}
                      >
                        Publish your custom store or portfolio to your custom
                        domain or our lightning CDN.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 4. DETAILED FEATURE SHOWCASE 1: LATEX RESUME BUILDER */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, sm: 6 }}>
              <Typography
                variant="overline"
                sx={{ color: "#64748b", fontWeight: 700 }}
              >
                ATS-OPTIMIZED
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                LaTeX Precision Resume Builder
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748b", mb: 3, lineHeight: 1.6 }}
              >
                Write code or toggle visual blocks. Compile pixel-perfect
                resumes that pass Automated Tracking Systems (ATS) with 100%
                precision.
              </Typography>

              <Grid container spacing={1.5}>
                {[
                  "Live LaTeX syntax preview",
                  "Pre-configured Harvard & Tech templates",
                  "Export to raw .tex or pristine PDF",
                  "Inline typography & spell checker",
                  "Custom macro & styling controls",
                  "Version history & multiple drafts",
                ].map((feature) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={feature}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon
                        sx={{ color: "#0f172a", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#334155" }}
                      >
                        {feature}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Box
                sx={{
                  bgcolor: "#f1f5f9",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image="https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=700&q=80"
                  alt="Resume Builder Editor"
                  sx={{ borderRadius: "8px", objectFit: "cover" }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 5. DETAILED FEATURE SHOWCASE 2: INVOICE & BILL MAKER */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Box
                sx={{
                  bgcolor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
                }}
              >
                <CardMedia
                  component="img"
                  height="280"
                  image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=700&q=80"
                  alt="Billing and Invoices"
                  sx={{ borderRadius: "8px", objectFit: "cover" }}
                />
              </Box>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Typography
                variant="overline"
                sx={{ color: "#64748b", fontWeight: 700 }}
              >
                FINANCE & BILLING
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, mt: 1, mb: 2 }}>
                Automated Online Billing System
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "#64748b", mb: 3, lineHeight: 1.6 }}
              >
                Generate customized invoices with line items, tax breakdowns,
                discounts, and payment links in under 60 seconds.
              </Typography>

              <Grid container spacing={1.5}>
                {[
                  "Auto tax & currency conversion",
                  "Instant PDF & shareable link generation",
                  "Payment status tracking (Paid/Pending)",
                  "Recurring subscription invoices",
                  "Client address book management",
                  "One-click receipt email dispatch",
                ].map((feature) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={feature}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon
                        sx={{ color: "#0f172a", fontSize: 20 }}
                      />
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, color: "#334155" }}
                      >
                        {feature}
                      </Typography>
                    </Stack>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 6. STATS / METRICS BANNER (Full-width Dark Strip) */}
      <Box
        className="stats-section"
        sx={{
          "--stats-bg": `url(${pete})`,
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: "relative",
            zIndex: 1,
          }}
        >
          <Grid container spacing={4} textAlign="center">
            {[
              { number: "18K+", label: "Websites Launched" },
              { number: "45K+", label: "LaTeX Resumes Compiled" },
              { number: "$12M+", label: "Invoiced by Users" },
              { number: "99.9%", label: "Uptime Reliability" },
            ].map((stat) => (
              <Grid size={{ xs: 6, md: 3 }} key={stat.label}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 800,
                    letterSpacing: -1,
                  }}
                >
                  {stat.number}
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#cbd5e1",
                    mt: 0.5,
                    fontWeight: 500,
                  }}
                >
                  {stat.label}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 7. TESTIMONIALS */}
      <Box sx={{ py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1.5 }}>
              Loved by Creators Worldwide
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Hear how builders, software engineers, and freelancers scale their
              work.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {/* Normal Testimonial */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 3.5,
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar src="https://i.pravatar.cc/100?img=1" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Elena Rostova
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Full Stack Engineer
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.6 }}
                >
                  "The LaTeX resume generator is unbeatable. I updated my resume
                  in 10 minutes and landed interviews at top tech firms."
                </Typography>
              </Card>
            </Grid>

            {/* Featured Active Dark Testimonial */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 3.5,
                  bgcolor: "#0b1329",
                  color: "#ffffff",
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar src="https://i.pravatar.cc/100?img=33" />
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 700, color: "#ffffff" }}
                    >
                      Marcus Vance
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94a3b8" }}>
                      Freelance Consultant
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "#cbd5e1", lineHeight: 1.6 }}
                >
                  "Having the site builder and the invoice generator under one
                  roof saved me hundreds of dollars in SaaS subscriptions each
                  month."
                </Typography>
              </Card>
            </Grid>

            {/* Normal Testimonial */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 3.5,
                  border: "1px solid #e2e8f0",
                  borderRadius: "12px",
                  height: "100%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Avatar src="https://i.pravatar.cc/100?img=12" />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      Sarah Jenkins
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#64748b" }}>
                      Store Owner
                    </Typography>
                  </Box>
                </Stack>
                <Typography
                  variant="body2"
                  sx={{ color: "#475569", lineHeight: 1.6 }}
                >
                  "The website builder was so easy to customize. We had our
                  store up and receiving payments on day one without writing
                  backend code."
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 8. PRICING PLANS */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f8fafc" }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Transparent Pricing Plans
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Choose the right tier to launch and scale your online presence.
            </Typography>
          </Box>

          <Grid container spacing={3} alignItems="center">
            {/* Starter Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Starter
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 2 }}>
                  $12
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "#64748b" }}
                  >
                    /mo
                  </Typography>
                </Typography>
                <Stack spacing={1.5} sx={{ my: 3, textAlign: "left" }}>
                  {[
                    "1 Hosted Website",
                    "3 LaTeX Resumes",
                    "20 Monthly Invoices",
                    "Standard Support",
                  ].map((item) => (
                    <Stack
                      direction="row"
                      spacing={1}
                      key={item}
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#0f172a" }}
                      />
                      <Typography variant="body2" sx={{ color: "#475569" }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#0f172a",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                >
                  Select Plan
                </Button>
              </Card>
            </Grid>

            {/* Popular Plan (Dark Highlighted) */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  bgcolor: "#0b1329",
                  color: "#ffffff",
                  textAlign: "center",
                  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
                }}
              >
                <Typography
                  variant="overline"
                  sx={{
                    bgcolor: "rgba(255,255,255,0.15)",
                    px: 1.5,
                    py: 0.3,
                    borderRadius: "20px",
                    fontWeight: 700,
                  }}
                >
                  MOST POPULAR
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 2 }}>
                  $24
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "#94a3b8" }}
                  >
                    /mo
                  </Typography>
                </Typography>
                <Stack spacing={1.5} sx={{ my: 3, textAlign: "left" }}>
                  {[
                    "5 Hosted Websites",
                    "Unlimited LaTeX Resumes",
                    "Unlimited Invoices",
                    "Custom Domains",
                    "Priority 24/7 Support",
                  ].map((item) => (
                    <Stack
                      direction="row"
                      spacing={1}
                      key={item}
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#38bdf8" }}
                      />
                      <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    bgcolor: "#ffffff",
                    color: "#0b1329",
                    fontWeight: 700,
                    "&:hover": { bgcolor: "#f1f5f9" },
                  }}
                >
                  Get Started
                </Button>
              </Card>
            </Grid>

            {/* Pro / Enterprise Plan */}
            <Grid size={{ xs: 12, md: 4 }}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
                  Agency
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, my: 2 }}>
                  $49
                  <Typography
                    component="span"
                    variant="body2"
                    sx={{ color: "#64748b" }}
                  >
                    /mo
                  </Typography>
                </Typography>
                <Stack spacing={1.5} sx={{ my: 3, textAlign: "left" }}>
                  {[
                    "Unlimited Websites",
                    "Team Multi-User Access",
                    "White-labeled Invoices",
                    "LaTeX Macro API",
                    "Dedicated Account Manager",
                  ].map((item) => (
                    <Stack
                      direction="row"
                      spacing={1}
                      key={item}
                      alignItems="center"
                    >
                      <CheckCircleIcon
                        sx={{ fontSize: 18, color: "#0f172a" }}
                      />
                      <Typography variant="body2" sx={{ color: "#475569" }}>
                        {item}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
                <Button
                  fullWidth
                  variant="outlined"
                  sx={{
                    textTransform: "none",
                    borderColor: "#0f172a",
                    color: "#0f172a",
                    fontWeight: 600,
                  }}
                >
                  Select Plan
                </Button>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* 9. BOTTOM CALL TO ACTION BANNER */}
      <Box
        className="stats-section"
        sx={{
          "--stats-bg": `url(${petf})`,
        }}
      >
        <Container
          maxWidth="md"
          sx={{ position: "relative", zIndex: 1, textAlign: "center" }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Ready to Build Your Online Career and Business?
          </Typography>
          <Typography variant="body1" sx={{ color: "#94a3b8", mb: 4 }}>
            Join thousands of professionals already managing their sites,
            resumes, and client invoices effortlessly.
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#ffffff",
              color: "#0b1329",
              fontWeight: 700,
              px: 4,
              py: 1.5,
              textTransform: "none",
              borderRadius: "6px",
              "&:hover": { bgcolor: "#f1f5f9" },
            }}
          >
            Start Your Free Trial
          </Button>
        </Container>
      </Box>

      {/* 10. BLOG / RESOURCES SECTION */}
      <Box sx={{ py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <Box textAlign="center" sx={{ mb: 6 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Guides & Tutorials
            </Typography>
            <Typography variant="body1" sx={{ color: "#64748b" }}>
              Learn how to optimize your resume, boost site conversions, and
              bill clients faster.
            </Typography>
          </Box>

          <Grid container spacing={3}>
            {[
              {
                title:
                  "How to write LaTeX resumes that score 99+ on ATS parsers",
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
                tag: "Career",
              },
              {
                title:
                  "5 Website layouts that doubled client conversions in 2026",
                image:
                  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
                tag: "Design",
              },
              {
                title:
                  "Best practices for automated invoicing and tax compliance",
                image:
                  "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=600&q=80",
                tag: "Finance",
              },
            ].map((blog, idx) => (
              <Grid size={{ xs: 12, md: 4 }} key={idx}>
                <Card
                  sx={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "12px",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    height="180"
                    image={blog.image}
                    alt={blog.title}
                  />
                  <CardContent sx={{ p: 3 }}>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#64748b",
                        fontWeight: 700,
                        textTransform: "uppercase",
                      }}
                    >
                      {blog.tag}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 700, mt: 0.5, mb: 2, lineHeight: 1.4 }}
                    >
                      {blog.title}
                    </Typography>
                    <Button
                      variant="text"
                      size="small"
                      endIcon={<ArrowForwardIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        color: "#0f172a",
                        p: 0,
                      }}
                    >
                      Read Article
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 11. FOOTER */}
      <Box sx={{ borderTop: "1px solid #e2e8f0", py: 8, bgcolor: "#ffffff" }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 4 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <img
                  src="/amko.png"
                  alt="AMKO Logo"
                  style={{ width: 35, height: 35 }}
                />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  AMKO
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ color: "#64748b", lineHeight: 1.6, maxWidth: 300 }}
              >
                The all-in-one workspace for website design, LaTeX resumes, and
                online client invoicing.
              </Typography>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Product
              </Typography>
              <Stack spacing={1}>
                {[
                  "Website Builder",
                  "LaTeX Resume",
                  "Bill Maker",
                  "Templates",
                ].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      "&:hover": { color: "#0f172a" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Resources
              </Typography>
              <Stack spacing={1}>
                {["Documentation", "LaTeX Cheatsheet", "Guides", "API"].map(
                  (item) => (
                    <Typography
                      key={item}
                      variant="body2"
                      sx={{
                        color: "#64748b",
                        cursor: "pointer",
                        "&:hover": { color: "#0f172a" },
                      }}
                    >
                      {item}
                    </Typography>
                  ),
                )}
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Company
              </Typography>
              <Stack spacing={1}>
                {[
                  "About Us",
                  "Careers",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((item) => (
                  <Typography
                    key={item}
                    variant="body2"
                    sx={{
                      color: "#64748b",
                      cursor: "pointer",
                      "&:hover": { color: "#0f172a" },
                    }}
                  >
                    {item}
                  </Typography>
                ))}
              </Stack>
            </Grid>

            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                Contact
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
                support@AMKO.io
              </Typography>
              <Typography variant="body2" sx={{ color: "#64748b" }}>
                +1 (555) 019-2834
              </Typography>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          <Typography
            variant="caption"
            sx={{ color: "#94a3b8", display: "block", textAlign: "center" }}
          >
            © {new Date().getFullYear()} AMKO Inc. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
