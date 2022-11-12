// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Post from 'src/components/Post/Post';
import { useMotionPostAndCommentsLazyQuery } from 'src/generated/graphql';
import { PostCategory } from 'src/global/post_categories';
import BackToListingView from 'src/ui-components/BackToListingView';
import { ErrorState, LoadingState } from 'src/ui-components/UIStates';

const MotionPost = () => {
	const { id } = useParams();
	const idNumber = Number(id) || 0;

	const [getData, { called, data, error, refetch }] = useMotionPostAndCommentsLazyQuery({ variables: { 'id': idNumber } });

	useEffect(() => {
		if (called) {
			refetch();
		} else {
			getData();
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [called]);

	if (error?.message) return <ErrorState errorMessage={error.message} />;

	if (data) return (<div>
		<BackToListingView postCategory={PostCategory.MOTION} />

		<div className='mt-6'>
			<Post data={data} isMotion refetch={refetch} />
		</div>
	</div>);

	return <div className='mt-16'><LoadingState /></div>;
};

export default MotionPost;
