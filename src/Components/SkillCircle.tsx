import React from 'react'
import { Circle } from 'react-konva'

interface SkillCircleProps {
  x: number
  y: number
  name: string
  value: string
  toggled: boolean
  onClick: any
  setHover: any
  index: number
}

class SkillCircle extends React.Component<SkillCircleProps> {
  render() {
    return (
      <Circle
        x={this.props.x}
        y={this.props.y}
        width={30}
        height={30}
        fill={this.props.toggled ? 'yellow' : 'black'}
        opacity={this.props.toggled ? 0.1 : 0}
        shadowBlur={5}
        onClick={this.props.onClick}
        onMouseEnter={(e: any) => {
          console.log('index hover', this.props.index)
          // style stage container:
          const container = e.target.getStage().container()
          container.style.cursor = 'pointer'

          this.props.setHover(this.props.index)
        }}
        onMouseLeave={(e: any) => {
          const container = e.target.getStage().container()
          container.style.cursor = 'default'

          this.props.setHover(null)
        }}
      />
    )
  }
}

export default SkillCircle
