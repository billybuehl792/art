import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { Container, Stack, type StackProps } from "@mui/material";
import NavDrawer from "../modals/NavDrawer";
import Breadcrumbs from "./Breadcrumbs";
import MenuIconButton from "../buttons/MenuIconButton";

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

  "& .MuiContainer-root": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

const AppBar: React.FC<StackProps> = (props) => {
  /** Values */

  const [menuOpen, setMenuOpen] = useState(false);

  /** Callbacks */

  const handleToggleMenuOpen = () => setMenuOpen((open) => !open);

  return (
    <>
      <StyledStack direction="row" {...props}>
        <Container>
          <Breadcrumbs />
          <MenuIconButton open={menuOpen} onClick={handleToggleMenuOpen} />
        </Container>
      </StyledStack>
      <NavDrawer open={menuOpen} onClose={handleToggleMenuOpen} />
    </>
  );
};

export default AppBar;
