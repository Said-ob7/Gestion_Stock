import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Pages/Home";
import Admin from "./Pages/Admin";
import { useKeycloak } from "@react-keycloak/web";
import { useEffect } from "react";

const App = () => {
  const { keycloak, initialized } = useKeycloak();
  console.log(keycloak, "keycloak");
  console.log(initialized, "initialized");
  if (!initialized) {
    return <div>Loading...</div>;
  }
  useEffect(() => {
    if (initialized) {
      if (!keycloak.authenticated) {
        keycloak.login();
      }
    }
  }, [initialized, keycloak]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/*" element={<Home />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
