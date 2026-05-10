import React, { useRef, useState } from "react";
import { LuUser, LuUpload, LuTrash } from "react-icons/lu";

interface ProfilePhotoSelectorProps {
	image: File | null;
	setImage: (image: File | null) => void;
	preview?: string | null;
	setPreview?: (preview: string | null) => void;
}

const ProfilePhotoSelector = ({
	image,
	setImage,
	preview,
	setPreview,
}: ProfilePhotoSelectorProps) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);

	const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			// Update the image state
			setImage(file);

			// Generate preview URL from the file
			const preview = URL.createObjectURL(file);
			if (setPreview) {
				setPreview(preview);
			}
			setPreviewUrl(preview);
		}
	};

	const handleRemoveImage = () => {
		setImage(null);
		setPreviewUrl(null);
		if (setPreview) {
			setPreview(null);
		}
	};

	const onChooseFile = () => {
		inputRef.current?.click();
	};

	return (
		<div className="flex justify-center mb-6">
			<input
				type="file"
				accept="image/*"
				ref={inputRef}
				onChange={handleImageChange}
				className="hidden"
			/>

			{!image ? (
				<div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-orange-50">
					<LuUser className="text-4xl text-orange-500" />

					<button
						type="button"
						className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-white"
						onClick={onChooseFile}
					>
						<LuUpload />
					</button>
				</div>
			) : (
				<div className="relative">
					<img
						src={preview || previewUrl || ""}
						alt="profile photo"
						className="h-20 w-20 rounded-full object-cover"
					/>

					<button
						type="button"
						className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-red-500 text-white"
						onClick={handleRemoveImage}
					>
						<LuTrash />
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfilePhotoSelector;