import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { updateFrequencyStorage, lastUpdateTimeStorage } from '@extension/storage';
import { t } from '@extension/i18n';
import backgroundImage from '../public/tim-mossholder-Kjy0Q_S_2xg-unsplash.jpg';

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

  /* 使用背景图片 */
  background: url(${backgroundImage}) center/cover no-repeat;

  /* 创建多层光影效果，让四周更暗 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: 
      /* 中央聚光效果 - 降低暗部强度 */
      radial-gradient(
        ellipse at center,
        transparent 0%,
        rgba(0, 0, 0, 0) 35%,
        rgba(0, 0, 0, 0.5) 65%,
        rgba(0, 0, 0, 0.7) 100%
      ),
      /* 顶部补光 - 稍微增加亮度 */ linear-gradient(to bottom, rgba(255, 255, 255, 0.15) 0%, transparent 25%);
    mix-blend-mode: multiply;
    pointer-events: none;
  }

  /* 调整环境光 - 略微增加亮度 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, transparent 75%);
    mix-blend-mode: overlay;
    pointer-events: none;
  }
`;

const ArtInfo = styled.div`
  position: absolute;
  right: -180px;
  bottom: 24px;
  width: 160px;
  background: #f8f8f8;
  color: #333;
  padding: 16px;
  font-size: 12px;
  transform: translateY(0);
  text-align: left;
  letter-spacing: 0.3px;

  /* 增强卡片阴影效果 */
  box-shadow: 
    /* 近距离深色阴影 */
    0 4px 8px rgba(0, 0, 0, 0.2),
    /* 远距离扩散阴影 */ 0 8px 24px rgba(0, 0, 0, 0.15),
    /* 边缘细节阴影 */ 0 1px 2px rgba(0, 0, 0, 0.1);

  /* 左侧边框 */
  border-left: 1px solid rgba(0, 0, 0, 0.08);

  /* 添加微妙的内阴影 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
    pointer-events: none;
  }
`;

const ArtworkContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  margin-right: 180px;
  margin-left: 180px;
`;

const ArtFrame = styled.div`
  max-width: 600px;
  width: 100%;
  background: #fff;
  padding: 24px;
  border: 12px solid #000;
  position: relative;
  margin: 40px 0 0;
  z-index: 1;

  /* 加强画框阴影效果 */
  box-shadow: 
    /* 内部阴影 */
    inset 0 0 30px rgba(0, 0, 0, 0.2),
    /* 主阴影 - 更大更柔和 */ 0 20px 50px rgba(0, 0, 0, 0.5),
    /* 底部投影 - 模拟光线从上方打下的阴影 */ 0 35px 90px -20px rgba(0, 0, 0, 0.7),
    /* 近距离锐利阴影 */ 0 30px 45px -15px rgba(0, 0, 0, 0.4),
    /* 环境光阴影 */ 0 0 0 1px rgba(0, 0, 0, 0.1),
    /* 顶部打光 */ 0 -5px 20px rgba(255, 255, 255, 0.15);

  /* 画框纹理 */
  &::before {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    bottom: -12px;
    border: 12px solid #000;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='woodgrain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23woodgrain)'/%3E%3C/svg%3E");
    opacity: 0.15;
    pointer-events: none;
  }

  /* 加强画框顶部打光 */
  &::after {
    content: '';
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    height: 60px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    pointer-events: none;
  }
`;

const ArtImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  position: relative;

  /* 图片阴影效果 */
  box-shadow: 
    /* 内部阴影 */
    inset 0 0 10px rgba(0, 0, 0, 0.1),
    /* 顶部打光 */ 0 -2px 10px rgba(255, 255, 255, 0.1);

  /* 添加微妙的光泽效果 */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0));
    pointer-events: none;
  }
`;

const NavigationArea = styled.div<{ direction: 'left' | 'right' }>`
  position: fixed;
  top: 0;
  ${props => props.direction}: 0;
  width: 8%;
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
      rgba(0, 0, 0, 0.15),
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
  user-select: none;

  &:hover {
    background: white;
  }

  span {
    pointer-events: none;
  }
`;

const InfoTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 13px;
  font-weight: 500;
  color: #222;
  line-height: 1.4;

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: #000;
    }
  }
`;

const InfoText = styled.p`
  margin: 6px 0;
  line-height: 1.4;
  color: #666;
  font-size: 11px;
`;

const Link = styled.a`
  color: inherit;
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: #000;
  }
`;

const LoadingSpinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #483c32;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  margin: 50px auto;
`;

const LoadingContainer = styled.div`
  min-width: 400px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  color: #483c32;
  text-align: center;
  padding: 20px;
  font-size: 14px;
  line-height: 1.5;
`;

// 检查是否需要更新图片
async function shouldUpdate() {
  const frequency = await updateFrequencyStorage.get();
  const lastUpdate = await lastUpdateTimeStorage.get();
  const now = Date.now();

  switch (frequency) {
    case 'every_tab':
      return true;
    case 'every_10min':
      return now - lastUpdate >= 10 * 60 * 1000;
    case 'every_hour':
      return now - lastUpdate >= 60 * 60 * 1000;
    case 'every_day':
      return now - lastUpdate >= 24 * 60 * 60 * 1000;
    default:
      return false;
  }
}

const SpotLight = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background: radial-gradient(
    circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
    rgba(255, 255, 255, 0.15) 0%,
    transparent 40%
  );
  opacity: 0.7;
  mix-blend-mode: overlay;
`;

// // 添加署名件
// const Attribution = styled.div`
//   position: fixed;
//   bottom: 12px;
//   right: 12px;
//   font-size: 12px;
//   color: rgba(0, 0, 0, 0.5);
//   z-index: 10;

//   a {
//     color: rgba(0, 0, 0, 0.5);
//     text-decoration: none;
//     transition: color 0.3s ease;

//     &:hover {
//       color: rgba(0, 0, 0, 0.8);
//     }
//   }
// `;

const NewTab: React.FC = () => {
  const [artwork, setArtwork] = useState<AssetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // 创建一个通用的超时Promise
  const createTimeoutPromise = () =>
    new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error(t('request_timeout')));
      }, 20000);
    });

  const loadInitialArtwork = async () => {
    try {
      setError(null);
      const loadPromise = (async () => {
        if (await shouldUpdate()) {
          const image = await sendMessage('GET_NEXT_IMAGE');
          setArtwork(image);
          await lastUpdateTimeStorage.set(Date.now());
        } else {
          const image = await sendMessage('GET_INITIAL_IMAGE');
          setArtwork(image);
        }
      })();

      await Promise.race([loadPromise, createTimeoutPromise()]);
    } catch (error) {
      console.error('Failed to load artwork:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  // 添加键盘事件处理函数
  const handleKeyDown = (event: KeyboardEvent) => {
    if (loading) return; // 如果正在加载，不响应键盘事件

    switch (event.key) {
      case 'ArrowLeft':
        handlePrevious();
        break;
      case 'ArrowRight':
        handleNext();
        break;
    }
  };

  // 添加键盘事件监听
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);

    // 清理函数
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [loading]); // 依赖 loading 状态

  useEffect(() => {
    loadInitialArtwork();
  }, []);

  const handlePrevious = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadPromise = sendMessage('GET_PREVIOUS_IMAGE');
      const prevImage = await Promise.race([loadPromise, createTimeoutPromise()]);
      setArtwork(prevImage);
    } catch (error) {
      console.error('Failed to load previous artwork:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      const loadPromise = sendMessage('GET_NEXT_IMAGE');
      const nextImage = await Promise.race([loadPromise, createTimeoutPromise()]);
      setArtwork(nextImage);
      await lastUpdateTimeStorage.set(Date.now());
    } catch (error) {
      console.error('Failed to load next artwork:', error);
      setError(error instanceof Error ? error.message : '加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkAndUpdate = async () => {
      if (await shouldUpdate()) {
        // 更新图片
        chrome.runtime.sendMessage({ type: 'GET_NEXT_IMAGE' });
        // 更新最后更新时间
        lastUpdateTimeStorage.set(Date.now());
      }
    };

    checkAndUpdate();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <PageContainer>
      <SpotLight />
      <NavigationArea direction="left" onClick={handlePrevious}>
        <NavigationButton>
          <span>←</span>
        </NavigationButton>
      </NavigationArea>

      <ArtworkContainer>
        <ArtFrame>
          {loading ? (
            <LoadingContainer>
              <LoadingSpinner />
            </LoadingContainer>
          ) : error ? (
            <LoadingContainer>
              <ErrorMessage>{error}</ErrorMessage>
            </LoadingContainer>
          ) : (
            artwork?.data_url && <ArtImage src={artwork.data_url} alt={artwork.title} />
          )}
        </ArtFrame>

        {artwork && !error && (
          <ArtInfo>
            <InfoTitle>
              <Link href={artwork.link} target="_blank">
                {artwork.title}
              </Link>
            </InfoTitle>
            <InfoText>
              {' '}
              <Link href={artwork.artist_link} target="_blank">
                {artwork.creator}
              </Link>
            </InfoText>
            <InfoText>
              {' '}
              <Link href={artwork.attribution_link} target="_blank">
                {artwork.attribution}
              </Link>
            </InfoText>
          </ArtInfo>
        )}
      </ArtworkContainer>

      <NavigationArea direction="right" onClick={handleNext}>
        <NavigationButton>
          <span>→</span>
        </NavigationButton>
      </NavigationArea>

      {/* <Attribution>
        Photo by{' '}
        <a
          href="https://unsplash.com/@timmossholder?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          target="_blank"
          rel="noopener noreferrer">
          Tim Mossholder
        </a>{' '}
        on{' '}
        <a
          href="https://unsplash.com/photos/a-black-and-white-photo-of-a-shadow-of-a-tree-Kjy0Q_S_2xg?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash"
          target="_blank"
          rel="noopener noreferrer">
          Unsplash
        </a>
      </Attribution> */}
    </PageContainer>
  );
};

export default NewTab;
