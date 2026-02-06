"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type HeaderTheme = "white" | "navy" | "yellow";

type HeaderThemeContextValue = {
  theme: HeaderTheme;
  setTheme: (theme: HeaderTheme) => void;
};

const HeaderThemeContext = createContext<HeaderThemeContextValue>({
  theme: "white",
  setTheme: () => {},
});

export const HeaderThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<HeaderTheme>("white");

  return (
    <HeaderThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  );
};

export const useHeaderTheme = () => useContext(HeaderThemeContext);

/**
 * Drop this component into any page to signal the header theme.
 * Resets to "white" on unmount (page navigation).
 */
export const SetHeaderTheme = ({ theme }: { theme: HeaderTheme }) => {
  const { setTheme } = useHeaderTheme();

  useEffect(() => {
    setTheme(theme);
    return () => setTheme("white");
  }, [theme, setTheme]);

  return null;
};
