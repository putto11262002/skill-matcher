import { Container } from '@mui/material';
import React from 'react'
import Footer from './Footer';
import NavBar from './NavBar';

const Layout = ({ children }) => {
    return (
        <>
            <NavBar />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout;