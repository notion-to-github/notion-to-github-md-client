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
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { getAppIsInstalled, getRepositoryIsForked } from '@/lib/github';
import { accessTokenAtom } from '@/recoil/auth';
import { userInfoAtom } from '@/recoil/user';

const Page = () => {
    useAuth();

    const [encryptedConfig, setEncryptedConfig] =
        useRecoilState(encryptedConfigAtom);
    const config = decryptConfig(encryptedConfig);
    const accessToken = useRecoilValue(accessTokenAtom);
    const userInfo = useRecoilValue(userInfoAtom);

    const notionAPIKeyInput = useInput(config.notion.api_key, true);
    const notionPageInput = useInput('');
    const [notionDatabaseId, setDatabaseId] = useState<string>('');
    const router = useRouter();

    const setIsInitSetting = useSetRecoilState(isInitSettingAtom);

    const [currentCard, setCurrentCard] = useState<number>(1);
    const next = () => {
        setCurrentCard(prev => prev + 1);
    };

    const [isDatabaseCreated, setIsDatabaseCreated] = useState<boolean | null>(
        null,
    );
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [isForked, setIsForked] = useState<boolean | null>(null);

    const [isAppInstalled, setIsAppInstalled] = useState<boolean | null>(null);

    const [isSecretValid, setIsSecretValid] = useState<boolean | null>(null);

    const handleForkCheckButtonClick = () => {
        (async () => {
            const res = await getRepositoryIsForked(
                accessToken.value,
                userInfo.nickname,
            );

            if (res) setIsForked(() => true);
            else setIsForked(() => false);
        })();
    };

    const handleAppInstallCheckButtonClick = () => {
        (async () => {
            const res = await getAppIsInstalled(accessToken.value);

            if (res) setIsAppInstalled(() => true);
            else setIsAppInstalled(() => false);
        })();
    };

    const handleSecretCheckButtonClick = () => {
        const regex = /^secret_/;
        if (regex.test(notionAPIKeyInput.value)) setIsSecretValid(() => true);
        else setIsSecretValid(() => false);
    };

    const handleDatabaseCreateButtonClick = () => {
        const parsePageId = (url: string) => {
            const match = url.match(/[0-9a-f]{32}/);
            return match ? match[0] : '';
        };
        const pageId = parsePageId(notionPageInput.value);
        if (pageId === '') {
            setIsDatabaseCreated(() => false);
            return;
        }

        (async () => {
            setIsLoading(() => true);
            const { data } = await axios.post('/api/notion/database', {
                apiKey: notionAPIKeyInput.value,
                pageId,
            });
            setDatabaseId(data.id);
            console.log(data);
            console.log(data.id);
            setIsLoading(() => false);
            setIsDatabaseCreated(() => true);
        })();
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

            <Card
                id={1}
                currentNumber={currentCard}
                next={next}
                isDisabled={!isForked}
            >
                <div>
                    1.{' '}
                    <InlineLink
                        href="https://github.com/notion-to-github/notion-to-github-md"
                        target="_blank"
                    >
                        notion-to-github-md
                    </InlineLink>{' '}
                    페이지로 이동하여 레포지토리를 본인의 계정에 fork 해주세요.
                    (fork 여부가 반영될 때 까지 1-2분 정도 소요됩니다.)
                </div>
                <CheckWrapper>
                    <CheckButton
                        onClick={handleForkCheckButtonClick}
                        disabled={isForked!}
                    >
                        fork 확인하기
                    </CheckButton>
                    {isForked !== null &&
                        (isForked ? (
                            <CheckMessage>
                                ✅ fork가 완료되었습니다.
                            </CheckMessage>
                        ) : (
                            <CheckMessage>
                                ❌ 아직 fork가 완료되지 않았습니다. fork를
                                했다면 잠시 기다린 후 다시 시도해주세요.
                            </CheckMessage>
                        ))}
                </CheckWrapper>
            </Card>

            <Card
                id={2}
                currentNumber={currentCard}
                next={next}
                isDisabled={!isAppInstalled}
            >
                <div>
                    2.{' '}
                    <InlineLink
                        href="https://github.com/apps/notion-to-github-md"
                        target="_blank"
                    >
                        GitHub App 설치
                    </InlineLink>{' '}
                    페이지로 이동하여 설치 버튼을 누른 후, 1번에서 fork한
                    레포지토리에 App을 설치해주세요. (App 설치 여부가 반영될 때
                    까지 1-2분 정도 소요됩니다.)
                </div>
                <CheckWrapper>
                    <CheckButton
                        onClick={handleAppInstallCheckButtonClick}
                        disabled={isAppInstalled!}
                    >
                        설치 확인하기
                    </CheckButton>
                    {isAppInstalled !== null &&
                        (isAppInstalled ? (
                            <CheckMessage>
                                ✅ GitHub App 설치가 완료되었습니다.
                            </CheckMessage>
                        ) : (
                            <CheckMessage>
                                ❌ 아직 App이 설치되지 않았습니다. App을 설치한
                                후 다시 시도해주세요.
                            </CheckMessage>
                        ))}
                </CheckWrapper>
            </Card>

            <Card id={3} currentNumber={currentCard} next={next}>
                <div>
                    3.{' '}
                    <InlineLink
                        href="https://www.notion.so/my-integrations"
                        target="_blank"
                    >
                        노션 API 통합
                    </InlineLink>{' '}
                    페이지로 이동하여 새 API 통합을 만들어주세요. 사용할 노션
                    워크스페이스를 선택하고, API 통합의 이름을 설정합니다.
                    (이름은 식별이 가능하게 아무렇게나 지어주셔도 상관
                    없습니다.)
                </div>
            </Card>

            <Card
                id={4}
                currentNumber={currentCard}
                next={next}
                isDisabled={!isSecretValid}
            >
                4. 생성된 API 통합 시크릿을 아래 입력란에 입력해주세요.
                <InputWrapper>
                    <Input input={notionAPIKeyInput} password />
                </InputWrapper>
                <CheckWrapper>
                    <CheckButton
                        onClick={handleSecretCheckButtonClick}
                        disabled={isSecretValid!}
                    >
                        Secret 확인하기
                    </CheckButton>
                    {isSecretValid !== null &&
                        (isSecretValid ? (
                            <CheckMessage>✅ 유효한 secret입니다.</CheckMessage>
                        ) : (
                            <CheckMessage>
                                ❌ 유효하지 않은 secret입니다.
                            </CheckMessage>
                        ))}
                </CheckWrapper>
            </Card>

            <Card id={5} currentNumber={currentCard} next={next}>
                5. 노션 워크스페이스에 새 페이지를 만들고, 우측 상단에 ... 버튼,
                연결 추가 버튼을 눌러 3번에서 생성한 API 통합을 연결해줍니다.
            </Card>

            <Card
                id={6}
                currentNumber={currentCard}
                next={next}
                isDisabled={!isDatabaseCreated}
            >
                6. 다시 ... 버튼을, 링크 복사 버튼을 클릭한 후 아래 입력란에
                입력 후 "데이터베이스 생성" 버튼을 눌러주세요.{' '}
                <InputWrapper>
                    <Input input={notionPageInput} />
                </InputWrapper>
                <CheckWrapper>
                    <CheckButton
                        onClick={handleDatabaseCreateButtonClick}
                        disabled={isDatabaseCreated!}
                    >
                        데이터베이스 생성
                    </CheckButton>
                    {isLoading && <Loading />}
                    {!isLoading &&
                        isDatabaseCreated !== null &&
                        (isDatabaseCreated ? (
                            <CheckMessage>
                                🔔 Database가 생성되었습니다. (만약, 노션
                                페이지에 생성된 데이터베이스가 보이지 않는다면,
                                노션 페이지를 새로고침해주세요.)
                            </CheckMessage>
                        ) : (
                            <CheckMessage>
                                ❌ 유효하지 않은 페이지 링크입니다.
                            </CheckMessage>
                        ))}
                </CheckWrapper>
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
                    disabled={!isDatabaseCreated}
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

const DoneButton = styled.button`
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
`;

const CheckWrapper = styled.div`
    margin-top: 10px;
    display: flex;
    align-items: center;
`;

const CheckButton = styled.button`
    cursor: pointer;
    width: 120px;
    height: 22px;
    margin-right: 10px;
`;

const CheckMessage = styled.div`
    //background: pink;
`;
