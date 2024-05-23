import { ReactNode, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";

const PortalContext = createContext<HTMLDivElement | null>(null);

interface PortalProviderProps {
  children: ReactNode;
}

function PortalProvider({ children }: PortalProviderProps) {
  const [portalRef, setPortalRef] = useState<HTMLDivElement | null>(null);
  return (
    <PortalContext.Provider value={portalRef}>
      {children}
      <div
        id="portal-container"
        ref={(elem) => {
          if (!elem || portalRef) return;
          setPortalRef(elem);
        }}
      />
    </PortalContext.Provider>
  );
}

interface PortalElementProps {
  children: ReactNode;
}

function PortalElement({ children }: PortalElementProps) {
  const portalRef = useContext(PortalContext);

  if (!portalRef) return null;

  return createPortal(children, portalRef);
}

export const GlobalPortal = {
  Provider: PortalProvider,
  Element: PortalElement,
};
