import { ReactNode, createContext, useContext, useRef } from "react";
import { createPortal } from "react-dom";

const PortalContext = createContext<HTMLDivElement | null>(null);

interface PortalProviderProps {
  children: ReactNode;
}

function PortalProvider({ children }: PortalProviderProps) {
  const portalRef = useRef<HTMLDivElement>(null);
  return (
    <PortalContext.Provider value={portalRef.current}>
      {children}
      <div ref={portalRef} />
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
