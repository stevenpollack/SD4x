import React, { Component } from 'react'
import Lists from './Lists.js'
import AddList from './AddList.js'
import './App.css'
import {v4 as uuidv4} from 'uuid'

class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lists: {}
    }

    this.handleAddItem = this.handleAddItem.bind(this)
    this.handleItemClick = this.handleItemClick.bind(this)
    this.handleAddList = this.handleAddList.bind(this)
  }

  /**
   * This function takes the state of an AddList component as its parameter
   * and updates the state of this App component by adding a new entry to the "lists"
   * array and then adding a new property in the "items" object that has the same name
   * as the value put into the "lists" array. It should then re-render this App component.
   */
  handleAddList (newListName) {
    // AddList.state has .value which is the value of the <input/>
    this.setState(state => {
      let lists = state.lists
      lists[newListName] = {
        name: newListName,
        id: uuidv4(),
        items: []
      }
      return {  lists  }
    })
  }

  /**
   * This function takes the state of an AddItem component as its parameter
   * and updates the state of this App component by adding a new value to the
   * appropriate array in the "items" property of the state. Keep in mind that
   * the property names of "items" are the names of each list, which is mapped
   * to an array of the items in that list. After updating the "items" part of
   * the state, this function  should then re-render this App component.
   */
  handleAddItem (listName, newItem) {
    this.setState(state => {
      let lists = state.lists
      lists[listName].items.push(newItem)
      //console.log(lists)
      return { lists }
    })   
  }

  handleItemClick ({listName, id}) {
    console.log(this)
    this.setState(state => {
      const listItems = state.lists[listName].items
      const itemIndex = listItems.findIndex( item => item.id === id )
      const itemSelected = listItems[itemIndex].selected
      listItems[itemIndex].selected = !itemSelected

      return {lists: state.lists}
    })
  }

  /**
   * Renders the component.
   */
  render () {
    console.log(this)
    return (
      <div className='App'>
        <AddList addList={this.handleAddList} />
        <div id='listsDiv' className='List'>
          <Lists lists={this.state.lists} onItemClick={this.handleItemClick} onAddItem={this.handleAddItem} />
        </div>
      </div>
    )
  }
}

export default App
