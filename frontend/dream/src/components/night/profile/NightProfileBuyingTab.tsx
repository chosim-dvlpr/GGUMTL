// 리액트
import React, { useEffect, useState } from "react";

// 컴포넌트
import AuctionCard from "../nightcommon/AuctionCard";
import InfiniteScroll from "components/common/InfiniteScroll";
import tokenHttp from "api/tokenHttp";

// 스타일
import Text from "style/Text";
import styled from "styled-components";

// 타입
import { AuctionCardType } from "../auction/AuctionMainList";


const NoAuctionMsgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`


const NightProfileBuyingTab = () => {

  const [auctionBuyingDataList, setAuctionBuyingDataList] = useState<AuctionCardType[]>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [noAuctionMsg, setNoAuctionMsg] = useState<string>("참여 중인 경매가 없습니다.");
  const [hasNext, setHasNext] = useState<boolean>(true); 
  let size = 12;

  const [arriveEnd, setArriveEnd] = useState<boolean>(true);

  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/profile/night/auction/participation/list?size=${size}`}
    else {apiAddress = `/profile/night/auction/participation/list?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=>{
        const response = res.data.data
        const auctionList = response.auctionList

        setAuctionBuyingDataList([...auctionBuyingDataList, ...auctionList]);
        setLastItemId(auctionList[auctionList.length - 1]?.dreamCardId);
        setHasNext(response.hasNext);
      })
      .catch((err) => console.log("== 꿈 받기 탭 에러 ==", err))
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
      auctionBuyingDataList.length === 0
      ? <NoAuctionMsgWrap>
          <Text $nightWhite>{noAuctionMsg}</Text>
        </NoAuctionMsgWrap>
      : <InfiniteScroll 
        setArriveEnd={setArriveEnd} 
        component={
          auctionBuyingDataList?.map((data, i) => (
            <AuctionCard auctionCard={data} key={i}/>
          ))
        }
        />
    }
    </>
  )
}

export default NightProfileBuyingTab