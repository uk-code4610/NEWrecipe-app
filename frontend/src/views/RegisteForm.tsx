import { useView } from "../Context/ViewContext";
import { useState } from "react";

const RegisterForm = () => {
  const { currentView, setCurrentView } = useView();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const changePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const addUser = () => {
    if (!username || !password) {
      setMessage("未入力があります");
      return;
    }
    fetch("http://127.0.0.1:5001/api/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: username, password: password }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setMessage(data.message);
        setCurrentView("login");
      })
      .catch((error) => {
        setMessage("登録に失敗しました");
      });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      {currentView === "register" && (
        <div className="Login-input">
          <p>{message}</p>
          <h1>新規登録</h1>
          <p>ユーザー名を登録</p>
          <input
            type="text"
            name="username"
            placeholder="10文字以内"
            value={username}
            onChange={changeName}
          />
          <p>パスワードを作成</p>
          <input
            type="password"
            name="password"
            placeholder="16文字以内"
            value={password}
            onChange={changePass}
          />
          <button onClick={addUser}>登録</button>
        </div>
      )}
    </>
  );
};

export default RegisterForm;
