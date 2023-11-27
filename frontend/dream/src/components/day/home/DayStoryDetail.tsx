// 리액트
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

// 컴포넌트
import tokenHttp from "api/tokenHttp";
import Wrap from "style/Wrap";

// 스타일
import { AiOutlineClose } from "react-icons/ai";
import Text from "style/Text";
import { Box } from "style/Box";
import Image from "style/Image";
import styled from "styled-components";

export interface DayStoryDetailProps {
  setIsOpenModal :Dispatch<SetStateAction<boolean>>,
  isOpenModal :boolean,
  userId :number,
}

interface StoryType {
  challengeDetailContent :string,
  challengeDetailId :number,
  challengeTitle :string,
  nickName :string,
  photoUrl :string,
}

interface StoryBarProps {
  storylength :number,
  currentindex :number,
  index :number,
}

const StoryBar = styled.div<StoryBarProps>`
  width: calc(${props => 100/props.storylength*(props.currentindex+1)}%);
  height: 0.4rem;
  background-color: ${props =>
    props.currentindex >= props.index ? "#3D5665" : "#E4E8E7"};
  border-radius: 1rem;
  border: 1px solid #3D5665;
  `


const DayStoryDetail = ({setIsOpenModal, isOpenModal, userId} :DayStoryDetailProps) => {
  const [storyList, setStoryList] = useState<StoryType[]>([]);
  
  const handleIsOpenModal = () => {
    setIsOpenModal(false);
    setCurrentIndex(0); // 스토리 인덱스 초기화
    console.log("모달 닫기");
  }

  useEffect(() => {
      tokenHttp.get(`/day/challange/story/${userId}`)
      .then((res) => {
        console.log(res);
        if (res.data.status === 200) {
          setStoryList(res.data.data);
        }
        // 팔로우한 유저가 올린 글이 없을 때
        if (res.data.status === 400) {
        }
      })
      .catch(err => console.log(err))
    
  }, [])


  // 인덱스로 제어
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  let interval = 3000;

  // 스토리 입장 -> n초 대기 -> 다음 화면 넘어가기
  // 입장 후 n초 대기 -> 기준time 0으로 초기화 -> handleOnNext 실행
  // 다음 클릭 -> handleOnNext 실행 -> n초 대기 -> handleOnNext 실행
  // 이전 클릭 -> handleOnPrevious 실행 -> n초 대기 -> handleOnNext 실행
  
  const nextTime = (callback :() => void, time :number) => {
    setTimeout(callback, time);
  };

  // 스토리 시작 시 실행
  const storyStart = () :NodeJS.Timeout | undefined => {
    let timerId: NodeJS.Timeout | undefined = undefined;
    if (isOpenModal) {
      timerId = setTimeout(() => {
        console.log('시작');
        setCurrentIndex(1);
      }, interval);
    }
    return timerId;
  }

  // 일정시간 후 다음 페이지로 이동
  const goToNextInterval = (): void => {
    nextTime(() => {
      console.log('다음');
      if (isOpenModal && currentIndex + 1 < storyList.length) {
        setCurrentIndex(currentIndex+1);
      } else {handleIsOpenModal()}
      }, interval);
  }

  // 다음 페이지로 이동 (클릭)
  const handleOnNext = () => {
    endTimer();
    if (currentIndex + 1 >= storyList.length) {
      handleIsOpenModal();
      return
    }
    setCurrentIndex(currentIndex + 1);
  }

  // 이전 페이지로 이동 (클릭)
  const handleOnPrevious = () => {
    if (currentIndex - 1 < 0) return;
    endTimer();
    setCurrentIndex(currentIndex - 1);
    console.log('이전');
  }

  const endTimer = () => {
    const timerId = storyStart(); // 타이머 ID를 저장
    if (timerId) {
      clearTimeout(timerId); // 현재 실행 중인 타이머를 종료
    }
  }

  // 인덱스가 리스트 길이보다 작고 모달이 띄워져있을 때 실행
  useEffect(() => {
    if (currentIndex < storyList.length && isOpenModal) {
      goToNextInterval();
    };
  }, [currentIndex, isOpenModal])

  // 스토리 시작 시 setTimeOut
  useEffect(() => {
    if (isOpenModal) {
      storyStart();
    }
  }, [storyList])

  
  return (
    <>
    {
      currentIndex < storyList.length &&
      currentIndex > -1 &&
      <Wrap $storyWrap>
        {/* 닫기 버튼 */}
        <AiOutlineClose
        onClick={handleIsOpenModal}
        className="closeButton"
        style={{position: "fixed", top: "1.5rem", right: "1rem", width: "1.5rem", height: "1.5rem", zIndex: 1, color: "white"}}  
        ></AiOutlineClose>

        {
          <div className="story">
            {/* 클릭 영역 */}
            <div
            className="storyRight"
            onClick={handleOnNext}
            ></div>
            <div
            className="storyLeft"
            onClick={handleOnPrevious}
            ></div>

            {/* 상단바 */}
            <div className="storyBarBox">
              {storyList.map((element, i) => (
                  <StoryBar 
                  key={i} 
                  storylength={storyList.length}
                  currentindex={currentIndex}
                  index={i}
                  ></StoryBar>
              ))}
            </div>

            {/* 컨텐츠 영역 */}
            {/* 헤더 */}
            <div className="header">
              <Box $mainTitleBox $day>
                <Text>{storyList[currentIndex].challengeTitle}</Text>
              </Box>
            </div>
              <Image $mainImage $nightImageBorder>
                <img loading="lazy" src={storyList[currentIndex].photoUrl} />
              </Image>
              <Text>{storyList[currentIndex].nickName}</Text>
              <Box $challengeContentBox
              style={{padding: "1.5rem"}}
              >
                {storyList[currentIndex].challengeDetailContent}
              </Box>
          </div>
          }
      </Wrap>
      }
    </>
  )
}

export default DayStoryDetail
