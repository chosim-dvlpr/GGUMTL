
// 인증 생성
// TitleBox -> 챌린지 제목
// WideTextInput -> 내용 입력  

// 업로드 버튼 클릭 전
// LongButton -> 사진 업로드 버튼


// 업로드 버튼 클릭 후

// 중간 과정 -> 파일 업로드 화면

// MainImage
// LongButton :완료

// 리액트
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router";

// 컴포넌트
import Button from "components/common/Button";
import Container from "style/Container";
import tokenHttp from "api/tokenHttp";
import { ChalDetailDataType, ChalDetailInfoProps } from "../ChalDetail";
import { Box } from "style/Box";
import TextArea from "style/TextArea";
import { checkCertInput } from "utils/alert/checkInput";
import Image from "style/Image";
import { RiImageAddLine } from "react-icons/ri";
import basicHttp from "api/basicHttp";
import fileTokenHttp from "api/fileTokenHttp";
import Swal from "sweetalert2";

// 스타일


// 타입



// 챌린지 디테일 초기값
const initialChalDetail: ChalDetailInfoProps = {
  chalDetailData: {
    challengeContent: '',
    challengeId: 0,
    challengeTitle: '',
    keyword: '',
    participationCount: 0,
    badgeUrl: '',
    period: '',
    ranking: [
      {
        ranking: 0,
        nickName: '',
      },
    ]
  },
}

const ChalCreateCert = () => {

  const navigate = useNavigate()
  const params = useParams()
  const currentChallengeId = Number(params.challengeId)
  const [chalData, setChalData] = useState<ChalDetailDataType>(initialChalDetail.chalDetailData)
  const [challengeContent, setChallengeContent] = useState<string>('')
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [profileImageURL, setProfileImageURL] = useState<string | undefined>(undefined)
  const [ imageFile, setImageFile ] = useState<File|null>(null) 


  useEffect(() => {
    // 렌더링되었을 때 참여
    tokenHttp.get(`/day/challenge/item/${currentChallengeId}`)
      .then((response) => {
        const res = response.data.data
        setChalData(res.detail)
        console.log(chalData)
        // 성취도 계산

        // 현재 시작 후 몇일인지 계산

      })
      .catch((e) => { console.log(e) })
  }, [])

  // useRef를 이용해서 input 태그에 접근
  const imageInput = useRef<HTMLInputElement | null>(null);
  const imageInputClick = () => {
    imageInput.current?.click()
  }
  // 이미지 미리보기 
  const imageUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();

    // 파일이 없으면 리턴
    if (!e.target.files) { return }
    // 파일이 있으면 타겟 파일 변수 설정
    const file = e.target.files[0]
    setImageFile(file)
  
    if (file) {
      let image = window.URL.createObjectURL(file)
      setProfileImageURL(image)
      setProfileImage(file);
      // console.log(image,'image')
      console.log(file, 'file')
    }
  }

  const checkContent = (inputData: string): void => {
    setChallengeContent(inputData)
    // 공백만 들어있거나 특수문자 들어있음
    if (inputData != '' && !checkCertInput(inputData)) {
      Swal.fire({
        icon: 'warning',
        text: '내용에 공백만 들어갔습니다.',
      })
    }
  }

  const createCert = () => {
    const axiosData = new FormData()
    const axiosJsonData = {
      "challengeId" : currentChallengeId,
      "challengeDetailTitle" : '',
      "challengeDetailContent" : challengeContent,
    }

    if (imageFile){
      axiosData.append('file', imageFile)
    }
    axiosData.append(
      "challengeDetail", 
      new Blob([JSON.stringify(axiosJsonData)], {type: 'application/json'})
    )
    console.log(axiosData)

    fileTokenHttp.post('/s3/challenge/detail/new', axiosData)
      .then((response) => {
        console.log("인증 글 생성 완료",response)
        navigate(`/day/mychallenge/${currentChallengeId}`)
      })
      .catch((err)=>{console.log("인증글 생성 에러",err)})
  }

  return (
    <Container $dayBaseContainer $certCreate>
      <Box $mainTitleBox>
        {/* 뱃지 이미지 아직 안됨 */}
        <img loading="lazy" src={`${chalData?.badgeUrl}`}></img>
        {chalData?.challengeTitle}
      </Box>

      {profileImageURL ? (
        <Image $certImage>
          <img 
            loading="lazy"
            src={profileImageURL}
            onClick={imageInputClick}
          />
        </Image>
      ) : (
        <Image $certImage 
          onClick={imageInputClick}
        >
          <RiImageAddLine />
        </Image>
      )}

      <TextArea
        $chalDetailValue
        placeholder="오늘의 인증 글"
        onBlur={(e) => {
          checkContent(e.target.value)
        }}
      ></TextArea>


      <Button
        $fullWidth
        $dayBlue
        style={{ color: 'black' }}
        onClick={() => {createCert()}}
      >완료</Button>

      <input
        type="file"
        accept="image/*"
        style={{ display: 'none' }} // 화면에서 안보이게, 하지만 ref를 통해 기능은 가져감
        ref={imageInput}
        onChange={imageUpload}
      ></input>
    </Container>
  )
}

export default ChalCreateCert