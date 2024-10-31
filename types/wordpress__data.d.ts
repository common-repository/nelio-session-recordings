import '@wordpress/data';

type Action = Record< string, unknown > & {
	type: string;
};

declare module '@wordpress/data' {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	export const controls: Record< string, ( action: AnyAction ) => unknown >;
}
