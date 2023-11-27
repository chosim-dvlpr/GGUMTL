// 리액트
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import ChalContentListItem from "../daycommon/ChalContentListItem";
import InfiniteScroll from "components/common/InfiniteScroll";
import { DayChallengeListType, DayChallengeObjType, NoChalMsgWrap } from "./DayProfileOngoingTab";

// 스타일
import Text from "style/Text";


const DayProfileCompleteTab = () => {
  const params = useParams();

  const [allChalList, setAllChalList] = useState<DayChallengeListType>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true); 
  const [noChalMsg, setNoChalMsg] = useState<string>("해당 챌린지가 없습니다.");
  let size :number = 6;
  
  // infinite scroll
  const [arriveEnd, setArriveEnd] = useState<boolean>(true);

  // api 요청
  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/profile/day/mychallenge/end/list/${params.userId}?size=${size}`}
    else {apiAddress = `/profile/day/mychallenge/end/list/${params.userId}?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=> {
        const response = res.data.data
        const challengeList = response.challengeList
        setAllChalList([...allChalList, ...challengeList]);
        setLastItemId(challengeList[challengeList.length - 1]?.challengeId);
        setHasNext(response.hasNext);
      })
      .catch(err => console.log("== 챌린지 완료 탭 에러 ==", err))
    }
  };

  useEffect(() => {
    getAxios();
  }, [])

  useEffect(() => {
    if (arriveEnd) {
      getAxios();
      setArriveEnd(false);
    }
  }, [arriveEnd])


  return (
    <>
    {
      allChalList.length === 0
      ?
      <NoChalMsgWrap>
        <Text $black>{noChalMsg}</Text>
      </NoChalMsgWrap>
      :
      <InfiniteScroll
      setArriveEnd={setArriveEnd} 
      component={
        allChalList?.map((chal :DayChallengeObjType) => (
          <ChalContentListItem key={chal.challengeId} chal={chal} />))
        }
        >
      </InfiniteScroll>
    }
    </>
  )
  }

export default DayProfileCompleteTab