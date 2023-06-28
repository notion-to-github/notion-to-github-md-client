import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

interface Token {
    value: string | null;
    expire_time: number;
}

export const accessTokenAtom = atom<Token>({
    key: "accessTokenAtom",
    default: {
        value: null,
        expire_time: 0,
    },
    effects_UNSTABLE: [persistAtom],
});

export const refreshTokenAtom = atom<Token>({
    key: "refreshTokenAtom",
    default: {
        value: null,
        expire_time: 0,
    },
    effects_UNSTABLE: [persistAtom],
});
