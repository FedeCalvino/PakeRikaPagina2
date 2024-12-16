import React, { useState } from 'react';
import './localesstyles.css'; // Make sure to import the CSS file

export const Locales = ({setLocal}) => {
    const handleLocal = async (local) => {
        setLocal(local)
    };

    return (
        <div className="login-container">
            <h1 style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"center"}}>Local</h1>
            <form>
                <div className="form-group">
                    <div className="button-group">
                        <button
                            type="button"
                            className="local-button"
                            onClick={() => handleLocal('Rivera')}
                        >
                            Rivera
                        </button>
                        <button
                            type="button"
                            className="local-button"
                            onClick={() => handleLocal('Colonia')}
                        >
                            Colonia
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};