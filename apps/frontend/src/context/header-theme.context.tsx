"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";

export type HeaderTheme = "dark" | "orange" | "light";

type HeaderThemeContextValue = {
  theme: HeaderTheme;
  setTheme: (theme: HeaderTheme) => void;
};

const HeaderThemeContext = createContext<HeaderThemeContextValue>({
  theme: "light",
  setTheme: () => {},
});

export const HeaderThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<HeaderTheme>("light");

  return (
    <HeaderThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </HeaderThemeContext.Provider>
  );
};

export const useHeaderTheme = () => useContext(HeaderThemeContext);

/**
 * Drop this component into any page to signal the header theme.
 * Resets to "light" on unmount (page navigation).
 */
export const SetHeaderTheme = ({ theme }: { theme: HeaderTheme }) => {
  const { setTheme } = useHeaderTheme();

  useEffect(() => {
    setTheme(theme);
    return () => setTheme("light");
  }, [theme, setTheme]);

  return null;
};
