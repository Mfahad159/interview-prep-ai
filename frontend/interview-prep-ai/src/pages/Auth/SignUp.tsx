import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/input";

const SignUp = ({ setCurrentPage }) => {
	const [profilePic, setProfilePic] = useState(null);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState(null);

	const navigate = useNavigate();

	// Handle SignUp Form Submit
	const handleSignUp = async (e) => {
		e.preventDefault();
	};

	return (
		<div className="w-full p-8 flex flex-col justify-center">
			<h3 className="text-lg font-semibold text-black">Create an Account</h3>
			<p className="text-xs text-slate-700 mt-[5px] mb-6">
				Join us today by entering your details below.
			</p>

			<form onSubmit={handleSignUp}>
				<Input
					value={fullName}
					onChange={({ target }) => setFullName(target.value)}
					label="Full Name"
					placeholder="John"
					type="text"
				/>

				<Input
					value={email}
					onChange={({ target }) => setEmail(target.value)}
					label="Email Address"
					placeholder="john@example.com"
					type="text"
				/>

				<Input
					value={password}
					onChange={({ target }) => setPassword(target.value)}
					label="Password"
					placeholder="Min 8 Characters"
					type="password"
				/>

				{error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

				<button
					type="submit"
					className="mt-2 w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-100 hover:text-black"
				>
					SIGN UP
				</button>

				<p className="text-[13px] text-slate-800 mt-3">
					Already an account?{" "}
					<button
						className="font-medium text-primary underline cursor-pointer"
						onClick={() => {
							setCurrentPage("login");
						}}
					>
						Login
					</button>
				</p>
			</form>
		</div>
	);
};

export default SignUp;
