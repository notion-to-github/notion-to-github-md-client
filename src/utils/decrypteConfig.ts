import { Config } from "@/types/config";

const decrypteConfig = (encryptedConfig: string) => {
    return JSON.parse(encryptedConfig) as Config;
};

export default decrypteConfig;
