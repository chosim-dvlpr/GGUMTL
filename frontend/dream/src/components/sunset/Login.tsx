// 로고 이미지

// 카카오로그인버튼
// 구글로그인
// 최초 로그인:  -> <SignUpPage/>
// 기존 회원: ->  <SunsetMainPage/>

import React from 'react'
import styled from 'styled-components'

// 스타일
import Button from 'components/common/Button'
import axios from 'axios'
import basicHttp from 'api/basicHttp'
import Image from 'style/Image'
import Text from 'style/Text'

const LoginContainer = styled.div`
  width: 80%;
  margin: auto;
  margin-top: 8rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

// 로그인 함수

const Login = () => {
  const openKakaoLogin = () => {
    const KakaoLoginAPI = 'https://j9b301.p.ssafy.io/oauth2/authorization/kakao'

    window.location.href = KakaoLoginAPI
  }

  return (
    <>
      <LoginContainer>
        <Image $SunsetLogo>
          <img loading="lazy" src={`${process.env.PUBLIC_URL}/logo512.png`}></img>
        </Image>
        <Text $SunsetText>함께 꿈을 꾸러갈까요?</Text>
        <Button
          $fullWidth
          $kakao
          onClick={() => {
            openKakaoLogin()
          }}
        >
          Login with Kakao
        </Button>
      </LoginContainer>
    </>
  )
}

export default Login
