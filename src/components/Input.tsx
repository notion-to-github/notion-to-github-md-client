import { ChangeEvent } from "react";
import { styled } from "styled-components";

interface Props {
    input?: {
        value: string;
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        onReset: () => void;
        isVisible: boolean;
        toggleVisible: () => void;
    };
    password?: boolean;
}

const Input = (props: Props) => {
    const { input, password } = props;
    return (
        <Wrapper>
            <StyledInput
                value={input?.value}
                onChange={input?.onChange}
                type={input?.isVisible ? "text" : "password"}
            />
            {password && (
                <ToggleButton onClick={input?.toggleVisible}>
                    {input?.isVisible ? "숨김" : "표시"}
                </ToggleButton>
            )}
        </Wrapper>
    );
};

export default Input;

const Wrapper = styled.div`
    display: flex;
    align-items: center;
`;

const StyledInput = styled.input`
    background-color: #f0f0f0;
    border: 1px solid #ccc;
    border-radius: 5px;
    width: 300px;
    height: 25px;
    padding: 0 10px;

    &:focus {
        background-color: #ffffff;
    }
`;

const ToggleButton = styled.button`
    border: none;
    background-color: #ffffff;
    width: 40px;
    color: #1c6bfe;
    cursor: pointer;
`;
