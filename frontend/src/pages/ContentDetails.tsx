// pages/ContentDetails.tsx
import React from 'react';
import { useParams } from 'react-router-dom';
import { usePreview } from '../../../../BoxPeer/src/context/PreviewContext';
import { Card, Descriptions, Row, Col, Typography, Avatar, Divider } from 'antd';

const { Title, Text } = Typography;

const ContentDetails: React.FC = () => {
  const { cid } = useParams<{ cid: string }>();
  const { getPreviewByCid } = usePreview();

  const preview = getPreviewByCid(cid || '');

  if (!preview) {
    return <p>Content not found</p>;
  }

  const { fileObject, element } = preview;
  const { title, description, owner_name, consumerFee } = fileObject;

  return (
    <div style={{ padding: '20px' }}>
      <Card style={{ marginBottom: '20px' }}>
        {element}
      </Card>

      <Divider />

      <Title level={3}>File Details</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Title">
              <Text strong>{title}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              <Text>{description}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Uploaded by">
              <Avatar style={{ marginRight: 8 }} size="small" />
              <Text>{owner_name}</Text>
            </Descriptions.Item>


            <Descriptions.Item label="Fee">
              <Text>
                {parseInt(consumerFee) ? `APT ${parseInt(consumerFee) / 10 ** 8}` : 'Free'}
              </Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </div>
  );
};

export default ContentDetails;
