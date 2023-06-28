import { getUserInfo } from "@/lib/github";
import { accessTokenAtom, refreshTokenAtom } from "@/recoil/auth";
import { userInfoAtom } from "@/recoil/user";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useResetRecoilState } from "recoil";

const useAuth = () => {
    const [isAuth, setIsAuth] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
    const resetAccessToken = useResetRecoilState(accessTokenAtom);
    const [refreshToken, setRefreshToken] = useRecoilState(refreshTokenAtom);
    const resetRefreshToken = useResetRecoilState(refreshTokenAtom);
    const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
    const resetUserInfo = useResetRecoilState(userInfoAtom);
    const router = useRouter();
    const pathname = usePathname();

    const getAccessTokenByRefreshToken = async (
        refreshToken: string | null
    ) => {
        const response = await axios.post("/api/auth/refresh", {
            refreshToken,
        });
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
    };

    const updateUserInfo = async () => {
        if (userInfo.nickname !== null) return;
        const res = await getUserInfo(accessToken.value);
        // console.log(res);
        setUserInfo({ nickname: res.login, profile_url: res.avatar_url });
    };

    useEffect(() => {
        // console.log("use auth mount.");
        // console.log(accessToken);
        // console.log(refreshToken);

        if (accessToken.value === null && refreshToken.value === null) {
            // case 1: 최초 접속
        } else if (accessToken.expire_time < new Date().getTime()) {
            // case 2: access token 만료
            getAccessTokenByRefreshToken(refreshToken.value);
            updateUserInfo();
            setIsAuth(true);
        } else if (refreshToken.expire_time < new Date().getTime()) {
            // case 3: refresh token 만료
            alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
            if (pathname !== "/") router.push("/");
        } else {
            // case 0: 모든 token 정상
            updateUserInfo();
            setIsAuth(true);
            // console.log("야호!");
        }
    }, []);

    const signout = () => {
        resetAccessToken();
        resetRefreshToken();
        resetUserInfo();
        setIsAuth(false);
    };

    return { isAuth, signout };
};

export default useAuth;
