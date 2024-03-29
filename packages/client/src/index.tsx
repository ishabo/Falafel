import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import ReactDOM from 'react-dom';
import Routes from './components/Routes';
import theme from './theme';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto';

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Routes />
      <CssBaseline />
    </ThemeProvider>,
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
