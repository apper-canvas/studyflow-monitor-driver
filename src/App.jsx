import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Sidebar from "@/components/organisms/Sidebar";
import Dashboard from "@/components/pages/Dashboard";
import Assignments from "@/components/pages/Assignments";
import Courses from "@/components/pages/Courses";
import Grades from "@/components/pages/Grades";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex">
        <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />
        
        <div className="flex-1 flex flex-col min-h-screen">
          <Routes>
            <Route path="/" element={<Dashboard onMenuClick={handleMenuClick} />} />
            <Route path="/assignments" element={<Assignments onMenuClick={handleMenuClick} />} />
            <Route path="/courses" element={<Courses onMenuClick={handleMenuClick} />} />
            <Route path="/grades" element={<Grades onMenuClick={handleMenuClick} />} />
          </Routes>
        </div>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="toast-container"
        />
      </div>
    </Router>
  );
}

export default App;