import React from "react";
import styled from "styled-components";

interface Props {
    buttons: string[];
    buttonGroup: any;
}

const ButtonGroup: React.FC<Props> = ({ buttons, buttonGroup }) => {
    return (
        <ButtonGroupContainer>
            {buttons.map((button, index) => (
                <Button
                    key={index}
                    $isSelected={buttonGroup.value === button}
                    onClick={() => {
                        buttonGroup.setValue(button);
                    }}
                >
                    {button}
                </Button>
            ))}
        </ButtonGroupContainer>
    );
};

export default ButtonGroup;

const ButtonGroupContainer = styled.div`
    display: flex;
    border-radius: 5px;
    overflow: hidden;
`;

interface ButtonProps {
    $isSelected: boolean;
}

const Button = styled.button<ButtonProps>`
    border: none;
    padding: 10px 15px;
    background-color: ${(props) => {
        if (props.$isSelected) return "gray";
        else return "#f0f0f0";
    }};
    cursor: pointer;

    &:not(:last-child) {
        border-right: 1px solid #ccc;
    }

    &:hover {
        background-color: gray;
    }
`;
