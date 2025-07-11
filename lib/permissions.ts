import { createAccessControl } from "better-auth/plugins/access";
import {
	defaultStatements,
	adminAc,
	userAc,
} from "better-auth/plugins/admin/access";

export const statement = {
	...defaultStatements,
	project: ["create", "share", "update", "delete"], // <-- Permissions available for created roles
} as const;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
	project: ["create", "update"],
	...adminAc.statements,
});

export const learner = ac.newRole({
	project: ["share"],
	...userAc.statements,
});
