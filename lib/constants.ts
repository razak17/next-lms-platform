export const unknownError =
	"An unknown error occurred. Please try again later.";

export const redirects = {
	toLogin: "/login",
	toSignup: "/register",
	afterLogin: "/dashboard",
	afterLogout: "/",
	toVerify: "/verify-email",
	afterVerify: "/dashboard",
	toResetPassword: "/reset-password",
	toForgotPassword: "/forgot-password",
	toDashboard: "/dashboard",

	adminToLogin: "/admin/login",
	adminToSignup: "/admin/register",
	adminAfterLogin: "/admin/dashboard",
	adminAfterLogout: "/admin/login",
	adminToVerify: "/admin/otp-verification",
	adminAfterVerify: "/admin/dashboard",
	adminToResetPassword: "/admin/reset-password",
	adminToForgotPassword: "/admin/forgot-password",
	adminToDashboard: "/admin/dashboard",
	adminToTracks: "/admin/tracks",
	adminToCourses: "/admin/courses",
	adminToInvoices: "/admin/invoices",
	adminToLearners: "/admin/learners",
	adminToProfile: "/admin/profile",
} as const;

export const genderOptions = [
	{ value: "male", label: "Male" },
	{ value: "female", label: "Female" },
	{ value: "other", label: "Other" },
];
