import React, { useState } from 'react'
import GenerateCheckBoxes from './GenerateCheckBoxes'
import { Link } from 'react-router-dom'
import useSignUp from '../../hooks/useSignUp.js'
import { FaEdit } from "react-icons/fa";

function SignUp() {

	const { loading, signup } = useSignUp();
	const [profilePic, setProfilePic] = useState('https://cdn0.iconfinder.com/data/icons/communication-line-10/24/account_profile_user_contact_person_avatar_placeholder-512.png')

	const [input, setInput] = useState({
		username: '',
		uniqueID: '',
		password: '',
		confirmPassword: '',
		gender: '',
	})

	const handelCheckboxChange = (gender) => {
		setInput({ ...input, gender })
	}

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfilePic(URL.createObjectURL(file));
			setInput({ ...input, avatar: file });
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const formData = new FormData();
		formData.append('username', input.username);
		formData.append('uniqueID', input.uniqueID);
		formData.append('password', input.password);
		formData.append('confirmPassword', input.confirmPassword);
		formData.append('gender', input.gender);
		formData.append('avatar', input.avatar);
		await signup(formData)
	}

	return (
		<div className="flex items-center justify-center h-screen p-4 bg-[url('/13.jpg')] bg-cover bg-no-repeat bg-center filter brightness-95">
			<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
				<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
					<h1 className='text-3xl font-semibold text-center text-gray-300'>
						<span className='text-purple-400 font-semibold'>Sign Up</span>
					</h1>

					<form onSubmit={handleSubmit}>
						{/* Profile Picture Upload and Display */}
						<div className="relative w-full h-24 text-center mt-2">
							<div className="avatar">
								<div className="w-24 rounded-full">
									<img src={profilePic} alt="Profile" className="w-full h-full object-cover rounded-full" />
									<label className="absolute bottom-0 right-0 bg-gray-100 p-2 rounded-full cursor-pointer">
										<FaEdit className='text-black' />
										<input
											type="file"
											className="hidden"
											onChange={handleImageChange}
										/>
									</label>
								</div>
							</div>
						</div>

						{/* Other Form Inputs */}
						<div>
							<label className='label p-2'>
								<span className='text-base label-text text-gray-100'>Username</span>
							</label>
							<input
								type='text'
								placeholder='Enter username'
								className='w-full input input-bordered  h-10'
								value={input.username}
								onChange={(e) => setInput({ ...input, username: e.target.value })}
							/>
						</div>

						<div>
							<label className='label p-2 '>
								<span className='text-base label-text text-gray-100'>UserId</span>
							</label>
							<input
								type='text'
								placeholder='It should be unique'
								className='w-full input input-bordered h-10'
								value={input.uniqueID}
								onChange={(e) => setInput({ ...input, uniqueID: e.target.value })}
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
								value={input.password}
								onChange={(e) => setInput({ ...input, password: e.target.value })}
							/>
						</div>

						<div>
							<label className='label'>
								<span className='text-base label-text text-gray-100'>Confirm Password</span>
							</label>
							<input
								type='password'
								placeholder='Confirm Password'
								className='w-full input input-bordered h-10'
								value={input.confirmPassword}
								onChange={(e) => setInput({ ...input, confirmPassword: e.target.value })}
							/>
						</div>

						<GenerateCheckBoxes onCheckboxChange={handelCheckboxChange} selectedGender={input.gender} />

						<Link to='/login' className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block text-gray-100' href='#'>
							Already have an account?
						</Link>
						<div>

							<button className='btn btn-block btn-sm mt-2 border border-slate-700'
								disabled={loading}
							>
								{loading ? <span className='loading loading-spinner'></span> : "Sign Up"}
							</button>

						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default SignUp
