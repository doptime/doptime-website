// src/theme/Navbar/index.js
import React from 'react';
import Navbar from '@theme-original/Navbar';
import { AuthMenu } from '../../components/auth';

export default function NavbarWrapper(props) {
    return (
        <div className='flex flex-row w-full'>
            <div className='flex flex-row w-full h-full'>
                <Navbar {...props} />
            </div>
            <AuthMenu />
        </div >
    );
}
