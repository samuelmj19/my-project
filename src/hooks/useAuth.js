import React, {useState, useContext, createContext} from "react";
import axios from "axios";
import endPoints from "services/api";
import Cookies from "js-cookie";

const AuthContext = createContext();

export function ProviderAuth({ children }) {
    const auth = useProviderAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuth = () =>{
    return useContext(AuthContext);
};

function useProviderAuth() {
    const [user, setUser] = useState(null)

    const signIn = async (email, password) =>{
        const options = {
            headers: {
                accept: '*/*',
                'Content-Type': 'application/json'
            }
        }
        const {data: access_token } = await axios.post(endPoints.auth.login, { email, password }, options);
        if(access_token){
            const token = access_token.access_token;
            Cookies.set('token', token, {expires: 5});

            axios.defaults.headers.Authorization = `Bearer ${token}`;
            const {data: user } = await axios.get(endPoints.auth.profile);
            setUser(user)
        }
    };

    const logOut = () => {
        Cookies.remove('token');
        setUser(null)
        delete axios.defaults.headers.Authorization;
        window.location.href = '/login';
    }

    return{
        user, 
        signIn,
        logOut,
    };
}