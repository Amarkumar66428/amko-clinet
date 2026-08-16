import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { ThemeProvider } from "@emotion/react";
import theme from "./utils/theme";
import { SnackbarProvider } from "./features/snackBar";
import ServerError from "./pages/ServerError";
import { Provider } from "react-redux";
import { store } from "./app/store";
import "./sass/global.scss";
import "./App.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <SnackbarProvider>
            <AppRouter />
            <ServerError />
          </SnackbarProvider>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
