// 리액트
import React, {useRef, useState} from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
// 컴포넌트

// 타입 & 외부
import { AuctionCardType } from "../auction/AuctionMainList";

// 스타일
import { Box } from "style/Box";
import styled, {css} from "styled-components";
import Image from "style/Image";
import "./AuctionCard.css"

const AuctionCardFrame = styled.div`
  background: rgba(190, 169, 215, 0.5);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.25);
  border-radius: 20px;
  width: 40vw;
  height: 75vw;
`

export interface AuctionCardProps {
  auctionCard ?: AuctionCardType | null
}

const AuctionCard = ({auctionCard} : AuctionCardProps) => {
  const navigation = useNavigate()


  // 시간 계산
  const diffHour = () :number => {
    const today = new Date()
    const todayHour = today.getHours()
    const endedTime = new Date(auctionCard?.endedAt ? auctionCard?.endedAt : "")
    const endedHour = endedTime.getHours()

    const todayDay = today.getDate()
    const endDay = today.getDate()
    if (todayDay === endDay) { return 4 }

    if (endedHour === 0) {
      if (todayHour === 22) return 2
      else if (todayHour === 23) return 1
      else if (todayHour === 0) return 0
      return 3
    } else if (endedHour === 1) {
      if (todayHour === 23) return 2
      else if (todayHour === 0) return 1
      else if (todayHour === 1) return 0
      return 3
    } else return endedHour - todayHour
  }
  
  return (
    <>
    {/* 옥션 카드에 존재하는 키워드박스 클릭할 때도 경매장 가는 거 막아야 함. */}
    <div className="auction-card"
    onClick={() => {
        navigation(`/night/auction/detail/${auctionCard?.auctionId}`)
    }}    
    >
      <div className="auction-end-time"> 
      { diffHour() < 3 ? ( diffHour() > 0 ? `마감 ${diffHour()}시간 전` : "종료 임박") : "경매장 입장" }
      </div>
      <div className="auction-card-image">
        <Image $nightImageBorder $auctionCard><img loading="lazy" src={auctionCard?.dreamCardImageUrl}/></Image>
      </div>
      <div className="keyword-region">
        {/* keywords가 객체인 문제임 */}
        {auctionCard?.keywords.map((keyword, idx) => (
          <Box $keywordBoxNight key={idx}
          onClick={() => navigation(`/night/search?searchKeyword=${Object.values(keyword)}`)}
          >{Object.values(keyword)}</Box>  
        ))}
      </div>
      <div className="grade-region clearfix">
        <div className="one-second">
          <div className="grade">{auctionCard?.positivePoint ? auctionCard?.positivePoint : auctionCard?.positiveGrade}</div>
          <div className="grade-value">길몽</div>
        </div>

        <div className="one-second">
          <div className="grade">{auctionCard?.rarePoint ? auctionCard?.rarePoint : auctionCard?.rareGrade}</div>
          <div className="grade-value">희귀</div>
        </div>

      </div>
    </div> 

    </>
  )
}

export default AuctionCard