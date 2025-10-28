import React, { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  // Force LTR direction on every render
  useEffect(() => {
    document.documentElement.setAttribute("dir", "ltr");
    document.documentElement.setAttribute("lang", "en");
    document.body.setAttribute("dir", "ltr");
  }, []);

  return <AppRoutes />;
};

export default App;
