import React, { Component } from 'react';
import './App.css';
// import mongoose from "mongoose";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [
        {
        name: "test",
        phone: '2093',
        birthday: "1/2/3"
      }
    ]
    }
  }

  hRefetch() {
    fetch('/contact/display', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res)=> {
      if(res.status === 200) {
        console.log("Success! in fetch of componentDidMount", res)
        return res.json();
      } else {
        console.log("Failed", res)
      }
    }).then(data =>{
      console.log("the data is", data);
       this.setState({contacts: data})})
    .catch((err) => {
      console.log("Error!", err)
    })
  }

  componentDidMount(){
    this.hRefetch();
  }
  render() {
    return (
      <div>
        <ContactList contacts = {this.state.contacts} magicCallback={this.hRefetch.bind(this)}/>
      </div>
    );
  }
}

class ContactList extends Component {
  constructor(props){
    super(props);
    this.state={};
  }

  addContact(event) {
    event.preventDefault();
    var name = prompt("Enter contact name", name);
    var phone = prompt("Enter contact phone", name);
    var birthday = prompt("Enter contact birthday", name);

    fetch('/contact/create', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        phone: phone,
        birthday: birthday
      })
    }).then((res)=> {
      if(res.status === 200) {
        console.log("Success!", res);
        this.props.magicCallback();
      } else {
        console.log("Failed", res)
      }
    }).catch((err) => {
      console.log("Error!", err)
    })
    // window.location.reload();
    // I want to be able to reload the page when the contact is saved... not sure how to do it.
  }

  editContact(event, contact) {
    event.preventDefault();

    var name = prompt("Enter updated name", name);
    var phone = prompt("Enter updated phone", phone);
    var birthday = prompt("Enter updated birthday", birthday);

    var edited = {
      name: name,
      phone: phone,
      birthday: birthday
    }

    console.log("IN EDIT CONTACT")
    fetch('/contact/edit', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([contact, edited])
    }).then((res)=> {
      debugger;
      console.log(res);
      if(res.status === 200) {
        console.log("Success updating!", res)
        this.props.magicCallback()
      } else {
        console.log("Failed to update", res)
      }
    }).catch((err) => {
      console.log("ARE WE HERE?")
      debugger;
      console.log("Error!", err)
    })

  }

  deleteContact(event, contact) {
    event.preventDefault();

    fetch('/contact/delete', {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(contact)
    }).then((res)=> {
      if(res.status === 200) {
        console.log("Success deleting!", res);
        this.props.magicCallback();
      } else {
        console.log("Failed to delete", res)
      }
    }).catch((err) => {
      console.log("Error!", err)
    })

  }




  render(){
    return(
      <div>
      <ul>
        {this.props.contacts.map(contact => (
          <li>
            <button
              onClick = {(event)=> this.editContact(event, contact)}> Edit </button>
            <button
              onClick = {(event) => this.deleteContact(event, contact)}>Delete</button>
            {contact.name}, {contact.phone}, {contact.birthday}
          </li>
        ))}
      </ul>
      <button onClick = {(event) => (this.addContact(event))}> Add Contact </button>
    </div>
    )
  }
}

export default App;
