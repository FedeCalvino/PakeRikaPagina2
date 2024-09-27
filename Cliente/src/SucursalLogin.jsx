//12:00-16:00  20:00-24:00

import React, { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {gapi} from "gapi-script"
import GoogleLogin from 'react-google-login';

export const SucursalLogin = () => {

    const ClienteID = 393114921459-i346rh1rjm0ejvm4mesgqm5snh1f2emj.apps.googleusercontent.com;

    useEffect(()=>{
        const start =()=>{
            gapi.auth2.init({
                clienteId:ClienteID
            })
        }
        gapi.load("cliente:auth2",start)
    },[])

    const Success =()=>{

    }
    const Failure =()=>{
        
    }

  return (

    <div>        
        <GoogleLogin
        clienteId={ClienteID}
        onSuccess={Success}
        onFailure={Failure}
        cookiePolicy={'single-host-policy'}
        />
  </div>
  )
}
