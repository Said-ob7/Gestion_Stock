import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
