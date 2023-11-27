// 상단 박스
// titleText
// Wrapping
// 기간, 참여자, 카테고리
// /Wrapping

// #더보기 전
// 더보기 버튼

// #더보기 후
// 미션 ContentBoxBox
// 획득 뱃지 ContentBox
// 연속 일수 랭킹 ContentBox
// 리액트
import React, { useEffect, useState } from 'react'
import basicHttp from 'api/basicHttp'

// 컴포넌트
import Button from 'components/common/Button'
import Container from 'style/Container'
import { Box, BoxTitle } from 'style/Box'
import Text from 'style/Text'
import { BsChevronCompactDown, BsChevronCompactUp } from 'react-icons/bs'
// 타입
import { ChalDetailInfoProps } from './ChalDetail'
import Image from 'style/Image'

// 스타일

const ChalDetailInfo: React.FC<ChalDetailInfoProps> = (props) => {
  const chalDetail = props.chalDetailData
  const [moreData, setMoreData] = useState<boolean>(false)

  return (
    <Container $chalDetail>
      <Text $chalDetailTitle>{chalDetail.challengeTitle}</Text>
      {/* 기간 참여자 카테고리 */}
      <Container $spaceBetweenContainer>
        <Box $tripleWidth $chalDetailBox>
          <BoxTitle $boxTitle>기간</BoxTitle>
          <Text $chalBoxInnerText>{chalDetail.period}</Text>
        </Box>

        <Box $tripleWidth $chalDetailBox>
          <BoxTitle $boxTitle>참여자</BoxTitle>
          <Text $chalBoxInnerText>{chalDetail.participationCount}</Text>
        </Box>

        <Box $tripleWidth $chalDetailBox>
          <BoxTitle $boxTitle>카테고리</BoxTitle>
          <Text $chalBoxInnerText>{chalDetail.keyword}</Text>
        </Box>
      </Container>

      {
        //닫기와 더보기 버튼 클릭했을 때 변경
        moreData ? (
          <>
            <Box $fullWidth $chalDetailBox>
              <BoxTitle $boxTitle>미션</BoxTitle>
              <Text $chalBoxInnerText>{chalDetail.challengeContent}</Text>
            </Box>
            <Box $fullWidth $chalDetailBox>
              <BoxTitle $boxTitle>획득 뱃지</BoxTitle>
              <Image $badge>
                <img loading='lazy' src={chalDetail.badgeUrl} alt="뱃지 이미지" />
                {/* <img src={chalDetail.badgeUrl} alt="뱃지 이미지" /> */}
              </Image>
            </Box>
            {/* <Box $fullWidth $chalDetailBox>
              <BoxTitle $boxTitle>랭킹</BoxTitle>
              <Text $chalBoxInnerText>랭킹</Text>
            </Box> */}
            <Button
              $fullWidth
              $moreButton
              onClick={() => {
                setMoreData(false)
              }}
            >
              <BsChevronCompactUp />
              <p>닫기</p>
            </Button>
          </>
        ) : (
          <Button
            $fullWidth
            $moreButton
            onClick={() => {
              setMoreData(true)
            }}
          >
            <BsChevronCompactDown />
            <p>더보기</p>
          </Button>
        )
      }
    </Container>
  )
}

export default ChalDetailInfo
