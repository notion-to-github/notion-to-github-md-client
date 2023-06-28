'use client';

import Loading from '@/components/Loading';
import { accessTokenAtom, refreshTokenAtom } from '@/recoil/auth';
import { isInitSettingAtom } from '@/recoil/config';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilCallback, useRecoilValue } from 'recoil';
import { styled } from 'styled-components';

const Page = () => {
    const setAccessToken = useSetRecoilState(accessTokenAtom);
    const setRefreshToken = useSetRecoilState(refreshTokenAtom);
    const router = useRouter();
    const isInitSetting = useRecoilValue(isInitSettingAtom);

    const getAccessToken = async (code: string | null) => {
        const response = await axios.post('/api/auth', { code });
        const res = response.data;
        console.log(res);
        const now = new Date().getTime();
        setAccessToken({
            value: res.access_token,
            expire_time: now + (res.expires_in - 600) * 1000,
        });
        setRefreshToken({
            value: res.refresh_token,
            expire_time: now + (res.refresh_token_expires_in - 600) * 1000,
        });
        handleStateUpdate();
    };

    const handleStateUpdate = useRecoilCallback(({ snapshot }) => async () => {
        const accessToken = await snapshot.getPromise(accessTokenAtom);
        console.log(accessToken);
        if (isInitSetting) router.replace('/start');
        else router.replace('/');
    });

    useEffect(() => {
        const location = new URL(window.location.href);
        const code = location.searchParams.get('code');
        getAccessToken(code);
    }, []);

    return (
        <Wrapper>
            <Loading />
        </Wrapper>
    );
};

export default Page;

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100vw;
    height: 100vh;
`;
