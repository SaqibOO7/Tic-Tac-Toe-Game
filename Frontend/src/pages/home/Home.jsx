import React, { useEffect } from 'react'
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from '../../components/navbar/Navbar';

function Home() {

    return (
        <>
            <Navbar />
            <div className="flex items-center justify-center min-h-screen p-4 bg-[url('/12.jpg')] bg-cover bg-no-repeat bg-center">
                <div className='flex flex-col md:flex-row sm:h-auto md:h-[550px] rounded-lg overflow-hidden bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0 '>
                    <Sidebar />
                </div>
            </div>
        </>
    )
}

export default Home
