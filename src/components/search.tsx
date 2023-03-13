import React from "react";
import { Input, Space } from 'antd';

const { Search } = Input;

type SearchComponentProps = {
    onSearch: (text: string) => void
};

export default function SearchComponent ({onSearch}: SearchComponentProps){
    return <Search placeholder="Enter user name" onSearch={onSearch} style={{ width: 200 }} />;
};