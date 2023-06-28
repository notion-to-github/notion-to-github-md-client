'use client';

import Profile from '@/components/Profile';
import useAuth from '@/hooks/useAuth';
import { getApp } from '@/lib/github';
import { accessTokenAtom } from '@/recoil/auth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

import Logo from '../assets/images/notion-to-github.png';
import Image from 'next/image';

export default function Page() {
    const { isAuth, signout } = useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const router = useRouter();
    const accessToken = useRecoilValue(accessTokenAtom);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    if (!isHydrated) {
        return null;
    }

    const handleSigninButtonClick = () => {
        window.location.assign(
            `${process.env.NEXT_PUBLIC_GITHUB_AUTH_CODE_SERVER}?client_id=${process.env.NEXT_PUBLIC_CLIENT_ID}&redirect_url=${process.env.NEXT_PUBLIC_REDIRECT_URL}`,
        );
    };

    const handleSettingButtonClick = () => router.push('/setting');

    const handleDeployButtonClick = async () => {
        const res = await getApp(accessToken.value);
        console.log(res);
    };

    return (
        <Wrapper>
            <Title>
                <Image
                    src={Logo}
                    alt="notion-to-github"
                    width={75}
                    height={75}
                />
                <h1>Notion to GitHub MD</h1>
            </Title>
            <div>
                Notion에 작성한 글을 Markdown으로 추출하여 자동으로 GitHub에
                올려주는 서비스 입니다.
            </div>
            <div>블로그, 웹사이트 등을 더욱 편하게 관리해보세요!</div>
            {!isAuth ? (
                <SigninButton onClick={handleSigninButtonClick}>
                    GitHub로 로그인
                </SigninButton>
            ) : (
                <>
                    <Profile />
                    <Button onClick={handleDeployButtonClick} $isDeploy>
                        📖 배포하기
                    </Button>
                    <Button onClick={handleSettingButtonClick}>
                        🛠️ 설정하기
                    </Button>
                    <Button onClick={signout}>⎋ 로그아웃</Button>
                    <div>
                        Notion to GitHub MD가 처음이라면?{' '}
                        <InlineLink href="/start">시작하기</InlineLink>
                    </div>
                </>
            )}
        </Wrapper>
    );
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Title = styled.div`
    display: flex;
`;

interface ButtonProps {
    $isDeploy?: boolean;
}

const Button = styled.button<ButtonProps>`
    cursor: pointer;
    width: 400px;
    font-size: 20px;
    margin: 20px;
    padding: 20px;
    border: 1px solid rgba(31, 35, 40, 0.15);
    border-radius: 10px;
    background-color: ${props => {
        if (props.$isDeploy) return '#1f883d';
        else return '#eeeeee';
    }};
    color: ${props => {
        if (props.$isDeploy) return '#ffffff';
    }};

    &:hover {
        background-color: ${props => {
            if (props.$isDeploy) return '#1a7f37';
            else return '#dedede';
        }};
    }
`;

const SigninButton = styled.button`
    cursor: pointer;
    font-size: 20px;
    margin: 20px;
    padding: 20px;
    border: none;
    border-radius: 10px;
    color: #ffffff;
    background-color: #000000;
`;

const InlineLink = styled.a`
    color: #1c6bfe;
    text-decoration: underline;
`;
