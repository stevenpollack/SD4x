import React, { Component } from 'react'
import List from './List.js'

class Lists extends Component {
  render () {
    // If there are no lists, display a relevant message
    if (Object.keys(this.props.lists).length === 0) {
      return (
        <div id='listsDiv' className='List'>
          <h2>Add new lists to get started!</h2>
        </div>
      )
    }

    // Otherwise, for each list, create a div
    const lists = this.props.lists
    // unpack list items

    return (
      <div>{
        Object.values(lists).map(
          ({ name, id, items }) => {
            return (<List name={name} key={id} items={items} onAddItem={this.props.onAddItem} onItemClick={this.props.onItemClick} />)
          })
      }
      </div>
    )
  }
}

export default Lists
