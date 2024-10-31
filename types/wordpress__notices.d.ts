import '@wordpress/notices';

declare module '@wordpress/notices' {
	export const store: undefined | {
		readonly name: 'core/notices';
	};
}
