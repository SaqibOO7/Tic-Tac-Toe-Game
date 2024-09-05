import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import useLogin from '../../hooks/useLogin'

function Login() {

    const { loading, login } = useLogin();

    const [inputs, setInputs] = useState({
        uniqueID: '',
        password: '',
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        await login(inputs);

    }
    return (
        <div className="flex items-center justify-center h-screen p-4 bg-[url('/13.jpg')] bg-cover bg-no-repeat bg-center filter brightness-95" >
            <div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
                <div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
                    <h1 className='text-3xl font-semibold text-center'>
                        <span className='text-purple-600 font-semibold'>Login</span>
                    </h1>

                    <form onSubmit={handleSubmit}>
                        <div>
                            <label className='label p-2 '>
                                <span className='text-base label-text text-gray-100'>UserId</span>
                            </label>
                            <input
                                type='text'
                                placeholder='Enter UserId'
                                className='w-full input input-bordered h-10'
                                value={inputs.uniqueID}
                                onChange={(e) => setInputs({ ...inputs, uniqueID: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className='label'>
                                <span className='text-base label-text text-gray-100'>Password</span>
                            </label>
                            <input
                                type='password'
                                placeholder='Enter Password'
                                className='w-full input input-bordered h-10'
                                value={inputs.password}
                                onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
                            />
                        </div>
                        <Link to='/signup' className='text-sm  hover:underline hover:text-blue-600 mt-2 inline-block text-gray-100'>
                            {"Don't"} have an account?
                        </Link>

                        <div>
                            <button className='btn btn-block btn-sm mt-2'
                                disabled={loading}
                            >
                                {loading ? <span className='loading loading-spinner'></span> : "Login"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login
