export type NumberMatch =
	| {
			readonly matchType: 'greater-than' | 'less-than';
			readonly matchValue: number;
	  }
	| {
			readonly matchType: 'between';
			readonly minMatchValue: number;
			readonly maxMatchValue: number;
	  };

export type StringMatch = {
	readonly matchType:
		| 'is'
		| 'is-not'
		| 'includes'
		| 'does-not-include'
		| 'regex';
	readonly matchValue: string;
};

export type TypeAs< T extends string, A > = { readonly type: T } & A;
