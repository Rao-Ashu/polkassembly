// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

/* eslint-disable sort-keys */
import { BellOutlined, BookOutlined, DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Avatar, Drawer, Dropdown, Layout, Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { memo, ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import noUserImg from 'src/assets/no-user-img.png';
import { useUserDetailsContext } from 'src/context';
import { useLogoutMutation } from 'src/generated/graphql';
import { trackInfo } from 'src/global/post_trackInfo';
import { logout } from 'src/services/auth.service';
import { PostOrigin } from 'src/types';
import { AuctionAdminIcon, BountiesIcon, CalendarIcon, DemocracyProposalsIcon, DiscussionsIcon, FellowshipGroupIcon, GovernanceGroupIcon, MembersIcon, MotionsIcon, NewsIcon, OverviewIcon, ParachainsIcon, PreimagesIcon, ReferendaIcon, RootIcon, StakingAdminIcon, TipsIcon, TreasuryGroupIcon, TreasuryProposalsIcon } from 'src/ui-components/CustomIcons';
import checkGov2Route from 'src/util/checkGov2Route';
import getNetwork from 'src/util/getNetwork';

import Footer from './Footer';
import GovernanceSwitchButton from './GovernanceSwitchButton';
import NavHeader from './NavHeader';
import SwitchRoutes from './SwitchRoutes';

const network = getNetwork();

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getSiderMenuItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[]
): MenuItem {
	return {
		children,
		icon,
		key,
		label,
		type: key === 'tracksHeading' ? 'group' : ''
	} as MenuItem;
}

const getUserDropDown = (handleLogout: any, img?: string | null, username?: string): MenuItem => {
	const dropdownMenuItems: ItemType[] = [
		{
			key: 'notification settings',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='notification-settings'>
				<BellOutlined />
				<span>Notifications</span>
			</Link>
		},
		{
			key: 'view profile',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to={`/user/${username}`}>
				<UserOutlined />
				<span>View Profile</span>
			</Link>
		},
		{
			key: 'tracker',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='/tracker'>
				<BookOutlined />
				<span>Tracker</span>
			</Link>
		},
		{
			key: 'settings',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' to='/settings'>
				<SettingOutlined />
				<span>Settings</span>
			</Link>
		},
		{
			key: 'logout',
			label: <Link className='text-navBlue hover:text-pink_primary font-medium flex items-center gap-x-2' onClick={handleLogout} to='/'>
				<LogoutOutlined />
				<span>Logout</span>
			</Link>
		}
	];

	const AuthDropdown = ({ children }: {children: ReactNode}) => (
		<Dropdown menu={{ items: dropdownMenuItems }} trigger={['click']}>
			{children}
		</Dropdown>
	);

	return getSiderMenuItem(
		<AuthDropdown>
			<div className='flex items-center justify-between gap-x-2'>
				<span className='truncate w-[85%]'>{username || ''}</span> <DownOutlined className='text-navBlue hover:text-pink_primary text-base' />
			</div>
		</AuthDropdown>, 'userMenu', <AuthDropdown><Avatar className='-ml-2.5 mr-2' size={40} src={img || noUserImg} /></AuthDropdown>);
};

const gov1Items: {[x:string]: ItemType[]} = {
	overviewItems: [
		getSiderMenuItem('Overview', '/', <OverviewIcon className='text-white' />),
		getSiderMenuItem('Discussions', '/discussions', <DiscussionsIcon className='text-white' />),
		getSiderMenuItem('Calendar', '/calendar', <CalendarIcon className='text-white' />),
		getSiderMenuItem('News', '/news', <NewsIcon className='text-white' />),
		getSiderMenuItem('Parachains', '/parachains', <ParachainsIcon className='text-white' />)
	],
	democracyItems: [
		getSiderMenuItem('Proposals', '/proposals', <DemocracyProposalsIcon className='text-white' />),
		getSiderMenuItem('Referenda', '/referenda', <ReferendaIcon className='text-white' />)
	],
	councilItems: [
		getSiderMenuItem('Motions', '/motions', <MotionsIcon className='text-white' />),
		getSiderMenuItem('Members', '/council', <MembersIcon className='text-white' />)
	],
	treasuryItems: [
		getSiderMenuItem('Proposals', '/treasury-proposals', <TreasuryProposalsIcon className='text-white' />),
		getSiderMenuItem('Bounties', '/bounties', <BountiesIcon className='text-white' />),
		getSiderMenuItem('Child Bounties', '/child_bounties', <BountiesIcon className='text-white' />),
		getSiderMenuItem('Tips', '/tips', <TipsIcon className='text-white' />)
	],
	techCommItems: [
		getSiderMenuItem('Proposals', '/tech-comm-proposals', <DemocracyProposalsIcon className='text-white' />)
	],
	allianceItems: [
		getSiderMenuItem('Members', '/alliance-members', <MembersIcon className='text-white' />),
		// getSiderMenuItem('Motions', '/alliance-motions', <MotionsIcon className='text-white' />),
		getSiderMenuItem('Announcements', '/alliance-announcements', <NewsIcon className='text-white' />),
		getSiderMenuItem('Unscrupulous', '/alliance-unscrupulous', <ReferendaIcon className='text-white' />)
	]
};

if(window.screen.width < 1024 && network === 'kusama') {
	gov1Items.overviewItems = [
		getSiderMenuItem(<GovernanceSwitchButton className='flex lg:hidden' />, 'gov-2', ''),
		...gov1Items.overviewItems
	];
}

const items: MenuProps['items'] = [
	...gov1Items.overviewItems,

	getSiderMenuItem('Democracy', 'democracy_group', null, [
		...gov1Items.democracyItems
	]),

	getSiderMenuItem('Treasury', 'treasury_group', null, [
		...gov1Items.treasuryItems
	]),

	getSiderMenuItem('Council', 'council_group', null, [
		...gov1Items.councilItems
	]),

	getSiderMenuItem('Tech. Comm.', 'tech_comm_group', null, [
		...gov1Items.techCommItems
	]),

	getSiderMenuItem('Alliance', 'alliance_group', null, [
		...gov1Items.allianceItems
	])
];

const collapsedItems: MenuProps['items'] = [
	...gov1Items.overviewItems,
	...gov1Items.democracyItems,
	...gov1Items.treasuryItems,
	...gov1Items.councilItems,
	...gov1Items.techCommItems,
	...gov1Items.allianceItems
];

const gov2TrackItems: {[x:string]: ItemType[]} = {
	mainItems: [
		getSiderMenuItem(PostOrigin.ROOT.split(/(?=[A-Z])/).join(' '), `/${PostOrigin.ROOT.split(/(?=[A-Z])/).join('-').toLowerCase()}`, <RootIcon className='text-white' />),
		getSiderMenuItem(PostOrigin.AUCTION_ADMIN.split(/(?=[A-Z])/).join(' '), `/${PostOrigin.AUCTION_ADMIN.split(/(?=[A-Z])/).join('-').toLowerCase()}`, <AuctionAdminIcon className='text-white' />),
		getSiderMenuItem(PostOrigin.STAKING_ADMIN.split(/(?=[A-Z])/).join(' '), `/${PostOrigin.STAKING_ADMIN.split(/(?=[A-Z])/).join('-').toLowerCase()}`, <StakingAdminIcon className='text-white' />)
	],
	governanceItems : [],
	treasuryItems: [],
	fellowshipItems: [
		getSiderMenuItem('Members', '/fellowship')
	]
};

for (const trackName of Object.keys(trackInfo)) {
	if(!('group' in trackInfo[trackName])) continue;

	const menuItem = getSiderMenuItem(trackName.split(/(?=[A-Z])/).join(' '), `/${trackName.split(/(?=[A-Z])/).join('-').toLowerCase()}`);

	switch(trackInfo[trackName].group) {
	case 'Governance':
		gov2TrackItems.governanceItems.push(menuItem);
		break;
	case 'Treasury':
		gov2TrackItems.treasuryItems.push(
			getSiderMenuItem(trackName.split(/(?=[A-Z])/).join(' '), `/${trackName.split(/(?=[A-Z])/).join('-').toLowerCase()}`)
		);
		break;
	case 'Fellowship':
		gov2TrackItems.fellowshipItems.push(
			getSiderMenuItem(trackName.split(/(?=[A-Z])/).join(' '), `/${trackName.split(/(?=[A-Z])/).join('-').toLowerCase()}`)
		);
		break;
	}
}

let gov2OverviewItems = [
	getSiderMenuItem('Overview', '/gov-2', <OverviewIcon className='text-white' />),
	getSiderMenuItem('Discussions', '/discussions', <DiscussionsIcon className='text-white' />),
	getSiderMenuItem('Calendar', '/calendar', <CalendarIcon className='text-white' />),
	getSiderMenuItem('News', '/news', <NewsIcon className='text-white' />),
	getSiderMenuItem('Parachains', '/parachains', <ParachainsIcon className='text-white' />),
	getSiderMenuItem('Preimages', '/preimages', <PreimagesIcon className='text-sidebarBlue' />)

];

if(window.screen.width < 1024 && network === 'kusama') {
	gov2OverviewItems = [
		getSiderMenuItem(<GovernanceSwitchButton className='flex lg:hidden' />, '/', ''),
		...gov2OverviewItems
	];
}

const gov2Items:MenuProps['items'] = [
	...gov2OverviewItems,
	// Tracks Heading
	getSiderMenuItem(<span className='text-navBlue hover:text-navBlue ml-2 uppercase text-base font-medium'>Tracks</span>, 'tracksHeading', null),
	...gov2TrackItems.mainItems,
	getSiderMenuItem('Governance', 'gov2_governance_group', <GovernanceGroupIcon className='text-sidebarBlue' />, [
		...gov2TrackItems.governanceItems
	]),
	getSiderMenuItem('Treasury', 'gov2_treasury_group', <TreasuryGroupIcon className='text-sidebarBlue' />, [
		...gov2TrackItems.treasuryItems
	]),
	getSiderMenuItem('Fellowship', 'gov2_fellowship_group', <FellowshipGroupIcon className='text-sidebarBlue' />, [
		...gov2TrackItems.fellowshipItems
	])
];

const gov2CollapsedItems:MenuProps['items'] = [
	...gov2OverviewItems,
	...gov2TrackItems.mainItems,
	getSiderMenuItem('Governance', 'gov2_governance_group', <GovernanceGroupIcon className='text-white' />, [
		...gov2TrackItems.governanceItems
	]),
	getSiderMenuItem('Treasury', 'gov2_treasury_group', <TreasuryGroupIcon className='text-white' />, [
		...gov2TrackItems.treasuryItems
	]),
	getSiderMenuItem('Fellowship', 'gov2_fellowship_group', <FellowshipGroupIcon className='text-white' />, [
		...gov2TrackItems.fellowshipItems
	])
];

const AppLayout = ({ className }: { className?:string }) => {
	const { setUserDetailsContextState, username, picture } = useUserDetailsContext();
	const [sidedrawer, setSidedrawer] = useState<boolean>(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const isGov2Route: boolean = checkGov2Route(pathname);

	const handleMenuClick = (menuItem: any) => {
		if(['userMenu', 'tracksHeading'].includes(menuItem.key)) return;
		navigate(menuItem.key);
		setSidedrawer(false);
	};

	const [logoutMutation] = useLogoutMutation();

	const handleLogout = async () => {
		try {
			await logoutMutation();
		} catch (error) {
			console.error(error);
		}
		logout(setUserDetailsContextState);
		navigate('/');
	};

	const userDropdown = getUserDropDown(handleLogout, picture, username!);

	let sidebarItems = !sidedrawer ? collapsedItems : items;

	if(isGov2Route) {
		sidebarItems = !sidedrawer ? gov2CollapsedItems : gov2Items;
	}

	if(username) {
		sidebarItems = [userDropdown, ...sidebarItems];
	}

	return (
		<Layout className={className}>
			<NavHeader sidedrawer={sidedrawer} setSidedrawer={setSidedrawer}  />
			<Layout hasSider>
				<Sider
					trigger={null}
					collapsible={false}
					collapsed={true}
					onMouseOver={() => setSidedrawer(true)}
					style={{ transform: sidedrawer ? 'translateX(-60px)' : 'translateX(0px)', transitionDuration: '0.3s' }}
					className={'hidden overflow-y-hidden sidebar bg-white lg:block bottom-0 left-0 h-screen fixed z-40'}
				>
					<Menu
						theme="light"
						mode="inline"
						selectedKeys={[pathname]}
						defaultOpenKeys={['democracy_group', 'treasury_group', 'council_group', 'tech_comm_group', 'alliance_group']}
						items={sidebarItems}
						onClick={handleMenuClick}
						className={`${username?'auth-sider-menu':''} mt-[60px]`}
					/>
				</Sider>
				<Drawer placement='left' closable={false} onClose={() => setSidedrawer(false)} open={sidedrawer} getContainer={false} style={{ bottom:0, left:0, position: 'fixed', top: '60px' }}>
					<Menu
						theme="light"
						mode="inline"
						selectedKeys={[pathname]}
						defaultOpenKeys={['democracy_group', 'treasury_group', 'council_group', 'tech_comm_group', 'alliance_group']}
						items={sidebarItems}
						onClick={handleMenuClick}
						className={`${username?'auth-sider-menu':''} mt-[60px]`}
						onMouseLeave={() => setSidedrawer(false)}
					/>
				</Drawer>
				<Layout className='min-h-[calc(100vh - 10rem)] flex flex-row'>
					{/* Dummy Collapsed Sidebar for auto margins */}
					<div className="hidden lg:block bottom-0 left-0 w-[80px] -z-50"></div>
					<CustomContent />
				</Layout>
			</Layout>
			<Footer />
		</Layout>
	);
};

const CustomContent = memo(function CustomContent() {
	return <Content className={'lg:opacity-100 flex-initial mx-auto min-h-[90vh] w-[94vw] lg:w-[85vw] 2xl:w-5/6 my-6'}>
		<SwitchRoutes />
	</Content>;
});

export default styled(AppLayout)`

.ant-drawer-content-wrapper{
	max-width: 256px !important;
	box-shadow: none !important;
	min-width: 60px !important;

}
.ant-drawer-body{
	padding: 0 !important;

	ul{
		margin-top: 0 !important;
	}
}

.ant-menu-item-selected {
	background: #fff !important;

	.ant-menu-title-content {
		color: pink_primary !important;
	}
}

.ant-menu-title-content:hover {
	color: pink_primary !important;
}

.ant-menu-item::after {
	border-right: none !important;
}

.ant-menu-title-content {
	color: #334D6E !important;
	font-weight: 500;
	font-size: 14px;
	line-height: 21px;
	letter-spacing: 0.01em;
}

.auth-sider-menu {
	list-style: none !important;
}

.auth-sider-menu > li:first-child {
  margin-bottom: 25px;
  margin-top: 15px;
}

.ant-empty-image{
	display: flex;
	justify-content: center;
}

.sidebar .ant-menu-item-selected .anticon {
	filter: brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7151%) hue-rotate(321deg) brightness(90%) contrast(101%);
}

.ant-menu-inline-collapsed-noicon {
	color: nav_link;
}

.ant-menu-item-selected {
	.ant-menu-inline-collapsed-noicon {
		color: pink_primary;
	}
}

.ant-menu-sub {
	background: #fff !important;
}
`;