/**
 * WordPress dependencies
 */
import type { select as _select } from '@safe-wordpress/data';
type Select = typeof _select;

/**
 * Internal dependencies
 */
import type { Dict, Url } from './utils';

// ================
// EXPERIMENT TYPES
// ================

export type ExperimentTypeName = string;

export type ExperimentType< C extends Dict = Dict, A extends Dict = C > = {
	readonly name: string;
	readonly title: string;
	readonly shortTitle?: string;
	readonly category: ExperimentCategory;
	readonly description: string;
	readonly icon: ( props?: Dict ) => JSX.Element;
	readonly help: {
		readonly original: string;
		readonly alternative: string;
	};
	readonly defaults: {
		readonly original: C;
		readonly alternative: A;
	};
	readonly views: {
		readonly original: ( props: ExperimentEditProps< C > ) => JSX.Element;
		readonly alternative: (
			props: ExperimentEditProps< A >
		) => JSX.Element;
	};
	readonly supports: Partial< {
		readonly alternativeApplication:
			| boolean
			| ( ( alts: Alternatives< C, A > ) => boolean );
		readonly alternativeEdition: 'external';
		readonly alternativePreviewDialog: ( props: {
			readonly experimentId: ExperimentId;
			readonly alternativeId: AlternativeId;
			readonly attributes: A;
		} ) => JSX.Element;
		readonly scope: ScopeType;
		readonly isEnabled: ( select: Select ) => boolean;
		readonly presetAlternatives: (
			select: Select,
			collection: string
		) => ReadonlyArray< PresetOption > | boolean;
		readonly postTypes: string | ReadonlyArray< string >;
		readonly postTypeExceptions: string | ReadonlyArray< string >;
	} >;
};

export type ExperimentEditProps< A extends Dict > = {
	readonly attributes: A;
	readonly setAttributes: ( attrs: Partial< A > ) => void;
	readonly disabled?: boolean;
	readonly experimentType: ExperimentTypeName;
};

export type ExperimentCategory = 'page' | 'global' | 'woocommerce' | 'other';

// ====================
// EXPERIMENT INSTANCES
// ====================

export type ExperimentId = string;

export type Experiment< C extends Dict = Dict, A extends Dict = C > = {
	readonly id: ExperimentId;
	readonly type: ExperimentTypeName;
	readonly status:
		| 'draft'
		| 'ready'
		| 'scheduled'
		| 'running'
		| 'paused'
		| 'paused_draft'
		| 'finished'
		| 'trash';
	readonly name: string;
	readonly description: string;
	readonly startDate: string;
	readonly endDate: string | false;
	readonly endMode: 'manual' | 'duration' | 'page-views' | 'confidence';
	readonly endValue: number;
	readonly links: {
		readonly edit: string;
		readonly preview: string;
	};
	readonly alternatives: Alternatives< C, A >;
	readonly goals: ReadonlyArray< Goal >;
	readonly segmentEvaluation: 'site' | 'tested-page';
	readonly scope: ReadonlyArray< ScopeRule >;
};

export type AlternativeId = string;

export type Alternative< A extends Dict = Dict > = {
	readonly id: AlternativeId;
	readonly attributes: A & {
		readonly name?: string;
	};
	readonly isLastApplied?: boolean;
	readonly links: {
		readonly edit: string;
		readonly heatmap: string;
		readonly preview: string;
	};
};

export type Alternatives<
	C extends Dict = Dict,
	A extends Dict = C,
> = Readonly< [ Alternative< C >, ...Alternative< A >[] ] >;

export type Heatmap = Omit<
	Experiment,
	| 'alternatives'
	| 'goals'
	| 'links'
	| 'scope'
	| 'segmentEvaluation'
	| 'segments'
> & {
	readonly trackingMode: 'post' | 'url';
	readonly trackedPostId: number;
	readonly trackedPostType: string;
	readonly trackedUrl: Url;
	readonly links: {
		readonly edit: string;
		readonly heatmap: string;
		readonly preview: string;
	};
};

// =====
// GOALS
// =====

export type GoalId = string;

export type Goal = {
	readonly id: GoalId;
	readonly attributes: {
		readonly name: string;
	};
};

// =====
// SCOPE
// =====

export type ScopeType =
	| 'custom'
	| 'custom-with-tested-post'
	| 'tested-post-with-consistency';

export type ScopeRuleId = string;

export type ScopeRule = TestedPostScopeRule | CustomUrlScopeRule;

export type TestedPostScopeRule = {
	readonly id: ScopeRuleId;
	readonly attributes: {
		readonly type: 'tested-post';
	};
};

export type CustomUrlScopeRule = {
	readonly id: ScopeRuleId;
	readonly attributes: {
		readonly type: 'exact' | 'partial';
		readonly value: string;
	};
};

// =======
// HELPERS
// =======

type PresetOption = {
	readonly label: string;
	readonly value: string;
	readonly disabled?: boolean;
};
