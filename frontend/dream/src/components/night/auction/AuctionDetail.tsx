// 리액트
import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from "react-router-dom";

// 외부 
import tokenHttp from "api/tokenHttp";
import { changeDateHour } from "utils/dateForm";
import { RootState } from "store";
import { baseUrl } from "api/api";
import Swal from "sweetalert2";

// 컴포넌트
import Button from "components/common/Button";
import DreamCardGrade from "../nightcommon/DreamCardGrade";
import DreamKeywordRegion from "../nightcommon/DreamKeywordRegion";
import AuctionBuying from "./AuctionBuying";


// 스타일
import styled, {css} from "styled-components";
import Image from "style/Image";
import { Box, GradeWrappingBox } from "style/Box";
import Container from "style/Container";
import Text from "style/Text";
import Wrap from "style/Wrap";

const AuctionBox = styled(Box)`
  border-radius: 1rem;
  background-color: rgba(190, 169, 215, 0.5);
  margin-bottom: 0.5rem;
  padding: 0.5rem 1rem;
  /* color: white; */
`

const SmallText = styled(Text)`
  font-size: 0.5rem;
  margin-top: 0.25rem;
`

interface AuctionDetailType {
  biddingId : number;
  userId : number;
  biddingMoney : number; // 현재 최고가
  biddingAt : string;
  nickname : string; // 입찰자의 닉네임
  startAuctionMoney : number; 
  immediatelyBuyMoney : number;
  endedAt : "2023-09-09T00:00";
  createdAt : string;
  askingMoney : number; // 호가
  biddingCount : number; // 입찰횟수
  dreamCardId: number;
  dreamCardImageUrl : string;
  keywords : string[];
  positiveGrade : string;
  rareGrade : string;
  auctionStatus : string;
}

// 고민사항: 
// AuctionDetail과 Buying은 결국 가운데 바꿔끼기밖에 없음 (신규 렌더링은 낭비 같음)
// 경로는 다르게해도, useEffect -> location path 이걸로 보이는걸 다르게하면 어떨까.
const AuctionDetail = () => {
  const navigation = useNavigate()
  const location = useLocation()
  const userdata = useSelector((state: RootState) => state.auth.userdata);

  const [point, setPoint] = useState(userdata.point)

  const {auctionId} = useParams()
  const [auctionItem, setAuctionItem] = useState<AuctionDetailType>()
  const [isFirstAuctionPage, setIsFirstAuctionPage] = useState(true)
  const [biddingCount, setBiddingCount] = useState(auctionItem?.biddingCount)
  const [biddingMoney, setBiddingMoney] = useState(auctionItem?.biddingMoney)
  const [biddingTime, setBiddingTime] = useState(auctionItem?.createdAt)
  // 하드코딩
  const userId = useSelector((state:RootState)=> state.auth.userdata.userId)
  useEffect(()=> {
    
    tokenHttp.get(`/auction/point/${userId}`)
    .then(res => {
      setPoint(res.data.data.point)
    })
    
    tokenHttp.get(`/auction/detail/${Number(auctionId)}`)
    .then(res => {
      setAuctionItem(res.data.data)
      setBiddingCount(res.data.data.biddingCount)
      setBiddingMoney(res.data.data.biddingMoney)
      setBiddingTime(res.data.data.createdAt)
      console.log(res.data.data, "경매장 입장")

    })

  }, [])

  // 라우터 경로에 따른 것.
  useEffect(()=> {
    // 라우터 경로에 따라 컴포넌트 바꾸기
    if (location.pathname.includes("bidding")) {
      setIsFirstAuctionPage(false)
    } else setIsFirstAuctionPage(true)

  }, [location])

  // 시간 차이 계산
  const diffHour = () :number => {
    const today = new Date()
    const todayHour = today.getHours()
    const endedTime = new Date(auctionItem?.endedAt ? auctionItem?.endedAt : "")
    const endedHour = endedTime.getHours()
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
    } else return endedHour - todayHour >= 0 ? endedHour - todayHour : 0
  }

  // 꿈 즉시구매
  const buyDreamCardNow = () => {
    // 내 꿈머니보다 즉시구매가 높으면 돌려보내기 구현 필요
    
    const data = {
      auctionId: auctionId,
      userId: userdata.userId,
      biddingMoney: auctionItem?.immediatelyBuyMoney
    }
    tokenHttp.put(`/auction/purchase`, data)
    .then(res => {
      console.log(res)
      const response = res.data
      if (response.status === 204) {
        Swal.fire(response.data)
      } else if (response.status === 400) {
        Swal.fire(response.data)
      } else if (response.status === 200) {
        Swal.fire({
          icon:'success',
          title :'구매 성공',
        })
        return res.data.data.biddingUserId
      }
      return -1
    })
      .then(res => {
        if (res !== -1) {
          const data = {auctionId, newOwnerId: userId}
          tokenHttp.put("/auction", data)
          .then(res => {
            console.log(res, "주인 바뀜?")
            navigation(`/night/profile/${userId}`)
          })
        }
      })
  }

  const updateValue = (data:any) => {
    setBiddingCount(data.biddingCount)
    setBiddingMoney(data.biddingMoney)
    setBiddingTime(data.biddingTime)
  }

  return (
    <>
    <Container $baseContainer>
      <Image $mainImage $nightImageBorder>
        <img loading="lazy" src={auctionItem?.dreamCardImageUrl}
        />
      </Image>
    </Container>
    
    {/* 경매 첫 페이지만 나오는 곳 */}
    {isFirstAuctionPage && 
      <> 
      {/* 키워드 영역 */}
      <DreamKeywordRegion keywords={auctionItem?.keywords}/>
  
      {/* 길몽도, 희귀도 상속 필요 */}
      <DreamCardGrade 
      positiveGrade={auctionItem?.positiveGrade} 
      rareGrade={auctionItem?.rareGrade}/>
      </>
    }

    {/* 경매 참여 페이지(2) */}
    {!isFirstAuctionPage && <AuctionBuying 
    biddingMoney={auctionItem?.biddingMoney || 0}
    askingMoney={auctionItem?.askingMoney || 100}
    updateValue = {updateValue}
    />}

    {/* 입찰마감 & 현재최고가 */}
    <Container $baseContainer>
      <AuctionBox $fullWidth > 
      <Wrap $spaceBetweenWrap>
        <Text $nightBlue $isBold>입찰 마감 {diffHour()}시간 전</Text> 
        <Text $nightBlue>입찰 수: {biddingCount}명</Text> 
      </Wrap>      
      </AuctionBox>
      <AuctionBox $fullWidth>
        <Text $isBold $MBHalf>현재 최고가</Text>
      <Wrap $spaceBetweenWrap>
        <Text $isBold>$ {biddingMoney}</Text> 
        <Text>{changeDateHour(biddingTime)}</Text> 
      </Wrap>
      </AuctionBox>
    </Container>
    {/* 첫 페이지만 존재 */}
    {isFirstAuctionPage && 
      <>
      {/* 버튼 2개 */}
      <Container $baseContainer $auctionDetailMargin>
      <Wrap $spaceBetweenWrap>
        {/* 클릭하면 즉시 구매 & 우리 꿈머니 차감 필요 */}
        <Button $halfWidthImeBuy
        onClick={buyDreamCardNow}
        >
          <Text $isBold>즉시 구매</Text>
          <SmallText>{auctionItem?.immediatelyBuyMoney} 꿈포인트</SmallText>
        </Button>
        <Button $halfWidth $nightPurple
        onClick={()=> navigation(`/night/auction/bidding/${auctionId}`)}
        >참여하기</Button>
      </Wrap>
      {/* 꿈머니 구현 이후 */}
      <Text $nightKeword>나의 꿈머니: {point}</Text>
      </Container>
      </>
    }


    </>
  )
}

export default AuctionDetail