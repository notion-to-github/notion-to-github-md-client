'use client';

import ButtonGroup from '@/components/ButtonGroup';
import useButtonGroup from '@/hooks/useButtonGroup';
import useInput from '@/hooks/useInput';
import { putSecrets } from '@/lib/github';
import { accessTokenAtom } from '@/recoil/auth';
import {
    encryptedConfigAtom,
    isInitSettingAtom,
    tempConfigAtom,
} from '@/recoil/config';
import { Config, ImageStorage, Notification } from '@/types/config';
import encrypteConfig from '@/utils/encrypteConfig';
import decrypteConfig from '@/utils/decrypteConfig';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
    useRecoilCallback,
    useRecoilState,
    useRecoilValue,
    useResetRecoilState,
} from 'recoil';
import { styled } from 'styled-components';
import Section from '@/components/Section';
import SubSection from '@/components/SubSection';
import Input from '@/components/Input';
import Dropdown from '@/components/Dropdown';
import { AWSRegion } from '@/constants/AWSRegion';
import useAuth from '@/hooks/useAuth';

const Page = () => {
    useAuth();
    const [isHydrated, setIsHydrated] = useState(false);
    const accessToken = useRecoilValue(accessTokenAtom);
    const router = useRouter();
    const [encrytedConfig, setEncrytedConfig] =
        useRecoilState(encryptedConfigAtom);
    const resetConfig = useResetRecoilState(encryptedConfigAtom);
    const config = decrypteConfig(encrytedConfig);
    const images = ['github', 'aws_s3'];
    const notifications = ['none', 'slack'];
    const [tempConfig, setTempConfig] = useRecoilState(tempConfigAtom);

    const notionAPIKeyInput = useInput(config.notion.api_key, true);
    const notionDatabaseIDInput = useInput(config.notion.database_id, true);
    const githubRepositoryInput = useInput(config.github.repository);
    const githubDirectoryInput = useInput(config.github.directory);
    const imageStorageButtonGroup = useButtonGroup<ImageStorage>(
        config.image.storage,
    );
    const notificationButtonGroup = useButtonGroup<Notification>(
        config.notification,
    );

    const isInitSetting = useRecoilValue(isInitSettingAtom);

    const temp = useRecoilCallback(({ snapshot }) => async () => {
        const temp = await snapshot.getPromise(tempConfigAtom);
        console.log(temp);
    });

    useEffect(() => {
        if (isInitSetting) router.replace('/start');
        setIsHydrated(true);
        setTempConfig(config);
        temp();
    }, []);

    if (!isHydrated) {
        return null;
    }

    const handleClearButtonClick = () => resetConfig();

    const handleSaveButtonClick = () => {
        const newConfig: Config = {
            notion: {
                api_key: notionAPIKeyInput.value,
                database_id: notionDatabaseIDInput.value,
            },
            github: {
                repository: githubRepositoryInput.value,
                directory: githubDirectoryInput.value,
            },
            image: {
                storage: imageStorageButtonGroup.value,
            },
            notification: notificationButtonGroup.value,
        };
        console.log(newConfig);
        setEncrytedConfig(encrypteConfig(newConfig));
        router.push('/');
        // putSecrets(accessToken);
    };

    return (
        <TopWrapper>
            <Wrapper>
                <h1>🛠️ setting</h1>

                <Section title="Notion">
                    <SubSection
                        title="API Key"
                        description="노션 api key"
                        necessary
                    >
                        <Input input={notionAPIKeyInput} password />
                    </SubSection>
                    <SubSection
                        title="Database ID"
                        description='Notion에서 불러올 database의 id 입니다. "시작하기"를 통해 Notion database를 생성하였다면 자동으로 입력됩니다.'
                        necessary
                    >
                        <Input input={notionDatabaseIDInput} password />
                    </SubSection>
                </Section>

                <Section title="GitHub">
                    <SubSection
                        title="Repository name"
                        description=".md 파일이 저장될 GitHub 계정 내 레포지토리를 설정합니다."
                        necessary
                    >
                        <Input input={githubRepositoryInput} />
                    </SubSection>
                    <SubSection
                        title="Directory path"
                        description=".md 파일이 저장될 GitHub 계정 내 레포지토리 내 디렉토리 경로를 설정합니다. 설정하지 않을 경우, 최상위 경로에 저장됩니다."
                    >
                        <Input input={githubDirectoryInput} />
                    </SubSection>
                </Section>

                <Section title="Image">
                    <SubSection
                        title="Storage"
                        description='이미지가 저장될 서비스를 선택합니다. 기본값은 "GitHub" 입니다.'
                    >
                        <ButtonGroup
                            buttons={images}
                            buttonGroup={imageStorageButtonGroup}
                        />
                    </SubSection>
                </Section>

                {imageStorageButtonGroup.value === 'aws_s3' && (
                    <Section title="AWS S3">
                        <SubSection title="Region">
                            <Dropdown options={AWSRegion} />
                        </SubSection>
                        <SubSection title="Bucket">
                            <Input />
                        </SubSection>
                        <SubSection title="Access Key ID">
                            <Input password />
                        </SubSection>
                        <SubSection title="Secret Access Key">
                            <Input password />
                        </SubSection>
                    </Section>
                )}

                <Section title="Notification">
                    <SubSection
                        title="Notification"
                        description='배포 시 notion-to-github-md의 진행 상황을 알림받을 수 있습니다. 기본값은 "none"입니다.'
                    >
                        <ButtonGroup
                            buttons={notifications}
                            buttonGroup={notificationButtonGroup}
                        />
                    </SubSection>
                </Section>

                {notificationButtonGroup.value === 'slack' && (
                    <Section title="Slack">
                        <></>
                    </Section>
                )}

                <ButtonWrapper>
                    <Button $type="cancel" onClick={() => router.push('/')}>
                        취소
                    </Button>
                    <Button $type="reset" onClick={handleClearButtonClick}>
                        초기화
                    </Button>
                    <Button $type="save" onClick={handleSaveButtonClick}>
                        변경사항 저장
                    </Button>
                </ButtonWrapper>
            </Wrapper>
        </TopWrapper>
    );
};

export default Page;

const TopWrapper = styled.div`
    display: flex;
    justify-content: center;
    padding: 10px;
`;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 500px;
    border: 1px solid #ced4da;
    border-radius: 6px;
`;

interface ButtonProps {
    $type: 'save' | 'reset' | 'cancel';
}

const Button = styled.button<ButtonProps>`
    display: flex;
    justify-content: center;
    width: 125px;
    border: 1px solid rgba(31, 35, 40, 0.15);
    border-radius: 6px;
    margin: 0 5px 20px 5px;
    padding: 12px;
    font-size: 14px;
    cursor: pointer;
    font-weight: bold;

    background-color: ${props => {
        if (props.$type == 'save') return '#1f883d';
    }};
    color: ${props => {
        if (props.$type == 'save') return '#ffffff';
        else if (props.$type == 'reset') return '#cf222e';
    }};

    &:hover {
        background-color: ${props => {
            if (props.$type == 'save') return '#1a7f37';
            else if (props.$type == 'reset') return '#a40e26';
            else return '#dedede';
        }};
        color: ${props => {
            if (props.$type == 'reset') return '#ffffff';
        }};
    }
`;

const ButtonWrapper = styled.div`
    display: flex;
`;
