import { userInfoAtom } from '@/recoil/user';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

const Profile = () => {
    const userInfo = useRecoilValue(userInfoAtom);

    return (
        <Wrapper>
            {userInfo.nickname === null || userInfo.profile_url === null ? (
                <div>loading...</div>
            ) : (
                <>
                    <ProfileWrapper>
                        <img
                            src={userInfo.profile_url}
                            width={75}
                            height={75}
                        />
                    </ProfileWrapper>
                    <div>{userInfo.nickname}</div>
                </>
            )}
        </Wrapper>
    );
};

export default Profile;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ProfileWrapper = styled.div`
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
`;
