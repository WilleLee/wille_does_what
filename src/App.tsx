import { GlobalPortal } from "@/GlobalPortal";
import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "@pages/index";

function App() {
  return (
    <GlobalPortal.Provider>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </GlobalPortal.Provider>
  );
}

export default App;
