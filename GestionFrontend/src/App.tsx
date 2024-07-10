import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Admin from "./components/Admin";
import {useKeycloak} from "@react-keycloak/web";
import {useEffect} from "react";

const App = () => {
    const { keycloak, initialized } = useKeycloak();
    console.log(keycloak,"keycloak")
    console.log(initialized,"initialized")
    if (!initialized) {
        return <div>Loading...</div>;
    }
    useEffect(() => {
        if(!initialized&& !keycloak.authenticated ){
            keycloak.logout();
        }
       else if(initialized && !keycloak.authenticated){
            keycloak.login();
        }
    }, [initialized]);

    if (!keycloak.authenticated) {
        return <div>Not authenticated</div>;
    }
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
