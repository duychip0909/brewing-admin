import { PlusOutlined } from '@ant-design/icons';
import {
    Button,
    Form,
    Input,
    InputNumber, Select, Upload, message
} from 'antd';
import axios from 'axios';

import { useEffect, useState } from 'react';


const FormDisabledDemo = () => {

    const [form] = Form.useForm();

    const [loading, setLoading] = useState(false);

    const [beans, setBeans] = useState([]);

    const [imageUrl, setImageUrl] = useState(null);

    const onFinish = (values) => {
        setLoading(true);
        axios.post('http://127.0.0.1:8000/api/store', values)
            .then((response) => {
                console.log(response.data);
                setLoading(false);
                form.resetFields();
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    };

    const handleUpload = (info) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setImageUrl(info.file.response.url);
            setLoading(false);
            message.success(`${info.file.name} file uploaded successfully`);
        }
        if (info.file.status === 'error') {
            setLoading(false);
            message.error(`${info.file.name} file upload failed.`);
          }
    }

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/manage_beans')
            .then(response => {
                setBeans(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <>
            <Form
                labelCol={{
                    span: 4,
                }}
                form={ form }
                onFinish={ onFinish }
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                style={{
                    maxWidth: 600,
                }}

            >
                <Form.Item label="Name" name="name">
                    <Input />
                </Form.Item>
                <Form.Item label="Price" name="price">
                    <InputNumber />
                </Form.Item>
                <Form.Item label="Description" name="description">
                    <Input />
                </Form.Item>
                <Form.Item label="Beans" name="bean_id">
                    <Select>
                        {beans.map(bean => (
                            <Select.Option value={bean.id}>{bean.bean}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item label="Upload" name='image'>
                    <Upload listType="picture-card" name='image' action='http://127.0.0.1:8000/api/upload' headers={{ Authorization: `Bearer ${localStorage.getItem('token')}` }} onChange={handleUpload}>
                        <div>
                            <PlusOutlined />
                            <div
                                style={{
                                    marginTop: 8,
                                }}
                            >
                                Upload
                            </div>
                        </div>
                    </Upload>
                </Form.Item>
                <Form.Item>
                    <Button type='primary' htmlType='submit' loading={ loading }>Create Record</Button>
                </Form.Item>
            </Form>
        </>
    );
};
export default () => <FormDisabledDemo />;