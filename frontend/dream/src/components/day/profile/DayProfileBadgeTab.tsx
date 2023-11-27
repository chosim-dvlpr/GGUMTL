// 리액트
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import InfiniteScroll from "components/common/InfiniteScroll";

// 스타일
import styled from "styled-components";
import Image from "style/Image";
import Text from "style/Text";

export interface ProfileBadgeAxiosType {
  badgeId :number,
  challengeId :number,
  completedDays :string
}

const BadgeWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 3fr);
  flex-direction: column;
  margin: 0 0.5rem;
`
const NoBadgeMsgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

const DayProfileBadgeTab = () => {
  const params = useParams();

  const [allBadgeList, setAllBadgeList] = useState<ProfileBadgeAxiosType[]>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true); 
  const [noBadgeMsg, setNoBadgeMsg] = useState<string>("뱃지가 없습니다.");
  let size :number = 6;

  // infinite scroll
  const [arriveEnd, setArriveEnd] = useState<boolean>(true);

  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === -1) {apiAddress = `/profile/day/badge/list/${params.userId}?size=${size}`}
    else {apiAddress = `/profile/day/badge/list/${params.userId}?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res)=> {
        const response = res.data.data
        const badgeList = response.badgeList
        setAllBadgeList([...allBadgeList, ...badgeList]);
        setLastItemId(badgeList[badgeList.length - 1]?.badgeId);
        setHasNext(response.hasNext);
      })
      .catch(err=>console.log("뱃지 탭 : ", err))
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
        allBadgeList.length === 0
        ? 
        <NoBadgeMsgWrap>
          <Text $black>{noBadgeMsg}</Text>
        </NoBadgeMsgWrap>
        :
          <BadgeWrap>
            <InfiniteScroll
            setArriveEnd={setArriveEnd} 
            // lastItemId={lastItemId}
            component={
              allBadgeList?.map((badge :ProfileBadgeAxiosType) => (
                <Image 
                $badge
                key={badge.badgeId}><img src=""></img></Image>
                ))
              }
              >
            </InfiniteScroll>
          </BadgeWrap>
      }
    </>
  )
}

export default DayProfileBadgeTab