/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Application } from '../../../automation';
import { z } from 'zod';

/**
 * Debug Tools
 */
export function applyDebugTools(server: McpServer, app: Application) {
	server.tool(
		'vscode_automation_debug_open',
		'Open the debug viewlet',
		async () => {
			await app.workbench.debug.openDebugViewlet();
			return {
				content: [{
					type: 'text' as const,
					text: 'Opened debug viewlet'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_set_breakpoint',
		'Set a breakpoint on a specific line',
		{
			lineNumber: z.number().describe('Line number to set breakpoint on')
		},
		async (args) => {
			const { lineNumber } = args;
			await app.workbench.debug.setBreakpointOnLine(lineNumber);
			return {
				content: [{
					type: 'text' as const,
					text: `Set breakpoint on line ${lineNumber}`
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_start',
		'Start debugging',
		async () => {
			const result = await app.workbench.debug.startDebugging();
			return {
				content: [{
					type: 'text' as const,
					text: `Started debugging (result: ${result})`
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_stop',
		'Stop debugging',
		async () => {
			await app.workbench.debug.stopDebugging();
			return {
				content: [{
					type: 'text' as const,
					text: 'Stopped debugging'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_step_over',
		'Step over in debugger',
		async () => {
			await app.workbench.debug.stepOver();
			return {
				content: [{
					type: 'text' as const,
					text: 'Stepped over'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_step_in',
		'Step into in debugger',
		async () => {
			await app.workbench.debug.stepIn();
			return {
				content: [{
					type: 'text' as const,
					text: 'Stepped in'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_step_out',
		'Step out in debugger',
		async () => {
			await app.workbench.debug.stepOut();
			return {
				content: [{
					type: 'text' as const,
					text: 'Stepped out'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_debug_continue',
		'Continue execution in debugger',
		async () => {
			await app.workbench.debug.continue();
			return {
				content: [{
					type: 'text' as const,
					text: 'Continued execution'
				}]
			};
		}
	);
}
