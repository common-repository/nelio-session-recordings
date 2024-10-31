export type Quota = {
	readonly availableQuota: number;
	readonly percentage: number;
};

// ===========
// FS PRODUCTS
// ===========

export type Currency = string;

export type FastSpringProductId = string;

export type FastSpringProduct = {
	readonly id: FastSpringProductId;
	readonly price: Record< Currency, number >;
	readonly upgradeableFrom: ReadonlyArray< FastSpringProductId >;
	readonly displayName: FSLocalizedString;
	readonly description: FSLocalizedString;
	readonly attributes?: {
		readonly pageviews?: string;
	};
	readonly isSubscription?: boolean;
	readonly period?: 'month' | 'year';
	readonly isAddon?: boolean;
	readonly allowedAddons?: ReadonlyArray< FastSpringProductId >;
};

export type FSLocalizedString = {
	readonly es: string;
	readonly en: string;
};
