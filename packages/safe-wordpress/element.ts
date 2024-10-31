/**
 * WordPress dependencies
 */
export * from '@wordpress/element';
import { createRoot, render as legacyRender } from '@wordpress/element';

export function render(
	element: JSX.Element,
	container: Element | null
): void {
	if ( ! container ) {
		return;
	} //end if

	if ( createRoot ) {
		const root = createRoot( container );
		root.render( element );
	} else {
		legacyRender( element, container );
	} //end if
} //end render()
