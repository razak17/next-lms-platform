export const unknownError =
	"An unknown error occurred. Please try again later.";

export const redirects = {
	toLogin: "/login",
	toSignup: "/register",
	afterLogin: "/dashboard",
	afterLogout: "/",
	toVerify: "/verify-email",
	afterVerify: "/dashboard",
	adminToLogin: "/admin/login",
	adminToSignup: "/admin/register",
	adminAfterLogin: "/admin/dashboard/stores",
	adminAfterLogout: "/admin/login",
	adminToVerify: "/verify-email",
	adminAfterVerify: "/admin/dashboard",
} as const;
