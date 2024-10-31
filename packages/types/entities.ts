// =====
// POSTS
// =====

export type EntityId = number;

export type EntityKindName = string;

export type EntityKind = {
	readonly kind: 'form' | 'entity';
	readonly name: EntityKindName;
	readonly labels: {
		// eslint-disable-next-line camelcase
		readonly singular_name: string;
	};
};

export type EntityInstance = {
	readonly id: EntityId;
	readonly authorName: string;
	readonly date: string;
	readonly excerpt: string;
	readonly imageId: number;
	readonly imageSrc: string;
	readonly link: string;
	readonly thumbnailSrc: string;
	readonly title: string;
	readonly type: string;
	readonly typeLabel: string;
	readonly extra: Partial< {
		readonly specialPostType: 'page-for-posts' | 'page-on-front';
	} >;
};
