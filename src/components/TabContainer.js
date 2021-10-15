import React, { useState } from 'react'

export function TabItem({ title = '', children = <></>, ...props }) {
  return children
}

export function TabButtons({
  data = [],
  selected = 0,
  setSelected = () => { },
  ...props
}) {
  return (
    <div>
      <div className="tab-buttons">
        {(data ?? [])?.map((title, titleIndex) => {
          const isActive = Boolean(titleIndex === selected)
          return (
            <div
              key={titleIndex}
              onClick={() => setSelected(titleIndex)}
              className={
                'tab-button ' + (Boolean(isActive) ? 'active' : 'disable')
              }
            >
              <span>{title}</span>
            </div>
          )
        })}
      </div>
      <div className="tab-line" />
    </div>
  )
}

export function TabContent({ data = [], selected = 0, ...props }) {
  return (
    <div className="tab-contents">
      {(data ?? [])?.map((item, itemIndex) => {
        const isActive = itemIndex === selected
        return (
          isActive && (
            // <Slide key={itemIndex} in={isActive}>
            <div key={itemIndex} className="tab-content">
              {item}
            </div>
            // </Slide>
          )
        )
      })}
    </div>
  )
}

export default function TabContainer({ children = <></>, ...props }) {
  const items = Array.isArray(children) ? children : [children]
  const titles = items.map((item) => item?.props?.title ?? '')

  const [selected, setSelected] = useState(0)

  return (
    <div className="tab-container">
      <TabButtons data={titles} selected={selected} setSelected={setSelected} />
      <TabContent data={items} selected={selected} />
    </div>
  )
}
