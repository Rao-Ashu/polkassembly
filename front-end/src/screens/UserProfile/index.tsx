// Copyright 2019-2020 @Premiurly/polkassembly authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import styled from '@xstyled/styled-components';
import React, { useContext, useEffect, useState } from 'react';
import { Button, Card, Divider, Form, Grid, Icon, Input, Label, TextArea } from 'semantic-ui-react';
import { UserDetailsContext } from 'src/context/UserDetailsContext';
import { useGetUserDetailsQuery } from 'src/generated/graphql';
import Loader from 'src/ui-components/Loader';

interface Props {
	className?: string
}

const UserProfile = ({ className }: Props): JSX.Element => {
	const { id, username } = useContext(UserDetailsContext);
	const [bio, setBio] = useState<string>('');
	const [userImage, setUserImage] = useState<string>('');
	const [editProfile, setEditProfile] = useState<boolean>(false);
	const [title, setTitle] = useState<string>('aaa');
	const [badges, setBadges] = useState<string[]>(['star', 'tsar', 'arts', 'rats', 'sart']);
	const [newBadge, setNewBadge] = useState<string>('');

	const { data, error } = useGetUserDetailsQuery({
		variables: {
			user_id: Number(id)
		}
	});

	console.log('data : ', data);
	console.log('error : ', error);

	// TODO: Enable
	// useEffect(() => {
	// refetch();
	// }, [refetch]);

	useEffect(() => {
		if(data?.userDetails) {
			setBio(`${data.userDetails.bio}`);
			setUserImage(`${data.userDetails.image}`);
			setTitle('data.userDetails.title');
			setBadges(['data.userDetails.badges']);
		}
	}, [data]);

	const addNewBadge = () => {
		setBadges([...badges, newBadge]);
		setNewBadge('');
	};

	return (
		id ? <Grid stackable className={className}>
			<Grid.Column width={16}>
				<h1>Profile</h1>
			</Grid.Column>
			{ data && !error ?
				<Grid.Column className='profile-card' mobile={16} tablet={16} computer={15} largeScreen={15} widescreen={15}>

					<Grid stackable>
						<Grid.Column className='profile-col' width={16}>
							<div className='profile-div'>
								{userImage ?
									<img width={130} height={130} className='profile-img' src={`data:image/png;base64,${userImage}`} />
									: <Icon className='no-image-icon' name='user circle' />
								}

								<div className={`profile-text-div ${editProfile ? 'editing' : ''}`}>
									{ username && <h3 className='display-name'>{username}</h3>}

									{editProfile ? <Input placeholder='Title' onChange={(e) => setTitle(e.target.value)} value={title} /> :
										title ? <h3 className='display-title'>{title}</h3> :
											<h3 className='no-display-title'>No title added</h3>
									}

									{ editProfile && <Input placeholder='New Badge' onChange={(e) => setNewBadge(e.target.value)} value={newBadge} action={{ icon: 'add', onClick: addNewBadge }} /> }
									{ badges.length > 0 ?
										<Label.Group className={`display-badges ${editProfile ? 'editing' : ''}`} size='big'>
											{badges.map((badge, i) => (<Label key={i}>{badge}{editProfile ? <Icon name='delete' /> : null}</Label>))}
										</Label.Group> :
										<h3 className='no-display-title'>No badges added</h3>
									}
								</div>
							</div>
							<Button basic size='large' className='edit-profile-btn' onClick={() => { setEditProfile(!editProfile);} }> <Icon name={`${ editProfile ? 'close' : 'pencil'}`} /> {`${ editProfile ? 'Cancel Edit' : 'Edit Profile'}`}</Button>
						</Grid.Column>
					</Grid>

					{editProfile ?
						<>
							<Divider className='profile-divider' />
							<div className='about-div'>
								<h2>About</h2>
								<Form>
									<TextArea rows={6} placeholder='Please add your bio here...' onChange={(e) => setBio((e.target as HTMLInputElement).value)} value={bio} />
								</Form>

								<Button className='update-button' size='big'>
									Update
								</Button>
							</div>
						</>
						:bio ?
							<>
								<Divider className='profile-divider' />
								<div className='about-div'>
									<h2>About</h2>
									<p>{bio}</p>
								</div>
							</>
							:
							<>
								<Divider className='profile-divider' />
								<div className='no-about-div'>
									<p>Please click on &apos;Edit Profile&apos; to add a bio.</p>
								</div>
							</>
					}
				</Grid.Column>
				:
				<Loader />
			}
		</Grid>
			:
			<Grid stackable className={className}>
				<Grid.Column width={16}>
					<Card fluid header='Please login to access profile.' />
				</Grid.Column>
			</Grid>
	);
};

export default styled(UserProfile)`

	h1 {
		font-size: 48px;
		font-weight: 400;
		margin-bottom: 36px;
	}

	.profile-card {
		background-color: white;
		padding: 24px !important;
		border-radius: 10px;
		box-shadow: box_shadow_card;

		.profile-div {
			@media only screen and (min-width: 767px) {
				display: flex;
			}

			.profile-img {
				border-radius: 50%;
			}

			.no-image-icon {
				font-size: 130px !important;
				margin-top: 50px;
				margin-bottom: -48px;
				color: #778192;
			}
		}


		.profile-text-div {
			@media only screen and (min-width: 767px) {
				margin-left: 24px;
			}

			&.editing {
				display: flex;
				flex-direction: column;

				.input {
					margin-bottom: 16px;
					width: 100%;
					max-width: 400px;

					@media only screen and (max-width: 767px) {
						margin-left: auto;
						margin-right: auto;
					}

					.button {
						padding: 0 16px;
					}
				}
			}
		}

		.profile-col {
			display: flex !important;
			justify-content: space-between;

			@media only screen and (max-width: 767px) {
				text-align: center;
				flex-direction: column;
				margin-left: 0;
			}

			h3 {
				font-weight: 500;
			}
			
			h3.display-name {
				margin-top: 1rem;
				font-size: 22px;
			}

			h3.display-title, h3.no-display-title {
				font-size: 18px;
				color: #7D7D7D;
				margin-top: 16px;
				text-transform: capitalize;
			}

			h3.no-display-title {
				font-size: 16px;
				text-transform: none;
			}

			.display-badges {
				margin-top: 26px;

				&.editing {
					margin-top: 0;
				}

				.label {
					border-radius: 48px;
					background: #E5007A;
					color: #fff;
					font-size: 14px;
					font-weight: 500;
				}
			}

			.edit-profile-btn {
				border-radius: 5px;
				border: 1px solid #8D8D8D;
				height: 40px;
				font-size: 14px;
    		white-space: nowrap;

				@media only screen and (max-width: 767px) {
					margin-top: 16px;
				}
			}
		}

		.profile-divider {
			margin-top: 3.5em;
		}

		.about-div, .no-about-div {
			margin: 1.4em 0.5em;

			h2 {
				font-weight: 500;
				font-size: 22px;
			}

			p, textarea {
				font-weight: 400;
				font-size: 16px;
				line-height: 24px;
				color: #7D7D7D !important;
			}

			.update-button {
				background-color: #E5007A;
				color: #fff;
				margin-top: 16px;
				float: right;
			}
		}

		.no-about-div {
			text-align: center;
			margin-bottom: -4px;
		}
}
`;
