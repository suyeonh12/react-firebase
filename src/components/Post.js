import React, { useState } from "react";
import { db } from '../firebase';
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { getStorage, ref, deleteObject } from "firebase/storage";

const Post = ({postObj, isOwener})=>{
    const [edit, setEdit] = useState(false);
    const [newpost, setNewPost] = useState(postObj.content);

    const deletePost = async () =>{
        const yes = window.confirm("정말 삭제할까요?");
        if(yes){
            await deleteDoc(doc(db, "posts", postObj.id));
            const storage = getStorage();
            const storageRef = ref(storage, postObj.attachmentUrl);
            deleteObject(storageRef);
        }
    }

    const toggleEditMode = () => setEdit(prev=>!prev);

    const onChange = (e) => {
        const {target:{value}} = e;
        setNewPost(value);
    }
    const onSubmit = async (e) =>{
        e.preventDefault();
        const postRef = doc(db, "posts", postObj.id);

        await updateDoc(postRef, {
            content: newpost
        });
        setEdit(false);
    }

    return(
        <li>
            {
                edit ? (
                    <>
                        <form onSubmit={onSubmit}>
                            <input value={newpost} required onChange={onChange} />
                            <button>입력</button>
                        </form>
                        <button onClick={toggleEditMode}>취소</button>
                    </>
                ) : (
                    <>
                        <h4>{postObj.content}</h4>
                        <h5>- {postObj.name} -</h5>
                        {
                            postObj.attachmentUrl && <img src={postObj.attachmentUrl} width="100px" alt=""/>
                        }
                        {
                        isOwener && (
                            <>
                            <button onClick={deletePost}>삭제</button>
                            <button onClick={toggleEditMode}>수정</button>
                            </>
                        )
                        }                    
                    </>
                )
            }
        </li>
    )
}

export default Post;