import { Box } from "@mui/material";

export default function GlassCard({ as = "div", className = "", children, ...rest }) {
  return (
    <Box component={as} className={`glass-card ${className}`.trim()} {...rest}>
      {children}
    </Box>
  );
}
