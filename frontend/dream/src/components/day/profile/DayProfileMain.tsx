// 리액트
import React, { useState } from "react";

// 컴포넌트
import ProfileHeader from "components/common/ProfileHeader";
import DayProfileBadgeTab from "./DayProfileBadgeTab";
import DayProfileOngoingTab from "./DayProfileOngoingTab";
import DayProfileCompleteTab from "./DayProfileCompleteTab";

// 스타일
import styled, {css} from "styled-components";
import Text from "style/Text";

const DreamTabWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  margin: inherit;
  & > div {
    text-align: center;
  }
`
const TabLine = styled.hr`
  border: 1px solid #D9D9D9;
  opacity: 0.5;
  margin: 0.25rem 1rem;
  margin-bottom: 1rem;
`

const CustomText = styled(Text)<TabStyleType>`  
  color: #999999;
  ${(props) => props.$isActive && 
    css`
      color: #FFE177;
    `
  }
`

export interface TabStyleType {
  $isActive ?: boolean
}


const DayProfileMain = () => {
  // 탭 3개
  const [isBadgeTab, setIsBadgeTab] = useState(true);
  const [isOngoingTab, setIsOngoingTab] = useState(false);
  const [isCompleteTab, setIsCompleteTab] = useState(false);

  // 뱃지 탭 보여주기
  const show1BadgeTab = () => {
    setIsBadgeTab(true);
    setIsOngoingTab(false);
    setIsCompleteTab(false);
  };

  // 진행 중 탭 보여주기
  const showOngoingTab = () => {
    setIsBadgeTab(false);
    setIsOngoingTab(true);
    setIsCompleteTab(false);
  };

  // 완료 탭 보여주기
  const showCompleteTab = () => {
    setIsBadgeTab(false);
    setIsOngoingTab(false);
    setIsCompleteTab(true);
  };

  return (
    <>
    <ProfileHeader/>

    <DreamTabWrap>
      <CustomText 
      onClick={show1BadgeTab}
      $isActive={isBadgeTab}
      >뱃지</CustomText>
      <CustomText 
      onClick={showOngoingTab}
      $isActive={isOngoingTab}
      >진행 중</CustomText>
      <CustomText 
      onClick={showCompleteTab}
      $isActive={isCompleteTab}
      >완료</CustomText>
    </DreamTabWrap>
    <TabLine/>

    { isBadgeTab && <DayProfileBadgeTab />}
    { isOngoingTab && <DayProfileOngoingTab />}
    { isCompleteTab && <DayProfileCompleteTab />}
    
    </>
  )
}

export default DayProfileMain