// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { ReactNode } from 'react';

interface Props {
	children: ReactNode
	className?: string
}

const OnchainInfoWrapper = ({ children, className }: Props) => {

	return (
		<div className={className}>{children}</div>
	);
};

export default styled(OnchainInfoWrapper)`
	background-color: white;
	padding: 2rem 3rem 2rem 3rem;
	border-style: solid;
	border-width: 5px;
	border-color: grey_light;
	font-size: sm;
	overflow-wrap: break-word;
	margin-bottom: 1rem;
	font-family: font_mono;

	h6 {
		font-family: font_mono;
		font-size: sm;
	}

	h4 {
		font-size: lg;
		font-family: font_mono;
		margin-bottom: 2rem;
	}

	.methodArguments {
		display: inline-block;
		overflow-x: auto;
		overflow-y: auto;
		width: 100%;
		max-height: 20rem;
		word-wrap: normal;
	}

	.motion-sub-info{
		background-color: grey_light;
		.row {
			width: 100%;
		}
	}

	@media only screen and (max-width: 576px) {
		padding: 2rem;
	}

	/* Arguments Style */
	.arguments-heading {
		margin-bottom: 12px;
		display: flex;
		align-items: center;

		&.mt {
			margin-top: 20px;
		}

		.buttons {
			margin-left: 12px;

			.active-btn {
				background: #E5007A !important;
				color: #fff;
			}
		}
	}

	.json-view, .table-view {
		width: 100%;
		max-width: 100%;
		overflow-x: auto;
		background: #eee;
		padding: 16px;
	}

	.react-json-view {
		background: #fff !important;
		padding: 8px;
		width: 100%;
		overflow-x: auto;
	}

	.table-view {
		table {
			width: 100%;
			border-spacing: 0px;
		}

		td.indirect-data {
			background: #fff;
		}

		td.direct-data {
			font-style: normal;
			font-weight: normal;
			font-size: 14px;
			line-height: 20px;
			height: 40px;
			border-style: solid;
			border-width: 1px 1px 0px 1px;
			border-color: rgb(238, 238, 238);
			min-width: 160px;
    	padding: 10px 24px;
			background: #fff;
		}
	}
`;
