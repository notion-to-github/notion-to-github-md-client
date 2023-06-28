import { Config } from '@/types/config';
import encrypteConfig from '@/utils/encrypteConfig';
import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';

const { persistAtom } = recoilPersist();

const defaultConfig: Config = {
    notion: {
        api_key: null,
        database_id: null,
    },
    github: {
        repository: null,
        directory: null,
    },
    image: {
        storage: 'github',
    },
    notification: 'none',
};

export const encryptedConfigAtom = atom<string>({
    key: 'encryptedConfigAtom',
    default: encrypteConfig(defaultConfig),
    effects_UNSTABLE: [persistAtom],
});

export const tempConfigAtom = atom<Config>({
    key: 'tempComfigAtom',
    default: defaultConfig,
});

export const isInitSettingAtom = atom<boolean>({
    key: 'isInitSettingAtom',
    default: true,
    effects_UNSTABLE: [persistAtom],
});
