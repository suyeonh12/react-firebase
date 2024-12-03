import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, getDocs, query, onSnapshot, orderBy } from "firebase/firestore"; 
import Post from '../components/Post';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

const Home = ({userObj}) => {
    const [post, setPost] = useState('');
    const [posts, setPosts] = useState([]);
    const [attachment, setAttachment] = useState();
    const storage = getStorage();
    const storageRef = ref(storage);
    let attachmentUrl = '';
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

    console.log(userObj);
    
    const onChange = (e) =>{
        const{target:{value}} = e;
        setPost(value);
    }
    
    const onSubmit = async(e)=>{
        e.preventDefault();
        const storageRef = ref(storage, `${userObj.uid}/${uuidv4()}`);
        const makePost = async (url)=>{
            try{
                // Add a new document with a generated id.
                const docRef = await addDoc(collection(db, "posts"), {
                    content: post,
                    date: serverTimestamp(),
                    uid: userObj.uid,
                    attachmentUrl:url,
                    name: userObj.displayName
                });
                setAttachment('');
                setPost('');
                myform.reset();
            }catch(e){
                console.error("error:", e);
            }            
        }
        if(attachment){
            uploadString(storageRef, attachment, 'data_url').then(async (snapshot) => {
                //console.log('Uploaded a data_url string!');
                attachmentUrl = await getDownloadURL(storageRef);
                makePost(attachmentUrl);
            });            
        }else{
            makePost(attachmentUrl);
        }

    }

    let myform = document.querySelector('form');

    const onFilechange = (e) =>{
        //const thefile = e.target.files[0]
        const {target:{files}} = e;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (e)=>{
            //console.log(e);
            const {target:{result}} = e;
            setAttachment(result);
        }
        reader.readAsDataURL(theFile);
    }
    console.log(attachment);
    const onClearFile = () =>{
        setAttachment(null);
    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <p>
                    <input value={post} type="text" placeholder="새 포스트를 입력하세요" onChange={onChange} />
                    <input type="file" accept="image/*" onChange={onFilechange} />
                </p>
                {
                    attachment && (
                        <>
                            <img src={attachment} width="100px" alt=""/>
                            <button type="button" onClick={onClearFile}>업로드 취소</button>
                        </>
                    )
                }
                <p>
                    <button type="submit">입력</button>
                </p>
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