import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Renamed interface to be specific to the application domain
interface ChemVizSession {
    currentUser: User | null;
    isInitializing: boolean;
}

const SessionContext = createContext<ChemVizSession | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    // Unique state variable names
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    useEffect(() => {
        // Abstracting the auth state change listener slightly
        const detachListener = onAuthStateChanged(auth, (firebaseUser) => {
            setCurrentUser(firebaseUser);
            setIsInitializing(false);
        });

        return () => detachListener();
    }, []);

    // Providing a strictly typed value object
    const sessionValue: ChemVizSession = {
        currentUser,
        isInitializing
    };

    return (
        <SessionContext.Provider value={sessionValue}>
            {!isInitializing && children}
        </SessionContext.Provider>
    );
}

export function useAuth() {
    const session = useContext(SessionContext);
    if (session === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return session;
}
