// 리액트
import React, {useEffect, useState} from "react";

// 컴포넌트
import NightHomeItem from "./NightHomeItem";
import InfiniteScroll from "components/common/InfiniteScroll";
import tokenHttp from "api/tokenHttp";

// 타입
export interface NightHomeItemType {
  dreamCardId: number;
  dreamCardOwner: number;
  ownerNickname: string;
  ownerProfileUrl: string;
  dreamCardImageUrl: string;
  dreamCardAuthor: number; // 꿈 카드 작성자
  createAt: string;
  likedNumber: number,
  like: boolean;
}

export interface NightHomeListType extends Array<NightHomeItemType>{}

const NightHomeList = () => {

  const [nightHomeDataSet, setNightHomeDataSet] = useState<NightHomeListType>([])
  const [lastItemId, setLastItemId] = useState<number>(-1);
  let size = 5;

  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === -1) {apiAddress = `/night/?size=${size}`}
    else {apiAddress = `/night/?lastItemId=${lastItemId}&size=${size}`}
    
    tokenHttp.get(apiAddress)
    .then((res)=> {
      if (typeof res.data.data.list === "object") {
        setNightHomeDataSet([...nightHomeDataSet, ...res.data.data.list]);
      }})
    .catch(err=>console.log("===", err))
  };

  useEffect(() => {
    getAxios();
  }, []);

  // nightHomeDataSet에 새로운 내용이 들어오면 lastItemId 변경
  useEffect(() => {
    nightHomeDataSet[nightHomeDataSet.length - 1] && 
    setLastItemId(nightHomeDataSet[nightHomeDataSet.length - 1].dreamCardId)
  }, [setNightHomeDataSet, nightHomeDataSet])


  const [arriveEnd, setArriveEnd] = useState<boolean>(false);

  useEffect(() => {
    if (arriveEnd) {
      getAxios();
      setArriveEnd(false);
    }
  }, [arriveEnd])

  return (
    <>
    {
      nightHomeDataSet &&
      <InfiniteScroll
      setArriveEnd={setArriveEnd} 
      component={
        nightHomeDataSet?.map((item: NightHomeItemType, idx:number) => (
          <NightHomeItem 
          cardData={item} 
          key={idx}/>
        ))}
      />
    }
    </>
  )
}

export default NightHomeList