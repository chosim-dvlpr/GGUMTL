import React from "react"
import styled from "styled-components"

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85vh;
  /* width: 30%; */
`

const Loading = () => {
  return (
    <>
    <LoadingContainer>
      <img loading="lazy" src={process.env.PUBLIC_URL + "/image/loadingFin.gif"} />
      {/* <div>기다려주세요...!</div> */}
    </LoadingContainer>
    </>
  )
}

export default Loading