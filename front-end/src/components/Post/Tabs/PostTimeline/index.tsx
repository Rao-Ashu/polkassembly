// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { FC } from 'react';
import { BountyPostFragment, ChildBountyPostFragment, MotionPostFragment, ProposalPostFragment, ReferendumPostFragment, TechCommitteeProposalPostFragment,TipPostFragment, TreasuryProposalPostFragment } from 'src/generated/graphql';
import { FellowshipReferendumPostFragment, ReferendumV2PostFragment } from 'src/types';

import TimelineContainer from './TimelineContainer';

interface IPostTimelineProps {
	className?: string;
	isBounty?: boolean;
	isMotion?: boolean;
	isProposal?: boolean;
	isReferendum?: boolean;
	isReferendumV2?: boolean;
	isFellowshipReferendum?: boolean;
	isTreasuryProposal?: boolean;
	isTechCommitteeProposal?: boolean;
	isTipProposal?: boolean;
	isChildBounty?: boolean;
	referendumPost?: ReferendumPostFragment;
	referendumV2Post?: ReferendumV2PostFragment;
	proposalPost?: ProposalPostFragment;
	motionPost?: MotionPostFragment;
	treasuryPost?: TreasuryProposalPostFragment;
	tipPost?: TipPostFragment;
	bountyPost?: BountyPostFragment;
	childBountyPost?: ChildBountyPostFragment;
	techCommitteeProposalPost?: TechCommitteeProposalPostFragment;
	fellowshipReferendumPost?: FellowshipReferendumPostFragment;
}

const PostTimeline: FC<IPostTimelineProps> = (props) => {
	const {
		className,
		isBounty,
		isMotion,
		isProposal,
		isReferendum,
		isReferendumV2,
		isFellowshipReferendum,
		isTreasuryProposal,
		isTechCommitteeProposal,
		isTipProposal,
		isChildBounty,
		referendumPost,
		referendumV2Post,
		proposalPost,
		motionPost,
		treasuryPost,
		tipPost,
		bountyPost,
		childBountyPost,
		techCommitteeProposalPost,
		fellowshipReferendumPost
	} = props;

	return (
		<div className={`${className} p-10`}>
			{ isTechCommitteeProposal &&
				<TimelineContainer
					statuses={techCommitteeProposalPost?.onchain_link?.onchain_tech_committee_proposal?.[0]?.status?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: s.status || ''
					})) || []}
					title='Tech Committee Proposal'
				/>
			}
			{ isBounty &&
				<TimelineContainer
					statuses={bountyPost?.onchain_link?.onchain_bounty?.[0]?.bountyStatus?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: s.status || ''
					})) || []}
					title='Bounty'
				/>
			}
			{ isChildBounty &&
					<TimelineContainer
						statuses={childBountyPost?.onchain_link?.onchain_child_bounty?.[0]?.childBountyStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Child Bounty'
					/>
			}
			{ isMotion &&
				<>
					<TimelineContainer
						statuses={motionPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: (s as any).status || ''
						})) || []}
						title='Motion'
					/>
					<TimelineContainer
						statuses={motionPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: (s as any).status || ''
						})) || []}
						title='Referendum'
					/>
				</>
			}
			{ isProposal &&
				<>
					<TimelineContainer
						statuses={proposalPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Proposal'
					/>
					<TimelineContainer
						statuses={proposalPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.map((s: any) => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Referendum'
					/>
				</>
			}
			{ isReferendum &&
					<>
						<TimelineContainer
							statuses={referendumPost?.onchain_link?.onchain_proposal?.[0]?.proposalStatus?.map(s => ({
								blockNumber: s.blockNumber?.number || 0,
								status: (s as any).status || ''
							})) || []}
							title='Proposal'
						/>
						<TimelineContainer
							statuses={referendumPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.map(s => ({
								blockNumber: s.blockNumber?.number || 0,
								status: (s as any).status || ''
							})) || []}
							title='Motion'
						/>
						<TimelineContainer
							statuses={referendumPost?.onchain_link?.onchain_referendum?.[0]?.referendumStatus?.map(s => ({
								blockNumber: s.blockNumber?.number || 0,
								status: s.status || ''
							})) || []}
							title='Referendum'
						/>
					</>
			}
			{ isReferendumV2 &&
					<TimelineContainer
						statuses={referendumV2Post?.onchain_link?.onchain_referendumv2?.[0]?.referendumStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Referendum'
					/>
			}
			{ isFellowshipReferendum &&
					<TimelineContainer
						statuses={fellowshipReferendumPost?.onchain_link?.onchain_fellowship_referendum?.[0]?.referendumStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Fellowship Referendum'
					/>
			}
			{ isTreasuryProposal &&
			<>
				<TimelineContainer
					statuses={treasuryPost?.onchain_link?.onchain_treasury_spend_proposal?.[0]?.treasuryStatus?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: s.status || ''
					})) || []}
					title='Treasury Proposal'
				/>
				<TimelineContainer
					statuses={treasuryPost?.onchain_link?.onchain_motion?.[0]?.motionStatus?.map(s => ({
						blockNumber: s.blockNumber?.number || 0,
						status: (s as any).status || ''
					})) || []}
					title='Motion'
				/>
			</>
			}
			{ isTipProposal &&
					<TimelineContainer
						statuses={tipPost?.onchain_link?.onchain_tip?.[0]?.tipStatus?.map(s => ({
							blockNumber: s.blockNumber?.number || 0,
							status: s.status || ''
						})) || []}
						title='Tip'
					/>
			}
		</div>
	);
};

export default PostTimeline;