// 리액트
import React from "react";
import { RecommendObjType } from "./RecommendChalMain";
import { Box } from "style/Box";
import Container from "style/Container";
import Image from "style/Image";
import Text from "style/Text";
import { useNavigate } from "react-router";

interface RecommendChalItemProps {
  chal : RecommendObjType
}

const RecommendChalItem = ({chal}: RecommendChalItemProps) => {
  const navigate = useNavigate()
  
  return (
    <Box $recommendChalBox onClick={()=>{navigate(`/day/challenge/${chal.challengeId}`)}}>
      <Image $badge $largeBadge $recommendBadge>
        <img loading="lazy" src={chal.badgeUrl} alt="뱃지" />
      </Image>
      <Text $recommendCardTitle>{chal.title}</Text>
      <p>{chal.period}</p>
    </Box>
  )
}

export default RecommendChalItem