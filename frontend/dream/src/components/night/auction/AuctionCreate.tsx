{/* FlipCard 크기에 맞는 일반 이미지 쓰세요. (Flip 하지 마세요.) */} 

// 키워드들
// 등급 어쩌구
// 3개의 Input

{/* <DreamRecordContentsTab></DreamRecordContentsTab> */}

// 2개의 버튼

// 리액트
import React, {useEffect, useState} from "react";

// 컴포넌트
import DreamRecordContentsTab from "../dream/DreamRecordContentsTab";
import DreamKeywordRegion from "../nightcommon/DreamKeywordRegion";
import DreamCardGrade from "../nightcommon/DreamCardGrade";
import Button from "components/common/Button";

// 스타일
import styled, {css} from "styled-components";
import Container from "style/Container";
import Input, {InputProps} from "style/Input";
import Image from "style/Image";
import Text from "style/Text";
import Wrap from "style/Wrap";
import { useNavigate, useParams } from "react-router";
import tokenHttp from "api/tokenHttp";
import { ReverseCardType } from "../home/NightHomeItem";
import Swal from "sweetalert2";

const AuctionInputWrap = styled.div`
  display: grid;
  margin-left: 1rem;
  margin-right: 1rem;
  grid-template-columns: 40% 60%;
  ;
`

const CustomInput = styled(Input)`
  color: #3E3E3E;
  background-color: rgb(190, 169, 215, 50%);
`

const CustomText = styled(Text)`
  padding-left: 1rem;
  line-height: 2rem;
  color: #ffff;
`
const WarnText = styled(Text)`
  padding-left: 1rem;
  margin-top: 0.125rem;
  margin-bottom: 0.125rem;
  font-size: 0.5rem;
  color: #423535;
`

const MarginBot = styled.div`
  margin-bottom: 0.75rem;
`

export interface AuctionCreateType {
  startAuctionMoney :number // 경매 초기가
  immediatelyBuyMoney: number // 즉시구매가
}

const AuctionCreate = () => {
  const params = useParams()
  const navigate = useNavigate()

  const [startAuctionMoney , setStartAuctionMoney] = useState(1000)
  const [immediatelyBuyMoney , setImmediatelyBuyMoney] = useState(1000)

  // 메시지 바꾸기 용도
  const [isSMBaseMSG, setIsSMBaseMSG] = useState(true)
  const [isIMBaseMSG, setIsIMBaseMSG] = useState(true)

  // const endDate = today.setDate(today.getDate()+1)
  const endDate = (type :string) :string | undefined => {
    const today = new Date()
    const nextDay = new Date(today.setDate(today.getDate()+1))
    const year = nextDay.getFullYear()
    let month = String(nextDay.getMonth() +1)
    let day = String(nextDay.getDate())
    let hour = String(nextDay.getHours())
    let minutes = String(nextDay.getMinutes())
    let seconds = String(nextDay.getSeconds())
    
    if (type === "normal") {
      return [year, month, day].join(".") + " " + [hour, minutes].join(":")
    } 
    // "2023-09-22T11:23:00",
    else if (type === "axios") {
      if (month.length === 1) {
        month = "0" + month
      }
      if (day.length === 1) {
        day = "0" + day
      }
      if (hour.length === 1) {
        hour = "0" + hour
      }
      if (minutes.length === 1) {
        minutes = "0" + minutes
      }
      if (seconds.length === 1) {
        seconds = "0" + seconds
      } else if (seconds.length === 0) {
        seconds = "00"
      }
      console.log(nextDay)
      console.log([year, month, day].join("-") + "T" + [hour, minutes, seconds].join(":"))
    
      return [year, month, day].join("-") + "T" + [hour, minutes, seconds].join(":")
    }
  }

  
  // 추후 호가 몫만 들고가는 유효성 검사
  const changeStartMoney = () => {
    if (startAuctionMoney % 1000 > 0) {setIsSMBaseMSG(false)}
    else {setIsSMBaseMSG(true)}
  }

  const changeImmediatelyBuyMoney = () => {
    if (immediatelyBuyMoney % 1000 > 0) {setIsIMBaseMSG(false)}
    else {setIsSMBaseMSG(true)}
  }

  // 플립 카드 데이터
  const [reverseCardData, setReverseCardData] = useState<ReverseCardType>()

  useEffect(() => {
    tokenHttp.get(`/night/dream/${params.dreamCardId}/interpretation`)
    .then((res)=>{
      console.log("꿈 정보 불러오기 : ", res)
      const response = res.data
      const data = response.data

      // 카드 소유자가 아닐 때
      if (response.status === 400) {
        Swal.fire({
          icon: 'warning',
          text: response.data,
        })
        navigate('/night/main')
      } else if (response.status === 200) {
        setReverseCardData(data)
      }
    })
    .catch((err) => console.log("꿈 정보 불러오기 에러 : ", err))

    // const data = {

    // }
    // setReverseCardData()
  }, [])

  const auctionCreate = () => {
    const data = {
      auctionStatus : "T",
      isShow : "T",
      endedAt : endDate("axios"),
      immediatelyBuyMoney : immediatelyBuyMoney,
      startAuctionMoney : startAuctionMoney,
    }

    if (startAuctionMoney % 1000 === 0 && immediatelyBuyMoney % 1000 === 0) {
      tokenHttp.post(`/auction/${params.dreamCardId}`, data)
      .then((res) => {
        console.log("경매 데이터 보내기 : ", res) 
        const response = res.data
        if (response.status === 400) {console.log(response.data)}
        else if (response.status === 200) {
          navigate("/night/auction/list")
      }
      })
      .catch(err => console.log("경매 데이터 보내기 에러 : ", err))
    } else {alert("올바른 값을 입력해주세요!")}
  }
    
  return (
    <>
    <Container $baseContainer>
    {/* 이미지 */}
    <Image $mainImage $nightImageBorder><img loading="lazy" src={reverseCardData?.dreamCardImageUrl}/></Image>
    <DreamKeywordRegion keywords={reverseCardData?.keywords}/>
    <DreamCardGrade   
    positiveGrade={reverseCardData?.positiveGrade}  
    rareGrade={reverseCardData?.rareGrade}
    />

  {/* 옥션 전용 Input */}
    <AuctionInputWrap>
      <CustomText $isBold $black>마감시간</CustomText>
      <CustomInput $auctionInput $nightColor disabled value={endDate("normal")}/>
    </AuctionInputWrap>
    <MarginBot/>
    <AuctionInputWrap>
    <CustomText $isBold $black>시작가</CustomText>
    <CustomInput $auctionInput $nightColor
    type="number"
    onChange={(e) => setStartAuctionMoney(e.currentTarget.value)}
    onBlur={changeStartMoney}
    value={startAuctionMoney}
    />
    </AuctionInputWrap>
    <AuctionInputWrap>
      <CustomText />
    { !isSMBaseMSG && <WarnText>1000단위 금액을 입력해주세요.</WarnText>}    
    { isSMBaseMSG && <WarnText $danger>숫자만 입력해주세요.</WarnText>}    
    </AuctionInputWrap>
    <AuctionInputWrap>
    <CustomText $isBold $black>즉시 판매</CustomText>
    <CustomInput $auctionInput $nightColor
        type="number"
        onChange={(e) => setImmediatelyBuyMoney(e.currentTarget.value)}
        onBlur={changeImmediatelyBuyMoney}
        value={immediatelyBuyMoney}
    />
    </AuctionInputWrap>
    <AuctionInputWrap>
      <CustomText />
    { !isIMBaseMSG && <WarnText>1000단위 금액을 입력해주세요.</WarnText>}      
    </AuctionInputWrap>
    <MarginBot/>

    {/* 꿈 기록과 해몽 바뀌는 곳 ~ props 필요 */}
    <DreamRecordContentsTab setReverseCardData={setReverseCardData}/>

    <Wrap $nightBotButtonWrap>
      <div>
      </div>
      <div>
        <Button $nightPalePurple onClick={() => navigate(-1)}>취소</Button>
        <Button $nightPurple onClick={() => auctionCreate()}>경매</Button>
      </div>
    </Wrap>
    </Container>
    </>
  )
}

export default AuctionCreate;

