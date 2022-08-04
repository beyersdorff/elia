/*
  Documentation: https://reactjs.org/docs/context.html
*/

import React, { useReducer, createContext, useEffect, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

export const UserContext = createContext();
export const UserUpdateContext = createContext();

export function useUser() {
    return useContext(UserContext);
}

export function useUserUpdate() {
    return useContext(UserUpdateContext);
}

export default function UserProvider({ children }) {
    const [user, setUser] = useLocalStorage(
        "user",
        {}
    );

    function putUser(user) {
        setUser(user);
    }

    return (
        <UserContext.Provider value={user}>
            <UserUpdateContext.Provider value={putUser}>
                {children}
            </UserUpdateContext.Provider>
        </UserContext.Provider>
    )
}