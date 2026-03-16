import * as z from "zod";
import { Image as ImageIcon, SquarePen } from "lucide-react";
import { ImageUpload } from "@/components/ui/image-upload";
import { FormDialog, useFormDialog } from "@/components/form-dialog";
import type { FieldConfig } from "@/lib/form/field-config";
import { uploadFileToCloudinary } from "@/config/cloudinary";
import {
	useAdminProfileQuery,
	useUpdateAdminProfileMutation,
} from "@/hooks/admin/useProfile.hook";
import type {
	AdminProfile,
	UpdateAdminProfileInput,
} from "@/types/admin-profile.type";

const editProfileSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email address"),
	phone: z.string().min(1, "Phone is required"),
	address: z.string().optional(),
	avatarUrl: z.string().optional(),
});

type EditProfileFormData = z.infer<typeof editProfileSchema>;

const editProfileFields: FieldConfig<EditProfileFormData>[] = [
	{
		name: "avatarUrl",
		type: "custom",
		label: "Avatar",
		render: ({ field, disabled }) => (
			<ImageUpload
				value={String(field.value ?? "")}
				onChange={(value) => field.onChange(value)}
				onUpload={uploadFileToCloudinary}
				disabled={disabled}
			/>
		),
	},
	{
		name: "name",
		type: "text",
		label: "Name",
		placeholder: "Enter your name",
		required: true,
	},
	{
		name: "email",
		type: "text",
		label: "Email",
		disabled: true,
	},
	{
		name: "phone",
		type: "text",
		label: "Phone",
		placeholder: "Enter your phone number",
		required: true,
	},
	{
		name: "address",
		type: "textarea",
		label: "Address",
		placeholder: "Enter your address",
		rows: 3,
	},
];

const profileToFormValues = (profile: AdminProfile): EditProfileFormData => ({
	name: profile.name ?? "",
	email: profile.email ?? "",
	phone: profile.phone ?? "",
	address: profile.address ?? "",
	avatarUrl: profile.avatarUrl ?? "",
});

const MyProfilePage = () => {
	const dialog = useFormDialog<AdminProfile>();

	const {
		data: profile,
		isLoading,
		error,
		refetch,
	} = useAdminProfileQuery();

	const updateProfileMutation = useUpdateAdminProfileMutation();

	const memberSince = profile?.createdAt
		? new Date(profile.createdAt).getFullYear().toString()
		: "";

	const handleOpenEdit = () => {
		if (!profile) return;
		dialog.openEdit(profile);
	};

	const handleSubmit = async (values: EditProfileFormData) => {
		if (!dialog.data?.id) {
			throw new Error("Profile data is not ready");
		}

		const input: UpdateAdminProfileInput = {
			name: values.name,
			email: values.email,
			phone: values.phone,
			avatarUrl: values.avatarUrl ?? "",
			address: values.address ?? "",
		};

		await updateProfileMutation.mutateAsync({
			userId: dialog.data.id,
			input,
		});
	};

	if (isLoading) {
		return (
			<div className="bg-white rounded-2xl border border-[#E8E0D8] p-6">
				<p className="text-[#6D4C41]">Loading profile...</p>
			</div>
		);
	}

	if (error || !profile) {
		return (
			<div className="bg-white rounded-2xl border border-[#E8E0D8] p-6 space-y-4">
				<p className="text-red-600">
					{error instanceof Error
						? error.message
						: "Failed to load profile information."}
				</p>
				<button
					onClick={() => void refetch()}
					className="inline-flex px-4 py-2 border border-[#6D4C41] text-[#6D4C41] rounded-lg hover:bg-[#6D4C41] hover:text-white transition-colors"
				>
					Retry
				</button>
			</div>
		);
	}

	return (
		<>
			<div className="space-y-8">
				<section>
					<h1 className="font-coffee text-4xl md:text-5xl italic text-[#3E2723] mb-2">
						My Profile
					</h1>
					<p className="text-[#8D6E63] text-base">
						Manage your personal information and preferences.
					</p>
				</section>

				<section>
					<div className="bg-white rounded-2xl shadow-md border border-[#E8E0D8] overflow-hidden">
						<div className="relative h-36 bg-linear-to-r from-[#8D6E63] via-[#A1887F] to-[#BCAAA4]" />

						<div className="relative px-6 md:px-10 pb-8">
							<div className="absolute -top-16 left-6 md:left-10">
								<div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-[#EFEBE9]">
									{profile.avatarUrl ? (
										<img
											src={profile.avatarUrl}
											alt={profile.name}
											className="w-full h-full object-cover"
										/>
									) : (
										<div className="w-full h-full flex items-center justify-center">
											<span className="text-5xl font-bold text-[#6D4C41]">
												{profile.name?.charAt(0)?.toUpperCase() || "U"}
											</span>
										</div>
									)}
								</div>
							</div>

							<div className="pt-20 md:pt-6 md:ml-40 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
								<div>
									<h2 className="font-coffee text-3xl text-[#3E2723] mb-1">
										{profile.name || "Admin"}
									</h2>
									<div className="flex items-center gap-3 text-sm">
										<span className="flex items-center gap-1.5 text-[#C97B3D] font-semibold uppercase tracking-wider text-xs">
											<span className="w-2 h-2 rounded-full bg-[#C97B3D]" />
											ADMIN
										</span>
										{memberSince && (
											<>
												<span className="text-[#A1887F]">·</span>
												<span className="text-[#8D6E63]">
													Member since {memberSince}
												</span>
											</>
										)}
									</div>
								</div>

								<button
									onClick={handleOpenEdit}
									className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#C97B3D] hover:bg-[#B5692F] text-white rounded-lg font-medium text-sm shadow-sm transition-all duration-200 hover:shadow-md cursor-pointer"
								>
									<SquarePen className="w-4 h-4" />
									Edit Profile
								</button>
							</div>
						</div>
					</div>
				</section>

				<section>
					<div className="bg-white rounded-2xl shadow-lg shadow-[#D7CCC8]/40 border border-[#E8E0D8] overflow-hidden">
						<div className="h-px bg-linear-to-r from-transparent via-[#D7CCC8] to-transparent mx-8 mt-6" />

						<div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 divide-y md:divide-y-0 md:divide-x divide-[#E8E0D8]">
							<div className="p-8">
								<h3 className="font-coffee text-xl text-[#3E2723] mb-6">
									Contact Information
								</h3>
								<div className="space-y-6">
									<div className="flex items-start gap-4">
										<div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
											<ImageIcon className="w-5 h-5 text-[#C97B3D]" />
										</div>
										<div>
											<p className="text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-1">
												Email Address
											</p>
											<p className="text-sm font-medium text-[#3E2723]">
												{profile.email || "Not provided"}
											</p>
										</div>
									</div>

									<div className="flex items-start gap-4">
										<div className="shrink-0 w-11 h-11 rounded-2xl bg-[#FFF3E0] flex items-center justify-center shadow-md">
											<ImageIcon className="w-5 h-5 text-[#C97B3D]" />
										</div>
										<div>
											<p className="text-xs font-semibold text-[#C97B3D] uppercase tracking-wider mb-1">
												Phone Number
											</p>
											<p className="text-sm font-medium text-[#3E2723]">
												{profile.phone || "Not provided"}
											</p>
										</div>
									</div>
								</div>
							</div>

							<div className="p-8">
								<h3 className="font-coffee text-xl text-[#3E2723] mb-6">
									Address
								</h3>

								<p className="text-sm font-medium text-[#3E2723] leading-relaxed whitespace-pre-line">
									{profile.address || "No address provided"}
								</p>
							</div>
						</div>
					</div>
				</section>
			</div>

			<FormDialog<EditProfileFormData>
				open={dialog.isOpen}
				onOpenChange={(open) => !open && dialog.close()}
				title="Edit Profile"
				description="Update your profile information below"
				size="lg"
				schema={editProfileSchema}
				fields={editProfileFields}
				values={profileToFormValues(dialog.data ?? profile)}
				mode="edit"
				onSubmit={handleSubmit}
				onSuccess={() => {
					dialog.close();
					void refetch();
				}}
			/>
		</>
	);
};

export default MyProfilePage;

