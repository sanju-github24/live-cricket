import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MatchPage from "./pages/MatchPage";
import WatchPage from "./pages/WatchPage";
import SchedulePage from "./pages/SchedulePage";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/"            element={<Home />} />
        <Route path="/match/:id"   element={<MatchPage />} />
        <Route path="/watch/:id"   element={<WatchPage />} />
        <Route path="/schedule"    element={<SchedulePage />} />
      </Routes>
    </>
  );
}
