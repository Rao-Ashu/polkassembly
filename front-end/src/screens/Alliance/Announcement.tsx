// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import AllianceAnnouncements from 'src/components/Listing/Members/AllianceAnnouncements';

const Announcements = () => {
	return (
		<>
			<h1 className='dashboard-heading mb-4 md:mb-6'>Alliance</h1>

			{/* Intro and Create Post Button */}
			<div className="flex flex-col md:flex-row">
				<p className="text-sidebarBlue text-sm md:text-base font-medium bg-white p-4 md:p-8 rounded-md w-full shadow-md mb-4">
					The Alliance Pallet provides a collective that curates a list of accounts and URLs, deemed by the voting members to be unscrupulous actors. The Alliance provides a set of ethics against bad behavior, and provides recognition and influence for those teams that contribute something back to the ecosystem.
				</p>
			</div>
			<AllianceAnnouncements className='mt-8' />
		</>
	);
};

export default Announcements;