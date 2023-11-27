
// .map
// CircleImage (프로필 이미지)
// onClick할 때 스토리로 가기. ~ Router {/* <DayStoryDetailPage></DayStoryDetailPage> */}

// 리액트
import React, { useState, useEffect } from "react";
import tokenHttp from "api/tokenHttp";

// 컴포넌트
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
  const [lastItemId, setLastItemId] = useState<number>(0); // 마지막 아이템 번호
  const [hasNext, setHasNext] = useState<boolean>(true); 
  let size = 8;

  // infinite scroll
  const [arriveEnd, setArriveEnd] = useState<boolean>(true); // 바닥에 다다름을 알려주는 변수

  // axios 연결 - 팔로우 유저 목록 조회
  const getAxios = () => {
    let apiAddress :string = "";

    // 처음 요청
    if (lastItemId === 0) {apiAddress = `/day/challenge/story/user-list?size=${size}`}
    // 두번째부터 요청
    else {apiAddress = `/day/challenge/story/user-list?lastItemId=${lastItemId}&size=${size}`}
    if (arriveEnd && hasNext) {
      tokenHttp.get(apiAddress)
      .then((res) => {
        console.log("스토리 리스트 : ", res)
        
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
      // lastItemId={lastItemId}
      component={
        storyDataList?.map((data :StoryDataObjType, key :number) => (
        <Image
          $smallProfileImage
          key={key}
          onClick={() => showStoryModal(data.userId)}
          >
            <img loading="lazy" src={data.imageUrl}></img>
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