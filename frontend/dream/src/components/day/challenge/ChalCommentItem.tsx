// 댓글 아이템

// CircleImage :댓글프로필
// 닉네임
// 댓글 콘텐츠

// 리액트
import React from 'react'

// 컴포넌트

// 스타일
import styled from 'styled-components'
import Text from 'style/Text'
import Image from 'style/Image'
import Wrap from 'style/Wrap'
import { ChalCommentAxiosType } from './ChalCommentList'

interface CommentItemTypeProps {
  commentData: ChalCommentAxiosType
}

const ChalCommentItem = ({ commentData }: CommentItemTypeProps) => {
  return (
    <>
      <Wrap $commentWrap>
        <Image $tinyProfileImage>
          <img loading="lazy" src={commentData.profileImageUrl}></img>
        </Image>
        <div className="contentarea">
          <Text $black $isBold>
            {commentData.nickname}
          </Text>
          <Text $black>{commentData.content}</Text>
        </div>
      </Wrap>
    </>
  )
}

export default ChalCommentItem
