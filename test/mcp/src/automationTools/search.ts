/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { Application } from '../../../automation';
import { z } from 'zod';

/**
 * Search Tools
 */
export function applySearchTools(server: McpServer, app: Application) {
	server.tool(
		'vscode_automation_search_open',
		'Open the search viewlet',
		async () => {
			await app.workbench.search.openSearchViewlet();
			return {
				content: [{
					type: 'text' as const,
					text: 'Opened search viewlet'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_search_for_text',
		'Search for text in files',
		{
			searchText: z.string().describe('Text to search for')
		},
		async (args) => {
			const { searchText } = args;
			await app.workbench.search.searchFor(searchText);
			return {
				content: [{
					type: 'text' as const,
					text: `Searched for: "${searchText}"`
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_search_set_files_to_include',
		'Set files to include in search',
		{
			pattern: z.string().describe('File pattern to include (e.g., "*.ts", "src/**")')
		},
		async (args) => {
			const { pattern } = args;
			await app.workbench.search.setFilesToIncludeText(pattern);
			return {
				content: [{
					type: 'text' as const,
					text: `Set files to include: "${pattern}"`
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_search_submit',
		'Submit the current search',
		async () => {
			await app.workbench.search.submitSearch();
			return {
				content: [{
					type: 'text' as const,
					text: 'Submitted search'
				}]
			};
		}
	);

	server.tool(
		'vscode_automation_search_clear_results',
		'Clear search results',
		async () => {
			await app.workbench.search.clearSearchResults();
			return {
				content: [{
					type: 'text' as const,
					text: 'Cleared search results'
				}]
			};
		}
	);
}
