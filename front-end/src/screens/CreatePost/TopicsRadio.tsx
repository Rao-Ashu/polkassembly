// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LoadingOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import { SegmentedValue } from 'antd/lib/segmented';
import React, { useEffect } from 'react';
import ErrorAlert from 'src/ui-components/ErrorAlert';

import { usePost_TopicsLazyQuery } from '../../generated/graphql';

interface Props {
    className?: string
    onTopicSelection: (id: number)=> void
}

const TopicsRadio = ({ className, onTopicSelection }: Props) => {

	const [refetch, { data, error }] = usePost_TopicsLazyQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	if (error?.message) {
		console.error('Topic retrieval error', error);
		return <ErrorAlert errorMsg={error.message} />;
	}

	if(data && data.post_topics.length) {
		const topicOptions: string[] = [];
		data.post_topics.forEach(({ name }) => {
			topicOptions.push(name);
		});

		const onTopicChange = (value: SegmentedValue) => {
			const topicObj = data.post_topics.find(obj => obj.name === `${value}`);

			if(topicObj) {
				onTopicSelection(topicObj?.id);
			}
		};

		return (
			<div className={`${className} overflow-x-auto`}>
				<Segmented className='px-3 py-2 rounded-md' options={topicOptions} onChange={onTopicChange} />
			</div>
		);
	}

	return (
		<div className={className}>
			<LoadingOutlined />
		</div>
	);
};

export default TopicsRadio;
