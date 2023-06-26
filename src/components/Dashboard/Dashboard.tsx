import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputAdornment, CircularProgress, TextField, Modal, RadioGroup, Radio, Button, FormControlLabel, Checkbox, FormControl, InputLabel, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Backdrop } from '@mui/material';
import SearchIcon from '@material-ui/icons/Search';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';


// Dialog import functionality
// type DialogProps = {
//   title?: string;
//   children: React.ReactNode;
// };
// const Dialog = (props: DialogProps) => {
//   return (
//     <div>
//       <div>{props.title}</div>
//       {props.children}
//     </div>
//   );
// };

// interface declaration
interface UserData {
  name: string;
  designation: string;
  joinDate: string;
  gender: string;
  position: string[];
}


// navigation of dashboard to login page onclick of logout button
const Dashboard: React.FC = () => {
    const {user} = useSelector((state: any) => state.user);
    const name = user ? user.split('@')[0] : '';
    const navigate = useNavigate();
    const logoutClick = () => {
    navigate('/');
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (isSaving) {
      return;
    }

    setOpen(false);
    setEditIndex(null);
  };

  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [formData, setFormData] = useState<UserData>({
    name: '',
    designation: '',
    joinDate: '',
    gender: '',
    position: [],

  });

  useEffect(() => {
    if (!open) {
      setFormData({
        name: '',
        designation: '',
        joinDate: '',
        gender: '',
        position: [],
      });
      setFormErrors({});
    }
  }, [open])
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    const storedData = localStorage.getItem('users');
    if (storedData) {
      setUsers(JSON.parse(storedData));
    }
  }, []);

  // functionality if value is empty
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | { name?: string; value: unknown }>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name as string]: value as string }));

    if (value === '') {
      setFormErrors((prevState) => ({ ...prevState, [name as keyof UserData]: 'Please enter a value.' }));
    } else {
      setFormErrors((prevState) => ({ ...prevState, [name as keyof UserData]: '' }));
    }
  };

  // radio button functionality
  const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setFormData({ ...formData, gender: value });
    formErrors.gender = '';
  };

  // checkbox functionality
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = event.target;
    let updatedPosition = formData.position.slice();
    if (checked) {
      updatedPosition.push(name);
    } else {
      updatedPosition = updatedPosition.filter((pos) => pos !== name);
    }
    setFormData({ ...formData, position: updatedPosition });
    formErrors.position = []
    if (!checked) {
      formErrors.position = ['Please select position']
    }
  };

  const [formErrors, setFormErrors] = useState<Partial<UserData>>({
    name: '',
    designation: '',
    joinDate: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  // save button functionality
  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // error show
    const errors: Partial<UserData> = {};

    if (formData.name.trim() === '') {
      errors.name = 'Please enter a name.';
    }
    if (formData.designation.trim() === '') {
      errors.designation = 'Please enter a designation.';
    }
    if (formData.joinDate.trim() === '') {
      errors.joinDate = 'Please select a join date.';
    }
    if (formData.gender === '') {
      errors.gender = 'Please select gender';
    }

    if (formData.position.length === 0) {
      if (errors.position) {
        errors.position.push('Please select at least one position.');
      } else {
        errors.position = ['Please select at least one position.'];
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setOpen(false);
    setIsSaving(true);

    setTimeout(() => {
      // edit button functionality inside modal
      if (editIndex !== null) {
        // Update existing user data at the specified index
        const updatedUsers = [...users];
        updatedUsers[editIndex] = formData;
        setUsers(updatedUsers);
        setFormData({
          name: '',
          designation: '',
          joinDate: '',
          gender: '',
          position: [''],
        });

        // Add this line to display a success notification for update
        toast.success('Employee data updated successfully!', {
          position: toast.POSITION.TOP_CENTER
        });

        setEditIndex(null);
        setIsEditing(false);
        setIsSaving(false);

        // Update local storage with the updated users data
        localStorage.setItem('users', JSON.stringify(updatedUsers));

      } else {
        // Add new user data
        setUsers((prevUsers) => [...prevUsers, formData]);
        setFormData({
          name: '',
          designation: '',
          joinDate: '',
          gender: '',
          position: [],
        });
        // Add this line to display a success notification
        toast.success('Employee saved successfully!', {
          position: toast.POSITION.TOP_CENTER
        });

        // Add new user data
        const updatedUsers = [...users, formData];
        setUsers(updatedUsers);

        // Update local storage with the updated users data
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      setIsSaving(false);
      setEditIndex(null);
    }, 3000);
  };

  // Delete button functionality
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const handleDeleteYes = (index: number) => {
    const dataCopy = [...users];
    dataCopy.splice(index, 1);
    setUsers(dataCopy);

    // Add this line to display a success notification
    toast.success('Employee deleted successfully!', {
      position: toast.POSITION.TOP_RIGHT
    });

    // Update local storage with the updated users data
    localStorage.setItem('users', JSON.stringify(dataCopy));
    setIsOpen(false);
  };

  const openConfirmationModal = (index: number) => {
    setIsOpen(true);
    setSelectedRow(index);
  };

  const closeConfirmationModal = () => {
    setIsOpen(false);
  };

  // Edit button functionality
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const handleEdit = (index: number) => {
    const userToEdit = users[index];
    setFormData(userToEdit);
    setEditIndex(index);
    setOpen(true);
    setIsEditing(true);
  };

  const [searchQuery, setSearchQuery] = useState('');


  // Dashboard page content
  return (
    <body className='DashboardBody'>
      <div className='container'>
        <h1 style={{ color: 'white', fontSize: '50px' }} >Welcome, {name}!</h1>
        <div className='Button'> 
          <Button variant="contained" color='success' onClick={handleOpen}>Add</Button>
          <TextField
            label="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ backgroundColor: 'white', borderRadius: '5px' }}  InputProps={{
              endAdornment: (
                  <InputAdornment position="end" style={{height: '20px'}}>
                      <SearchIcon />
                  </InputAdornment>
              ), style:{
                height: '37px',
                fontSize: '20px',
                padding: '0px',
                lineHeight: '20px'
              },
          }}
          InputLabelProps= {{style:{height: '30px', marginTop: '-13px'}}}
          />
          <Button variant="contained" className='logout' color='warning' type="button" onClick={logoutClick}>Logout</Button>
        </div>
        {/* Add employee modal content */}
        <Modal open={open} onClose={handleClose} BackdropProps={{ onClick: () => { }, style: { pointerEvents: 'none' } }}>
          <div className='modalDiv' style={{ alignItems: 'center', textAlign: 'center', padding: '16px', width: '400px', margin: '0 auto', top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)', borderBlockStyle: 'dashed', borderRadius: '5px' }}>
            <h2>Add Employee</h2>
            <form onSubmit={handleSave}>
              <TextField label="Name" name="name" value={formData.name} onChange={handleFormChange} error={!!formErrors.name}
                helperText={formErrors.name} fullWidth /><br /><br />
              <TextField label="Designation" name="designation" value={formData.designation} onChange={handleFormChange} error={!!formErrors.designation}
                helperText={formErrors.designation} fullWidth /><br />
              <FormControl >
                <InputLabel id="join-date">Join Date</InputLabel><br /><br />
                <TextField name="joinDate" type='date' value={formData.joinDate} onChange={handleFormChange} error={!!formErrors.joinDate}
                  helperText={formErrors.joinDate} fullWidth />
              </FormControl><br /><br />
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div>
                  <InputLabel id="gender-label">Gender</InputLabel>
                  <FormControl fullWidth error={!!formErrors.gender} style={{ alignItems: 'center' }}>
                    <RadioGroup value={formData.gender} onChange={handleRadioChange}>
                      <FormControlLabel value="male" control={<Radio />} label="Male" />
                      <FormControlLabel value="female" control={<Radio />} label="Female" />
                      <FormControlLabel value="other" control={<Radio />} label="Other" />
                    </RadioGroup>
                    {formErrors.gender && <span style={{ color: "red" }} className="error">{formErrors.gender}</span>}
                  </FormControl></div>
                <div>
                  <InputLabel id="position">Position</InputLabel>
                  <FormControl fullWidth error={!!formErrors.position} style={{ alignItems: 'flex-start' }}>
                    <FormControlLabel control={<Checkbox {...label} name="developer" checked={formData.position.includes('developer')} onChange={handleCheckboxChange} />} label="Developer" />
                    <FormControlLabel control={<Checkbox {...label} name="designer" checked={formData.position.includes('designer')} onChange={handleCheckboxChange} />} label="Designer" />
                    <FormControlLabel control={<Checkbox {...label} name="manager" checked={formData.position.includes('manager')} onChange={handleCheckboxChange} />} label="Manager" />
                    <FormControlLabel control={<Checkbox {...label} name="intern" checked={formData.position.includes('intern')} onChange={handleCheckboxChange} />} label="Intern" />
                    {formErrors.position && <span className="error" style={{ color: "red" }}>{formErrors.position}</span>}
                  </FormControl></div>
                </div>
              <div className='Button'>
                <Button variant="contained" color='success' type="submit" > {isEditing ? 'Update' : 'Save'}</Button>
                <Button variant="contained" color="error" onClick={() => setOpen(false)} >Close</Button>
              </div>
            </form>
          </div>
        </Modal><br />

        <TableContainer>
          <Table>
            {/* Table heading */}
            <TableHead>
              <TableRow>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Designation</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Join Date</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Gender</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Position</TableCell>
                <TableCell style={{ color: 'white', fontWeight: 'bold' }}>Action</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            {isSaving ? (
              <Backdrop open={isSaving} >
                <CircularProgress />
              </Backdrop>
            ) : (
              <>
                {/* Adding rows */}
                <TableBody>
                  {users.filter(
                    (user) =>
                      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      user.designation.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((user, index) => (
                      <TableRow key={index} className={editIndex === index ? 'editing' : ''}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.designation}</TableCell>
                        <TableCell>{user.joinDate}</TableCell>
                        <TableCell>{user.gender}</TableCell>
                        <TableCell>{user.position.join(', ')}</TableCell>
                        <TableCell>
                          <Button variant="contained" color="primary" onClick={() => handleEdit(index)}>Edit</Button>
                        </TableCell>
                        <TableCell>
                        <Button variant="contained" color="error" onClick={() => openConfirmationModal(index)}>Delete</Button>
                    
                          {isOpen && selectedRow === index && (
                            <Modal open={isOpen} onClose={closeConfirmationModal}>
                              <div style={{ borderRadius: '10px', borderBlockStyle: 'dotted', padding: '16px', background: 'white', width: '400px', margin: '0 auto', top: '50%', position: 'absolute', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <h2>Confirm Deletion</h2>
                                <p>Are you sure you want to delete this data?</p>
                                <div style={{ display: 'flex', justifyContent: "space-between" }}>
                                  <Button variant="contained" onClick={closeConfirmationModal}>No</Button>
                                  <Button variant="contained" color="error" onClick={() => handleDeleteYes(index)}>Yes</Button>
                                </div>
                              </div>
                            </Modal>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </>
            )}
          </Table>
        </TableContainer>
        {/* Empty table notification  */}
        {(users.length === 0 || users.filter.length === 0) && (
          <div style={{ fontSize: "20px" }}>No employees found!</div>
        )}
        {/* Toast container */}
        <ToastContainer />
      </div >

    </body>
  );
}
export default Dashboard;