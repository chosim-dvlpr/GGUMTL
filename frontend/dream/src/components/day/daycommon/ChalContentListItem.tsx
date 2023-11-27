// 챌린지 이미지 CircleImage

// 제목
// 참여자 수

// Day 일 수

// 리액트
import React from 'react'

// 컴포넌트
import { Box } from 'style/Box'
import { DayChallengeObjType } from '../home/DayChallengeList'
import { useNavigate } from 'react-router-dom'

// 스타일

interface ChalContentListItemProps {
  key: number
  chal: DayChallengeObjType
}

const ChalContentListItem = ({ chal }: ChalContentListItemProps) => {
  const navigate = useNavigate()

  return (
    <>
      <Box
        $challengeContentBox
        onClick={() => navigate(`/day/challenge/${chal.challengeId}`)}
      >
        <img loading="lazy" src={chal.badgeUrl}></img>
        <div>
          <div>
            <p>{chal.challengeTitle ? chal.challengeTitle : chal.title}</p>
          </div>
          <div>
            <p>참여자 : {chal.participateCount}</p>
            <p>Day : {chal.period}</p>
          </div>
        </div>
      </Box>
    </>
  )
}

export default ChalContentListItem
