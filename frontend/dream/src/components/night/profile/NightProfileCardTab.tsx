// 리액트
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { RootState } from "store";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import Button from "components/common/Button";
import InfiniteScroll from "components/common/InfiniteScroll";

// 스타일
import Image from "style/Image";
import styled from "styled-components";
import Text from "style/Text";

const ProfileCardButtonWrap = styled.div`
  margin: 1rem 0.5rem;
`

const ProfileDreamCardWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin-right: 0.5rem;
`

const NoCardMsgWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`

export interface ProfileDreamCardAxiosType {
  dreamCardId :number,
  dreamCardImageUrl :string,
  dreamCardAuthorId :number,
  isShow :string,
  purchase :boolean,
}

const NightProfileCardTab = () => {
  const navigate = useNavigate();
  const params = useParams();
  const userId = useSelector((state: RootState) => state.auth.userdata.userId);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

  const profileId :number = Number(params.userId);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [noCardMsg, setNoCardMsg] = useState<string>("");
  const [hasNext, setHasNext] = useState<boolean>(true); 
  let size = 16;
  
  const [arriveEnd, setArriveEnd] = useState<boolean>(true);
  const [dreamCardList, setDreamCardList] = useState<ProfileDreamCardAxiosType[]>([]);
  
  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/profile/night/card/${profileId}?size=${size}`}
    else {apiAddress = `/profile/night/card/${profileId}?lastItemId=${lastItemId}&size=${size}`}
    
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res) => {
        const response = res.data
        const data = response.data

        // 생성된 꿈카드가 있을 때
        if (response.status === 200) {
          const axiosDreamCardList = data.dreamCardList
          setDreamCardList([...dreamCardList, ...axiosDreamCardList]);
          setLastItemId(axiosDreamCardList[axiosDreamCardList.length - 1].dreamCardId) 
        } 
        // 생성된 꿈카드가 없을 때
        if (response.status === 400) {
          setNoCardMsg(data);
        }
      })
      .catch((err) => console.log("밤 꿈 카드 탭 에러 : ", err))
    }
  }

  useEffect(() => {
    getAxios();  
  }, [])


  // 공개 카드만 보이도록 
  const [isShowAllCard, setIsShowAllCard] = useState<boolean>(false);
  
  const handleShowCard = () => {
    // 공개카드만 -> 비공개 카드 포함해서 보여주기
    if (isShowAllCard) {setIsShowAllCard(false)}
    // 비공개 카드 포함 전체 -> 공개카드만 보여주기
    else {setIsShowAllCard(true)}
  }
  
  // 구매 카드만 보이도록
  const [isBuyCard, setIsBuyCard] = useState<boolean>(false);
  
  const handleBuyCard = () => {
    // 구매카드만 -> 구매 안한 카드 포함해서 보여주기
    if (isBuyCard) {setIsBuyCard(false)}
    // 구매 안한 카드 포함 전체 -> 구매카드만 보여주기
    else {setIsBuyCard(true)}
  }

  // 로딩 중
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 데이터 로딩이 완료되면
  useEffect(() => {
    setIsLoading(false);
  }, [dreamCardList]);


  useEffect(() => {
    if (arriveEnd) {
      getAxios();
      setArriveEnd(false);
    }
  }, [arriveEnd])

  // 내 프로필인지 확인
  useEffect(() => {
    if (params && userId === Number(params.userId)) {
      setIsMyProfile(true)
    }
  }, [userId, params])

  return (
    <>
    {/* 프로필 유저 === 본인 일치 시 버튼 보이도록 */}
    {/* 공개, 구매 버튼 */}
    {
      isMyProfile && 
      <ProfileCardButtonWrap>
        <Button 
        $follow 
        $nightPalePurple 
        $nightPalePurpleSelected={isShowAllCard}
        onClick={handleShowCard}
        >공개</Button>
        <Button 
        $follow 
        $nightPalePurple
        $nightPalePurpleSelected={isBuyCard}
        onClick={handleBuyCard}
        >구매</Button>
      </ProfileCardButtonWrap>
    }

    {/* 로딩 중일 때 로딩 메시지 표시 */}
    {isLoading && <div>Loading...</div>}

    {/* 데이터 로딩이 완료된 후에 꿈 카드를 표시 */}
    {!isLoading && 
      dreamCardList.length === 0
      ? <NoCardMsgWrap>
          <Text $nightWhite>{noCardMsg}</Text>
        </NoCardMsgWrap>
      : <ProfileDreamCardWrap>
          <InfiniteScroll
          setArriveEnd={setArriveEnd} 
          component={
            dreamCardList
            .filter((card) => (isShowAllCard ? card.isShow === "T" : true))
            .filter((card) => (isBuyCard ? card.purchase === true : true))
            .map((card, i) => (
              <Image $profileCard $nightImageBorder onClick={() => {if (isMyProfile) {navigate(`/night/dream/${card.dreamCardId}`)}}} key={i}>
                <img loading="lazy" src={card.dreamCardImageUrl} alt="dreamCard"></img>
              </Image>
            ))
            }
          > 
          </InfiniteScroll>
        </ProfileDreamCardWrap>    
    }
    </>
  )
}

export default NightProfileCardTab
