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
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const changeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };
  const changePass = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const loginBtn = () => {
    if (isLoading) return;
    if (!username || !password) {
      setMessage("入力してください");
      return;
    }
    setIsLoading(true);
    fetch("https://new-afro-kitchen.onrender.com/api/login", {
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
        setIsLoading(false);
        setIsLoggedIn(true);
        setCurrentView("list");
      })
      .catch((error) => {
        setIsLoading(false);
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
            placeholder="4文字以上10文字以内で入力してください"
            value={username}
            onChange={changeName}
          />
          <p>パスワードを入力してください</p>
          <input
            type="password"
            name="password"
            placeholder="6文字以上16文字以内で入力してください"
            value={password}
            onChange={changePass}
          />
          <button onClick={loginBtn} disabled={isLoading}>
            {isLoading ? "ログイン中..." : "ログイン"}
          </button>
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
