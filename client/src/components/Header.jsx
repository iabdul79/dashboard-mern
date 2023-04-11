import { Typography, Box, useTheme } from "@mui/material";

function Header({ title, subtitle }) {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        textTransform="uppercase"
        mb="5px"
      >
        {title}
      </Typography>
      <Typography
        variant="h5"
        color={theme.palette.secondary[300]}
        textTransform="capitalize"
      >
        {subtitle}
      </Typography>
    </Box>
  );
}

export default Header;
