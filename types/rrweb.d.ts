import '@rrweb/types';

declare module '@rrweb/types' {

	export type nelioFullSnapshotEvent = fullSnapshotEvent & {
		data: fullSnapshotEvent['data'] & {
			href?: string;
			isRefresh?: boolean;
			isUTurn?: boolean;
		}
	};

	export type nelioMouseInteractionData = mouseInteractionData & {
		isRageClick?: boolean;
		clickedElement?: {
			selector: string;
			isClickable: boolean;
			id?: string;
			text?: string;
		}
	};
}
