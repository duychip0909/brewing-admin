import React, { useState, useEffect } from "react";
import './App.css';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';

import {
  Button,
  Layout,
  Menu,
  theme,
  Space,
  Table,
  Tag,
  Typography,
  Tabs
} from 'antd';

import axios from 'axios';
import Form from "./Form";


const { Header, Sider, Content } = Layout;

const { Text, Title } = Typography;

function App() {

  const [collapsed, setCollapsed] = useState(false);

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const [coffees, setCoffees] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/manage_api')
      .then(res => {
        setCoffees(res.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const { TabPane } = Tabs;

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Image',
      dataIndex: 'image',
      key: 'image',
      render: (image) => (
        <img src={image} alt="Coffee image" style={{ width: 100, aspectRatio: 1, objectFit: 'cover', borderRadius: 5}} />
      )
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span>{ price.toLocaleString() }đ</span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button type="primary">
            Edit
          </Button>
          <Button type='primary' danger onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = coffees;

  const onDelete = (id) => {
    axios.get(`http://127.0.0.1:8000/api/delete_api/${id}`)
      .then(res => {
        setCoffees(coffees.filter((coffee) => coffee.id !== id));
        console.log(res.data.message);
      })
      .catch(error => {
        console.log(error);
    })
    
  }

  return (
    <Layout>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Coffee Category',
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Coffees',
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Orders',
            },
          ]}
        />
      </Sider>
      <Layout className="side-layout">
      <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}
        >
          {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: 'trigger',
            onClick: () => setCollapsed(!collapsed),
          })}
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
          }}
        >
          <div className="App">
            <Tabs>
              <TabPane tab='Manage' key='1'>
                <Title mark style={{textAlign: 'center', marginTop: 0}}>Coffees table</Title>
                <Table columns={columns} dataSource={data} />
              </TabPane>
              <TabPane tab='Create' key='2'>
                <Title mark style={{textAlign: 'center', marginTop: 0}}>Coffees create form</Title>
                <Form />
              </TabPane>
            </Tabs>
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
