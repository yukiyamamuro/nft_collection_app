import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { orange } from '@mui/material/colors';

import reportWebVitals from './reportWebVitals';
import './styles/index.css';

const theme = createTheme({
  palette: {
    primary: {
      main: orange[50],
      contrastText: orange[100]
    },
    text: {
      primary: orange[50]
    },
  },
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
