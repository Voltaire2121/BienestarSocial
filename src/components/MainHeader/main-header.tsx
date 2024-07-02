import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Container from '@mui/material/Container'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import './main-header.css'
import { Menu, MenuItem, Typography } from '@mui/material'
import { useState } from 'react'
import { userLogout } from '../../services/firebase'

const pages = ['Usuarios', 'Citas', 'Profesionales', 'Formulas', 'Examenes']

const MainHeader = () => {
  //const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = useState(null)

  // const handleOpenNavMenu = (event) => {
  //   setAnchorElNav(event.currentTarget)
  // }
  const handleOpenUserMenu = (event: any) => {
    setAnchorElUser(event.currentTarget)
  }

  // const handleCloseNavMenu = () => {
  //   setAnchorElNav(null)
  // }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleLogout = () => {
    userLogout()
  }

  return (
    <AppBar
      position="static"
      style={{ backgroundColor: '#35a836', height: '90px' }}
    >
      <Container maxWidth="xl" style={{ height: '90 px' }}>
        <Toolbar style={{ height: '90px' }}>
          <img
            className="Shown_when_big image"
            src="../src/assets/logo_bienestar_small.svg"
          />
          <IconButton
            size="large"
            color="warning"
            style={{ width: 50, height: 50, zIndex: 30 }}
          />
          {/* <Box sx={{ flexGrow: 1 }}>
            {<IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="white"
              style={{ color: 'white' }}
            > }
            <MenuIcon className="Shown_when_small" />
            </IconButton>
          </Box> */}
          <div className="small-image-container">
            <img
              className="Shown_when_small small-image"
              src="../src/assets/logo_bienestar_small.svg"
            />
          </div>
          <Box
            className="Shown_when_big top-list"
            style={{ justifyContent: 'center', height: '90px' }}
            sx={{ flexGrow: 1 }}
          >
            <ul>
              {pages.map((page) => (
                <div className="header-li" key={page}>
                  {page}{' '}
                </div>
              ))}

              {/* <div className="header-li">Citas</div>
              <div className="header-li">Profesionales</div>
              <div className="header-li">Fómulas</div>
              <div className="header-li">Exámenes</div> */}
            </ul>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Abrir opciones" onClick={handleOpenUserMenu}>
              <IconButton sx={{ p: 0 }}>
                <Avatar
                  alt="Cristian Jimenez"
                  src="../"
                  sx={{
                    width: '60px',
                    height: '60px',
                    backgroundColor: '#9edbab',
                  }}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem key={1} onClick={handleLogout}>
                <Typography textAlign="center">Cerrar sesion</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
export default MainHeader
