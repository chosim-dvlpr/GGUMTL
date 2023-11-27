// 이미지
// 뒤집을 때 나옴

// Image

// 내용

// 리액트
import React, {useState} from "react";

// 컴포넌트
import Button from "components/common/Button";
import DreamCardGrade from "./DreamCardGrade";

// 외부
import tokenHttp from "api/tokenHttp";

// 스타일
import styled, {css} from "styled-components";
import "./NightFlipCard.css"
import Image from "style/Image";
import Container from "style/Container";
import { Box } from "style/Box";
import Text from "style/Text";

// 타입
import { ReverseCardType } from "../home/NightHomeItem";
import { changeDate } from "utils/dateForm";
import { useNavigate } from "react-router-dom";

const CustomKeywordBox = styled.div`
  background-color: #3b3170;
  color: white;
  padding: 0.25rem;
  text-align: center;
  border-radius: 0.25rem;
  &:active {
    opacity: 0.8;
  }
`

const NightFlipCardKeyBtnWrap = styled.div`
  display: grid;
  grid-template-columns: 7fr 3fr;
  margin: inherit;
`
const NightFlipCardKeywordWrap = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  padding: inherit;
  gap: 3vw;
`

const ButtonDiv = styled.div`
  text-align: right;
`
// 플립 카드 닉네임과 일자 용도
const NightFlipCardBotWrap = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 0;
`

export interface ReverseCardProps {
  reverseCardData ?: ReverseCardType | null
}

const NightFlipCard = ({reverseCardData}: ReverseCardProps) => {
  const navigation = useNavigate()

  const [isFlipCard, setIsFlipCard] = useState(false)
  const dreamCardId = reverseCardData?.dreamCardId

  const dreamCardFlipStyle = {
    transform: isFlipCard ? 'translateY(0)' : "translateY(100%)"
  }

  // 꿈 주인 유저 프로필로 이동
  const moveUserProfile = () => {
    navigation(`/night/profile/${reverseCardData?.dreamCardOwner}`)
  }

  // 경매장 입장
  const enterAuctionSpace = () => {
    navigation(`/night/auction/detail/${reverseCardData?.auctionId}`)
  }

  // 조회수 증가 (카드 클릭할 때마다 증가시킴)
  const addHits = () :void => {
    tokenHttp.put(`/night/dream/detail/hit`, dreamCardId)
    .then(res => console.log(res, "조회수 증가"))
  }

  return (
    <>
    <Container $baseContainer>
      <div className="card" onClick={(e:any) => {
        if (!e.target.className.includes("blockClickEvent")) {
          setIsFlipCard(!isFlipCard)
          addHits()
          return
        }
      }}>
  {/* <div className="card-image"></div> */}
      <Image $mainImage $nightImageBorder>
        <img loading="lazy" src={reverseCardData?.dreamCardImageUrl}/>
      </Image>
        <div className="card-description" style={dreamCardFlipStyle}>
          <NightFlipCardKeyBtnWrap >
            <NightFlipCardKeywordWrap>
              {/* 키워드 3개까지만 출력하기 */}
              { (Array.isArray(reverseCardData?.keywords) && reverseCardData?.keywords.length !== 0 ) ? 
              reverseCardData?.keywords.map((keyword, idx) => (
                (idx <= 2 && keyword !== null) ? (
                <CustomKeywordBox className="blockClickEvent" key={idx}> 
                  <Text $nightKeword className="blockClickEvent"
                    onClick={() => navigation(`/day/main?pullKeyword=${Object.values(keyword)}`)}
                  >
                    {Object.values(keyword)}
                  </Text>
                </CustomKeywordBox >
                ) : null
              )) 
              : null }
            </NightFlipCardKeywordWrap>
            {/* d */}
            <ButtonDiv >
              {/* 경매 상태 T일 때만 버튼 보임 */}
              { reverseCardData?.auctionStatus === "T" &&             
              <Button $nightMiddlePurple className="blockClickEvent"
              onClick={enterAuctionSpace}
              >꿈 경매</Button>}            </ButtonDiv>
          </NightFlipCardKeyBtnWrap>

          <DreamCardGrade positiveGrade={reverseCardData?.positiveGrade} rareGrade={reverseCardData?.rareGrade}/>
          <NightFlipCardBotWrap >
            <Text className="blockClickEvent"
            onClick={moveUserProfile}
            > {reverseCardData?.ownerNickname} </Text>
            <Text>{changeDate(reverseCardData?.createdAt)}</Text>
          </NightFlipCardBotWrap>
        </div>
      </div>

    </Container>
    </>
  )
}

export default NightFlipCard