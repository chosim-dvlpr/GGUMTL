// 리액트
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

// 외부
import dataHttp from "api/dataHttp";
import { RootState } from "store";

// 컴포넌트
import SoundToText from "./SoundToText";
import Loading from "components/loading/Loading";

// 스타일
import Button from "components/common/Button";
import TextArea from "style/TextArea";
import styled from "styled-components";
import { IoMicOutline, IoMicSharp } from "react-icons/io5"
import Wrap from "style/Wrap";
import "components/night/dream/DreamCreate.css"
import Text from "style/Text";


const DreamCreateContainer = styled.div`
  margin: 1.5rem 0.5rem;
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

interface DreamTextAreaWrapperProps {
  height :number;
} 

const DreamTextAreaWrapper = styled.div<DreamTextAreaWrapperProps>`
  width: 100%;
  height: calc(${props => props.height/16 > 22 ? props.height/16 : 22}rem);
  margin-bottom: 2rem;
  transition: height 0.3s ease;
`;

const IconRecord = styled(IoMicOutline)`
  width: 2rem;
  height: 2rem;
`

const IconRecording = styled(IoMicSharp)`
  width: 2rem;
  height: 2rem;
`

const DreamCreate = () => {
  const navigate = useNavigate()
  const [recordStart, setRecordStart] = useState<boolean>(false); // 녹음 시작
  const [allText, setAllText] = useState<string>(""); // 입력본 + 녹음본 모두 합친 것
  const { startListening, stopListening, accenting, setAccentText, accentText } = SoundToText();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const userId = useSelector((state:RootState) => state.auth.userdata.userId)

  // 로당
  const [isLoading, setIsLoading] = useState<boolean>(false)

  
  // 녹음 시작 & 종료
  useEffect(() => {
    if (recordStart) {
      startListening();
    } else {
      stopListening();
    }
  }, [setRecordStart, recordStart]);
  
  // 변환된 텍스트 저장
  useEffect(() => {
    if (accentText) {
      setAllText(allText + " " + accentText); // 기존 입력된 값과 합치기
    }
  }, [setAccentText, accentText])
  
  // 체크박스 변화 감지
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  // allText: 보낼 데이터
  // isChecked가 공개 여부
  const sendDreamToPython = () => {
    const dreamCardAuthor:number = userId
    const isShow = isChecked ? "T" : "F"
    const dreamCardContent = allText
    const data = {dreamCardAuthor, isShow, dreamCardContent}
    setIsLoading(true)
    
    dataHttp.post("/night/dream/create", data)
    .then(res => {
      navigate(`/night/dream/${res.data}`)
    })
    .catch(err => {
      console.log(err)
      setIsLoading(false)
    })
  }

  // TextArea 높이 감지
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0);

  useEffect(() => {
    setTextAreaHeight(window.document.querySelector('#textarea')?.scrollHeight ?? 0)
  }, [allText])

  return (
    <>
    {isLoading && <Loading/>}
      <DreamCreateContainer>
      { !isLoading &&
        <>
 
          <Button
          $fullWidth
          $nightVoice
          onClick={() => {
            console.log('클릭');
            setRecordStart(!recordStart); // 녹음 시작, 종료
            accenting(); // 텍스트로 변환
          }}
          $isRecording={recordStart}
          >
            {
              recordStart
              ? <IconRecording/>
              : <IconRecord/>
            }
            
          </Button>
          <DreamTextAreaWrapper height={textAreaHeight}>
            <TextArea
            $nightDreamInput
            id="textarea"
            value={allText}
            onChange={(e) => setAllText(e.target.value)}
            />
          </DreamTextAreaWrapper>

          <Wrap $nightBotButtonWrap $nightButtonCheckWrap>
            <div>
              <label className="container">
                <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
                <div className="checkmark"></div>
                <Text $nightWhite>공개</Text>
              </label>
            </div>
            <div>
              <Button $nightPalePurple onClick={() => navigate(`/night/main`)}>취소</Button>
              <Button 
              $nightPurple
              onClick={sendDreamToPython}
              >등록</Button>
            </div>
          </Wrap>
        </>
      }
      </DreamCreateContainer>
    </>
  )
}

export default DreamCreate