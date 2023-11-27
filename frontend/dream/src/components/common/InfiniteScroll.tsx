// 리액트
import React, { Dispatch, SetStateAction, useCallback, useEffect } from "react";

// 스타일
export interface DayChallengeObjType {
  title :string,
  period :string,
  challengeId :number
}

export interface DayChallengeListType extends Array<DayChallengeObjType> {}

export interface InfiniteScrollProps {
  children ?: any,
  setArriveEnd :Dispatch<SetStateAction<boolean>>,
  component :any,
} 


const InfiniteScroll = ({
  setArriveEnd, 
  component
} :InfiniteScrollProps) => {
  
  const handleScroll = useCallback((): void => {
    const { innerHeight } = window;
    // 브라우저창 내용의 크기 (스크롤을 포함하지 않음)
    
    const { scrollHeight } = document.body;
    // 브라우저 총 내용의 크기 (스크롤을 포함한다)
    
    const scrollTop :any = document.documentElement.children[1].scrollTop;
    // 현재 스크롤바의 위치 (스크롤에 따라 변함)

    
    if (Math.round(scrollTop + innerHeight) >= scrollHeight*0.9 ) {
      setArriveEnd(true);
    } else {setArriveEnd(false)}
  }, []);
  
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, true);
    // 스크롤이 발생할때마다 handleScroll 함수를 호출하도록 추가
    
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      // 해당 컴포넌트가 언마운트 될때, 스크롤 이벤트를 제거
    };
  }, [handleScroll]);



  return (
    <>
      {component}
    </>
  )
}

export default InfiniteScroll