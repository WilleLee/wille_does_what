import { GlobalPortal } from "@/GlobalPortal";
import { Navigate, Route, Routes } from "react-router-dom";
import StartPage from "@pages/index";
import { Global, css } from "@emotion/react";
import { ReactNode } from "react";
import colors from "@constants/colors";

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
      <Layout>
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="*" element={<Navigate replace to="/" />} />
        </Routes>
      </Layout>
    </GlobalPortal.Provider>
  );
}

export default App;

interface LayoutProps {
  children: ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <div
      css={css`
        max-width: 100%;
        width: 100%;
        overflow-x: hidden;
        padding: 0;
        margin: 0;
        height: auto;
      `}
    >
      <div
        css={css`
          width: 100%;
          max-width: 380px;
          margin: 0 auto;
          padding: 16px 8px;
          background: ${colors.background};
        `}
      >
        {children}
      </div>
    </div>
  );
}
