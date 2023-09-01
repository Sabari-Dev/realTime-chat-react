import { useEffect, useState } from "react";
import { auth, db, storage } from "../Config/Config";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
  orderBy,
  setDoc,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  getDocs,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import User from "./User";
import MessageArea from "./MessageArea";
import Message from "./Message";
import { BsFillTrash3Fill } from "react-icons/bs";
import image from "../profile.jpg";
import toast from "react-hot-toast";

const Home = () => {
  const [users, setUsers] = useState([]);
  const [chat, setChat] = useState("");
  const [text, setText] = useState("");
  const [img, setImg] = useState("");
  const [msgs, setMsgs] = useState([]);

  const user1 = auth.currentUser.uid;
  useEffect(() => {
    const usersRef = collection(db, "Users");
    const q = query(usersRef, where("uid", "not-in", [user1]));

    const unsub = onSnapshot(q, (querySnapshot) => {
      let users = [];
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      setUsers(users);
    });
    return () => unsub();
  }, []);
  // console.log(users);
  const selectUser = async (user) => {
    setChat(user);
    const user2 = user.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    const msgRef = collection(db, "messages", id, "chat");
    const q = query(msgRef, orderBy("createdAt", "asc"));

    onSnapshot(q, (querySnapshot) => {
      let msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push(doc.data());
      });
      setMsgs(msgs);
    });
    //conversion last msg
    const docSnap = await getDoc(doc(db, "lastMsg", id));
    if (docSnap.data() && docSnap.data().from !== user1) {
      await updateDoc(doc(db, "lastMsg", id), { unread: false });
    }
  };
  // console.log(msgs);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user2 = chat.uid;
    const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;

    let url;
    if (img) {
      const imageRef = ref(
        storage,
        `images/${new Date().getTime()}-${img.name}`
      );
      const snap = await uploadBytes(imageRef, img);
      const dlUrl = await getDownloadURL(ref(storage, snap.ref.fullPath));
      url = dlUrl;
    }
    await addDoc(collection(db, "messages", id, "chat"), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
    }).then((UserCredential) => {
      // setTimeout(() => {
      //   setMsgId(UserCredential.id);
      //   console.log(msgId);
      // }, 10000);
      // const addId = doc(db, "messages", id, "chat", msgId);
      // await updateDoc(addId, { chatId: msgId });
      // setMsgId("");
    });

    await setDoc(doc(db, "lastMsg", id), {
      text,
      from: user1,
      to: user2,
      createdAt: Timestamp.fromDate(new Date()),
      media: url || "",
      unread: true,
    });
    setText("");
    setImg("");
  };
  const deleteChat = async () => {
    if (window.confirm("Are You sure to delete the Messages?")) {
      const user2 = chat.uid;
      const id = user1 > user2 ? `${user1 + user2}` : `${user2 + user1}`;
      //delete last msg
      const lastMsgDocRef = doc(db, "lastMsg", id);
      await deleteDoc(lastMsgDocRef);
      //delete chat
      const msgRef = collection(db, "messages", id, "chat");
      const querySnapshot = await getDocs(msgRef);
      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );
      await Promise.all(deletePromises);

     toast.success("Chats deleted successfully!!");
    }
  };
  return (
    <div className="home-page">
      <div className="user-page ">
        {users.map((user) => (
          <User
            key={user.uid}
            user={user}
            selectUser={selectUser}
            user1={user1}
            chat={chat}
          />
        ))}
      </div>
      <div className="message-pager">
        {chat ? (
          <>
            <div className="name text-center text-light d-flex">
              <div className="profile-img w-25  text-start ms-2">
                <img
                  src={chat ? chat.avatar : image}
                  alt=""
                  style={{ height: "50px", width: "50px", borderRadius: "50%" }}
                />
              </div>

              <p className="w-50 pt-2">{chat.userName}</p>
              {msgs.length ? (
                <i
                  className="deleteMsg text-end  me-3 pt-2 text-danger w-25"
                  onClick={deleteChat}
                >
                  <BsFillTrash3Fill />
                </i>
              ) : null}
            </div>
            <div className="messages">
              {msgs.length
                ? msgs.map((msg, i) => (
                    <Message key={i} msg={msg} user1={user1} />
                  ))
                : null}
            </div>
            <MessageArea
              handleSubmit={handleSubmit}
              text={text}
              setText={setText}
              setImg={setImg}
            />
          </>
        ) : (
          <h3 className="text-secondary text-center">
            Select people to start conversation
          </h3>
        )}
      </div>
    </div>
  );
};

export default Home;
