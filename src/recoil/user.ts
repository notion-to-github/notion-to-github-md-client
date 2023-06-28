import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

interface UserInfo {
    nickname: string | null;
    profile_url: string | null;
}

export const userInfoAtom = atom<UserInfo>({
    key: "userInfoAtom",
    default: { nickname: null, profile_url: null },
    effects_UNSTABLE: [persistAtom],
});
