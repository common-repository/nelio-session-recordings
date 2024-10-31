/**
 * WordPress dependencies
 */
import { combineReducers } from '@safe-wordpress/data';

/**
 * Internal dependencies
 */
import { entities } from './entities';
import { experiments } from './experiments';
import { page } from './page';
import { recordings } from './recordings';
import { settings } from './settings';
import { siteQuota } from './user';

export default combineReducers( {
	entities,
	experiments,
	page,
	recordings,
	settings,
	siteQuota,
} );
