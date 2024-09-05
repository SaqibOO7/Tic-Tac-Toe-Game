import React from 'react'
import { BiLogOut } from "react-icons/bi";
import useLogout from '../../hooks/useLogout';

function LogoutButton() {
    const { loading, logout } = useLogout();

    return (
        <div className='mt-5 flex justify-center md:justify-start'>

            {!loading ? (<BiLogOut onClick={logout} className='w-6 h-6 text-white cursor-pointer' />)
                : (<span className='loading loading-spinner'></span>)
            }

        </div>
    )
}

export default LogoutButton
