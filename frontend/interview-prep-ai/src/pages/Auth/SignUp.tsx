import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/input";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { useUser } from "../../context/UserContext";

const SignUp = ({ setCurrentPage }) => {
	const [profilePic, setProfilePic] = useState(null);
	const [profilePicPreview, setProfilePicPreview] = useState(null);
	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);

	const { updateUser } = useUser();
	const navigate = useNavigate();

	const handleSignUp = async (e) => {
		e.preventDefault();

		if (!fullName) {
			setError("Please enter your full name.");
			return;
		}
		if (!validateEmail(email)) {
			setError("Please enter a valid email address.");
			return;
		}
		if (!password || password.length < 8) {
			setError("Password must be at least 8 characters.");
			return;
		}

		setError("");

		try {
			let profileImageUrl = null;

			// 1. Upload profile photo if one was selected
			if (profilePic) {
				const formData = new FormData();
				formData.append("image", profilePic);
				const uploadRes = await axiosInstance.post(API_PATHS.AUTH.UPLOAD_IMAGE, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				profileImageUrl = uploadRes.data.imageUrl;
			}

			// 2. Register user
			const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
				name: fullName,
				email,
				password,
				profileImageUrl,
			});

			const { token, ...userData } = response.data;
			updateUser({ ...userData, token });
			navigate("/dashboard");
		} catch (error) {
			if (error.response && error.response.data.message) {
				setError(error.response.data.message);
			} else {
				setError("Something went wrong. Please try again.");
			}
		}
	};

	return (
		<div className="w-full p-8 flex flex-col justify-center">
			<h3 className="text-lg font-semibold text-black">Create an Account</h3>
			<p className="text-xs text-slate-700 mt-[5px] mb-6">
				Join us today by entering your details below.
			</p>

			<form onSubmit={handleSignUp}>
				<ProfilePhotoSelector
					image={profilePic}
					setImage={setProfilePic}
					preview={profilePicPreview}
					setPreview={setProfilePicPreview}
				/>

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
					className="mt-2 w-full rounded-lg bg-black py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-100 hover:text-black"
				>
					SIGN UP
				</button>

				<p className="text-[13px] text-slate-800 mt-3">
					Already an account?{" "}
					<button
						className="font-medium text-amber-600 underline cursor-pointer"
						onClick={() => setCurrentPage("login")}
					>
						Login
					</button>
				</p>
			</form>
		</div>
	);
};

export default SignUp;
