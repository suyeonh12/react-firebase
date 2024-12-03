import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy } from "firebase/firestore"; 
import Post from '../components/Post';

const Home = ({userObj}) => {
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    /*const getPosts = async ()=>{
        const querySnapshot = await getDocs(collection(db, "posts"));
        querySnapshot.forEach((doc) => {
            //console.log(doc.data());
            const postObj = {
                ...doc.data(),
                id:doc.id
            }
            setPosts((prev)=>[postObj, ...prev]);
        });        
    }*/

    useEffect(()=>{
        //getPosts();
        const q = query(collection(db, "posts"),orderBy('date', 'desc'));
        onSnapshot(q, (querySnapshot) => {
            const postArr = querySnapshot.docs.map((doc) => ({
                ...doc.data(),
                id:doc.id
                })
            );
            setPosts(postArr);
        });        
    },[])

    console.log(posts);
    
    const onChange = (e) =>{
        const{target:{value}} = e;
        setPost(value);
    }
    
    const onSubmit = async(e)=>{
        e.preventDefault();
        try{
            // Add a new document with a generated id.
            const docRef = await addDoc(collection(db, "posts"), {
                content: post,
                date: serverTimestamp(),
                uid: userObj
            });
            console.log("Document written with ID: ", docRef.id);
            setPost('');
        }catch(e){
            console.error("error:", e);
        }
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input value={post} type="text" placeholder="새 포스트를 입력하세요" onChange={onChange} />
                <button type="submit">입력</button>
            </form>
            <hr/>
            <h3>Post List</h3>
            <ul className="postlist">
                {
                    posts.map(item=>(
                       <Post key={item.id} postObj={item} isOwener={item.uid === userObj}/>
                    ))
                }
            </ul>
        </div>
    )
}

export default Home;