import React, { useEffect, useState } from "react";
import { Avatar, Card, Tag } from 'antd';
import styled from 'styled-components';
import { BranchesOutlined, CodeOutlined } from '@ant-design/icons';
import { Gist } from "./gistApi.types";
import { fetchForks } from "../api";

export default function GistCard(gist: Gist) {
    const FORKS_LIST_LIMIT = 3;
    const [forks, setForks] = useState<Gist[]>([]);

    useEffect(() => {
        const getForks = async () => {
            const response = await fetchForks(gist.forks_url);
            const sortedResponse = response.sort((a: Gist, b: Gist) => {
                return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
            });
            setForks(sortedResponse);
        }
        getForks();
    }, [gist.forks_url])

    const openForkUrl = (url: string) => () => {
        window.open(url, '_blank');
    }

    const getFileLanguages = () => {
        const languages = new Set<string>();
        Object.values(gist.files).forEach((file) => {
            if (file.language) {
                languages.add(file.language);
            }
        })
        return languages.size > 0 && <LanguagesContainer>
            <LanguagesTitle>
                <CodeOutlined /> Languages:
            </LanguagesTitle>
            {[...languages].map((language) => {
                return (
                    <Tag color="blue">{language}</Tag>
                )
            })}</LanguagesContainer>;
    }

    const getTitle = (login: string, fileName: string, gistUrl: string) => {
        return <CardTitleWrapper><a href={gistUrl} target="_blank" rel="noreferrer">{`${fileName}`}</a></CardTitleWrapper>
    }

    return (
        <Card 
            title={ getTitle(gist.owner.login, Object.keys(gist.files)[0], gist.html_url)}
            headStyle={{padding: '8px 10px'}}
            bodyStyle={{padding: '8px 10px'}}>
            <p className="card-description">{gist.description}</p>
            {getFileLanguages()}
            <ForksContainer>
                <div>
                    <BranchesOutlined /> forks: {forks?.length}
                </div>
                {forks?.length > 0 &&
                    <AvatarGroup
                        maxCount={FORKS_LIST_LIMIT}
                        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                        {forks.map((fork) => {
                            return (
                                <div style={{cursor: 'pointer'}} key={fork.id} title={fork.owner.login} onClick={openForkUrl(fork.html_url)}>
                                    <Avatar src={fork.owner.avatar_url} />
                                </div>
                            )
                        })}
                    </AvatarGroup>
                }
            </ForksContainer>
        </Card>
    )
}

const LanguagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 4px;
    flex-wrap: wrap;

    margin-top: 8px;
`;

const LanguagesTitle = styled.div`
    display: flex;
    align-items: center;
    gap: 4px;
`;

const AvatarGroup = styled(Avatar.Group)`
    cursor: pointer;
`;

const CardTitleWrapper = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: left;
`;

const ForksContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 14px;

    margin-top: 8px;
`;