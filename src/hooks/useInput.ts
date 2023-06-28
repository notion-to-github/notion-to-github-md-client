import { useState } from "react";

const useInput = (initValue: string | null, isPassword?: boolean) => {
    const [value, setValue] = useState<string>(
        initValue === null ? "" : initValue
    );

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    const onReset = () => {
        setValue("");
    };

    const [isVisible, setIsVisible] = useState<boolean>(
        isPassword ? false : true
    );

    const toggleVisible = () => {
        setIsVisible((prev) => !prev);
    };

    return { value, onChange, onReset, isVisible, toggleVisible };
};

export default useInput;
