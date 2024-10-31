import { MAX_NODE_TEXT_LENGTH } from './constants';

export function cleanText( element: HTMLElement ): string {
	return element.innerText
		.replace( /\s+/g, ' ' )
		.substring( 0, MAX_NODE_TEXT_LENGTH )
		.trim();
} //end getCssSelector()
