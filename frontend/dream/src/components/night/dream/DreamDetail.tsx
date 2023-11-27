// 리액트
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

// 컴포넌트
import DreamRecordContentsTab from "./DreamRecordContentsTab";
import NightFlipCard from "../nightcommon/NightFlipCard";
import tokenHttp from "api/tokenHttp";

// 스타일
import { ReverseCardType } from "../home/NightHomeItem";
import Button from "components/common/Button";
import Wrap from "style/Wrap";
import Text from "style/Text";
import Swal from "sweetalert2";

const DreamDetail = () => {
  const navigate = useNavigate();

  const [reverseCardData, setReverseCardData] = useState<ReverseCardType>()
  const [reviewStatus, setReviewStatus] = useState<string>("")
  
  // 꿈 카드 삭제
  const deleteDreamCard = () => {
    if (window.confirm("꿈 카드를 정말로 삭제하시겠습니까?")) {
      tokenHttp.delete(`/night/dream/${reverseCardData?.dreamCardId}`)
      .then((res) => {
        if (res.data.status === 200) {
          Swal.fire({
            icon: 'success',
            text: '삭제되었습니다.',
          })
          navigate(`/night/main`)
        } else if (res.data.status === 204) {
          Swal.fire({
            icon: 'warning',
            text: '존재하지 않는 꿈 카드입니다!',
          })
        }
      })
      .catch(err => console.log("꿈 카드 삭제 에러 : ", err))
    }}

    // 체크박스
    const [isChecked, setIsChecked] = useState<boolean>(false);
  
    // 체크박스 변화 감지
    const handleCheckboxChange = () => {
      const data = {dreamCardId: reverseCardData?.dreamCardId}
  
      tokenHttp.put(`/night/dream`, data)
      .then((res) => {
        console.log("공개 여부 변경 : ", res)
        const response = res.data
      
        if (response.status === 200) {
          setIsChecked(!isChecked);
        } else if (response.staus === 204) {
          console.log("공개 여부 변경 fail")
        }
  
      })
      .catch((err) => console.log("공개 여부 변경 에러 : ", err, isChecked))
    };
  
    // 초기 데이터가 공개 상태라면 체크박스 체크 상태로 하기
    useEffect(() => {
      reverseCardData?.isShow == "T" && setIsChecked(true)
    }, [reverseCardData, setReverseCardData])

  return (
    <>
      <NightFlipCard reverseCardData={reverseCardData}/>
      <DreamRecordContentsTab 
      setReverseCardData={setReverseCardData} 
      setReviewStatus={setReviewStatus}
      />
      <div style={{margin: "0 0.5rem"}}>
        <Wrap $nightBotButtonWrap $nightButtonCheckWrap>
          <div>
            <label className="container">
              <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange}/>
              <div className="checkmark"></div>
              <Text $nightWhite>공개</Text>
            </label>
          </div>
          <div>
            <Button 
            $nightPalePurple
            onClick={() => deleteDreamCard()}
            >삭제</Button>
            {
              reverseCardData?.dreamCardAuthor != reverseCardData?.dreamCardOwner
              ? reviewStatus === "F" &&
                <Button 
                $nightPurple 
                onClick={() => navigate(`/night/auction/bidding/review`)}>리뷰</Button>
              : <Button 
                $nightPurple
                onClick={() => navigate(`/night/auction/detail/${reverseCardData?.dreamCardId}/create`)}
                >경매</Button>
            }
            
          </div>
        </Wrap>
      </div>
    </>
  )
}

export default DreamDetail
