import React, {createContext, useContext,useEffect, useState, type ReactNode}  from 'react'
import supabase from '@/Supabase/SupabaseClient'
import type { User, Session} from '@supabase/supabase-js'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'


interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  signUpWithEmail: (email: string, password: string) => Promise<any>;
  signOut: () => Promise<any>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading,setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate();


useEffect(() => {
  //Initial check for existing session
  const getSession = async () => {
    const { data: {session}, error} = await supabase.auth.getSession();
    if(session){
      setSession(session)
      setUser(session.user)
    }

    if (error) {
      setError(error.message);
    }
    setLoading(false)
  }
  getSession();

  //Listen for new session
  const { data: authListener} = supabase.auth.onAuthStateChange((_event, newSession) => {
    setSession(newSession)
    setUser(newSession?.user || null)
    setLoading(false)
  })

  return () => {
    authListener?.subscription?.unsubscribe();
  };

},[]);

//SignIn Function
const signInWithEmail = async (email: string, password: string) => {
  try {
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      return data
    }
    navigate('/dashboard')
    toast.success('Successfully signed in!')
    return data
  } catch (err: any) {
    console.error('Auth network error', err)
    setError(err?.message ?? 'Network error: failed to reach auth server')
    return null
  }
  finally {
    setLoading(false)
  }
};

//SignUp Function
const signUpWithEmail = async (email: string, password: string) => {
  try {
    setLoading(true)
    const { data, error} = await supabase.auth.signUp({ email, password})
    if (error) {
      setError(error.message)
    }
    console.log('Sign Up:', { email, password, data, error }) 
    return data
    navigate('/dashboard')
    toast.success('Account created successfully!')
  } catch (err: any) {
    console.error('Auth network error', err)
    setError(err?.message ?? 'Network error: failed to reach auth server')
    return null
  } finally {
    setLoading(false)
  }
}

//SignOut Function
const signOut = async () => {
  const {error} = await supabase.auth.signOut()
  if (error) {
    setError(error.message)
  }
};



  return (
  <AuthContext.Provider value={{ user, session, loading, error, signInWithEmail, signUpWithEmail, signOut }}>
  {children}
  </AuthContext.Provider>
)
}



export const useAuth = () => {
  const context = useContext(AuthContext)
  if(context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
