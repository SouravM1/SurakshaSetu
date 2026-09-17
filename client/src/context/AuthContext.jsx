import {
    createContext,
    useContext,
    useState
} from "react";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {

    // =====================================================
    // USER
    // =====================================================

    const [user, setUser] = useState(() => {

        const savedUser = localStorage.getItem("user");

        try {

            return savedUser
                ? JSON.parse(savedUser)
                : null;

        } catch (error) {

            console.error(
                "Invalid user data in localStorage"
            );

            localStorage.removeItem("user");

            return null;
        }
    });


    // =====================================================
    // TOKEN
    // =====================================================

    const [token, setToken] = useState(() => {

        return localStorage.getItem("token");
    });


    // =====================================================
    // LOGIN
    // =====================================================

    const login = (token, user) => {

        localStorage.setItem(
            "token",
            token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        setToken(token);
        setUser(user);
    };


    // =====================================================
    // UPDATE USER
    // =====================================================

    const updateUser = (updatedUser) => {

        localStorage.setItem(
            "user",
            JSON.stringify(updatedUser)
        );

        setUser(updatedUser);
    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setToken(null);
        setUser(null);
    };


    // =====================================================
    // AUTH CONTEXT
    // =====================================================

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                updateUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {

    return useContext(AuthContext);
};