import React, { Component } from 'react'

class ListItem extends Component {
  render () {
    const fontColor = this.props.selected ? 'red' : 'black'
    const itemValue = { listName: this.props.listName, id: this.props.id }
    return (
      <span onClick={() => this.props.onItemClick(itemValue)} style={{ color: fontColor }}>
        <strong>{this.props.value}</strong>
      </span>
    )
  }
}
export default ListItem
