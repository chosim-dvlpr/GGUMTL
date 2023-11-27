// 로고이미지

// 낮의꿈 꾸러가기
{/* =>  <DayHomePage/> */}

// 밤의꿈 꾸러가기
{/* => <NightHomePage/> */}

import basicHttp from "api/basicHttp";
import tokenHttp from "api/tokenHttp";
import Button from "components/common/Button";
import React, {useEffect} from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import store from "store";
import userdataReducer, { UserdataType, getCurrentUserdata } from "store/userdataReducer";

import styled from "styled-components";

const SunsetMainContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12rem;
`

const StartIcon = styled.div`
  width: 10rem;
  height: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  
  &:active {
    background-color: rgba(184, 184, 184, 0.2);
  }
  
  & > img {
    width: 6rem;
    height: 6rem;
  }
`;



const SunsetMain = () => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //유저 로그인 정보 리덕스에 저장
  useEffect(()=>{
    tokenHttp.get('/user')
      .then((response)=> {
        console.log(response.data.data)
        dispatch(getCurrentUserdata(response.data.data))
      })  
      .catch((e)=>{console.log(e)})
  },[])

  return (
    <SunsetMainContainer>
      <StartIcon onClick={()=>{navigate('/day/main')}}>
        <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/icon/sun.png`}></img>
        <p>낮 꿈 꾸러가기</p>
      </StartIcon>
      <StartIcon onClick={()=>{navigate('/night/main')}}>
        <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/icon/moon.png`}></img>
        <p>밤 꿈 꾸러가기</p>
      </StartIcon>
    {/* <Button >낮 아이콘</Button>
    <Button >밤 아이콘</Button> */}
    </SunsetMainContainer>
  )
}

export default SunsetMain