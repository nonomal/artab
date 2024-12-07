import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

/**
 * 艺术品数据接口定义
 */
export interface AssetData {
  artist_link: string;
  attribution: string;
  attribution_link: string;
  creator: string;
  image: string;
  link: string;
  source: string;
  title: string;
  data_url?: string;
}

// 加载动画
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const PageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ArtInfo = styled.div`
  max-width: 600px;
  width: 100%;
  background: #483c32;
  color: #fff;
  padding: 20px 24px;
  margin: 0 40px 40px;
  font-size: 14px;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s ease;
`;

const ArtworkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover > div:last-child {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ArtFrame = styled.div`
  max-width: 600px;
  width: 100%;
  background: #fff;
  padding: 24px;
  border: 12px solid #483c32;
  position: relative;
  margin: 40px 40px 0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
`;

const ArtImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
`;

const NavigationArea = styled.div<{ direction: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${props => props.direction}: 0;
  width: 15%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
    background: linear-gradient(
      ${props => (props.direction === 'left' ? 'to right' : 'to left')},
      rgba(0, 0, 0, 0.3),
      transparent
    );
  }
`;

const NavigationButton = styled.button`
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    background: white;
  }
`;

const InfoTitle = styled.h2`
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 500;
`;

const InfoText = styled.p`
  margin: 8px 0;
  line-height: 1.5;
`;

const Link = styled.a`
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    border-bottom-color: rgba(255, 255, 255, 0.8);
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #8b4513;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto;
`;

const NewTab: React.FC = () => {
  const [artwork, setArtwork] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);

  // 发送消息到 background service worker
  const sendMessage = async (type: string) => {
    try {
      const response = await chrome.runtime.sendMessage({ type });
      if (!response.success) {
        throw new Error(response.error);
      }
      return response.data;
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  };

  const loadInitialArtwork = async () => {
    try {
      const image = await sendMessage('GET_NEXT_IMAGE');
      setArtwork(image);
    } catch (error) {
      console.error('Failed to load artwork:', error);
      // tips 提示取失败，并且给出错误信息
      // alert(`获取艺术品失败: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialArtwork();
  }, []);

  const handlePrevious = async () => {
    setLoading(true);
    try {
      const prevImage = await sendMessage('GET_PREVIOUS_IMAGE');
      setArtwork(prevImage);
    } catch (error) {
      console.error('Failed to load previous artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const nextImage = await sendMessage('GET_NEXT_IMAGE');
      setArtwork(nextImage);
    } catch (error) {
      console.error('Failed to load next artwork:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <NavigationArea direction="left" onClick={handlePrevious}>
        <NavigationButton>←</NavigationButton>
      </NavigationArea>

      <ArtworkContainer>
        <ArtFrame>
          {loading ? <LoadingSpinner /> : artwork?.data_url && <ArtImage src={artwork.data_url} alt={artwork.title} />}
        </ArtFrame>

        {artwork && (
          <ArtInfo>
            <InfoTitle>{artwork.title}</InfoTitle>
            <InfoText>
              Artist:{' '}
              <Link href={artwork.artist_link} target="_blank">
                {artwork.creator}
              </Link>
            </InfoText>
            <InfoText>
              Source:{' '}
              <Link href={artwork.attribution_link} target="_blank">
                {artwork.attribution}
              </Link>
            </InfoText>
            <InfoText>
              <Link href={artwork.link} target="_blank">
                View on Google Arts & Culture
              </Link>
            </InfoText>
          </ArtInfo>
        )}
      </ArtworkContainer>

      <NavigationArea direction="right" onClick={handleNext}>
        <NavigationButton>→</NavigationButton>
      </NavigationArea>
    </PageContainer>
  );
};

export default NewTab;
