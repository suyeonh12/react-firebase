import React, { useState, useEffect } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import profile from '../profile_icon.svg';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db } from '../firebase';
import { collection, query, onSnapshot, where, orderBy, limit } from "firebase/firestore"; 
import Post from '../components/Post';

const Profile = ()=>{
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();
    const [profileImg, setProfileImg] = useState(profile);
    const [posts, setPosts] = useState([]);

    const onLogoutClick = () =>{
        signOut(auth).then(() => {
            alert('로그아웃 되었습니다.');
            navigate("/");
        }).catch((error) => {
            console.log(error);
        });
    }
    const getUserPost = ()=>{
        const q = query(collection(db, "posts"), where("uid", "==", user.uid), orderBy('date', 'desc'), limit(10));
        onSnapshot(q, (querySnapshot) => {
            const postArr = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id:doc.id
                })
            );
            setPosts(postArr);
        });         
    }
    /*useEffect(()=>{
        user.photoURL.includes('firebase') && setProfileImg(user.photoURL);
        getUserPost();
    },[])*/
    useEffect(()=>{
        if (user && user.photoURL && user.photoURL.includes('firebase')) {
            setProfileImg(user.photoURL);
        }
        getUserPost();
    },[])
    console.log(posts);

    const updateLogo = async (e) =>{
        const {target:{files}} = e;
        const file = files[0];
        const storage = getStorage();
        const profileLogoRef = ref(storage, `profiles/${user.uid}`);
        const result = await uploadBytes(profileLogoRef, file);  
        const profileUrl = await getDownloadURL(result.ref);
        //console.log(profileUrl);        
        setProfileImg(profileUrl);    
        await updateProfile(user, {
            photoURL:profileUrl
        })    
    }
    console.log(auth);
    return(
        <>
            <div className="profile">
                <div>
                    <img src={profileImg} alt="logo" />
                    <h3>{user.displayName ?? ""}</h3>
                </div>
                <input type="file" className="hidden" accept="image/*" id="profile" onChange={updateLogo} />
                <label htmlFor="profile">Update profile</label>
                <button onClick={onLogoutClick} className="btnRed">Logout</button>
            </div>            
            <hr/>
            <h3>My post List</h3>
            <ul className="postlist">
                {
                    posts.map(item=>(
                       <Post key={item.id} postObj={item} isOwener={item.uid === user.uid}/>
                    ))
                }
            </ul>
        </>
    )
}

export default Profile;