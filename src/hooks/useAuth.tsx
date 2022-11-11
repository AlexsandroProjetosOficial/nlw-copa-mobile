import { useContext } from 'react';
import { AuthContext, AuthContextDataProps } from "../contexts/AuthContext";

const useAuth = (): AuthContextDataProps => {
	const context = useContext(AuthContext);

	return context;
}

export { useAuth };