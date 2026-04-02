import React, { createContext, useContext, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import StreamsManager from "./pages/StreamsManager";
import AddStream from "./pages/AddStream";
import Sidebar from "./components/Sidebar";

export const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

function Protected({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken") || "");

  const login = (t) => { setToken(t); localStorage.setItem("adminToken", t); };
  const logout = () => { setToken(""); localStorage.removeItem("adminToken"); };

  return (
    <AuthCtx.Provider value={{ token, login, logout }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={
          <Protected>
            <div style={{ display: "flex", minHeight: "100vh" }}>
              <Sidebar />
              <main style={{ flex: 1, padding: "2rem", overflow: "auto" }}>
                <Routes>
                  <Route path="/"         element={<Dashboard />} />
                  <Route path="/streams"  element={<StreamsManager />} />
                  <Route path="/add"      element={<AddStream />} />
                </Routes>
              </main>
            </div>
          </Protected>
        } />
      </Routes>
    </AuthCtx.Provider>
  );
}
