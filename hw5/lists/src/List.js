import React, { Component } from 'react'
import ListItem from './ListItem.js'
import AddItem from './AddItem.js'
import { v4 as uuidv4 } from 'uuid'

class List extends Component {
  render () {
    var name = this.props.name
    var items = this.props.items // array of objects {id, value, selected}
    if (items) {
      return (
        <div id={name}>
          <h3>{name} List</h3>
          <ul>
            {items.map(({ id, value, selected }) => {
              return (
                <li key={uuidv4()}>
                  <ListItem value={value} id={id} listName={name} selected={selected} onItemClick={this.props.onItemClick} />
                </li>
              )
            })}
          </ul>
          <AddItem idName={name} onAddItem={this.props.onAddItem} />
        </div>
      )
    }
    return (
      <div id={name}>
        <h3>{name} List</h3>
        <AddItem idName={name} onAddItem={this.props.onAddItem} />
      </div>
    )
  }
}

export default List
