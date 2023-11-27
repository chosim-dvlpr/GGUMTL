import Button from "components/common/Button";
import React, {useEffect, useState} from "react";
import { useNavigate } from "react-router";
import styled from "styled-components";

const NotFound = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding:0;
  overflow-y: hidden;
  
  & > img {
    height: 100vh;
    position: fixed;
    top:0;
    z-index: 10;
  }
`
const GoButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 7.5rem;
  z-index: 20;
  position: fixed;
  top:26rem;
  background-color: aliceblue;
`

const NotFoundPage = () => {

  const navigate = useNavigate()

  return (
    <>
    <NotFound>
      <img loading="lazy" src={`${process.env.PUBLIC_URL}/image/404page/404page.gif`}></img>   
      <GoButton>
        <Button 
          $goHomeButton
          onClick={()=>{navigate('/')}}
        >
          로그인 하러 가기
        </Button>
      </GoButton>
    </NotFound>
    </>
  )
}

export default NotFoundPage