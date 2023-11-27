// 리액트
import React, { useEffect, useState } from "react";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import ChalContentListItem from "../daycommon/ChalContentListItem";
import InfiniteScroll from "components/common/InfiniteScroll";

// 스타일
import styled from "styled-components";
import Text from "style/Text";

export interface DayChallengeObjType {
  badgeUrl ?:string,
  challengeTitle :string,
  period :string,
  challengeId :number,
  challengeParticipateId ?:number,
  participationCount ?:number
}

export const NoChalMsgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

export interface DayChallengeListType extends Array<DayChallengeObjType> {}

const DayProfileOngoingTab = () => {
  const [allChalList, setAllChalList] = useState<DayChallengeListType>([]);
  const [lastItemId, setLastItemId] = useState<number>(0); 
  const [hasNext, setHasNext] = useState<boolean>(true); 
  const [noChalMsg, setNoChalMsg] = useState<string>("");
  let size :number = 6;

  const [arriveEnd, setArriveEnd] = useState<boolean>(true);
  
  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/day/mychallenge/list?size=${size}`}
    else {apiAddress = `/day/mychallenge/list?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=> {
        const response = res.data

        if (response.status === 400) {
          setNoChalMsg(response.data)
        } else if (response.status === 200) {
          const challengeList = response.data.challengeList
          setAllChalList([...allChalList, ...challengeList]);
          setLastItemId(challengeList[challengeList.length - 1]?.challengeId);
          setHasNext(response.data.hasNext);
        }
      })
      .catch(err=>console.log("===", err))
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

export default DayProfileOngoingTab