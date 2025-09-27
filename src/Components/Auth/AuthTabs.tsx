import { Input } from "../ui/input"
import { Tabs,TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { useState, type JSX } from "react"
import { useAuth } from "@/Hooks/useAuth"
import React from "react";
import { ClipLoader } from "react-spinners"


const AuthTabs: React.FC = (): JSX.Element => {
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const { signInWithEmail,signUpWithEmail, error, loading } = useAuth()

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
    await signInWithEmail(email, password)
  }

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Email:", email)
    console.log("Password:", password)
    await signUpWithEmail(email, password)
  }

  const tabs = [
    {
      name: 'Sign In',
      value: 'sign-in',
      content: (
        <>
          <div className="">
            <form onSubmit={handleSignIn}>
              { error && <p className='text-red-500'>{error}</p>}
         <div>
              <div className="py-2">
                <label htmlFor="email" className="pb-2">Email</label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="py-4">
                <label htmlFor="password" className="pb-2">Password</label>
                <Input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="py-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500" > {loading ? <ClipLoader className="animate-spin h-2 w-2 mr-2" color="white" loading={loading} /> : "Sign In"}</Button>
              </div>
         </div>
             
            </form>
          </div>
        </>
      )
    },
    {
      name: 'Sign Up',
      value: 'sign-up',
      content: (
        <>
           <div className="">
            <form onSubmit={handleSignUp}>
              { error && <p className='text-red-500 bg-red-50 rounded p-2'>{error}</p>}
             
           <div> 
              <div className="py-2">
                <label htmlFor="email" className="pb-2  ">Email</label>
                <Input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="py-4">
                <label htmlFor="password" className="pb-2">Password</label>
                <Input id="password" type="password" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <div className="py-4">
                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-500" > {loading ? <ClipLoader className="animate-spin h-2 w-2 mr-2" color="white" loading={loading} /> : "Sign Up"}</Button>
              </div>
             </div> 
              
            </form>
          </div>
        </>
      )
    },
   
  ]

  return (
    <div className="w-full max-w-md p-6 bg-white ">
     
      <Card>
        <CardHeader className="text-center ">
          <CardTitle className="text-3xl bg-gradient-to-r from-[#C800FF] to-[#16a34a] bg-clip-text text-transparent ">
            Goal Tracker
          </CardTitle>
          <CardDescription>
            Track your goals and build accountability
          </CardDescription>
        </CardHeader>
        
        <CardContent>
           <Tabs defaultValue='sign-in'>
          <TabsList className="w-full">
            {tabs.map(tab => (
              <TabsTrigger key={tab.value} value={tab.value}>
                {tab.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <div className='text-muted-foreground text-sm'>{tab.content}</div>
            </TabsContent>
          ))}
        </Tabs>
        </CardContent>
      </Card> 
      
    </div>
  )
}

export default AuthTabs