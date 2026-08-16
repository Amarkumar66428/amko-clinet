import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Drawer,
  AppBar,
  Toolbar,
  Stack,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Tooltip,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Visibility as PreviewIcon,
  Edit as EditIcon,
  FileDownload as ExportIcon,
  FileUpload as ImportIcon,
  RestartAlt as ResetIcon,
  FormatAlignLeft,
  FormatAlignCenter,
  FormatAlignRight,
  ViewQuilt as TemplateIcon,
} from "@mui/icons-material";

// @dnd-kit core and sortable imports
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- INITIAL TEMPLATES ---
const TEMPLATES = {
  service: [
    {
      id: "comp-1",
      type: "HeroSection",
      props: {
        headline: "Grow Your Business With Modern Solutions",
        subheadline:
          "We help startups and enterprises build scalable web & mobile apps.",
        buttonText: "Book a Consultation",
        textColor: "#0f172a",
        bgColor: "#f8fafc",
        paddingY: 48,
        align: "center",
      },
    },
    {
      id: "comp-2",
      type: "FeatureCards",
      props: {
        title1: "Cloud Architecture",
        desc1: "Robust AWS & GCP infrastructure designed for massive scale.",
        title2: "Custom Full-Stack Dev",
        desc2: "High-performance React, Node, and MERN applications.",
        title3: "Security & Audits",
        desc3: "Enterprise-grade code reviews and security optimizations.",
        bgColor: "#ffffff",
        paddingY: 40,
      },
    },
    {
      id: "comp-3",
      type: "CallToAction",
      props: {
        title: "Ready to start your next project?",
        subtitle:
          "Get in touch with our engineering team today for a free assessment.",
        buttonText: "Contact Sales",
        bgColor: "#0b1329",
        textColor: "#ffffff",
        paddingY: 48,
      },
    },
  ],
  ecommerce: [
    {
      id: "comp-101",
      type: "HeroSection",
      props: {
        headline: "Exclusive Minimalist Collection",
        subheadline:
          "Hand-crafted modern essentials for everyday productivity.",
        buttonText: "Shop New Arrivals",
        textColor: "#ffffff",
        bgColor: "#1e293b",
        paddingY: 56,
        align: "center",
      },
    },
    {
      id: "comp-102",
      type: "ProductGrid",
      props: {
        item1Title: "Ergonomic Desk Mat",
        item1Price: "$49.00",
        item1Img:
          "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=500&q=80",
        item2Title: "Mechanical Keyboard",
        item2Price: "$129.00",
        item2Img:
          "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=500&q=80",
        bgColor: "#ffffff",
        paddingY: 40,
      },
    },
  ],
};

// --- DYNAMIC RENDERER FOR BLOCK TYPES ---
function ComponentRenderer({ component }) {
  const { type, props } = component;

  switch (type) {
    case "HeroSection":
      return (
        <Box
          sx={{
            py: `${props.paddingY}px`,
            px: 4,
            bgcolor: props.bgColor,
            color: props.textColor,
            textAlign: props.align || "center",
          }}
        >
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, mb: 1.5, letterSpacing: -0.5 }}
          >
            {props.headline}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              maxWidth: 700,
              mx: props.align === "center" ? "auto" : 0,
              mb: 3,
              opacity: 0.85,
            }}
          >
            {props.subheadline}
          </Typography>
          {props.buttonText && (
            <Button
              variant="contained"
              sx={{
                bgcolor: props.textColor === "#ffffff" ? "#ffffff" : "#0f172a",
                color: props.textColor === "#ffffff" ? "#0f172a" : "#ffffff",
                fontWeight: 700,
                px: 3.5,
                py: 1.2,
                textTransform: "none",
                "&:hover": { opacity: 0.9 },
              }}
            >
              {props.buttonText}
            </Button>
          )}
        </Box>
      );

    case "FeatureCards":
      return (
        <Box sx={{ py: `${props.paddingY}px`, px: 4, bgcolor: props.bgColor }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
            {[
              { t: props.title1, d: props.desc1 },
              { t: props.title2, d: props.desc2 },
              { t: props.title3, d: props.desc3 },
            ].map((item, idx) => (
              <Card
                key={idx}
                variant="outlined"
                sx={{ flex: 1, p: 2, borderRadius: 2 }}
              >
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                    {item.t}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.d}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      );

    case "ProductGrid":
      return (
        <Box sx={{ py: `${props.paddingY}px`, px: 4, bgcolor: props.bgColor }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 800, mb: 3, textAlign: "center" }}
          >
            Featured Products
          </Typography>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={3}
            justifyContent="center"
          >
            {[
              {
                title: props.item1Title,
                price: props.item1Price,
                img: props.item1Img,
              },
              {
                title: props.item2Title,
                price: props.item2Price,
                img: props.item2Img,
              },
            ].map((p, idx) => (
              <Card
                key={idx}
                sx={{ width: { xs: "100%", sm: 300 }, borderRadius: 2 }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={p.img}
                  alt={p.title}
                />
                <CardContent>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    {p.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="primary"
                    sx={{ fontWeight: 600, mt: 0.5 }}
                  >
                    {p.price}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>
      );

    case "CallToAction":
      return (
        <Box
          sx={{
            py: `${props.paddingY}px`,
            px: 4,
            bgcolor: props.bgColor,
            color: props.textColor,
            textAlign: "center",
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            {props.title}
          </Typography>
          <Typography
            variant="body2"
            sx={{ maxWidth: 600, mx: "auto", mb: 3, opacity: 0.8 }}
          >
            {props.subtitle}
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#38bdf8",
              color: "#0b1329",
              fontWeight: 700,
              textTransform: "none",
              px: 4,
              "&:hover": { bgcolor: "#0284c7", color: "#ffffff" },
            }}
          >
            {props.buttonText}
          </Button>
        </Box>
      );

    default:
      return <Box sx={{ p: 4 }}>Unknown Component: {type}</Box>;
  }
}

// --- SORTABLE WRAPPER FOR INDIVIDUAL CANVAS BLOCKS ---
function SortableBlock({
  component,
  isSelected,
  onSelect,
  onDelete,
  isPreview,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: component.id, disabled: isPreview });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      onClick={() => !isPreview && onSelect(component.id)}
      sx={{
        cursor: isPreview ? "default" : "pointer",
        outline:
          !isPreview && isSelected
            ? "3px solid #0284c7"
            : "1px dashed transparent",
        "&:hover": {
          outline: !isPreview && !isSelected ? "2px dashed #94a3b8" : undefined,
        },
        position: "relative",
        my: 0.5,
      }}
    >
      {/* Component Type Badge & Quick Controls */}
      {!isPreview && (
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            bgcolor: "rgba(15, 23, 42, 0.8)",
            backdropFilter: "blur(4px)",
            borderRadius: 1,
            px: 1,
            py: 0.5,
          }}
        >
          <Box
            {...attributes}
            {...listeners}
            sx={{ cursor: "grab", display: "flex", color: "#fff" }}
          >
            <DragIcon fontSize="small" />
          </Box>
          <Typography
            variant="caption"
            sx={{ color: "#fff", fontWeight: 600, px: 0.5 }}
          >
            {component.type}
          </Typography>
          <IconButton
            size="small"
            sx={{ color: "#ef4444", p: 0.2 }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(component.id);
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      )}

      {/* Render Component Content */}
      <ComponentRenderer component={component} />
    </Box>
  );
}

// --- MAIN BUILDER COMPONENT ---
export default function WebsiteBuilder() {
  const [components, setComponents] = useState(TEMPLATES.service);
  const [selectedId, setSelectedId] = useState(components[0]?.id || null);
  const [isPreview, setIsPreview] = useState(false);
  const [jsonDialogOpen, setJsonDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");

  const selectedComponent = components.find((c) => c.id === selectedId);

  // DnD Sensors configuration
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setComponents((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const updateProp = (key, value) => {
    setComponents((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return { ...c, props: { ...c.props, [key]: value } };
        }
        return c;
      }),
    );
  };

  const addBlock = (type) => {
    const newId = `comp-${Date.now()}`;
    let newBlock = { id: newId, type, props: {} };

    if (type === "HeroSection") {
      newBlock.props = {
        headline: "Your Main Value Proposition",
        subheadline:
          "Describe your product or service in one or two clear sentences.",
        buttonText: "Get Started Now",
        textColor: "#0f172a",
        bgColor: "#f1f5f9",
        paddingY: 48,
        align: "center",
      };
    } else if (type === "FeatureCards") {
      newBlock.props = {
        title1: "Speed & Power",
        desc1: "Lightning fast execution and modern architecture.",
        title2: "Full Customization",
        desc2: "Fine-tune every visual setting instantly.",
        title3: "Instant Deploy",
        desc3: "Push directly to live hosting with one click.",
        bgColor: "#ffffff",
        paddingY: 40,
      };
    } else if (type === "ProductGrid") {
      newBlock.props = {
        item1Title: "Pro Plan Subscription",
        item1Price: "$29/mo",
        item1Img:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500&q=80",
        item2Title: "Enterprise Suite",
        item2Price: "$99/mo",
        item2Img:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500&q=80",
        bgColor: "#ffffff",
        paddingY: 40,
      };
    } else if (type === "CallToAction") {
      newBlock.props = {
        title: "Ready to elevate your workflow?",
        subtitle: "Join over 10,000 satisfied users building daily.",
        buttonText: "Sign Up Free",
        bgColor: "#0b1329",
        textColor: "#ffffff",
        paddingY: 40,
      };
    }

    setComponents([...components, newBlock]);
    setSelectedId(newId);
  };

  const deleteBlock = (id) => {
    const filtered = components.filter((c) => c.id !== id);
    setComponents(filtered);
    if (selectedId === id) {
      setSelectedId(filtered[0]?.id || null);
    }
  };

  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(components, null, 2);
    setJsonInput(jsonStr);
    setJsonDialogOpen(true);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        setComponents(parsed);
        setSelectedId(parsed[0]?.id || null);
        setJsonDialogOpen(false);
      } else {
        alert("Invalid JSON structure: Root must be an array of components.");
      }
    } catch {
      alert("Invalid JSON format. Please check your syntax.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        bgcolor: "#f1f5f9",
      }}
    >
      {/* 1. TOP BUILDER TOOLBAR */}
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "#0b1329", borderBottom: "1px solid #1e293b" }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#38bdf8" }}>
              SITE BUILDER
            </Typography>
            <Chip
              label={isPreview ? "Preview Mode" : "Editing Mode"}
              size="small"
              sx={{
                bgcolor: isPreview ? "#10b981" : "#334155",
                color: "#fff",
                fontWeight: 600,
              }}
            />
          </Stack>

          <Stack direction="row" spacing={1.5}>
            {/* Quick Templates */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<TemplateIcon />}
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                textTransform: "none",
              }}
              onClick={() => {
                setComponents(TEMPLATES.service);
                setSelectedId("comp-1");
              }}
            >
              Services Template
            </Button>
            <Button
              size="small"
              variant="outlined"
              startIcon={<TemplateIcon />}
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                textTransform: "none",
              }}
              onClick={() => {
                setComponents(TEMPLATES.ecommerce);
                setSelectedId("comp-101");
              }}
            >
              E-Commerce Template
            </Button>

            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: "#334155", my: 1 }}
            />

            {/* Import / Export */}
            <Button
              size="small"
              variant="outlined"
              startIcon={<ExportIcon />}
              sx={{
                color: "#cbd5e1",
                borderColor: "#334155",
                textTransform: "none",
              }}
              onClick={handleExportJSON}
            >
              Schema JSON
            </Button>

            {/* Toggle Preview */}
            <Button
              size="small"
              variant="contained"
              startIcon={isPreview ? <EditIcon /> : <PreviewIcon />}
              sx={{
                bgcolor: isPreview ? "#f59e0b" : "#38bdf8",
                color: "#0b1329",
                fontWeight: 700,
                textTransform: "none",
              }}
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? "Back to Editor" : "Preview Site"}
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* 2. MAIN BUILDER BODY */}
      <Box sx={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* LEFT SIDEBAR: ADD COMPONENTS */}
        {!isPreview && (
          <Box
            sx={{
              width: 260,
              bgcolor: "#ffffff",
              borderRight: "1px solid #e2e8f0",
              p: 2,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#64748b",
                mb: 2,
                textTransform: "uppercase",
              }}
            >
              Add Sections
            </Typography>
            <Stack spacing={1.5}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addBlock("HeroSection")}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "#0f172a",
                  borderColor: "#cbd5e1",
                }}
              >
                Hero Header
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addBlock("FeatureCards")}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "#0f172a",
                  borderColor: "#cbd5e1",
                }}
              >
                3-Card Features
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addBlock("ProductGrid")}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "#0f172a",
                  borderColor: "#cbd5e1",
                }}
              >
                Product Showcase
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => addBlock("CallToAction")}
                sx={{
                  justifyContent: "flex-start",
                  textTransform: "none",
                  color: "#0f172a",
                  borderColor: "#cbd5e1",
                }}
              >
                Call To Action
              </Button>
            </Stack>

            <Divider sx={{ my: 3 }} />

            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                color: "#64748b",
                mb: 1,
                textTransform: "uppercase",
              }}
            >
              Page Structure ({components.length})
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#94a3b8", display: "block", mb: 2 }}
            >
              Drag blocks directly on the canvas to reorder.
            </Typography>
            <Stack spacing={1}>
              {components.map((c, index) => (
                <Paper
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  sx={{
                    p: 1.2,
                    cursor: "pointer",
                    bgcolor: selectedId === c.id ? "#e0f2fe" : "#f8fafc",
                    border:
                      selectedId === c.id
                        ? "1px solid #38bdf8"
                        : "1px solid #e2e8f0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#1e293b" }}
                  >
                    {index + 1}. {c.type}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteBlock(c.id);
                    }}
                  >
                    <DeleteIcon fontSize="small" sx={{ color: "#94a3b8" }} />
                  </IconButton>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}

        {/* CENTER CANVAS (DRAG & DROP AREA) */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            p: isPreview ? 0 : 3,
            bgcolor: isPreview ? "#ffffff" : "#f8fafc",
          }}
        >
          <Box
            sx={{
              maxWidth: isPreview ? "100%" : "950px",
              mx: "auto",
              minHeight: "80vh",
              bgcolor: "#ffffff",
              boxShadow: isPreview
                ? "none"
                : "0 10px 25px -5px rgba(0,0,0,0.1)",
              borderRadius: isPreview ? 0 : 2,
              overflow: "hidden",
            }}
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={components.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {components.map((comp) => (
                  <SortableBlock
                    key={comp.id}
                    component={comp}
                    isSelected={selectedId === comp.id}
                    onSelect={setSelectedId}
                    onDelete={deleteBlock}
                    isPreview={isPreview}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </Box>
        </Box>

        {/* RIGHT SIDEBAR: PROPERTIES INSPECTOR */}
        {!isPreview && (
          <Box
            sx={{
              width: 320,
              bgcolor: "#ffffff",
              borderLeft: "1px solid #e2e8f0",
              p: 3,
              overflowY: "auto",
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 800, color: "#0f172a", mb: 0.5 }}
            >
              Block Settings
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "#64748b", display: "block", mb: 3 }}
            >
              {selectedComponent
                ? `Customizing ${selectedComponent.type}`
                : "Click any block to edit its properties"}
            </Typography>

            {selectedComponent ? (
              <Stack spacing={2.5}>
                {/* Specific controls per block type */}
                {selectedComponent.type === "HeroSection" && (
                  <>
                    <TextField
                      label="Headline"
                      fullWidth
                      multiline
                      rows={2}
                      size="small"
                      value={selectedComponent.props.headline || ""}
                      onChange={(e) => updateProp("headline", e.target.value)}
                    />
                    <TextField
                      label="Subheadline"
                      fullWidth
                      multiline
                      rows={3}
                      size="small"
                      value={selectedComponent.props.subheadline || ""}
                      onChange={(e) =>
                        updateProp("subheadline", e.target.value)
                      }
                    />
                    <TextField
                      label="Button Label"
                      fullWidth
                      size="small"
                      value={selectedComponent.props.buttonText || ""}
                      onChange={(e) => updateProp("buttonText", e.target.value)}
                    />
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ fontWeight: 600, display: "block", mb: 0.5 }}
                      >
                        Alignment
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {["left", "center", "right"].map((align) => (
                          <Button
                            key={align}
                            variant={
                              selectedComponent.props.align === align
                                ? "contained"
                                : "outlined"
                            }
                            size="small"
                            onClick={() => updateProp("align", align)}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {align}
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  </>
                )}

                {selectedComponent.type === "FeatureCards" && (
                  <>
                    <TextField
                      label="Feature 1 Title"
                      size="small"
                      value={selectedComponent.props.title1 || ""}
                      onChange={(e) => updateProp("title1", e.target.value)}
                    />
                    <TextField
                      label="Feature 1 Description"
                      size="small"
                      multiline
                      value={selectedComponent.props.desc1 || ""}
                      onChange={(e) => updateProp("desc1", e.target.value)}
                    />
                    <Divider />
                    <TextField
                      label="Feature 2 Title"
                      size="small"
                      value={selectedComponent.props.title2 || ""}
                      onChange={(e) => updateProp("title2", e.target.value)}
                    />
                    <TextField
                      label="Feature 2 Description"
                      size="small"
                      multiline
                      value={selectedComponent.props.desc2 || ""}
                      onChange={(e) => updateProp("desc2", e.target.value)}
                    />
                  </>
                )}

                {selectedComponent.type === "ProductGrid" && (
                  <>
                    <TextField
                      label="Product 1 Name"
                      size="small"
                      value={selectedComponent.props.item1Title || ""}
                      onChange={(e) => updateProp("item1Title", e.target.value)}
                    />
                    <TextField
                      label="Product 1 Price"
                      size="small"
                      value={selectedComponent.props.item1Price || ""}
                      onChange={(e) => updateProp("item1Price", e.target.value)}
                    />
                    <TextField
                      label="Product 1 Image URL"
                      size="small"
                      value={selectedComponent.props.item1Img || ""}
                      onChange={(e) => updateProp("item1Img", e.target.value)}
                    />
                  </>
                )}

                {selectedComponent.type === "CallToAction" && (
                  <>
                    <TextField
                      label="Heading"
                      size="small"
                      value={selectedComponent.props.title || ""}
                      onChange={(e) => updateProp("title", e.target.value)}
                    />
                    <TextField
                      label="Subtitle"
                      size="small"
                      multiline
                      rows={2}
                      value={selectedComponent.props.subtitle || ""}
                      onChange={(e) => updateProp("subtitle", e.target.value)}
                    />
                    <TextField
                      label="Button Text"
                      size="small"
                      value={selectedComponent.props.buttonText || ""}
                      onChange={(e) => updateProp("buttonText", e.target.value)}
                    />
                  </>
                )}

                {/* Universal Styling Props */}
                <Divider sx={{ my: 1 }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 700,
                    color: "#64748b",
                    textTransform: "uppercase",
                  }}
                >
                  Block Layout & Colors
                </Typography>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Background Color
                  </Typography>
                  <input
                    type="color"
                    value={selectedComponent.props.bgColor || "#ffffff"}
                    onChange={(e) => updateProp("bgColor", e.target.value)}
                    style={{
                      width: "100%",
                      height: "36px",
                      border: "1px solid #cbd5e1",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  />
                </Box>

                {selectedComponent.props.textColor && (
                  <Box>
                    <Typography
                      variant="caption"
                      sx={{ display: "block", mb: 0.5 }}
                    >
                      Text Color
                    </Typography>
                    <input
                      type="color"
                      value={selectedComponent.props.textColor || "#000000"}
                      onChange={(e) => updateProp("textColor", e.target.value)}
                      style={{
                        width: "100%",
                        height: "36px",
                        border: "1px solid #cbd5e1",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    />
                  </Box>
                )}

                <Box>
                  <Typography
                    variant="caption"
                    sx={{ display: "block", mb: 0.5 }}
                  >
                    Vertical Padding: {selectedComponent.props.paddingY || 40}px
                  </Typography>
                  <Slider
                    size="small"
                    value={selectedComponent.props.paddingY || 40}
                    min={16}
                    max={120}
                    onChange={(_, val) => updateProp("paddingY", val)}
                  />
                </Box>
              </Stack>
            ) : (
              <Typography
                variant="body2"
                sx={{ color: "#94a3b8", textAlign: "center", mt: 8 }}
              >
                Select any block on the canvas to configure its content and
                styling.
              </Typography>
            )}
          </Box>
        )}
      </Box>

      {/* 3. IMPORT / EXPORT SCHEMA DIALOG */}
      <Dialog
        open={jsonDialogOpen}
        onClose={() => setJsonDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Website JSON Schema</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: "#64748b", mb: 2 }}>
            This JSON represents the state saved to your MongoDB `Pages`
            collection. You can edit this JSON directly or copy it into your
            database.
          </Typography>
          <TextField
            multiline
            rows={12}
            fullWidth
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            sx={{ fontFamily: "monospace", fontSize: "0.85rem" }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setJsonDialogOpen(false)}
            sx={{ textTransform: "none" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleImportJSON}
            variant="contained"
            sx={{ textTransform: "none", bgcolor: "#0f172a" }}
          >
            Apply & Render Schema
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
