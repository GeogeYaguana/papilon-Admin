import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from '../hooks/useAuth';
import { AuthService } from '../services/AuthService';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';
import '../layouts/ClippedDrawer.css';
const drawerWidth = 240;

interface DrawerProps {
  children: React.ReactNode;
}

const ClippedDrawer: React.FC<DrawerProps> = ({ children }) => {

  const navigate = useNavigate(); // Hook para manejar navegación
  const { logout,state } = useAuth(); // Asumiendo que obtienes userId de state.userId
  const [, setFacturas] = useState<any[]>([]);

  // Define acciones específicas para cada botón
  const handleProductosClick = () => {
    navigate('/dashboard'); // Redirigir a la ruta /productos
  };

  const handleVerCanjesClick = () => {
    navigate('/canjes'); // Redirigir a la ruta /canjes
  };

  const handleRegistrarFacturasClick = () => {
    navigate('/registrar-factura'); // Redirigir a la ruta /registrar-facturas
  };

  const handleVerFacturasClick = async() => {
    try {
      const response = await axiosInstance.get(`/facturas/usuario/${state.userId}`);
      setFacturas(response.data.facturas);
      navigate('/facturas', { state: { facturas: response.data.facturas } });
    } catch (err: any) {
      console.error(err);
      alert(
        err.response?.data?.error ||
          'Error al obtener facturas para este usuario'
      );
    }  };

    const handleLogout = () => {
      AuthService.logout();
      logout(); // Si estás usando un AuthContext
      navigate('/login'); // Redirigir a login
    };

  const logoUrl = 'https://firebasestorage.googleapis.com/v0/b/papilon-baa86.appspot.com/o/LineaGrafica%2FLOGO_PAPILON%20HORIZONTAL.png?alt=media&token=b9f4dd30-8ae4-4b03-909b-f0292c284e18'
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1, 
        backgroundColor: '#fff',
        }}>
        <Toolbar>
          <img src={logoUrl} alt='Logo' className="logoH"/>
          <div style={{ flexGrow: 1 }}></div>
          <button className="logoutButton" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </Toolbar>

      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton onClick={handleProductosClick}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Productos" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleVerCanjesClick}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Ver Canjes" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleRegistrarFacturasClick}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Registrar Facturas" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton onClick={handleVerFacturasClick}>
                <ListItemIcon>
                  <MailIcon />
                </ListItemIcon>
                <ListItemText primary="Ver Facturas" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default ClippedDrawer;
