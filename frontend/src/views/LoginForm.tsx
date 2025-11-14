import { useState } from "react";
import { useView } from "../Context/ViewContext";
type Props = {
  setIsLoggedIn: (isLoggedIn: boolean) => void;
};
const LoginForm = ({ setIsLoggedIn }: Props) => {
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
  const loginBtn = () => {
    if (!username || !password) {
      setMessage("入力してください");
      return;
    }
    fetch("http://127.0.0.1:5001/api/login", {
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
        localStorage.setItem("has_account", "true");
        setMessage(data.message);
        setIsLoggedIn(true);
        setCurrentView("list");
      })
      .catch((error) => {
        setMessage("ログインに失敗しました");
      });
    setUsername("");
    setPassword("");
  };

  return (
    <>
      {currentView === "login" && (
        <div className="Login-input">
          <p>{message}</p>
          <h1>ログイン</h1>
          <p>ユーザー名を入力してください</p>
          <input
            type="text"
            name="username"
            placeholder="10文字以内"
            value={username}
            onChange={changeName}
          />
          <p>パスワードを入力してください</p>
          <input
            type="password"
            name="password"
            placeholder="16文字以内"
            value={password}
            onChange={changePass}
          />
          <button onClick={loginBtn}>ログイン</button>
          <div className="to-Register">
            <h3>アカウントをお持ちではないですか？</h3>
            <p onClick={() => setCurrentView("register")}>新規登録する</p>
          </div>
        </div>
      )}
    </>
  );
};
export default LoginForm;
