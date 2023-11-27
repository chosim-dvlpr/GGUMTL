
// TitleBox

//  TextBox :제목
// 미션 내용

// Wrapping
// TextBox :제목  카테고리
// TextBox :제목  챌린지 기간

// FullwidthBar //성취도

// LongButton 챌린지 인증하기 // 하루 1회 했으면 "비활성"
{/*  이동: <ChalCreateCertPage></ChalCreateCertPage> */}

// 다른 사람들의 응원메시지를 확인해보세요 //  인증기간에 따른 활성//비활성
// LongButton 타임 캡슐 + 타임캡슐 이미지 // 클릭 시 ChalCapsulePage

// 리액트
import React, {useEffect,useState} from "react";

// 컴포넌트
import Button from "components/common/Button";
import Container from "style/Container";
import { Box, BoxTitle } from "style/Box";
import { useNavigate, useParams } from "react-router";
import basicHttp from "api/basicHttp";
import { ChalDetailDataType, ChalDetailInfoProps } from "../ChalDetail";
import Wrap from "style/Wrap";
import styled from "styled-components";
import tokenHttp from "api/tokenHttp";
import Text from "style/Text";
import { extractNumber } from "utils/calc/extractNumber";
// 스타일


// progress 속성을 정의
interface ProgressBarProps {
  achievement :number;
}

const ProgressBar = styled.div<ProgressBarProps>`
  height: 1rem;
  width: 100%;
  border-radius: 1rem;
  color: #997ad8;
  position: relative;
  background-color: #F9F9F9;
  
  &::before {
    content: "";
    position: absolute;
    inset: 0 calc(${props => 100 -props.achievement}%) 0 0;
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
      width: ${props => props.achievement}%; // 원하는 최대 너비
    }
  }
`


// 챌린지 디테일 초기값
const initialChalDetail:ChalDetailInfoProps = {
  chalDetailData:{
    challengeContent :'',
    challengeId : 0,
    challengeTitle :'',
    keyword :'',
    participationCount :0,
    badgeUrl :'',
    period :'',
    ranking: [
      {
        ranking : 0,
        nickName :'',
      },
    ]
  },
} 

const ChalManageDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const currentChallengeId = Number(params.challengeId)
  const [chalData, setChalData] = useState<ChalDetailDataType>(initialChalDetail.chalDetailData)

  // false 면 인증 이미 완료, true 면 인증 가능
  const [possibleCert, setPossibleCert] = useState<boolean>(true) 

  // 성취도
  const [achievement, setAchievement] = useState<number>(0)
  const [possibleTimecapsule, setPossibleTimecapsule] = useState<boolean>(false)

  useEffect(()=>{
    // 렌더링되었을 때 참여
    tokenHttp.get(`/day/challenge/item/${currentChallengeId}`)
      .then((response)=>{
        const res = response.data
        setChalData(res.data.detail)
        console.log("챌린지 데이터",res.data.detail)

        console.log("현재 참여한 일수",res.data.participateDay)
        const passDays:number = res.data.participateDay
        
        const chalPeriodDays:number = extractNumber(res.data.detail.period)
        console.log("참여할 기간 일수",res.data.detail.period)
        console.log("참여할 기간 숫자", extractNumber(res.data.detail.period))
        
        // 성취도 계산
        setAchievement(Math.floor((passDays/chalPeriodDays)*100))
        console.log('성취도', Math.floor((passDays/chalPeriodDays)*100))

        // 타임 캡슐 확인 가능 여부
        if (Math.floor((passDays/chalPeriodDays)*100) >= 3) {
          setPossibleTimecapsule(true)
        }

        // 현재 시작 후 몇일인지 계산

      })
      .catch((e)=>{console.log(e)})
    
    tokenHttp.get(`day/challenge/writeDetailPossible/${currentChallengeId}`)
      .then((response)=>{
        const res = response.data
        if (res.status === 200) {
          setPossibleCert(true)
        }
        else if (res.status === 400){
          setPossibleCert(false)
        }
        console.log("인증 완료 여부 = ",res)
      })
      .catch((err)=>{console.log(err)})
  
  },[])


  return (
    <Container $dayBaseContainer $dayCreate>
      <Box $mainTitleBox onClick={()=>{navigate(`/day/challenge/${chalData.challengeId}`)}}>
        <img loading="lazy" src={`${chalData?.badgeUrl}`}></img> 
        {chalData?.challengeTitle}
      </Box>
      <Box $wideTextBox $day>
        <BoxTitle $boxTitle>미션</BoxTitle>
        {chalData?.challengeContent}
      </Box>

      {/* 중간 2단 박스 */}
      <Container $spaceBetweenContainer>
        <Box $doubleWidth $day $chalManageBox>
          <BoxTitle $boxTitle>카테고리</BoxTitle>
          <p>{chalData?.keyword}</p>
        </Box>

        <Box $doubleWidth $day $chalManageBox>
          <BoxTitle $boxTitle>챌린지 기간</BoxTitle>
          <p>{chalData?.period}</p>
        </Box>
      </Container>

      {/* 성취도 바 */}
      <Box $progressBox>
        <ProgressBar achievement={achievement}></ProgressBar>  
        <BoxTitle $boxTitle>성취도</BoxTitle>
        <Text $progressPercent>{achievement}%</Text>
      </Box>

      {/* 챌린지 인증하기 버튼 */}
      <Button 
        $fullWidth $chalCertButton
        $dayBlue={possibleCert}
        $dayGrey={!possibleCert}
        // true면 활성 false면 비활성
        disabled={!possibleCert}
        
        onClick={()=>{navigate(`/day/mychallenge/${currentChallengeId}/cert/create`)}}
        >
        {possibleCert ? (
          <Text $isBold>챌린지 인증하기</Text>
        ):(
          <Text $isBold>인증을 완료하셨습니다</Text>
        )}
      </Button>

      <Text $dayMoney $timeCapsuleText>다른 사람들의 응원 메세지를 확인해보세요.</Text>
      
      <Button 
        $fullWidth $chalCertButton
        $dayYellow={possibleTimecapsule}
        $dayGrey={!possibleTimecapsule}
        disabled={!possibleTimecapsule}
        onClick={()=>{{navigate(`/day/challenge/${currentChallengeId}/timecapsule`)}}}
      >
        <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/icon/timecapsule.png`}></img>
        <Text $isBold>타임 캡슐</Text>
      </Button>

    </Container>
  )
}

export default ChalManageDetail