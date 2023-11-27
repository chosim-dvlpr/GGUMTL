// 리액트
import React, { useState, useEffect } from "react";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import DayStoryDetail from "./DayStoryDetail";
import InfiniteScrollHorizon from "components/common/InfiniteScrollHorizon";

// 스타일
import Image from "style/Image";

export interface StoryDataObjType {
  challengeDetailId :number,
  imageUrl :string,
  nickname :string,
  userId :number,
}

export interface StoryDataListType extends Array<StoryDataObjType> {}


const DayStoryList = () => {
  const [storyDataList, setStoryDataList] = useState<StoryDataListType>([]);
  const [lastItemId, setLastItemId] = useState<number>(0);
  const [hasNext, setHasNext] = useState<boolean>(true); 
  let size = 8;

  // infinite scroll
  const [arriveEnd, setArriveEnd] = useState<boolean>(true);

  const getAxios = () => {
    let apiAddress :string = "";

    if (lastItemId === 0) {apiAddress = `/day/challenge/story/user-list?size=${size}`}
    else {apiAddress = `/day/challenge/story/user-list?lastItemId=${lastItemId}&size=${size}`}

    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res) => {        
        if (res.status === 200) {
          const response = res.data.data
          const resultList = response.resultList
          setStoryDataList([...storyDataList, ...resultList]);
          setLastItemId(resultList[resultList.length - 1]?.challengeDetailId);
          setHasNext(response.hasNext);
        }})
        .catch((err) => console.log("DayStoryList : ", err))  
    }
  };

  useEffect(() => {
    getAxios();
  }, []);


  useEffect(() => {
    if (arriveEnd) {
      getAxios();
      setArriveEnd(false);
    }
  }, [arriveEnd])

  // 스토리 모달 띄우기
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [showUserId, setShowUserId] = useState<number>(0);

  const showStoryModal = (userId :number) => {
    setIsOpenModal(true);
    setShowUserId(userId)
    console.log("유저 프로필 클릭");
  }

  return (
    <>
    {
      isOpenModal && 
      <DayStoryDetail 
        setIsOpenModal={setIsOpenModal} 
        isOpenModal={isOpenModal}
        userId={showUserId}
        ></DayStoryDetail>
    }
    <div style={{display: "-webkit-box", overflowX: "scroll"}}>

      <InfiniteScrollHorizon
      setArriveEnd={setArriveEnd} 
      component={
        storyDataList?.map((data :StoryDataObjType, key :number) => (
        <Image
          $smallProfileImage
          key={key}
          onClick={() => showStoryModal(data.userId)}
          >
            <img loading="lazy" src={data.imageUrl} />
          </Image>
        ))
      }
      >
      </InfiniteScrollHorizon>
    </div>
    </>
  )
}

export default DayStoryList