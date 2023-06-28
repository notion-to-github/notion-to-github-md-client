import { useState } from "react";

const useButtonGroup = <T>(initValue: T) => {
    const [value, setValue] = useState<T>(initValue);

    return { value, setValue };
};

export default useButtonGroup;
