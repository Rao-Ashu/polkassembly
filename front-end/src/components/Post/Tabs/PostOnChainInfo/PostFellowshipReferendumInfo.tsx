// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import moment from 'moment';
import * as React from 'react';
import { trackInfo } from 'src/global/post_trackInfo';
import { useCurrentBlock } from 'src/hooks';
import { OnchainLinkFellowshipReferendumFragment } from 'src/types';
import Address from 'src/ui-components/Address';
import blockToTime from 'src/util/blockToTime';
import formatBnBalance from 'src/util/formatBnBalance';
import getNetwork from 'src/util/getNetwork';

import ArgumentsTableJSONView from './ArgumentsTableJSONView';
import OnchainInfoWrapper from './OnchainInfoWrapper';

const network = getNetwork();
interface Props{
	onchainLink: OnchainLinkFellowshipReferendumFragment
	setOtherProposalsSidebarAddr: (address: string) => void
}

const PostFellowshipReferendumInfo = ({ onchainLink, setOtherProposalsSidebarAddr }: Props) => {
	const currentBlock = useCurrentBlock();
	if (!onchainLink) return null;

	const {
		onchain_fellowship_referendum,
		origin
	} = onchainLink;

	if ( !onchain_fellowship_referendum?.[0] ){
		return null;
	}

	const { deciding, decisionDeposit, enactmentAfter, enactmentAt, preimage, trackNumber, submitted } = onchain_fellowship_referendum[0];
	const { metaDescription, method, preimageArguments } = preimage || {};

	const getTrackNameFromNumber = (trackNum: number) => {
		for (const trackName of Object.keys(trackInfo)) {
			if(trackInfo[trackName].trackId === trackNum) return trackName.split(/(?=[A-Z])/).join(' ');
		}
	};

	const formattedBlockToTime = (blockNo: number) => {
		if(!currentBlock) return;

		const time = blockToTime(currentBlock.toNumber() - blockNo);
		const timeArr = time.split(' ');

		if (!timeArr[0] || !timeArr[1] || !timeArr[2]) {
			return moment().utc().format('DD MMM YYYY');
		}

		const days = Number(timeArr[0].replace('d', ''));
		const hours = Number(timeArr[1].replace('h', ''));
		const minutes = Number(timeArr[2].replace('m', ''));
		const duration = moment.duration({ 'days': days, 'hours': hours, 'minutes': minutes });
		const date = moment().utc().subtract(duration).format('DD MMM YYYY');
		return date;
	};

	return (
		<>
			<OnchainInfoWrapper>
				<div className='md:hidden text-pink_primary cursor-pointer mb-5' onClick={() => setOtherProposalsSidebarAddr(submitted.who)}>
					View Other Proposals
				</div>
				<h5 className='mb-5 font-bold text-base'>Metadata</h5>
				<ul className='list-none flex flex-col gap-y-2'>
					<li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Proposer</h6>
						<article className='flex gap-x-2 col-span-4 md:col-span-6 overflow-hidden'>
							<Address  displayInline={true} address={submitted.who}/>
							<div className='hidden md:block text-pink_primary cursor-pointer ml-auto' onClick={() => setOtherProposalsSidebarAddr(submitted.who)}>
								View Other Proposals
							</div>
						</article>
					</li>
					{submitted && submitted.amount && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Submitted</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{formatBnBalance(submitted.amount, { numberAfterComma: 2, withUnit: true })}
						</div>
					</li>}
					{origin && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Origin</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{origin.split(/(?=[A-Z])/).join(' ')}
						</div>
					</li>}
					{trackNumber && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Track Number</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{trackNumber}
						</div>
					</li>}
					{trackNumber && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Track Name</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{getTrackNameFromNumber(trackNumber)}
						</div>
					</li>}
					{enactmentAfter && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Enactment After</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{enactmentAfter.length < 8 ? enactmentAfter :
								<div>
									<span>{formattedBlockToTime(Number(enactmentAfter))}</span>
									<a href={`https://${network}.subscan.io/block/${enactmentAfter}`} target='_blank' rel='noreferrer' className='ml-3 text-pink_secondary'>#{enactmentAfter}</a>
								</div>
							}
						</div>
					</li>}
					{enactmentAt && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Enactment At</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{enactmentAt.length < 8 ? enactmentAt :
								<div>
									<span>{formattedBlockToTime(Number(enactmentAt))}</span>
									<a href={`https://${network}.subscan.io/block/${enactmentAt}`} target='_blank' rel='noreferrer' className='ml-3 text-pink_secondary'>#{enactmentAt}</a>
								</div>
							}
						</div>
					</li>}
					{deciding && deciding.since && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Deciding Since</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{`${deciding.since}`.length < 8 ? deciding.since :
								<div>
									<span>{formattedBlockToTime(deciding.since)}</span>
									<a href={`https://${network}.subscan.io/block/${deciding.since}`} target='_blank' rel='noreferrer' className='ml-3 text-pink_secondary'>#{deciding.since}</a>
								</div>
							}
						</div>
					</li>}
					{deciding && deciding.confirming && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Confirming</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{`${deciding.confirming}`.length < 8 ? deciding.confirming :
								<div>
									<span>{formattedBlockToTime(deciding.confirming)}</span>
									<a href={`https://${network}.subscan.io/block/${deciding.confirming}`} target='_blank' rel='noreferrer' className='ml-3 text-pink_secondary'>#{deciding.confirming}</a>
								</div>
							}
						</div>
					</li>}
					{decisionDeposit && decisionDeposit.amount && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Decision Deposit</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{formatBnBalance(decisionDeposit.amount, { numberAfterComma: 2, withUnit: true })}
						</div>
					</li>}
					{method && <li className='grid grid-cols-6 md:grid-cols-8 gap-x-5 border-b py-1.5'>
						<h6 className='col-span-2'>Method</h6>
						<div className='text-navBlue col-span-4 md:col-span-6 overflow-hidden'>
							{method}
						</div>
					</li>}
				</ul>
				{method && preimageArguments && preimageArguments.length &&
				<div className='mt-7'>
					<h5 className='font-bold text-base mb-3'>Call Arguments</h5>
					<div>
						<ArgumentsTableJSONView postArguments={preimageArguments} showAccountArguments={true}  />
					</div>
				</div>}
				{metaDescription && metaDescription.length > 2 &&
				<div className='grid grid-cols-6 md:grid-cols-8 gap-x-5 mt-5'>
					<h6 className='col-span-6 md:col-span-2'>Description</h6>
					<p className='text-navBlue leading-6 col-span-6'>{metaDescription}</p>
				</div>}
				{/* TODO: Update for subscan when they have Gov2 */}
				{/* <Col span={24}>
					<ExternalLinks isReferendum={true} onchainId={onchainLink.onchain_referendumv2[0]?.referendumId} />
				</Col> */}
			</OnchainInfoWrapper>
		</>
	);
};

export default PostFellowshipReferendumInfo;