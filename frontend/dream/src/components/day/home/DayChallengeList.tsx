
// map
// <ChallengeContentListItem></ChallengeContentListItem> ./daycommon 

// 리액트
import React, { useEffect, useState } from "react";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import ChalContentListItem from "../daycommon/ChalContentListItem";
import InfiniteScroll from "components/common/InfiniteScroll";

// 스타일
import Text from "style/Text";
import { CategoryAxiosType } from "../daycommon/DayCategoryList";

export interface DayChallengeObjType {
  title ?:string,
  period :string,
  challengeId :number,
  challengeTitle ?:string,
  challengeParticipateId ?:number,
  participateCount ?:number,
  dreamKeywordId ?:number,
  badgeUrl ?:string,
}

export interface DayChallengeListType extends Array<DayChallengeObjType> {}

export interface CategoryToChalProps {
  categoryProps :CategoryAxiosType
}

const DayChallengeList = (props :CategoryToChalProps) => {
  const [allChalList, setAllChalList] = useState<DayChallengeListType>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true); 
  let size :number = 6;

  
  // infinite scroll
  const [arriveEnd, setArriveEnd] = useState<boolean>(true); // 바닥에 다다름을 알려주는 변수


  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/day?size=${size}`}
    else {apiAddress = `/day?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=>{
        const response = res.data.data
        const challengeList = response.challengeList
        setAllChalList([...allChalList, ...challengeList]);
        setLastItemId(challengeList[challengeList.length - 1].challengeId);
        setHasNext(response.hasNext);
      })
      .catch((err) => console.log(err))
    }
  }

  useEffect(() => {
    getAxios();
  }, []);

  useEffect(() => {
    if (arriveEnd) {
      getAxios();
      setArriveEnd(false);
    }
  }, [arriveEnd])

  return (
    <>
    {
      allChalList &&
      <InfiniteScroll 
        setArriveEnd={setArriveEnd} 
        component={
          allChalList
          // 카테고리
          .filter((chal: DayChallengeObjType) => {
            if (props.categoryProps.keywordId !== 0) {
              return chal.dreamKeywordId === props.categoryProps.keywordId
            } else {
              return true
            }
          })
          .map((chal :DayChallengeObjType) => (
            <ChalContentListItem key={chal.challengeId} chal={chal} />))
        }
      ></InfiniteScroll>
    }
    </>
  )
}

export default DayChallengeList