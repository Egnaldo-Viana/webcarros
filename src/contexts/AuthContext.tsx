import React from 'react';
import supabase from '../services/superbaseClient';

type AuthContextData = {
  signed: boolean;
  user: UserProps | null;
  loadingAuth: boolean;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

interface UserProps {
  uid: string;
  name: string | null;
  email: string | null;
}

export const AuthContext = React.createContext({} as AuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<UserProps | null>(null);
  const [loadingAuth, setLoadingAuth] = React.useState(true);

  React.useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) {
        setUser({
          uid: data.session.user.id,
          name: data.session.user.user_metadata?.name ?? null,
          email: data.session.user.email ?? null,
        });
      }

      setLoadingAuth(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser({
            uid: session.user.id,
            name: session.user.user_metadata?.name ?? null,
            email: session.user.email ?? null,
          });
        } else {
          setUser(null);
        }

        setLoadingAuth(false);
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
