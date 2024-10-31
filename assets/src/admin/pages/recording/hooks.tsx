/**
 * WordPress dependencies
 */
import { useEffect } from '@safe-wordpress/element';

/**
 * External dependencies
 */
import { usePageAttribute } from '@neliosr/data';

export const useIsPlayerReady = (): boolean => {
	const [ events ] = usePageAttribute( 'recording/events', [] );
	const [ player ] = usePageAttribute( 'recording/player' );
	return !! player && !! events.length;
};

export const useStartTimestamp = (): number => {
	const [ events ] = usePageAttribute( 'recording/events', [] );
	return events[ 0 ]?.timestamp ?? 0;
};

export const useTimestampSetter = (): ( ( timestamp: number ) => void ) => {
	const [ player ] = usePageAttribute( 'recording/player' );
	const [ currentTime, setCurrentTime ] = usePageAttribute(
		'recording/currentTime'
	);
	const start = useStartTimestamp();
	return ( timestamp: number ) => {
		if ( currentTime === timestamp ) {
			return;
		} //end if
		player?.goto( timestamp - start );
		setCurrentTime( timestamp );
	};
};

export const useInactiveSkipperEffect = (): void => {
	const [ skipInactive ] = usePageAttribute( 'recording/skipInactive', true );
	const [ currentTime ] = usePageAttribute( 'recording/currentTime' );
	const [ inactivePeriods ] = usePageAttribute(
		'recording/inactivePeriods',
		[]
	);
	const setTimestamp = useTimestampSetter();

	const inactivePeriod = inactivePeriods.find(
		( [ start, end ] ) => start <= currentTime && currentTime < end
	);

	useEffect( () => {
		if ( ! inactivePeriod || ! skipInactive ) {
			return;
		} //end if
		setTimestamp( inactivePeriod[ 1 ] );
	}, [ inactivePeriod, skipInactive ] );
};
