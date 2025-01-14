// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { ReactElement } from 'react';
import Lottie from 'react-lottie-player';

import WrongQuizAnswerJson from './lottie-files/thumb-down-outline.json';

interface Props {
	width?: number
}

function WrongQuizAnswers({ width = 250 }: Props): ReactElement {

	return (
		<div>
			<Lottie
				animationData={WrongQuizAnswerJson}
				style={{
					height: width,
					width: width
				}}
				play={true}
			/>
			<div className='text-sidebarBlue font-medium w-full text-center' >OOPS! This looks like the wrong answer.</div>
		</div>
	);
}

export default WrongQuizAnswers;
