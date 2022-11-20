// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BellOutlined, BookOutlined, DownOutlined, LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import styled from '@xstyled/styled-components';
import { Avatar, Drawer, Dropdown, Layout, Menu, MenuProps } from 'antd';
import { ItemType } from 'antd/lib/menu/hooks/useItems';
import React, { memo, ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import noUserImg from 'src/assets/no-user-img.png';
import { useUserDetailsContext } from 'src/context';
import { useLogoutMutation } from 'src/generated/graphql';
import { logout } from 'src/services/auth.service';
import { BountiesIcon, CalendarIcon, DemocracyProposalsIcon, DiscussionsIcon, MembersIcon, MotionsIcon, NewsIcon, OverviewIcon, ParachainsIcon, ReferendaIcon, TipsIcon, TreasuryProposalsIcon } from 'src/ui-components/CustomIcons';

import Footer from './Footer';
import GovernanceSwitchDropdown from './GovernanceSwitchDropdown';
import NavHeader from './NavHeader';
import SwitchRoutes from './SwitchRoutes';

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
		label
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
		</AuthDropdown>, 'noNavigate', <AuthDropdown><Avatar className='-ml-2.5 mr-2' size={40} src={img || noUserImg} /></AuthDropdown>);
};

let overviewItems = [
	getSiderMenuItem('Overview', '/', <OverviewIcon className='text-white' />),
	getSiderMenuItem('Discussions', '/discussions', <DiscussionsIcon className='text-white' />),
	getSiderMenuItem('Calendar', '/calendar', <CalendarIcon className='text-white' />),
	getSiderMenuItem('News', '/news', <NewsIcon className='text-white' />),
	getSiderMenuItem('Parachains', '/parachains', <ParachainsIcon className='text-white' />)
];

const GovSwitchDropdownMenuItem = getSiderMenuItem(<GovernanceSwitchDropdown className='block lg:hidden' />, 'noNavigate', '');

if(window.screen.width < 1024) {
	overviewItems = [
		GovSwitchDropdownMenuItem,
		...overviewItems
	];
}

const democracyItems = [
	getSiderMenuItem('Proposals', '/proposals', <DemocracyProposalsIcon className='text-white' />),
	getSiderMenuItem('Referenda', '/referenda', <ReferendaIcon className='text-white' />)
];

const councilItems = [
	getSiderMenuItem('Motions', '/motions', <MotionsIcon className='text-white' />),
	getSiderMenuItem('Members', '/council', <MembersIcon className='text-white' />)
];

const treasuryItems = [
	getSiderMenuItem('Proposals', '/treasury-proposals', <TreasuryProposalsIcon className='text-white' />),
	getSiderMenuItem('Bounties', '/bounties', <BountiesIcon className='text-white' />),
	getSiderMenuItem('Child Bounties', '/child_bounties', <BountiesIcon className='text-white' />),
	getSiderMenuItem('Tips', '/tips', <TipsIcon className='text-white' />)
];

const techCommItems = [
	getSiderMenuItem('Proposals', '/tech-comm-proposals', <DemocracyProposalsIcon className='text-white' />)
];

const items: MenuProps['items'] = [
	...overviewItems,

	getSiderMenuItem('Democracy', 'democracy_group', null, [
		...democracyItems
	]),

	getSiderMenuItem('Treasury', 'treasury_group', null, [
		...treasuryItems
	]),

	getSiderMenuItem('Council', 'council_group', null, [
		...councilItems
	]),

	getSiderMenuItem('Tech. Comm.', 'tech_comm_group', null, [
		...techCommItems
	])
];

const collapsedItems: MenuProps['items'] = [
	...overviewItems,
	...democracyItems,
	...treasuryItems,
	...councilItems,
	...techCommItems
];

const AppLayout = ({ className }: { className?:string }) => {
	const { setUserDetailsContextState, username, picture } = useUserDetailsContext();
	const [sidedrawer, setSidedrawer] = useState<boolean>(false);
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const handleMenuClick = (menuItem: any) => {
		if(menuItem.key === 'noNavigate') return;

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
					// onMouseLeave={() => setSidebarCollapsed(true)}
					className={'hidden overflow-y-hidden sidebar bg-white lg:block bottom-0 left-0 h-screen fixed z-40'}
				>
					<Menu
						theme="light"
						mode="inline"
						selectedKeys={[pathname]}
						defaultOpenKeys={['democracy_group', 'treasury_group', 'council_group', 'tech_comm_group']}
						items={
							username?
								[getUserDropDown(handleLogout, picture, username), ...collapsedItems]
								: collapsedItems}
						onClick={handleMenuClick}
						className={`${username?'auth-sider-menu':''} mt-[60px]`}
					/>
				</Sider>
				<Drawer placement='left' closable={false} onClose={() => setSidedrawer(false)} open={sidedrawer} getContainer={false} style={{ bottom:0, left:0, position: 'fixed', top: '60px' }}>
					<Menu
						theme="light"
						mode="inline"
						selectedKeys={[pathname]}
						defaultOpenKeys={['democracy_group', 'treasury_group', 'council_group', 'tech_comm_group']}
						items={username
							? [getUserDropDown(handleLogout, picture, username), ...items]
							: items}
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

.auth-sider-menu > li:first-child {
  margin-bottom: 25px;
}

.ant-empty-image{
	display: flex;
	justify-content: center;
}

.sidebar .ant-menu-item-selected .anticon {
	filter: brightness(0) saturate(100%) invert(13%) sepia(94%) saturate(7151%) hue-rotate(321deg) brightness(90%) contrast(101%);
}
`;