import { GlobalPortal } from "@/GlobalPortal";
import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "@pages/index";
import { Global, css } from "@emotion/react";

function App() {
  return (
    <GlobalPortal.Provider>
      <Global
        styles={css`
          * {
            box-sizing: border-box;
          }
          h1,
          h2,
          h3,
          h4,
          h5,
          h6 {
            font-size: 1em;
            font-weight: normal;
            margin: 0; /* or ‘0 0 1em’ if you’re so inclined */
          }
        `}
      />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="*" element={<Navigate replace to="/" />} />
      </Routes>
    </GlobalPortal.Provider>
  );
}

export default App;
