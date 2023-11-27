// 리액트
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "store";
import { useParams } from "react-router-dom";

// 컴포넌트
import ProfileHeader from "components/common/ProfileHeader";
import NightProfileCardTab from "./NightProfileCardTab";
import NightProfileSellingTab from "./NightProfileSellingTab";
import NightProfileBuyingTab from "./NightProfileBuyingTab";

// 스타일
import styled, {css} from "styled-components";
import Text from "style/Text";

const DreamTabWrap = styled.div`
  display: flex;
  justify-content: space-evenly;
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
      color: #FFFFFF;
    `
  }
`

export interface TabStyleType {
  $isActive ?: boolean
}


const NightProfileMain = () => {
  const params = useParams();
  const userdata = useSelector((state: RootState) => state.auth.userdata);
  const [isMyProfile, setIsMyProfile] = useState<boolean>(false);

  // 유저 확인
  useEffect(() => {
    if (Number(params.userId) === userdata?.userId) {setIsMyProfile(true)} 
    else {setIsMyProfile(false)}
  }, [])

  // 탭 3개
  const [isCardTab, setIsCardTab] = useState(true);
  const [isBuyingTab, setIsBuyingTab] = useState(false);
  const [isdSellingTab, setIsdSellingTab] = useState(false);

  // 뱃지 탭 보여주기
  const showCardTab = () => {
    setIsCardTab(true);
    setIsBuyingTab(false);
    setIsdSellingTab(false);
  };

  // 진행 중 탭 보여주기
  const showBuyingTab = () => {
    setIsCardTab(false);
    setIsBuyingTab(true);
    setIsdSellingTab(false);
  };

  // 완료 탭 보여주기
  const showdSellingTab = () => {
    setIsCardTab(false);
    setIsBuyingTab(false);
    setIsdSellingTab(true);
  };

  return (
    <>
    <ProfileHeader />

    <DreamTabWrap>
      <CustomText 
      onClick={showCardTab}
      $isActive={isCardTab}
      >카드</CustomText>
      
      {
        isMyProfile &&
        <CustomText 
        onClick={showBuyingTab}
        $isActive={isBuyingTab}
        >꿈 받기</CustomText>
      }

      <CustomText 
      onClick={showdSellingTab}
      $isActive={isdSellingTab}
      >꿈 주기</CustomText>
    </DreamTabWrap>
    <TabLine/>

    { isCardTab && <NightProfileCardTab />}
    
    {/* 유저 확인 필요 */}
    { isBuyingTab && <NightProfileBuyingTab />}

    { isdSellingTab && <NightProfileSellingTab />}

    </>
  )
}

export default NightProfileMain