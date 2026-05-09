import React, { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

const Input = ({ value, onChange, label, placeholder, type }) => {
	const [showPassword, setShowPassword] = useState(false);

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="mb-4">
			<label className="text-[13px] text-slate-800">{label}</label>

			<div className="mt-2 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5">
				<input
					type={
						type === "password" ? (showPassword ? "text" : "password") : type
					}
					placeholder={placeholder}
					className="w-full bg-transparent text-sm text-slate-900 outline-none"
					value={value}
					onChange={(e) => onChange(e)}
				/>

				{type === "password" && (
					<button type="button" className="p-1" onClick={toggleShowPassword}>
						{showPassword ? (
							<FaRegEyeSlash size={20} className="text-amber-500" />
						) : (
							<FaRegEye size={20} className="text-slate-400" />
						)}
					</button>
				)}
			</div>
		</div>
	);
};

export default Input;
