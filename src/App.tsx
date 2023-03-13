import './App.css'
import SearchComponent from './components/search';
import { fetchGistList } from './api';
import { useEffect, useState } from 'react';
import { Avatar, List, message, Skeleton, Tag, Empty, Spin } from 'antd';
import { Gist } from './components/gistApi.types';
import GistCard from './components/gistCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';
import { GitHubLogo } from './components/icons';

function App() {

  const [gistList, setGistList] = useState<Gist[]>([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [messageApi, contextHolder] = message.useMessage();


  const onSearch = async (text: string) => {
    if (!text)
      return;

    setSearchText(text);
    setPageNo(1);
    setGistList([]);
  }

  const reset = () => {
    setSearchText('');
    setPageNo(1);
    setGistList([]);
  }

  useEffect(() => {
    if (searchText)
      loadMoreData();
  }, [searchText])

  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);

    const getGistList = async () => {
      let list = [];
      try {
        list = await fetchGistList(searchText, pageNo, 20);
      } catch (error) {
        messageApi.open({
          content: "We could not fetch results from Github. Please check the user name you have entered.",
          duration: 2,
          type: 'error'
        });
      }
      setGistList([...gistList, ...list]);
      setLoading(false);
      setPageNo((previousPageNo) => previousPageNo + 1);
      setHasMore(list.length > 0 && list.length % 20 === 0);
    }

    getGistList();
  };

  return (
    <>
      {contextHolder}
      <div className="App">
        <AppHeader>
          <HeaderTitle><GithubLogoSvgStyled />Gist Search</HeaderTitle>
          <HeaderBody>
            {gistList.length > 0 && <Tag color="geekblue" icon={<Avatar src={gistList[0].owner.avatar_url}></Avatar>} closable onClose={reset}>{gistList[0].owner.login}</Tag>}
            <SearchComponent onSearch={onSearch} />
          </HeaderBody>
        </AppHeader>
        <AppBody>
          {gistList.length > 0 ? <InfiniteScroll
            dataLength={gistList.length}
            hasMore={hasMore}
            next={loadMoreData}
            loader={<Skeleton />}>
            <List
              grid={{ gutter: 16, column: 4 }}
              dataSource={gistList}
              renderItem={gist => (
                <List.Item>
                  <GistCard {...gist} />
                </List.Item>
              )}
            />
          </InfiniteScroll> : loading ? <Spin size="large" /> : <Empty/>}
        </AppBody>
      </div>
    </>
  )
}

const AppHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #99292e;
  color: #fff;
  font-size: 20px;
  font-weight: 600;
`;
const GithubLogoSvgStyled = styled(GitHubLogo)`
  width: 30px;
  height: 30px;
  margin-right: 10px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;

  font-size: 20px;
  font-weight: 600;
`;

const HeaderBody = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

const AppBody = styled.div`
  padding: 20px;
  .no-data {
    text-align: center;
    font-size: 20px;
    font-weight: 600;
  }
`;
export default App
