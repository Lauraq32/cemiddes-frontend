import React, {useState, useEffect, useRef} from 'react';
import {InputText} from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import axios from 'axios';
import headers from '../service/token';


const Profile = () => {
    let emptyUser = {
        uid: null,
        name: '',
        lastname: '',
        rol: '',
        email: '',
        password: ''
        //confirmPassword: ''
    };
    
    const [user, setUser] = useState(emptyUser);
    const [submitted, setSubmitted] = useState(false);
    const toast = useRef(null);


    const userID = localStorage.getItem('uid');
    
    useEffect(() => {
        getUser();
    }, []);
    
    const getUser = () => {
        
        axios.get("http://localhost:8080/api/users/profile/" + userID, {headers})
        .then((response) => {
            const userData = response.data.account;
            setUser(userData);
            userData.password = response.data.password;
        })
        .catch(error => console.error('Error while getting user',error));

    }

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    }
    const saveUser = () => {
        let _user = {...user}

        if (user.uid) {
            console.log('hh: :', _user.password);
            console.log("user  is:", _user);

            axios.put('http://localhost:8080/api/users/profile/' + _user.uid, _user , {headers}, )
            .then(response => {
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'User Updated', life: 3000 });
                getUser();

            })
            .catch(error => console.error('Error while updating password:',error));
        }

    }



    return (
        <div className="grid justify-content-center">
            <Toast ref={toast} />

            <div className="col-12 md:col-6">
                <div className="card p-fluid">
                    <h5>Update Profile</h5>
                    <div className="field">
                        <label htmlFor="name">First Name</label>
                        <InputText id="name" type="text" value={user.name} onChange={(e) => onInputChange(e, 'name')}   />
                    </div>

                    <div className="field">
                        <label htmlFor="lastname">Last Name</label>
                        <InputText id="lastname" type="text" value={user.lastname}  onChange={(e) => onInputChange(e, 'lastname')} />
                    </div>

                    <div className="field">
                        <label htmlFor="rol">Role</label>
                        <InputText id="rol" type="text" value={user.rol}  onChange={(e) => onInputChange(e, 'rol')} />
                    </div>

                    <div className="field">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" type="text" value={user.email} onChange={(e) => onInputChange(e, 'email')} />
                    </div>

                    <div className="field">
                        <label htmlFor="password">Change Password</label>
                        <InputText id="password" type="password" placeholder='New Password' onChange={(e) => onInputChange(e, 'password')} />
  
                    </div>

                     {/* <div className="field">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <InputText id="confirmPassword" type="password" placeholder='Confirm New Password' />
                    </div> */}


                    <Button label="Update User" icon="pi pi-check" className="p-button-text password-btn" onClick={saveUser} />
                </div>
            </div> 
        </div>       
        );
}

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Profile, comparisonFn);