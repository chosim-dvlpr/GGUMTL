
// 타임캡슐 이미지

// TitleBox

// map
// TextBox :제목x

// 리액트
import tokenHttp from "api/tokenHttp";
import InfiniteScroll from "components/common/InfiniteScroll";
import React,{ useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Box } from "style/Box";
import Container from "style/Container";
import Image from "style/Image";

// 컴포넌트

// 스타일

interface TimeCapsuleItemType {
  timeCapsuleContent:string;
  timeCapsuleId:number;
  userId:number;
}

const ChalCapsuleList = () => {

  const params = useParams()
  const currentChallengeId = params.challengeId
  const navigate = useNavigate()
  const [timeCapsuleList, setTimeCapsuleList] = useState<TimeCapsuleItemType[]>([])
  const [arriveEnd, setArriveEnd] = useState<boolean>(true); // 바닥에 다다름을 알려주는 변수
  const [lastItemId, setLastItemId] = useState<number>(0); // db엔 0번이 없음
  const [hasNext, setHasNext] = useState<boolean>(true); 
  const [chalTitle, setChalTitle] = useState<string>('');
  const [timeCapsuleOpenSignal, setTimeCapsuleOpenSignal] = useState<boolean>(false)

  const timeCapsuleOpen = () => {
    setTimeCapsuleOpenSignal(true)
  }

  useEffect(()=>{
    setTimeout(timeCapsuleOpen,2500)
  },[])

  useEffect(()=>{
    let axiosUrl :string = ''

    if (lastItemId === 0) {
      axiosUrl = `/day/challenge/timecapsule/${currentChallengeId}?size=8`
    } else {
      axiosUrl = `/day/challenge/timecapsule/${currentChallengeId}?lastItemId=${lastItemId}&size=6`                                
    }
    
    console.log(axiosUrl)
    console.log('hasNext',hasNext)
    if (arriveEnd && hasNext) {  // 끝에 도달하고 다음이 있을 때 다음 데이터 호출
      tokenHttp.get(axiosUrl)
        .then((response)=>{
          const res = response.data.data
          console.log('타임캡슐 결과',res)
          const resultList = res.timeCapsuleList
          console.log('새로 호출되는 리스트', resultList)
          console.log('기존 타임캡슐 리스트 ', timeCapsuleList)
          setTimeCapsuleList([...timeCapsuleList, ...resultList])
          console.log('새로 만들어진 타임캡슐 리스트',timeCapsuleList)
          setArriveEnd(false);
          setHasNext(res.hasNext)

          setChalTitle(res.challengeTitle)
          setLastItemId(resultList[resultList.length-1]?.timeCapsuleId); // 마지막 item id 변경
          console.log('마지막 아이템 아이디',lastItemId)
        })
        .catch((err)=>{console.log(err)})
      }
  },[arriveEnd])

  return (
    <Container $columnCenterContainer $dayBaseContainer>
      {timeCapsuleOpenSignal ? (
        <>
          <Image $timeCapsuleImage>
            <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/icon/timecapsule.png`}></img>
          </Image>
          <Box $tiemCapsuleChalTitleBox>{chalTitle}</Box>
          <InfiniteScroll 
          setArriveEnd={setArriveEnd} 
          component = {
            timeCapsuleList.map((item: TimeCapsuleItemType, idx: number)=>(
              <Box $timeCapsuleContentBox key={idx}>{item.timeCapsuleContent}</Box>
              )) 
            }
          >
          </InfiniteScroll>
        </>
      ) : (
        <Image $timeCapsuleLoading>  
          <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/timecapsule-loading.gif`}></img>
        </Image>
      )}
  </Container>
  )
}
export default ChalCapsuleList