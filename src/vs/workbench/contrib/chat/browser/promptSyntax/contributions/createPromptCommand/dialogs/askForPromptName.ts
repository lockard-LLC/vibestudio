/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../../../../../../nls.js';
import { getFileExtension } from '../../../../../../../../platform/prompts/common/constants.js';
import { IQuickInputService } from '../../../../../../../../platform/quickinput/common/quickInput.js';
import { TPromptsType } from '../../../../../common/promptSyntax/service/types.js';

/**
 * Asks the user for a file name.
 */
export const askForPromptFileName = async (
	type: TPromptsType,
	quickInputService: IQuickInputService,
): Promise<string | undefined> => {
	const placeHolder = type === 'instructions' ?
		localize('askForInstructionsFileName.placeholder', "Enter the name of the instructions file") :
		localize('askForPromptFileName.placeholder', "Enter the name of the prompts file");

	const result = await quickInputService.input({ placeHolder });
	if (!result) {
		return undefined;
	}

	const trimmedName = result.trim();
	if (!trimmedName) {
		return undefined;
	}

	const fileExtension = getFileExtension(type);
	const cleanName = (trimmedName.endsWith(fileExtension))
		? trimmedName
		: `${trimmedName}${fileExtension}`;

	return cleanName;
};
