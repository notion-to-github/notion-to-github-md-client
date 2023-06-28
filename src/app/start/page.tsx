'use client';

import Card from '@/components/Card';
import Input from '@/components/Input';
import Loading from '@/components/Loading';
import useAuth from '@/hooks/useAuth';
import useInput from '@/hooks/useInput';
import { encryptedConfigAtom, isInitSettingAtom } from '@/recoil/config';
import { Config } from '@/types/config';
import decryptConfig from '@/utils/decrypteConfig';
import encryptConfig from '@/utils/encrypteConfig';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';

const Page = () => {
    useAuth();

    const [encryptedConfig, setEncryptedConfig] =
        useRecoilState(encryptedConfigAtom);
    const config = decryptConfig(encryptedConfig);

    const notionAPIKeyInput = useInput(config.notion.api_key, true);
    const notionPageInput = useInput('');
    const [notionDatabaseId, setDatabaseId] = useState<string>('');
    const [isCreated, setIsCreated] = useState<boolean>(false);
    const router = useRouter();

    const setIsInitSetting = useSetRecoilState(isInitSettingAtom);

    const [currentCard, setCurrentCard] = useState<number>(1);
    const next = () => {
        setCurrentCard(prev => prev + 1);
    };

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleCreateButtonClick = () => {
        const parsePageId = (url: string) => {
            const match = url.match(/[0-9a-f]{32}/);
            return match ? match[0] : '';
        };
        const pageId = parsePageId(notionPageInput.value);
        if (pageId === '') return;

        const createNotionDatabase = async () => {
            setIsLoading(true);
            const { data } = await axios.post('/api/notion/database', {
                apiKey: notionAPIKeyInput.value,
                pageId,
            });
            setDatabaseId(data.id);
            console.log(data);
            console.log(data.id);
            setIsLoading(false);
            setIsCreated(true);
        };
        createNotionDatabase();
    };

    const handleDoneButtonClick = () => {
        const newConfig: Config = {
            ...config,
            notion: {
                api_key: notionAPIKeyInput.value,
                database_id: notionDatabaseId,
            },
        };
        setEncryptedConfig(encryptConfig(newConfig));
        setIsInitSetting(false);
        router.push('/');
    };

    return (
        <Wrapper>
            <h1>🚀 시작하기</h1>
            <div style={{ marginTop: '-5px', marginBottom: '20px' }}>
                아래 한 단계씩 나타나는 스텝을 따라가면 초기 설정을 완료할 수
                있습니다. 현재 스텝을 완료했다면 ➡️ 버튼을 눌러 다음 스텝으로
                이동해주세요.
            </div>
            <Card id={1} currentNumber={currentCard} next={next}>
                1.{' '}
                <InlineLink
                    href="https://github.com/notion-to-github/notion-to-github-md"
                    target="_blank"
                >
                    notion-to-github-md
                </InlineLink>{' '}
                페이지로 이동하여 레포지토리를 본인의 계정에 fork 해주세요.
                (fork가 완료될 때 까지 잠시만 기다려주세요.)
            </Card>
            <Card id={2} currentNumber={currentCard} next={next}>
                2.{' '}
                <InlineLink
                    href="https://github.com/apps/notion-to-github-md"
                    target="_blank"
                >
                    GitHub App 설치
                </InlineLink>{' '}
                페이지로 이동하여 설치 버튼을 누른 후, 1번에서 fork한
                레포지토리에 App을 설치해주세요.
            </Card>
            <Card id={3} currentNumber={currentCard} next={next}>
                3.{' '}
                <InlineLink
                    href="https://www.notion.so/my-integrations"
                    target="_blank"
                >
                    노션 API 통합
                </InlineLink>{' '}
                페이지로 이동하여 새 API 통합을 만들어주세요. 사용할 노션
                워크스페이스를 선택하고, API 통합의 이름을 설정합니다. (이름은
                식별이 가능하게 아무렇게나 지어주셔도 상관 없습니다.)
            </Card>

            <Card id={4} currentNumber={currentCard} next={next}>
                4. 생성된 API 통합 시크릿을 아래 입력란에 입력해주세요.
                <InputWrapper>
                    <Input input={notionAPIKeyInput} password />
                    {/* <Button
                    onClick={handleSubmitButtonClick}
                    disabled={isSubmitted}
                >
                    제출
                </Button> */}
                </InputWrapper>
            </Card>
            {/* {isSubmitted && <Text>✅ API가 저장되었습니다.</Text>} */}
            <Card id={5} currentNumber={currentCard} next={next}>
                5. 노션 워크스페이스에 새 페이지를 만들고, 우측 상단에 ... 버튼,
                연결 추가 버튼을 눌러 3번에서 생성한 API 통합을 연결해줍니다.
            </Card>
            <Card
                id={6}
                currentNumber={currentCard}
                next={next}
                isDisabled={!isCreated}
            >
                6. 다시 ... 버튼을, 링크 복사 버튼을 클릭한 후 아래 입력란에
                입력 후 "데이터베이스 생성" 버튼을 눌러주세요.{' '}
                <InputWrapper>
                    <Input input={notionPageInput} />
                    <Button
                        onClick={handleCreateButtonClick}
                        disabled={isCreated}
                    >
                        데이터베이스 생성
                    </Button>
                </InputWrapper>
                {isLoading && <Loading />}
                {isCreated && (
                    <div style={{ marginTop: '10px' }}>
                        🔔 Database가 생성되었습니다. (만약, 노션 페이지에
                        생성된 데이터베이스가 보이지 않는다면, 노션 페이지를
                        새로고침해주세요.)
                    </div>
                )}
            </Card>
            <Card id={7} currentNumber={currentCard} next={next} isLast>
                🎉 모든 연결이 완료되었습니다!
                <br />
                추가적인 설정은 언제든지 설정 페이지에서 변경하실 수 있습니다.
                <br />
                아래 "끝내기" 버튼을 눌러 설정을 저장하고, 메인 페이지로 돌아갈
                수 있습니다.
                <br />
                메인 페이지에서 "배포하기" 버튼을 눌러 "Notion to Github MD"
                서비스를 이용해보세요!
                <DoneButton
                    onClick={handleDoneButtonClick}
                    disabled={!isCreated}
                >
                    끝내기
                </DoneButton>
            </Card>
        </Wrapper>
    );
};
export default Page;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    width: 50%;
    margin: 0 25%;
    /* background-color: pink; */
`;

const InlineLink = styled.a`
    color: #1c6bfe;
    text-decoration: none;
`;

const InputWrapper = styled.div`
    /* background-color: skyblue; */
    margin-top: 20px;
    width: 100%;
    display: flex;
    justify-content: center;
`;

const Button = styled.button``;

const DoneButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
`;
