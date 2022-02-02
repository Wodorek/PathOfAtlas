import React from 'react'
import './App.css'
import CanvasTree from './Components/Canvas'
import Sidebar from './Components/Sidebar'
import { findShortestPath, disconnectedSearch, encodeBitList, parseBitList } from './utils'
import { skillList } from './tree'

interface AppState {
  toggles: boolean[]
  history: boolean[][]
  redoHistory: boolean[][]
}

const _history: boolean[][] = []
const _redoHistory: boolean[][] = []

class App extends React.Component<any, AppState> {
  state = {
    toggles: skillList.map((skill) => false),
    history: _history,
    redoHistory: _redoHistory
  }

  componentDidMount() {
    if (window.location.hash && window.location.hash.length > 1) {
      try {
        const bitList = window.location.hash.slice(1)
        this.setState({ toggles: parseBitList(bitList) })
      } catch (err) {
        console.log('failed to parse build', err)
      }
    }

    document.addEventListener('keydown', this.handleKeyPress)
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress)
  }

  setUrl(toggles: boolean[]) {
    window.history.replaceState(null, '', '#' + encodeBitList(toggles))
  }

  toggleIndex(index: number) {
    let toggles = [...this.state.toggles]
    if (!this.state.toggles[index]) {
      const minPath = findShortestPath(toggles, index)

      minPath.forEach((pathIndex: any) => {
        toggles[pathIndex] = true
      })
    } else {
      toggles[index] = !toggles[index]

      toggles = disconnectedSearch(toggles)
    }

    const history = [...this.state.history]
    history.push([...this.state.toggles])

    const redoHistory: boolean[][] = []

    // this.setUrl(toggles)
    this.setState({ toggles, history, redoHistory })
  }

  undo() {
    const history = [...this.state.history]
    const toggles = history.pop()

    if (toggles) {
      const redoHistory = [...this.state.redoHistory]
      redoHistory.push([...this.state.toggles])

      this.setUrl(toggles)
      this.setState({ toggles, history, redoHistory })
    }
  }

  redo() {
    const redoHistory = [...this.state.redoHistory]
    const toggles = redoHistory.pop()

    if (toggles) {
      const history = [...this.state.history]
      history.push([...this.state.toggles])

      this.setUrl(toggles)
      this.setState({ toggles, history, redoHistory })
    }
  }

  handleKeyPress = (event: any) => {
    if (event.ctrlKey && event.key === 'z') {
      this.undo()
    }
    if (event.ctrlKey && event.key === 'y') {
      this.redo()
    }
  }

  render() {
    return (
      <div className="App">
        <Sidebar toggles={this.state.toggles}></Sidebar>
        <CanvasTree toggles={this.state.toggles} toggleIndex={this.toggleIndex.bind(this)}></CanvasTree>
      </div>
    )
  }
}

export default App
