import React, { useState } from 'react';
import styled from 'styled-components';
import { banners } from '../data/banners';

const HeroBanner: React.FC = () => {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1) % banners.length);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <BannerWrapper>
      <ImageContainer style={{ transform: `translateX(-${index * 100}%)` }}>
        {banners.map((banner) => (
          <BannerImage
            key={banner.id}
            src={banner.image}
            alt={banner.alt}
          />
        ))}
      </ImageContainer>
      <NavButton left onClick={prev}>〈</NavButton>
      <NavButton right onClick={next}>〉</NavButton>
    </BannerWrapper>
  );
};

export default HeroBanner;

const BannerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 440px;
  overflow: hidden;
  background: black;
`;

const ImageContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
`;

const BannerImage = styled.img`
  flex-shrink: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const NavButton = styled.button<{ left?: boolean; right?: boolean }>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${(props) => props.left && `left: 20px;`}
  ${(props) => props.right && `right: 20px;`}
  background: rgba(0, 0, 0, 0.4);
  border: none;
  color: white;
  font-size: 2rem;
  cursor: pointer;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  z-index: 1;
  &:hover {
    background: rgba(0, 0, 0, 0.7);
  }
`;
