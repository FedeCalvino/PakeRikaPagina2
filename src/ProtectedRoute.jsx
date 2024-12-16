import React from 'react'
import { Outlet } from 'react-router-dom'
import { Login } from './Login'

export const ProtectedRoute = ({children,user,login}) => {
    console.log(user)

    if(!user){
        return <Login loginFnct={login}/>
    }
    return (
        children ? children : <Outlet/>
    )
}
