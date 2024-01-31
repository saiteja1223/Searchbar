import React,{useState,useEffect,useRef} from 'react'
import './searchbar.css'
import Pill from './Pill';

function Searchbar() {
    const[searchTerm,setSearchTerm]=useState("");
    const[suggestions,setSuggestions]=useState([]);
    const[selectedUsers,setSelectedUsers]=useState([])
    const[selectedUsersSet,setSelectedUsersSet]=useState(new Set())
    const inputRef=useRef(null);
    const fetchUsers=()=>{
        if(searchTerm.trim()=== "")
        {
            setSuggestions([])
            return;
        }
        fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
        .then((res)=>res.json())
        .then((data)=>setSuggestions(data))
        .catch((err)=>{console.error(err);})
    }
    useEffect(()=>{
       const time=setTimeout(()=>{
        console.log("timeout")
        fetchUsers();},2000 )
        return()=>{
            clearTimeout(time);
        }

    },[searchTerm])
    const handelSelectUser=(user)=>{
        setSelectedUsers([...selectedUsers,user])
        setSelectedUsersSet(new Set([...selectedUsersSet,user.email]))
        setSearchTerm("")
        setSuggestions("")
        inputRef.current.focus();

    }
    
    const handleRemoveUser=(user)=>{
        const updatedUsers=selectedUsers.filter((selectedUsers)=>selectedUsers.id!==user.id)
        setSelectedUsers(updatedUsers);
        const updatedEmails=new Set(selectedUsersSet)
        updatedEmails.delete(user.email)
        setSelectedUsersSet(updatedEmails)
    }
    const handleKeyDown=(e)=>{
        if(
            e.key ==="Backspace"&&e.target.value=== ""&&selectedUsers.length>0
        ){
            const lastUser=selectedUsers[selectedUsers.length-1]
            handleRemoveUser(lastUser)
            setSuggestions([])
        }

    }
  return (
    <div className='user-search-container'>
    <div className='user-search-input' >
        {selectedUsers.map((user)=>{
            return(
                <Pill
                 key={user.email} 
                 image={user.image}
                 text={`${user.firstName}${user.lastName}`}
                 onClick={()=>handleRemoveUser(user)}
                
                />
        )
        })}
    <div>
        <input type='text' ref={inputRef} value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)}
        placeholder='Search for a user...' onKeyDown={handleKeyDown}/>
            
    <ul className='suggestions-list'>
        {suggestions?.users?.map((user,index)=>{
            return !selectedUsersSet.has(user.email)?(
                <li key={user.email} onClick={()=>handelSelectUser(user)}>
                    <img src={user.image} alt={`${user.firstName}${user.lastName}`}></img>
                    <span>{user.firstName}{user.lastName}</span>
                </li>
            ):<></>
        })}
    </ul>
    </div>

    </div>
    </div>
  )
}

export default Searchbar