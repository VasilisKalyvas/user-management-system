import { useState, useEffect } from 'react'
import axios from 'axios'
import './css/UserList.css'
import {Table, Button, Modal, Form, FormControl} from 'react-bootstrap'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx/xlsx.mjs';

function UserList() {
  const [UserList, setUserList] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('') 
  const [role, setRole] = useState('')
  const [NewName, setNewName] = useState('')
  const [NewEmail, setNewEmail] = useState('')
  const [NewRole, setNewRole] = useState('')
  const [getId, setGetId] = useState('')
  const [searchValue, setSearchValue] = useState('')
  const [filterRole, setfilterRole] = useState('')
  const [show, setShow] = useState(false); // CREATE MODAL
  const [showUpdate, setShowUpdate] = useState(false); // UPDATE MODAL
  const handleClose = () => setShow(false); // CREATE MODAL
  const handleShow = () => setShow(true); // CREATE MODAL
  const handleCloseUpdate = () => setShowUpdate(false); // UPDATE MODAL
  
  const handleShowUpdate = (id) => 
  { 
     setShowUpdate(true); 
     setGetId(id);
  }; // UPDATE MODAL

  useEffect(() =>{
    axios.get("http://localhost:3001/userlist")
    .then((response) => {
      setUserList(response.data);
      console.log(response.data)
      })
  }, [])

  const addUser = (e) =>{
    e.preventDefault();
    axios.post("http://localhost:3001/insert",
    {   name: name, 
        email: email,  
        role: role
    }).then((response) => {
      setUserList([
        ...UserList,
        {
          name,
          email,
          role
        },
      ]);
      console.log(response);
    });
    handleClose();
  };

  const updateUser = (id) => {
    axios.put(`http://localhost:3001/user/${id}`,
        {   name: NewName, 
            email: NewEmail, 
            role: NewRole
        }).then(() => {
          setUserList(UserList.map((val) =>{
            return  val._id === id ? 
                { _id: id, 
                  name: NewName, 
                  email: NewEmail, 
                  role: NewRole
                } : val;
          }
          ))
        });
        handleCloseUpdate();
  };

  const deleteUser = (id) => {
    axios.delete(`http://localhost:3001/delete/${id}`)
    .then((response) => {
      setUserList(UserList.filter((val)=> {
        return val._id != id;
      }));console.log(response)
      });
  };

  let data = [];
  UserList.forEach((element, index, array) => {
    data.push([element.name, element.email, element.role])
  })
   
 console.log('data table', data);

  const downloadPdf = () => {
    const doc = new jsPDF()
    doc.text("User's List", 20, 10)
    doc.autoTable({
      theme: "grid",
      columns: ['Name', 'Email', 'Role'],
      body: data
    })
    doc.save('Users.pdf')
  }

  const dataForExcel = UserList.map(row=>{
    delete row.tableData
    return row
  })

  const downloadExcel = () => {
    var wb = XLSX.utils.book_new(),
    ws = XLSX.utils.json_to_sheet(dataForExcel);

    XLSX.utils.book_append_sheet(wb, ws, 'UsersList');
    XLSX.writeFile(wb, 'UsersList.xlsx');
  }
  return (
    <>
  <div>
    <div className='Options' style={{padding: '10px'}}>
      <Button variant="primary" onClick={handleShow} style={{marginRight: '10px'}}>
          Add User
      </Button>
      <Button variant="success" onClick={downloadPdf} style={{marginRight: '10px'}}>
          PDF
      </Button>
      <Button variant="success" onClick={downloadExcel} style={{marginRight: '10px'}}>
          EXCEL
      </Button>
    </div>
{/*CREATE USER */}

    <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <form >
              <div className="ui divider">
                  <div className="ui form">
                      <div className="App">
                            <label>Name:</label>
                            <input type="text" placeholder="Name" onChange={(event) =>{setName(event.target.value)}}/>
                            <label>Email:</label>
                            <input type="email" placeholder="Email" onChange={(event) =>{setEmail(event.target.value)}}/>
                            <label>Role:</label>
                              <select id='role' value={role} onChange={(event) =>{setRole(event.target.value)}}>
                                <option>Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                              </select>
                            <br></br>
                            <Button variant='primary' onClick={addUser} style={{marginTop: '10px'}}>Add User</Button>
                      </div>
                  </div>
              </div>
          </form>
        </Modal.Body>
      </Modal>

{/*EDIT USER */}

      <Modal show={showUpdate} onHide={handleCloseUpdate}>
        <Modal.Header closeButton>
          <Modal.Title>Update User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
           <form >
              <div className="ui divider">
                  <div className="ui form">
                      <div className="App">
                          {UserList.filter((val)=> {
                              return val._id == getId;
                             }).map((val, key)  => (
                              <div key={key}>
                               <b>Name: {val.name}</b><br></br>
                               <b>Email: {val.email}</b><br></br>
                               <b>Role: {val.role}</b><br></br>
                               <br></br>
                              </div>
                            ))} 
                            
                            <label>Name:</label>
                            <input type="text"
                              placeholder="Name" onChange={(event) =>{setNewName(event.target.value)}}
                            />
                            <label>Email:</label>
                            <input type="email"placeholder="Email" onChange={(event) =>{setNewEmail(event.target.value)}}/>
                            <label>Role:</label>
                              <select id='role' onChange={(event) =>{setNewRole(event.target.value)}}>
                                <option>Select Role</option>
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                              </select>
                            <br></br>
                            <Button variant='warning' onClick={() => {updateUser(getId)}} style={{marginTop: '10px'}}>Update User</Button>
                      </div>
                  </div>
              </div>
          </form>
        </Modal.Body>
      </Modal>

{/*DISPLAY USERS */}

    <div className='App container'>
    <h1>Users</h1>
    <Form className="d-flex" >
        <FormControl
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          onChange={(event) =>{setSearchValue(event.target.value)}}
    />
    </Form>
    <div>
      <span>
        <Form.Check 
            type='radio'
            id={`inline-1`}
            label='User'
            name='group1'
            onChange={() =>{setfilterRole('user')}}
          />
      </span>
      <span>
      <Form.Check 
            type='radio'
            id={`inline-2`}
            label='Admin'
            name='group1'
            onChange={() =>{setfilterRole('admin')}}
          />
      </span>
      <span>
      <Form.Check 
            type='radio'
            id={`inline-3`}
            label='All'
            name='group1'
            onChange={() =>{setfilterRole('all')}}
          />
      </span>
    </div>
    
    { UserList.length == 0 ? (<> <p style={{marginTop: '30px'}}>No users in the DataBase</p></>) : (<>
    <div className='table'>
      <Table>
      <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
      </thead>
          <tbody>
          {UserList.filter((val) => { 
            if(searchValue == '') {
              return val
            }else if(
              val.name.toString().toLowerCase().includes(searchValue.toString().toLowerCase())
               || val.email.toString().toLowerCase().includes(searchValue.toString().toLowerCase())
              ){
              return val
            }
          }).filter((val) => { 
            if(filterRole == 'all') {
              return val
            }
            else if(
              filterRole == ''
              ){
              return val
            }else if(
              filterRole == 'user'
              ){
              return val.role == 'User'
            }else if(
              filterRole == 'admin'
              ){
              return val.role == 'Admin'
            }
          }).map((val, key)  => (
              <tr key={key}>
                <td>{val.name}</td>
                <td>{val.email}</td>
                <td>{val.role}</td>
                <td><Button variant='warning' onClick={() => {handleShowUpdate(val._id);}}>Edit</Button></td>
                <td><Button variant='danger' onClick={() => {deleteUser(val._id);}}>Delete</Button></td>
               
              </tr>
            ))}
        </tbody>
      </Table>
      </div>
      </>)}
    </div>
</div>
</>
  );
}

export default UserList
