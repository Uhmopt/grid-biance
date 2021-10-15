import defaultAvatar from 'assets/img/avatar-default.svg'
import React from 'react'
import { ReactSVG } from 'react-svg'

export function AvatarCard({ data = {}, ...props }) {
  return (
    <div
      className="avatar-card"
      color={data?.color}
      style={{ backgroundColor: data?.color }}
    >
      <div>&nbsp;</div>
      <ReactSVG className="avatar" src={defaultAvatar} />
      <div className="avatar-card-footer">
        <span>
          {data?.value || 0} <span>BNB</span>
        </span>
      </div>
    </div>
  )
}

export default function AvatarGrid({ data = [], ...props }) {
  return (
    <div className="avatar-list-container">
      <div className="avatar-list">
        {(data ?? [])?.map((item, itemIndex) => {
          return <AvatarCard data={item} key={itemIndex} />
        })}
      </div>
    </div>
  )
}
