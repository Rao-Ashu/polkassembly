// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { ColumnsType } from 'antd/lib/table';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetLatestTipPostsLazyQuery } from 'src/generated/graphql';
import { noTitle } from 'src/global/noTitle';
import { PostCategory } from 'src/global/post_categories';
import { post_topic } from 'src/global/post_topics';
import { post_type } from 'src/global/post_types';
import { EmptyLatestActivity, ErrorLatestActivity, LoadingLatestActivity, PopulatedLatestActivity, PopulatedLatestActivityCard } from 'src/ui-components/LatestActivityStates';
import NameLabel from 'src/ui-components/NameLabel';
import StatusTag from 'src/ui-components/StatusTag';
import getRelativeCreatedAt from 'src/util/getRelativeCreatedAt';

interface TipPostsRowData {
  key: string | number;
  title: string;
  address?: string;
	username: string;
	status?: string;
	createdAt: string | null;
	onChainId?: string | number | null | undefined
	postId?: string | number
	postCategory: PostCategory
}

const columns: ColumnsType<TipPostsRowData> = [
	{
		title: '#',
		dataIndex: 'postId',
		key: 'index',
		width: 65,
		fixed: 'left'
	},
	{
		title: 'Title',
		dataIndex: 'title',
		key: 'title',
		width: 420,
		fixed: 'left'
	},
	{
		title: 'Creator',
		dataIndex: 'username',
		key: 'creator',
		render: (username, { address }) => <NameLabel textClassName='max-w-[9vw] 2xl:max-w-[12vw]' defaultAddress={address} username={username} disableIdenticon={true} />
	},
	{
		title: 'Status',
		dataIndex: 'status',
		key: 'status',
		render: (status) => {
			if(status) return <StatusTag status={status} />;
		},
		width: 200
	},
	{
		title: 'Created',
		key: 'created',
		dataIndex: 'createdAt',
		render: (createdAt) => {
			const relativeCreatedAt = getRelativeCreatedAt(createdAt);
			return (
				<span>{relativeCreatedAt}</span>
			);
		}
	}
];

const TipPostsTable = () => {
	const navigate = useNavigate();

	const [refetch, { data, error }] = useGetLatestTipPostsLazyQuery({
		variables: {
			limit: 8,
			postTopic: post_topic.TREASURY,
			postType: post_type.ON_CHAIN
		}
	});
	useEffect(() => {
		refetch();
	}, [refetch]);

	//error state
	if (error?.message) return <ErrorLatestActivity errorMessage={error?.message} />;

	if(data) {
		//empty state
		const atLeastOneCurrentTip = data.posts.some((post) => {
			if (post.onchain_link?.onchain_tip.length || post.onchain_link?.onchain_tip_id) {
				// this breaks the loop as soon as
				// we find a post that has a tip.
				return true;
			}
			return false;
		});

		if(!data.posts || !data.posts.length || !atLeastOneCurrentTip) return <EmptyLatestActivity />;

		const tableData: TipPostsRowData[] = [];

		data.posts.forEach(post => {
			if(post?.author?.username && (!!post.onchain_link?.onchain_tip.length || post.onchain_link?.onchain_tip_id)) {
				// truncate title
				let title = post.title ? post.title : post.onchain_link.onchain_tip?.[0]?.reason || noTitle;
				title = title.length > 80 ? `${title.substring(0, Math.min(80, title.length))}...`  : title.substring(0, Math.min(80, title.length));

				const tableDataObj:TipPostsRowData = {
					key: post.id,
					title,
					address: post.onchain_link.proposer_address,
					username: post.author.username,
					createdAt: post.created_at,
					status: post.onchain_link.onchain_tip?.[0]?.tipStatus?.[0].status,
					onChainId: post.onchain_link?.onchain_tip_id,
					postId: post.id,
					postCategory: PostCategory.TIP
				};

				tableData.push(tableDataObj);
			}
		});

		return(<>
			<div className='hidden lg:block'>
				<PopulatedLatestActivity columns={columns} tableData={tableData} onClick={(rowData) => navigate(`/tip/${rowData.onChainId}`)} />
			</div>

			<div className="block lg:hidden h-[650px] overflow-y-auto">
				<PopulatedLatestActivityCard tableData={tableData} onClick={(rowData) => navigate(`/tip/${rowData.onChainId}`)} />
			</div>
		</>);
	}

	// Loading state
	return <LoadingLatestActivity />;
};

export default TipPostsTable;