import React, { useState } from 'react'

import { changeDate } from 'utils/dateForm'

// 컴포넌트
import Text from 'style/Text'
import Heart from 'components/common/Heart'
import { FaRegCommentDots } from 'react-icons/fa6'

//타입
import { CertArticleItemType } from './ChalCertArticleList'
import Image from 'style/Image'
import styled from 'styled-components'
import { Box } from 'style/Box'
import { useNavigate, useParams } from 'react-router-dom'

const ProfileDateWrap = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 0.5rem;
`

const ProfileWrap = styled.div`
  display: flex;
  justify-content: center;
  /* line-height: 100%; */
  & > div:nth-child(2) {
    & > div {
      text-align: center;
    }
  }
`
const ProfileImage = styled(Image)`
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 1rem;
  & > img {
    width: 100%;
    object-fit: cover;
    aspect-ratio: 1/1;
    object-position: center;
    border-radius: 50%;
  }
`

const MarginBot = styled.div`
  margin-bottom: 2rem;
`

const BottomContainer = styled.div`
  display: grid;
  grid-template-columns: 2fr 2fr 8fr;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`

const HeartCommentContainer = styled.div`
  display: flex;
  align-items: center;
  & > svg {
    margin-right: 0.5rem;
    font-size: 1.2rem;
  }

  & > div {
    margin: 0;
  }
`

// progress 속성을 정의
interface ProgressBarProps {
  progress: number
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 0.8rem;
  border-radius: 1rem;
  color: #997ad8;
  position: relative;
  background-color: #f9f9f9;

  &::before {
    content: '';
    position: absolute;
    inset: 0 calc(${(props) => 100 - props.progress}%) 0 0;
    border-radius: inherit;
    background: currentColor;
    animation: p6 2s;
  }
  @keyframes p6 {
    /* 100% {inset:0} */
    0% {
      width: 0;
    }
    100% {
      width: ${(props) => props.progress}%; // 원하는 최대 너비
    }
  }
`

interface CertArticleItemProps {
  certData: CertArticleItemType
}

// 메인 리턴 부분
const ChalCertArticleItem = ({ certData }: CertArticleItemProps) => {
  const navigate = useNavigate()
  const params = useParams()
  const challengeId = params.challengeId // 현재 챌린지 id
  const challengeDetailId = certData.challengeDetailId // 챌린지 인증글 id

  const [progress, setProgress] = useState<number>(70)

  // 유저 프로필로 이동
  const moveUserProfile = () => {
    navigate(`/day/challenge/${challengeId}/comments/${challengeDetailId}`)
  }

  return (
    <>
      <ProfileDateWrap>
        {/* 상단바 */}
        <ProfileWrap>
          <ProfileImage
            // 여기에 이동하는 곳
            onClick={moveUserProfile}
          >
            <img loading='lazy' src={certData?.photoUrl} alt="없음" />
          </ProfileImage>
          <Text $verticalAlign $nightWhite onClick={moveUserProfile}>
            {certData?.nickname}{' '}
          </Text>
        </ProfileWrap>

        <Text $verticalAlign $nightWhite>
          {changeDate(certData?.createdAt)}
        </Text>
      </ProfileDateWrap>

      {/* 인증 이미지 */}
      <Image $mainImage $dayImageBorder>
        <img loading='lazy' src={certData?.photoUrl} alt="없음" />
      </Image>

      {/* 인증 글 하단바 */}
      <BottomContainer>
        {/* 왼쪽 파트 (좋아요 댓글) */}
        {/* 좋아요 */}
        <HeartCommentContainer>
          <Heart
            challengeDetailId={challengeDetailId}
            isLike={certData.like}
            likedNumber={certData.likeCount}
          />
        </HeartCommentContainer>
        {/* 댓글 */}
        <HeartCommentContainer onClick={moveUserProfile}>
          <FaRegCommentDots />
          <Text>{certData?.commentCount}</Text>
        </HeartCommentContainer>

        {/* 오른쪽 파트 */}
        <ProgressBar progress={progress}></ProgressBar>
      </BottomContainer>

      {/* 게시글 내용 */}
      <Box $day $wideTextBox>
        {certData?.challengeDetailContent}
      </Box>

      <MarginBot />
    </>
  )
}

export default ChalCertArticleItem
