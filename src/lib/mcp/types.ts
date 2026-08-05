import { z } from "zod";

export interface ToolContext {
  getToken(): string | undefined;
  isAuthenticated(): boolean;
  principal?: { sub?: string };
}

export interface ToolDefinition<
  TSchema extends Record<string, z.ZodTypeAny> = Record<string, z.ZodTypeAny>,
  TResult = unknown,
> {
  name: string;
  title?: string;
  description: string;
  inputSchema: TSchema;
  annotations?: {
    readOnlyHint?: boolean;
    idempotentHint?: boolean;
    openWorldHint?: boolean;
    destructiveHint?: boolean;
  };
  handler: (input: z.infer<z.ZodObject<TSchema>>, ctx: ToolContext) => Promise<TResult> | TResult;
}

export function defineTool<TSchema extends Record<string, z.ZodTypeAny>, TResult>(
  tool: ToolDefinition<TSchema, TResult>,
): ToolDefinition<TSchema, TResult> {
  return tool;
}
