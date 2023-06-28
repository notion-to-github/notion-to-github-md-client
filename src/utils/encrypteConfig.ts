import { Config } from "@/types/config";

const encrypteConfig = (config: Config) => {
    return JSON.stringify(config);
};

export default encrypteConfig;
