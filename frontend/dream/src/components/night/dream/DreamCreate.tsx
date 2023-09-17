// 음성 LongButton
// WideTextInput
// 공개 // 버튼 2개

// 리액트
import React, { useState } from "react";

// 컴포넌트

// 스타일
import Button from "components/common/Button";
import TextArea from "style/TextArea";
import styled from "styled-components";
import { IoMicOutline } from "react-icons/io5"

const DreamCreateContainer = styled.div`
  margin: 6rem 0.5rem;
`;

const IconRecord = styled(IoMicOutline)`
  width: 2rem;
  height: 2rem;
`


let recognition: any = null
if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true
  recognition.lang = "ko-KR"
}

const DreamCreate = () => {
  const [recordStart, setRecordStart] = useState(false); // 녹음 시작
  const [recordEnd, setRecordEnd] = useState(false); // 녹음 종료

  return (
    <>
    <DreamCreateContainer>
      <Button
      $fullWidth
      $nightVoice
      onClick={() => console.log('클릭')}
      >
        <IconRecord/>
      </Button>
      <TextArea
      $nightDreamInput
      />

      <div
      style={{
        display: "flex", 
        justifyContent: "space-between", 
        padding: "0 1rem"
      }}
      >
        <div>
          {/* 임시 체크박스 */}
          <input
          type="checkbox"
          />
          공개
        </div>

        <div>
          <Button
          $nightMiddlePurple
          >
          취소
          </Button>
          <Button
          $nightPurple
          >
          등록
          </Button>
        </div>
      </div>
    </DreamCreateContainer>
    </>
  )
}

export default DreamCreate