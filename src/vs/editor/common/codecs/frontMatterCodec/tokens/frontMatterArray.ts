/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { LeftBracket, RightBracket } from '../../simpleCodec/tokens/index.js';
import { FrontMatterValueToken, type TValueTypeName } from './frontMatterToken.js';

/**
 * Token that represents an `array` value in a Front Matter header.
 */
export class FrontMatterArray extends FrontMatterValueToken<'array', [
	LeftBracket,
	...FrontMatterValueToken<TValueTypeName>[],
	RightBracket,
]> {
	/**
	 * Name of the `array` value type.
	 */
	public override readonly valueTypeName = 'array';

	/**
	 * List of the array items.
	 */
	public get items(): readonly FrontMatterValueToken<TValueTypeName>[] {
		const result = [];

		for (const token of this.tokens) {
			if (token instanceof FrontMatterValueToken) {
				result.push(token);
			}
		}

		return result;
	}

	public override toString(): string {
		return `front-matter-array(${this.shortText()})${this.range}`;
	}
}
