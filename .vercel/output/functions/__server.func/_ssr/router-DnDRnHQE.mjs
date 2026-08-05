import "../_runtime.mjs";
import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
import { t as supabase } from "./client-T7L3gOdv.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { i as require_react } from "../_libs/dnd-kit__accessibility+react.mjs";
import { a as QueryClientProvider, s as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
import { a as projectsQO, i as habitsQO, r as habitLogsQO, s as tasksQO } from "./queries-CbT8XRDi.mjs";
import { n as getSessionSafe, r as isClockSkewJwtError, t as extractErrorMessage } from "./auth-recovery-BdaSotQy.mjs";
import { A as redirect, c as HeadContent, d as createRouter, f as Outlet, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Route$13 } from "./auth-C0CNnnpH.mjs";
import { t as Route$14 } from "./oauth.consent-C2Ha0y-3.mjs";
import { t as Route$15 } from "./projects._id-CoOcrSES.mjs";
import { s as roadmapsQO } from "./roadmap-queries-DOINgKpp.mjs";
import { t as Route$16 } from "./roadmaps._id-BBeB75rr.mjs";
import { t as parseRoadmapMarkdown } from "./roadmap-import-7Ltes41q.mjs";
import { t as Loading } from "./route-CWFPdDUJ.mjs";
import { i as scheduleRulesQO, r as scheduleBlocksQO } from "./schedule-queries-ChbbeOIA.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import "../_libs/@modelcontextprotocol/sdk+[...].mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
var style_default = "/assets/style-DH8e2wuK.css";
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-6xl font-semibold",
				children: "404"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: "Page not found."
			})]
		})
	});
}
function ErrorComponent({ error, reset }) {
	const router = useRouter();
	const clockSkew = isClockSkewJwtError(error);
	const message = extractErrorMessage(error);
	const handleSignOut = async () => {
		try {
			await supabase.auth.signOut();
		} catch {}
		if (typeof window !== "undefined") {
			localStorage.clear();
			window.location.href = "/auth";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-lg font-semibold",
					children: clockSkew ? "Your device clock looks off" : "Something went wrong"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground leading-relaxed",
					children: clockSkew ? "Your computer's date & time is ahead of the server, so your sign-in token was rejected. Enable 'Set time automatically' in Windows Settings, then try again." : message || "An unexpected error occurred."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex gap-3 justify-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "px-4 py-2 text-sm bg-accent-violet text-white rounded font-medium",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSignOut,
						className: "px-4 py-2 text-sm border border-border rounded font-medium hover:bg-muted/50",
						children: "Sign out & Re-authenticate"
					})]
				})
			]
		})
	});
}
var Route$12 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Focus — Personal Task Manager" },
			{
				name: "description",
				content: "A minimal, keyboard-first task manager for focused work."
			},
			{
				property: "og:title",
				content: "Focus — Personal Task Manager"
			},
			{
				property: "og:description",
				content: "A minimal, keyboard-first task manager for focused work."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: style_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$12.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
	});
}
var $$splitComponentImporter$8 = () => import("./route-D8F5n32X.mjs");
var Route$11 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const session = await getSessionSafe();
		if (!session?.user) throw redirect({ to: "/auth" });
		return { user: session.user };
	},
	component: lazyRouteComponent($$splitComponentImporter$8, "component"),
	pendingComponent: Loading,
	pendingMs: 0
});
function defineTool(tool) {
	return tool;
}
function runtimeEnv(name) {
	const runtime = globalThis;
	return runtime.Deno?.env?.get?.(name) ?? runtime.process?.env?.[name];
}
function configuredEnv(names) {
	for (const name of names) {
		const value = runtimeEnv(name)?.trim();
		if (value) return value;
	}
}
function supabaseProjectUrl() {
	const url = configuredEnv(["SUPABASE_URL", "VITE_SUPABASE_URL"]);
	if (!url) throw new Error("SUPABASE_URL (or VITE_SUPABASE_URL) is required");
	return url;
}
function supabasePublishableKey() {
	const direct = configuredEnv(["SUPABASE_PUBLISHABLE_KEY", "VITE_SUPABASE_PUBLISHABLE_KEY"]);
	if (direct) return direct;
	const keyset = runtimeEnv("SUPABASE_PUBLISHABLE_KEYS");
	if (keyset) try {
		const parsed = JSON.parse(keyset);
		if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
			const keys = parsed;
			const key = [keys.default, ...Object.values(keys)].find((v) => typeof v === "string" && v.trim().startsWith("sb_publishable_"))?.trim();
			if (key) return key;
		}
	} catch {}
	const legacy = configuredEnv(["SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY"]);
	if (legacy) return legacy;
	throw new Error("SUPABASE_PUBLISHABLE_KEY, SUPABASE_PUBLISHABLE_KEYS, or SUPABASE_ANON_KEY is required");
}
/** Forwards the verified bearer token so RLS runs as the signed-in user. */
function supabaseForUser(ctx) {
	const token = ctx.getToken();
	if (!token) throw new Error("supabaseForUser requires a verified OAuth token");
	return createClient(supabaseProjectUrl(), supabasePublishableKey(), {
		global: { headers: { Authorization: `Bearer ${token}` } },
		auth: {
			persistSession: false,
			autoRefreshToken: false
		}
	});
}
function ok(payload) {
	return { content: [{
		type: "text",
		text: JSON.stringify(payload)
	}] };
}
function fail(message) {
	return {
		content: [{
			type: "text",
			text: message
		}],
		isError: true
	};
}
var listProjects = defineTool({
	name: "list_projects",
	title: "List projects",
	description: "List all projects belonging to the signed-in user.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("projects").select("*").order("created_at");
		return error ? fail(error.message) : ok({ projects: data ?? [] });
	}
});
var createProject = defineTool({
	name: "create_project",
	title: "Create project",
	description: "Create a new project for the signed-in user.",
	inputSchema: {
		name: stringType().min(1).describe("Project name."),
		color: stringType().optional().describe("Hex color such as #7C3AED."),
		icon: stringType().optional().describe("Lucide icon name, e.g. folder.")
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ name, color, icon }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("projects").insert({
			name,
			color: color ?? "#7C3AED",
			icon: icon ?? "folder"
		}).select().single();
		return error ? fail(error.message) : ok({ project: data });
	}
});
var updateProject = defineTool({
	name: "update_project",
	title: "Update project",
	description: "Update a project's name, color, or icon.",
	inputSchema: {
		id: stringType().describe("Project id."),
		name: stringType().optional(),
		color: stringType().optional(),
		icon: stringType().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, ...patch }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
		if (Object.keys(clean).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("projects").update(clean).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ project: data });
	}
});
var deleteProject = defineTool({
	name: "delete_project",
	title: "Delete project",
	description: "Delete a project. Tasks in the project are unassigned, not deleted.",
	inputSchema: { id: stringType().describe("Project id.") },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("projects").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var status = enumType([
	"todo",
	"in_progress",
	"done"
]);
var priority = enumType([
	"p1",
	"p2",
	"p3",
	"p4"
]);
var listTasks = defineTool({
	name: "list_tasks",
	title: "List tasks",
	description: "List the signed-in user's tasks, optionally filtered by project, status, or due date.",
	inputSchema: {
		project_id: stringType().optional().describe("Only tasks in this project."),
		status: status.optional(),
		due_date: stringType().optional().describe("Exact due date, YYYY-MM-DD."),
		due_before: stringType().optional().describe("Due on or before this date, YYYY-MM-DD."),
		unscheduled: booleanType().optional().describe("Only tasks with no due date.")
	},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		let q = supabaseForUser(ctx).from("tasks").select("*").order("order_index");
		if (input.project_id) q = q.eq("project_id", input.project_id);
		if (input.status) q = q.eq("status", input.status);
		if (input.due_date) q = q.eq("due_date", input.due_date);
		if (input.due_before) q = q.lte("due_date", input.due_before);
		if (input.unscheduled) q = q.is("due_date", null);
		const { data, error } = await q;
		return error ? fail(error.message) : ok({ tasks: data ?? [] });
	}
});
var createTask = defineTool({
	name: "create_task",
	title: "Create task",
	description: "Create a task. Set due_date to schedule it, project_id to file it under a project.",
	inputSchema: {
		title: stringType().min(1),
		description: stringType().optional(),
		project_id: stringType().optional(),
		status: status.optional(),
		priority: priority.optional(),
		due_date: stringType().optional().describe("YYYY-MM-DD."),
		tags: arrayType(stringType()).optional(),
		is_recurring: booleanType().optional(),
		recur_pattern: stringType().optional().describe("e.g. daily, weekly."),
		remind_lead_minutes: numberType().int().optional().describe("Minutes before due time to remind.")
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("tasks").insert(input).select().single();
		return error ? fail(error.message) : ok({ task: data });
	}
});
var updateTask = defineTool({
	name: "update_task",
	title: "Update task",
	description: "Update any field of a task, including scheduling it or marking it done.",
	inputSchema: {
		id: stringType(),
		title: stringType().optional(),
		description: stringType().optional(),
		project_id: stringType().nullable().optional(),
		status: status.optional(),
		priority: priority.optional(),
		due_date: stringType().nullable().optional().describe("YYYY-MM-DD, or null to unschedule."),
		tags: arrayType(stringType()).optional(),
		is_recurring: booleanType().optional(),
		recur_pattern: stringType().nullable().optional(),
		order_index: numberType().int().optional(),
		remind_lead_minutes: numberType().int().nullable().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, ...patch }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
		if (Object.keys(clean).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("tasks").update(clean).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ task: data });
	}
});
var deleteTask = defineTool({
	name: "delete_task",
	title: "Delete task",
	description: "Delete a task and its subtasks.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("tasks").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var listSubtasks = defineTool({
	name: "list_subtasks",
	title: "List subtasks",
	description: "List the subtasks of a task.",
	inputSchema: { task_id: stringType() },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ task_id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("subtasks").select("*").eq("task_id", task_id).order("order_index");
		return error ? fail(error.message) : ok({ subtasks: data ?? [] });
	}
});
var createSubtask = defineTool({
	name: "create_subtask",
	title: "Create subtask",
	description: "Add a subtask to a task.",
	inputSchema: {
		task_id: stringType(),
		title: stringType().min(1),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("subtasks").insert(input).select().single();
		return error ? fail(error.message) : ok({ subtask: data });
	}
});
var updateSubtask = defineTool({
	name: "update_subtask",
	title: "Update subtask",
	description: "Rename, reorder, or check off a subtask.",
	inputSchema: {
		id: stringType(),
		title: stringType().optional(),
		is_done: booleanType().optional(),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, ...patch }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
		if (Object.keys(clean).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("subtasks").update(clean).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ subtask: data });
	}
});
var deleteSubtask = defineTool({
	name: "delete_subtask",
	title: "Delete subtask",
	description: "Delete a subtask.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("subtasks").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var listHabits = defineTool({
	name: "list_habits",
	title: "List habits",
	description: "List the signed-in user's habits together with their logged completion dates.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const supabase = supabaseForUser(ctx);
		const { data: habits, error } = await supabase.from("habits").select("*").order("created_at");
		if (error) return fail(error.message);
		const { data: logs, error: logsError } = await supabase.from("habit_logs").select("*").order("logged_date", { ascending: false });
		if (logsError) return fail(logsError.message);
		return ok({
			habits: habits ?? [],
			logs: logs ?? []
		});
	}
});
var createHabit = defineTool({
	name: "create_habit",
	title: "Create habit",
	description: "Create a habit to track daily.",
	inputSchema: { title: stringType().min(1) },
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ title }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("habits").insert({ title }).select().single();
		return error ? fail(error.message) : ok({ habit: data });
	}
});
var updateHabit = defineTool({
	name: "update_habit",
	title: "Update habit",
	description: "Rename a habit.",
	inputSchema: {
		id: stringType(),
		title: stringType().min(1)
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, title }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("habits").update({ title }).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ habit: data });
	}
});
var deleteHabit = defineTool({
	name: "delete_habit",
	title: "Delete habit",
	description: "Delete a habit and its logs.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("habits").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var setHabitLog = defineTool({
	name: "set_habit_log",
	title: "Log or unlog a habit",
	description: "Mark a habit as done or not done for a given date.",
	inputSchema: {
		habit_id: stringType(),
		logged_date: stringType().describe("YYYY-MM-DD."),
		done: booleanType().describe("true to log the habit, false to remove the log.")
	},
	annotations: {
		readOnlyHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ habit_id, logged_date, done }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const supabase = supabaseForUser(ctx);
		if (done) {
			const { error } = await supabase.from("habit_logs").insert({
				habit_id,
				logged_date
			});
			if (error && error.code !== "23505") return fail(error.message);
		} else {
			const { error } = await supabase.from("habit_logs").delete().eq("habit_id", habit_id).eq("logged_date", logged_date);
			if (error) return fail(error.message);
		}
		return ok({
			habit_id,
			logged_date,
			done
		});
	}
});
var listScheduleBlocks = defineTool({
	name: "list_schedule_blocks",
	title: "List weekly schedule blocks",
	description: "List the recurring weekly schedule blocks (1 = Monday ... 7 = Sunday).",
	inputSchema: { day_of_week: numberType().int().optional().describe("1 = Monday ... 7 = Sunday.") },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ day_of_week }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		let q = supabaseForUser(ctx).from("schedule_blocks").select("*").order("day_of_week").order("start_time");
		if (day_of_week) q = q.eq("day_of_week", day_of_week);
		const { data, error } = await q;
		return error ? fail(error.message) : ok({ blocks: data ?? [] });
	}
});
var createScheduleBlock = defineTool({
	name: "create_schedule_block",
	title: "Create weekly schedule block",
	description: "Add a recurring weekly time block, e.g. 'AWS study' Monday 08:00-08:30.",
	inputSchema: {
		day_of_week: numberType().int().describe("1 = Monday ... 7 = Sunday."),
		title: stringType().min(1),
		start_time: stringType().optional().describe("HH:MM or HH:MM:SS, default 09:00."),
		end_time: stringType().optional().describe("HH:MM or HH:MM:SS."),
		details: stringType().optional(),
		color: stringType().optional().describe("Hex color."),
		project_id: stringType().optional(),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("schedule_blocks").insert(input).select().single();
		return error ? fail(error.message) : ok({ block: data });
	}
});
var updateScheduleBlock = defineTool({
	name: "update_schedule_block",
	title: "Update weekly schedule block",
	description: "Change a recurring block's day, time, title, color, project, or active state.",
	inputSchema: {
		id: stringType(),
		day_of_week: numberType().int().optional(),
		title: stringType().optional(),
		start_time: stringType().optional(),
		end_time: stringType().nullable().optional(),
		details: stringType().nullable().optional(),
		color: stringType().optional(),
		project_id: stringType().nullable().optional(),
		is_active: booleanType().optional(),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, ...patch }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
		if (Object.keys(clean).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("schedule_blocks").update(clean).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ block: data });
	}
});
var deleteScheduleBlock = defineTool({
	name: "delete_schedule_block",
	title: "Delete weekly schedule block",
	description: "Delete a recurring weekly block.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("schedule_blocks").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var listScheduleRules = defineTool({
	name: "list_schedule_rules",
	title: "List schedule rules",
	description: "List the non-negotiables / working principles attached to the weekly planner.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("schedule_rules").select("*").order("order_index");
		return error ? fail(error.message) : ok({ rules: data ?? [] });
	}
});
var createScheduleRule = defineTool({
	name: "create_schedule_rule",
	title: "Create schedule rule",
	description: "Add a non-negotiable rule to the weekly planner.",
	inputSchema: {
		text: stringType().min(1),
		kind: stringType().optional().describe("Defaults to non_negotiable."),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async (input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("schedule_rules").insert(input).select().single();
		return error ? fail(error.message) : ok({ rule: data });
	}
});
var updateScheduleRule = defineTool({
	name: "update_schedule_rule",
	title: "Update schedule rule",
	description: "Edit or reorder a schedule rule.",
	inputSchema: {
		id: stringType(),
		text: stringType().optional(),
		kind: stringType().optional(),
		order_index: numberType().int().optional()
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, ...patch }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const clean = Object.fromEntries(Object.entries(patch).filter(([, v]) => v !== void 0));
		if (Object.keys(clean).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("schedule_rules").update(clean).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ rule: data });
	}
});
var deleteScheduleRule = defineTool({
	name: "delete_schedule_rule",
	title: "Delete schedule rule",
	description: "Delete a schedule rule.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("schedule_rules").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
function uid() {
	return Math.random().toString(36).slice(2, 10);
}
var PHASE_ACCENTS = [
	"#7C3AED",
	"#10B981",
	"#F97316",
	"#EF4444",
	"#0EA5E9",
	"#EAB308",
	"#EC4899",
	"#06B6D4"
];
var itemSchema = objectType({
	text: stringType(),
	chips: arrayType(stringType()).optional().describe("Short tags shown as pills on the item.")
});
var columnSchema = objectType({
	title: stringType().describe("Column heading, e.g. Topics."),
	items: arrayType(itemSchema).optional()
});
var phaseSchema = objectType({
	title: stringType().describe("Phase title, e.g. 'Phase 1 — Foundations'."),
	meta: stringType().optional().describe("Subtitle, e.g. 'Weeks 1-2 · ~7 hrs'."),
	accent: stringType().optional().describe("Hex accent color."),
	status: enumType([
		"todo",
		"current",
		"done"
	]).optional(),
	columns: arrayType(columnSchema).optional().describe("Defaults to Topics / Why it matters / Notes.")
});
function buildPhase(phase, index) {
	const columns = phase.columns && phase.columns.length > 0 ? phase.columns : [
		{
			title: "Topics",
			items: []
		},
		{
			title: "Why it matters",
			items: []
		},
		{
			title: "Notes / Angle",
			items: []
		}
	];
	return {
		id: uid(),
		title: phase.title,
		meta: phase.meta ?? "",
		accent: phase.accent ?? PHASE_ACCENTS[index % PHASE_ACCENTS.length],
		status: phase.status ?? "todo",
		pos: {
			x: 40 + index % 3 * 460,
			y: 40 + Math.floor(index / 3) * 420
		},
		columns: columns.map((c) => ({
			id: uid(),
			title: c.title,
			items: (c.items ?? []).map((i) => ({
				id: uid(),
				text: i.text,
				chips: i.chips ?? []
			}))
		}))
	};
}
var listRoadmaps = defineTool({
	name: "list_roadmaps",
	title: "List roadmaps",
	description: "List the signed-in user's roadmaps with their phases and progress.",
	inputSchema: {},
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async (_input, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("roadmaps").select("*").order("created_at", { ascending: false });
		return error ? fail(error.message) : ok({ roadmaps: data ?? [] });
	}
});
var getRoadmap = defineTool({
	name: "get_roadmap",
	title: "Get roadmap",
	description: "Read one roadmap, including its full phase/column/item structure.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { data, error } = await supabaseForUser(ctx).from("roadmaps").select("*").eq("id", id).single();
		return error ? fail(error.message) : ok({ roadmap: data });
	}
});
var createRoadmap = defineTool({
	name: "create_roadmap",
	title: "Create roadmap",
	description: "Create a roadmap for a goal from a list of phases. Each phase gets columns of items with optional chip tags, laid out on the roadmap canvas.",
	inputSchema: {
		title: stringType().min(1),
		description: stringType().optional(),
		phases: arrayType(phaseSchema).optional().describe("Phases in order. Omit for a single empty starter phase.")
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ title, description, phases }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const data = { phases: (phases && phases.length > 0 ? phases : [{ title: "Phase 1" }]).map(buildPhase) };
		const { data: row, error } = await supabaseForUser(ctx).from("roadmaps").insert({
			title,
			description: description ?? null,
			data
		}).select().single();
		return error ? fail(error.message) : ok({ roadmap: row });
	}
});
var importRoadmapMarkdown = defineTool({
	name: "import_roadmap_markdown",
	title: "Import roadmap from markdown",
	description: "Create a roadmap from markdown: '# Title', '## Phase', '### Column', '- item' lines with optional `chip` backticks.",
	inputSchema: {
		markdown: stringType().min(1),
		title: stringType().optional().describe("Overrides the markdown title.")
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ markdown, title }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const parsed = parseRoadmapMarkdown(markdown);
		const { data: row, error } = await supabaseForUser(ctx).from("roadmaps").insert({
			title: title ?? parsed.title,
			description: parsed.description ?? null,
			data: parsed.data
		}).select().single();
		return error ? fail(error.message) : ok({ roadmap: row });
	}
});
var updateRoadmap = defineTool({
	name: "update_roadmap",
	title: "Update roadmap",
	description: "Update a roadmap's title/description, or replace its phases. Use set_roadmap_phase_status to only change progress.",
	inputSchema: {
		id: stringType(),
		title: stringType().optional(),
		description: stringType().nullable().optional(),
		phases: arrayType(phaseSchema).optional().describe("Replaces all existing phases when provided.")
	},
	annotations: {
		readOnlyHint: false,
		openWorldHint: false
	},
	handler: async ({ id, title, description, phases }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const patch = {};
		if (title !== void 0) patch.title = title;
		if (description !== void 0) patch.description = description;
		if (phases) patch.data = { phases: phases.map(buildPhase) };
		if (Object.keys(patch).length === 0) return fail("Nothing to update.");
		const { data, error } = await supabaseForUser(ctx).from("roadmaps").update(patch).eq("id", id).select().single();
		return error ? fail(error.message) : ok({ roadmap: data });
	}
});
var setRoadmapPhaseStatus = defineTool({
	name: "set_roadmap_phase_status",
	title: "Set roadmap phase status",
	description: "Mark a phase as done, current, or upcoming (todo) — this drives the green progress on the canvas.",
	inputSchema: {
		roadmap_id: stringType(),
		phase_id: stringType().optional().describe("Phase id. Omit to match by phase title."),
		phase_title: stringType().optional().describe("Phase title, used when phase_id is omitted."),
		status: enumType([
			"todo",
			"current",
			"done"
		])
	},
	annotations: {
		readOnlyHint: false,
		idempotentHint: true,
		openWorldHint: false
	},
	handler: async ({ roadmap_id, phase_id, phase_title, status }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const supabase = supabaseForUser(ctx);
		const { data: row, error } = await supabase.from("roadmaps").select("*").eq("id", roadmap_id).single();
		if (error) return fail(error.message);
		const current = row?.data ?? { phases: [] };
		let matched = false;
		const phases = current.phases.map((p) => {
			if (!(phase_id ? p.id === phase_id : phase_title ? p.title === phase_title : false)) return p;
			matched = true;
			return {
				...p,
				status
			};
		});
		if (!matched) return fail("No phase matched the given phase_id/phase_title.");
		const { data: updated, error: updateError } = await supabase.from("roadmaps").update({ data: {
			...current,
			phases
		} }).eq("id", roadmap_id).select().single();
		return updateError ? fail(updateError.message) : ok({ roadmap: updated });
	}
});
var deleteRoadmap = defineTool({
	name: "delete_roadmap",
	title: "Delete roadmap",
	description: "Delete a roadmap.",
	inputSchema: { id: stringType() },
	annotations: {
		readOnlyHint: false,
		destructiveHint: true,
		openWorldHint: false
	},
	handler: async ({ id }, ctx) => {
		if (!ctx.isAuthenticated()) return fail("Not authenticated");
		const { error } = await supabaseForUser(ctx).from("roadmaps").delete().eq("id", id);
		return error ? fail(error.message) : ok({ deleted: id });
	}
});
var parsedRef = ({
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iY3NvaHVuY2pzem1xYWZoZnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE1NjgsImV4cCI6MjEwMDQ1NzU2OH0.UrFanze7CtkMQW6oToBFW4lhb532inLY3FlI9Odt5mk",
	"VITE_SUPABASE_URL": "https://mbcsohuncjszmqafhfyr.supabase.co"
}["VITE_SUPABASE_URL"] ?? "").match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
var projectRef = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1iY3NvaHVuY2pzem1xYWZoZnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ4ODE1NjgsImV4cCI6MjEwMDQ1NzU2OH0.UrFanze7CtkMQW6oToBFW4lhb532inLY3FlI9Odt5mk",
	"VITE_SUPABASE_URL": "https://mbcsohuncjszmqafhfyr.supabase.co"
}["VITE_SUPABASE_PROJECT_ID"] ?? parsedRef ?? "project-ref-unset";
var allTools = [
	listProjects,
	createProject,
	updateProject,
	deleteProject,
	listTasks,
	createTask,
	updateTask,
	deleteTask,
	listSubtasks,
	createSubtask,
	updateSubtask,
	deleteSubtask,
	listHabits,
	createHabit,
	updateHabit,
	deleteHabit,
	setHabitLog,
	listScheduleBlocks,
	createScheduleBlock,
	updateScheduleBlock,
	deleteScheduleBlock,
	listScheduleRules,
	createScheduleRule,
	updateScheduleRule,
	deleteScheduleRule,
	listRoadmaps,
	getRoadmap,
	createRoadmap,
	importRoadmapMarkdown,
	updateRoadmap,
	setRoadmapPhaseStatus,
	deleteRoadmap
];
function getMcpMetadata() {
	return {
		resource: `https://focusflow.cylvox.com/mcp`,
		authorization_servers: [`https://${projectRef}.supabase.co/auth/v1`],
		scopes_supported: ["authenticated"],
		bearer_methods_supported: ["header"]
	};
}
function extractBearerToken(request) {
	const authHeader = request.headers.get("Authorization") ?? request.headers.get("authorization");
	if (!authHeader) return void 0;
	return authHeader.match(/^Bearer\s+(.+)$/i)?.[1]?.trim();
}
function createToolContext(token) {
	return {
		getToken: () => token,
		isAuthenticated: () => Boolean(token),
		principal: token ? { sub: "authenticated-user" } : void 0
	};
}
async function invokeMcpTool(name, rawInput, token) {
	const tool = allTools.find((t) => t.name === name);
	if (!tool) return {
		content: [{
			type: "text",
			text: `Tool '${name}' not found.`
		}],
		isError: true
	};
	const ctx = createToolContext(token);
	const parsed = objectType(tool.inputSchema).safeParse(rawInput ?? {});
	if (!parsed.success) return {
		content: [{
			type: "text",
			text: `Invalid arguments: ${parsed.error.message}`
		}],
		isError: true
	};
	return tool.handler(parsed.data, ctx);
}
var $$splitComponentImporter$7 = () => import("./mcp-Nv9BnLDc.mjs");
var Route$10 = createFileRoute("/mcp")({
	server: { handlers: {
		POST: async ({ request }) => {
			const token = extractBearerToken(request);
			let body = {};
			try {
				body = await request.json();
			} catch {}
			if (body.jsonrpc === "2.0") {
				const method = body.method;
				const params = body.params ?? {};
				const id = body.id ?? null;
				if (method === "initialize") return Response.json({
					jsonrpc: "2.0",
					id,
					result: {
						protocolVersion: "2024-11-05",
						capabilities: { tools: {} },
						serverInfo: {
							name: "focus-flow",
							version: "0.1.0"
						}
					}
				});
				if (method === "tools/list") {
					const catalog = allTools.map((t) => ({
						name: t.name,
						description: t.description,
						inputSchema: {
							type: "object",
							properties: t.inputSchema
						}
					}));
					return Response.json({
						jsonrpc: "2.0",
						id,
						result: { tools: catalog }
					});
				}
				if (method === "tools/call") {
					const toolName = params.name;
					const result = await invokeMcpTool(toolName, params.arguments ?? {}, token);
					return Response.json({
						jsonrpc: "2.0",
						id,
						result
					});
				}
				if (method === "notifications/initialized") return new Response(null, { status: 204 });
				return Response.json({
					jsonrpc: "2.0",
					id,
					error: {
						code: -32601,
						message: `Method '${method}' not found`
					}
				});
			}
			return Response.json({
				jsonrpc: "2.0",
				id: null,
				error: {
					code: -32600,
					message: "Invalid JSON-RPC request"
				}
			});
		},
		OPTIONS: () => {
			return new Response(null, { headers: {
				"Access-Control-Allow-Origin": "*",
				"Access-Control-Allow-Methods": "POST, GET, OPTIONS",
				"Access-Control-Allow-Headers": "Authorization, Content-Type"
			} });
		}
	} },
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var Route$9 = createFileRoute("/.mcp/list-tools")({ server: { handlers: {
	GET: () => {
		const catalog = allTools.map((t) => ({
			name: t.name,
			title: t.title ?? t.name,
			description: t.description,
			inputSchema: t.inputSchema,
			annotations: t.annotations ?? {}
		}));
		return Response.json({ tools: catalog }, { headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		} });
	},
	OPTIONS: () => {
		return new Response(null, { headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Authorization, Content-Type"
		} });
	}
} } });
var Route$8 = createFileRoute("/.well-known/oauth-protected-resource")({ server: { handlers: {
	GET: () => {
		return Response.json(getMcpMetadata(), { headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		} });
	},
	OPTIONS: () => {
		return new Response(null, { headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, OPTIONS",
			"Access-Control-Allow-Headers": "Authorization, Content-Type"
		} });
	}
} } });
var $$splitComponentImporter$6 = () => import("../_authenticated-CAIX7-Vt.mjs");
var Route$7 = createFileRoute("/_authenticated/")({
	head: () => ({ meta: [{ title: "Today — Focus" }, {
		name: "description",
		content: "Today's tasks and in-progress work."
	}] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tasksQO);
		context.queryClient.ensureQueryData(projectsQO);
	},
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./habits-BUH31AnM.mjs");
var Route$6 = createFileRoute("/_authenticated/habits")({
	head: () => ({ meta: [{ title: "Habits — Focus" }, {
		name: "description",
		content: "Build habits with a daily checklist and streaks."
	}] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(habitsQO);
		context.queryClient.ensureQueryData(habitLogsQO);
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./monthly-BFtxtTKn.mjs");
var Route$5 = createFileRoute("/_authenticated/monthly")({
	head: () => ({ meta: [{ title: "Monthly — Focus" }, {
		name: "description",
		content: "See your month at a glance and drag tasks onto any day."
	}] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tasksQO);
		context.queryClient.ensureQueryData(projectsQO);
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./unscheduled-Da7fsWRY.mjs");
var Route$4 = createFileRoute("/_authenticated/unscheduled")({
	head: () => ({ meta: [{ title: "Unscheduled — Focus" }, {
		name: "description",
		content: "Tasks without a due date, ready to triage."
	}] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(tasksQO);
		context.queryClient.ensureQueryData(projectsQO);
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./weekly-B16di0hT.mjs");
var $$splitNotFoundComponentImporter = () => import("./weekly-ttaw6Euc.mjs");
var $$splitErrorComponentImporter = () => import("./weekly-BWuHzOBS.mjs");
var Route$3 = createFileRoute("/_authenticated/weekly")({
	head: () => ({ meta: [
		{ title: "Weekly Schedule — Focus" },
		{
			name: "description",
			content: "Design the weekly routine that repeats every week, and push it into your calendar as tasks."
		},
		{
			property: "og:title",
			content: "Weekly Schedule — Focus"
		},
		{
			property: "og:description",
			content: "Recurring weekly time blocks plus the non-negotiables that keep them honest."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(scheduleBlocksQO);
		context.queryClient.ensureQueryData(scheduleRulesQO);
		context.queryClient.ensureQueryData(projectsQO);
		context.queryClient.ensureQueryData(tasksQO);
	},
	errorComponent: lazyRouteComponent($$splitErrorComponentImporter, "errorComponent"),
	notFoundComponent: lazyRouteComponent($$splitNotFoundComponentImporter, "notFoundComponent"),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var Route$2 = createFileRoute("/.mcp/invoke-tool/$tool")({ server: { handlers: {
	POST: async ({ request, params }) => {
		const token = extractBearerToken(request);
		let rawInput = {};
		try {
			rawInput = await request.json();
		} catch {}
		const result = await invokeMcpTool(params.tool, rawInput, token);
		return Response.json(result, { headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*"
		} });
	},
	OPTIONS: () => {
		return new Response(null, { headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "POST, OPTIONS",
			"Access-Control-Allow-Headers": "Authorization, Content-Type"
		} });
	}
} } });
var $$splitComponentImporter$1 = () => import("./projects.index--zcVGkQ0.mjs");
var Route$1 = createFileRoute("/_authenticated/projects/")({
	head: () => ({ meta: [{ title: "Projects — Focus" }, {
		name: "description",
		content: "All your projects."
	}] }),
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(projectsQO);
		context.queryClient.ensureQueryData(tasksQO);
	},
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./roadmaps.index-DhUKSIX1.mjs");
var Route = createFileRoute("/_authenticated/roadmaps/")({
	head: () => ({ meta: [
		{ title: "Roadmaps — Focus" },
		{
			name: "description",
			content: "Plan multi-phase goals on a roadmap canvas, or import one from a markdown file."
		},
		{
			property: "og:title",
			content: "Roadmaps — Focus"
		},
		{
			property: "og:description",
			content: "Plan multi-phase goals on a roadmap canvas, or import one from a markdown file."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary"
		}
	] }),
	loader: ({ context }) => context.queryClient.ensureQueryData(roadmapsQO),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var AuthenticatedRouteRoute = Route$11.update({
	id: "/_authenticated",
	getParentRoute: () => Route$12
});
var AuthRoute = Route$13.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$12
});
var McpRoute = Route$10.update({
	id: "/mcp",
	path: "/mcp",
	getParentRoute: () => Route$12
});
var Char91DotmcpChar93ListToolsRoute = Route$9.update({
	id: "/.mcp/list-tools",
	path: "/.mcp/list-tools",
	getParentRoute: () => Route$12
});
var Char91DotwellKnownChar93OauthProtectedResourceRoute = Route$8.update({
	id: "/.well-known/oauth-protected-resource",
	path: "/.well-known/oauth-protected-resource",
	getParentRoute: () => Route$12
});
var AuthenticatedIndexRoute = Route$7.update({
	id: "/",
	path: "/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedHabitsRoute = Route$6.update({
	id: "/habits",
	path: "/habits",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedMonthlyRoute = Route$5.update({
	id: "/monthly",
	path: "/monthly",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedUnscheduledRoute = Route$4.update({
	id: "/unscheduled",
	path: "/unscheduled",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedWeeklyRoute = Route$3.update({
	id: "/weekly",
	path: "/weekly",
	getParentRoute: () => AuthenticatedRouteRoute
});
var OauthConsentRoute = Route$14.update({
	id: "/oauth/consent",
	path: "/oauth/consent",
	getParentRoute: () => Route$12
});
var Char91DotmcpChar93InvokeToolToolRoute = Route$2.update({
	id: "/.mcp/invoke-tool/$tool",
	path: "/.mcp/invoke-tool/$tool",
	getParentRoute: () => Route$12
});
var AuthenticatedProjectsIndexRoute = Route$1.update({
	id: "/projects/",
	path: "/projects/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedProjectsIdRoute = Route$15.update({
	id: "/projects/$id",
	path: "/projects/$id",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRoadmapsIndexRoute = Route.update({
	id: "/roadmaps/",
	path: "/roadmaps/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedHabitsRoute,
	AuthenticatedMonthlyRoute,
	AuthenticatedUnscheduledRoute,
	AuthenticatedWeeklyRoute,
	AuthenticatedIndexRoute,
	AuthenticatedProjectsIdRoute,
	AuthenticatedRoadmapsIdRoute: Route$16.update({
		id: "/roadmaps/$id",
		path: "/roadmaps/$id",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedProjectsIndexRoute,
	AuthenticatedRoadmapsIndexRoute
};
var rootRouteChildren = {
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute,
	McpRoute,
	Char91DotmcpChar93ListToolsRoute,
	Char91DotwellKnownChar93OauthProtectedResourceRoute,
	OauthConsentRoute,
	Char91DotmcpChar93InvokeToolToolRoute
};
var routeTree = Route$12._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
