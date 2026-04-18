import Head from "next/head";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { theme } from "../styles/theme.js";
import "../styles/globals.css";
import { useEffect } from "react";
import { onIdTokenChanged } from "firebase/auth";
import { auth } from "../utils/firebase.js";
import { fetcher } from "../utils/api.js";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!auth) return undefined;

    const unsubscribe = onIdTokenChanged(auth, async (user) => {
      if (!user) {
        window.localStorage.removeItem("cc-token");
        return;
      }
      const token = await user.getIdToken();
      window.localStorage.setItem("cc-token", token);
      try {
        await fetcher("/auth/sync", { method: "POST" });
      } catch {
        // Non-blocking sync; keep session token updated.
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>Career Compass</title>
        <link rel="icon" href="/file.svg" />
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
