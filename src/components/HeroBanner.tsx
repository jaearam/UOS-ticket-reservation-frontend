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
      <BannerImage
        src={banners[index].image}
        alt={banners[index].alt}
      />
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

const BannerImage = styled.img`
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
