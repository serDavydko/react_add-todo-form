import React from 'react';
import TodoList from './TodoList'
import Modal from './Modal'
import './App.css';

import users from './api/users';
import todos from './api/todos';

class App extends React.Component {
  state = {
    todosData: [],
    usersData: [],
    isOpen: false,
    idCounter: 0,

    valuesMap: {
      task: '',
      person: '',
    },
    errorsMap: {
      task: '',
      person: '',
    },

  }

  componentDidMount() {
    this.setState({
      usersData: users,
      idCounter: Math.max(...todos.map(item => item.id), 0),
      todosData: todos.map(todo => ({
          ...todo,
        user: users.find(user => (user.id === todo.userId)),
      })),
    })
  }

  submitForm = (event) => {
    console.log(this.state.todosData);
    event.preventDefault();
    console.log(event.target);

    const errorsMap = {};

    this.setState(prevState => {
      if (!prevState.valuesMap.task) {
        errorsMap.task = 'Please, write what shoult be done'
      }

     if (!prevState.valuesMap.person) {
        errorsMap.person = 'Chose executor from the list'
      }

     if (Object.keys(errorsMap).length > 0) {
        return { errorsMap };
      }

      return {todosData: [...prevState.todosData, {
        id: prevState.idCounter +1,
        title: prevState.valuesMap.task,
        completed: false,
        user: JSON.parse(prevState.valuesMap.person),
      }],
      valuesMap: {},
      }

    })
  }

  handleFieldChange = (event) => {
    const {name, value} = event.target;
    this.setState(prevState =>({
      valuesMap: {...prevState.valuesMap, [name]:value, },
      errorsMap: {},
    }))
  }

  toggleModal = () => {
    this.setState( {
      isOpen: true,
    });
  }

  toggleModalClose = () => {
    this.setState({
      isOpen: false,
      errorsMap: {},
    })
  }

  render() {

    return (
      <div className="App">
        <header>
        <h1>List of todos</h1>
        <button className ="btn" type="button" onClick={this.toggleModal}> Add new item</button>
        </header>
        {this.state.isOpen &&  < Modal
          show={this.state.isOpen}
          toggleModalClose ={this.toggleModalClose}
          usersData={this.state.usersData}
          submitForm= {this.submitForm}
          errorsMap = {this.state.errorsMap}
          handleFieldChange = {this.handleFieldChange} />}

          <TodoList todo={this.state.todosData} />

    </div>
    );

  }
}

export default App;
