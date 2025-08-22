/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Application } from '../../../automation';
import { z } from 'zod';

/**
 * Task Tools
 */
export function applyTaskTools(server: McpServer, app: Application) {
	server.tool(
		'vscode_automation_task_assert_tasks',
		'Assert that specific tasks exist with given properties',
		{
			filter: z.string().describe('Filter string for tasks'),
			expected: z.array(z.object({
				label: z.string().optional(),
				type: z.string().optional(),
				command: z.string().optional(),
				identifier: z.string().optional(),
				group: z.string().optional(),
				isBackground: z.boolean().optional(),
				promptOnClose: z.boolean().optional(),
				icon: z.object({
					id: z.string().optional(),
					color: z.string().optional()
				}).optional(),
				hide: z.boolean().optional()
			})).describe('Array of expected task properties'),
			type: z.enum(['run', 'configure']).describe('Type of task operation')
		},
		async (args) => {
			const { filter, expected, type } = args;
			await app.workbench.task.assertTasks(filter, expected, type);
			return {
				content: [{
					type: 'text' as const,
					text: `Asserted ${expected.length} tasks for ${type} with filter: "${filter}"`
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_task_configure',
		'Configure a task with specific properties',
		{
			properties: z.object({
				label: z.string().optional(),
				type: z.string().optional(),
				command: z.string().optional(),
				identifier: z.string().optional(),
				group: z.string().optional(),
				isBackground: z.boolean().optional(),
				promptOnClose: z.boolean().optional(),
				icon: z.object({
					id: z.string().optional(),
					color: z.string().optional()
				}).optional(),
				hide: z.boolean().optional()
			}).describe('Task configuration properties')
		},
		async (args) => {
			const { properties } = args;
			await app.workbench.task.configureTask(properties);
			return {
				content: [{
					type: 'text' as const,
					text: `Configured task: ${properties.label || properties.identifier || 'unnamed task'}`
				}]
			};
		}
	);
}
