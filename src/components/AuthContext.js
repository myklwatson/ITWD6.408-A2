//IMPORT
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "./supabaseClient.js";

// Shares the logged-in user (and their role) with every component, so any page can ask "who is logged in?"
const AuthContext = createContext(null);

//FUNCTION COMPONENT - wrap the app in this once (see App.js)
export function AuthProvider({ children }) {
  // STATE
  const [session, setSession] = useState(null); // null when nobody is logged in
  const [role, setRole] = useState(null); // 'customer' or 'staff', read from the profiles table. 'viewer' also added for Daniel to see all bookings.
  const [loading, setLoading] = useState(true); // true until the saved session has been checked

  // Restore any saved session when the app loads, then keep in step with login / logout
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession);
      },
    );

    return () => listener.subscription.unsubscribe(); // stop listening when the app closes
  }, []);

  // Look up the user's role whenever the logged-in user changes
  const userId = session?.user?.id;
  useEffect(() => {
    if (!userId) {
      setRole(null);
      return;
    }

    let cancelled = false; // ignore the result if the user changes before it arrives
    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data, error }) => {
        if (!cancelled) setRole(error ? "customer" : data.role); // default to the safer role
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // The values every component can read
  const value = {
    user: session?.user ?? null,
    role,
    isStaff: role === "staff",
    loading,
    canViewAll: role === "staff" || role === "viewer", // can see every booking (viewer is read-only)
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook used by components: const { user, isStaff } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}
