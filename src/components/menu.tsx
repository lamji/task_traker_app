import * as React from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Box, Button, Link, Typography } from '@mui/material';
import { useRouter } from 'next/router'

export default function BasicMenu({ name }: { name: string }) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
   const router = useRouter()

  const path = router.pathname

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<KeyboardArrowDownIcon />}
        sx={{
          color: 'black',
          background: 'transparent',
          '&:hover': {
            background: 'transparent',
          },
        }}
      >
        {name}
      </Button>

      <Menu id="basic-menu" anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
          <Link href="/add-status" style={{ textDecoration: 'none', color: 'black', width: "100%" }}>
            Add Status
          </Link>
        </MenuItem>
        <MenuItem sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
          <Link href="/notes" style={{ textDecoration: 'none', color: 'black', width: "100%" }}>
            Update Ticket
          </Link>
        </MenuItem>
        <MenuItem sx={{ '&:hover': { backgroundColor: '#e0e0e0' } }}>
          <Link href="/notes/srng" style={{ textDecoration: 'none', color: 'black', width: "100%" }}>
            Notes
          </Link>
        </MenuItem>
      </Menu>
    </div>
  );
}
