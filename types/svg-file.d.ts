declare module '*.svg' {
	const content: ( props?: HTMLSvgElement ) => JSX.Element;
	export default content;
}
