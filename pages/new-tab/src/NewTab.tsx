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
  background: url('${chrome.runtime.getURL('assets/wall-texture.png')}') repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
`;

const ArtFrame = styled.div`
  max-width: 600px;
  width: 100%;
  background: #f8f8f8;
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1),
    0 16px 32px rgba(0, 0, 0, 0.1),
    inset 0 0 0 1px rgba(255, 255, 255, 0.5);
  padding: 20px;
  border: 15px solid #8b4513;
  border-radius: 2px;
  position: relative;
  transition: transform 0.3s ease;
  margin: 20px;

  &::before {
    content: '';
    position: absolute;
    top: -20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 20px;
    background: #4a2508;
    border-radius: 5px 5px 0 0;
  }
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

const ArtInfo = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(0);
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

const Link = styled.a`
  color: #fff;
  text-decoration: none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);

  &:hover {
    border-bottom-color: rgba(255, 255, 255, 0.8);
  }
`;

const InfoHandle = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 5px 15px;
  border-radius: 5px 5px 0 0;
  font-size: 12px;
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
      // tips 提示获取失败，并且给出错误信息
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

      <ArtFrame>
        {loading ? <LoadingSpinner /> : artwork?.data_url && <ArtImage src={artwork.data_url} alt={artwork.title} />}
      </ArtFrame>

      <NavigationArea direction="right" onClick={handleNext}>
        <NavigationButton>→</NavigationButton>
      </NavigationArea>

      {artwork && (
        <ArtInfo>
          <h2>{artwork.title}</h2>
          <p>
            Artist:{' '}
            <Link href={artwork.artist_link} target="_blank">
              {artwork.creator}
            </Link>
          </p>
          <p>
            Source:{' '}
            <Link href={artwork.attribution_link} target="_blank">
              {artwork.attribution}
            </Link>
          </p>
          <p>
            View on Google Arts & Culture:{' '}
            <Link href={artwork.link} target="_blank">
              Learn More
            </Link>
          </p>
        </ArtInfo>
      )}
    </PageContainer>
  );
};

export default NewTab;
