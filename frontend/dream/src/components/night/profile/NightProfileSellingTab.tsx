// 리액트
import React, { useEffect, useState } from "react";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import AuctionCard from "../nightcommon/AuctionCard";
import InfiniteScroll from "components/common/InfiniteScroll";

// 스타일
import { AuctionCardType } from "../auction/AuctionMainList";
import Text from "style/Text";
import styled from "styled-components";

const NoCardMsgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const NightProfileSellingTab = () => {

  const [auctionSellingDataList, setAuctionSellingDataList] = useState<AuctionCardType[]>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true); 
  const [noAuctionMsg, setNoAuctionMsg] = useState<string>("참여 중인 경매가 없습니다.");
  let size = 12;
  
  const [arriveEnd, setArriveEnd] = useState<boolean>(true);

  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/profile/night/auction/list?size=${size}`}
    else {apiAddress = `/profile/night/auction/list?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=>{
        const response = res.data.data
        const auctionList = response.auctionList
        setAuctionSellingDataList([...auctionSellingDataList, ...auctionList]);
        setLastItemId(auctionList[auctionList.length - 1]?.dreamCardId);
        setHasNext(response.hasNext);
      })
      .catch((err) => console.log("== 꿈 팔기 탭 ==", err))
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
      auctionSellingDataList.length === 0
      ? <NoCardMsgWrap>
          <Text $nightWhite>{noAuctionMsg}</Text>
        </NoCardMsgWrap>
      : <InfiniteScroll 
        setArriveEnd={setArriveEnd} 
        component={
          auctionSellingDataList?.map((data, i) => (
            <AuctionCard auctionCard={data} key={i}/>
            ))
          }
        />
    }
    </>
  )
}

export default NightProfileSellingTab