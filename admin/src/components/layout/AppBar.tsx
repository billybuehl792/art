import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Container,
  IconButton,
  Stack,
  useMediaQuery,
  type StackProps,
} from "@mui/material";
import {
  Menu as MenuIcon,
  MenuOpen as MenuOpenIcon,
} from "@mui/icons-material";
import NavDrawer from "../modals/NavDrawer";
import Link from "../links/Link";
import { APP_TITLE } from "../../constants";
import { truncateText } from "@/utils/sx";

const StyledStack = styled(Stack)(({ theme }) => ({
  position: "fixed",
  display: "flex",
  top: 0,
  left: 0,
  right: 0,
  height: theme.layout.appBarHeight,
  alignItems: "center",
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  zIndex: theme.zIndex.appBar,
}));

const AppBar: React.FC<StackProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);
  const isMd = useMediaQuery((theme) => theme.breakpoints.up("md"));

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <>
      <StyledStack direction="row" {...props}>
        <Container
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Link variant="h1" to="/" sx={truncateText}>
            {APP_TITLE}
          </Link>
          <IconButton color="primary" onClick={handleToggleMenuOpen}>
            {menuOpen ? <MenuOpenIcon /> : <MenuIcon />}
          </IconButton>
        </Container>
      </StyledStack>
      <NavDrawer
        open={menuOpen}
        onClose={handleToggleMenuOpen}
        {...(isMd && { anchor: "right" })}
      />
    </>
  );
};

export default AppBar;
