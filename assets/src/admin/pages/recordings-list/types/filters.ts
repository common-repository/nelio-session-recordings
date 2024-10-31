import {
	Day,
	ExperimentId,
	Maybe,
	NumberMatch,
	StringMatch,
	TypeAs,
} from '@neliosr/types';
import { Settings } from './settings';

export type Filter =
	// Session
	| DateFilter
	| CountryFilter
	| DurationFilter
	| PageCountFilter
	// Navigation
	| LandingPageFilter
	| ExitPageFilter
	| ViewedPageFilter
	// Behavior
	| ClickedElementFilter
	| RageClickFilter
	| DeadClickFilter
	| RefreshedPageFilter
	| UTurnFilter
	| ABTestingFilter
	// Technology
	| DeviceFilter
	| BrowserFilter
	| OperatingSystemFilter
	| ScreenResolutionFilter;

export type DateFilter =
	| {
			readonly type: 'date';
			readonly condition:
				| 'day'
				| 'week'
				| 'fortnight'
				| 'month'
				| 'quarter'
				| 'semester'
				| 'year';
	  }
	| {
			readonly type: 'date';
			readonly condition: 'custom';
			readonly rangeStart?: Day;
			readonly rangeEnd?: Day;
	  };

export type CountryFilter = {
	readonly type: 'country';
	readonly value: ReadonlyArray< string >;
};

export type DurationFilter = TypeAs< 'duration', NumberMatch >;
export type PageCountFilter = TypeAs< 'page-count', NumberMatch >;
export type LandingPageFilter = TypeAs< 'landing-page', StringMatch >;
export type ExitPageFilter = TypeAs< 'exit-page', StringMatch >;
export type ViewedPageFilter = TypeAs< 'viewed-page', StringMatch >;

export type RefreshedPageFilter = TypeAs< 'refreshed-page', StringMatch >;
export type UTurnFilter = TypeAs< 'u-turn', StringMatch >;

export type DeviceFilter = {
	readonly type: 'device';
	readonly value: ReadonlyArray< 'mobile' | 'tablet' | 'desktop' >;
};

export type BrowserFilter = {
	readonly type: 'browser';
	readonly value: ReadonlyArray<
		| 'chrome'
		| 'android-browser'
		| 'edge'
		| 'firefox'
		| 'opera'
		| 'safari'
		| 'internet-explorer'
		| 'other'
	>;
};

export type OperatingSystemFilter = {
	readonly type: 'os';
	readonly value: ReadonlyArray<
		| 'windows'
		| 'macosx'
		| 'ios'
		| 'android'
		| 'chrome'
		| 'ubuntu'
		| 'linux'
		| 'other'
	>;
};

export type ScreenResolutionFilter = {
	readonly type: 'screen-resolution';
	readonly width: NumberMatch;
	readonly height: NumberMatch;
};

export type ClickedElementFilter = {
	readonly type: 'clicked-element';
	readonly subType: 'css-selector' | 'element-id' | 'text';
} & StringMatch;

export type ABTestingFilter = {
	readonly type: 'ab-testing';
	readonly test: Maybe< ExperimentId >;
	readonly variants: ReadonlyArray< number >;
	readonly convertedGoals: ReadonlyArray< number >;
};

export type RageClickFilter = {
	readonly type: 'rage-click';
};

export type DeadClickFilter = {
	readonly type: 'dead-click';
};

export type FilterDescriptionComponentType< T extends Filter > = (
	props: FilterDescriptionComponentProps< T >
) => JSX.Element | null;

export type FilterDescriptionComponentProps< T extends Filter > = {
	readonly settings: Settings;
	readonly filter: T;
};

export type FilterComponentType< T extends Filter > = (
	props: FilterComponentProps< T >
) => JSX.Element | null;

export type FilterComponentProps< T extends Filter > = {
	readonly settings: Settings;
	readonly filter: T;
	readonly onChange: ( filter: T ) => void;
};
