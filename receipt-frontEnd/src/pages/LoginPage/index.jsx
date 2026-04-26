import React, { useState } from "react";
import { login } from "../../api/authApi";
import "./style.css";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  
  const [form, setForm] = useState({
    loginId:"",
    password:""
  });

  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");

  const onChange=(e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  const onSubmit=async(e)=>{
    e.preventDefault();

    setError("");

    if(!form.loginId || !form.password){
      setError("아이디와 비밀번호 입력");
      return;
    }

    try{
      setLoading(true);
      const result=await login(form);
      console.log(result);

      alert(
        `${result.userName} 로그인 성공`
      );

      // 추후 페이지 이동
      navigate("/dashboard");
    }catch(err){
      console.error(err);

      setError(
        "로그인 실패"
      );
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <svg className="bg-svg" viewBox="0 0 1200 800">
        <circle cx="300" cy="250" r="250" fill="#dbeafe"/>
        <circle cx="900" cy="500" r="250" fill="#e0f2fe"/>
        <circle cx="150" cy="600" r="180" fill="#eef2ff"/>
        <circle cx="1050" cy="150" r="150" fill="#dbeafe"/>

        <rect
          x="720"
          y="180"
          width="260"
          height="360"
          rx="30"
          fill="#e5e7eb"
          transform="rotate(10 850 350)"
        />

        <rect
          x="650"
          y="140"
          width="260"
          height="360"
          rx="30"
          fill="white"
          style={{
            filter:
             "drop-shadow(0 30px 50px rgba(0,0,0,0.15))"
          }}
        />

        <line x1="680" y1="220" x2="880" y2="220" stroke="#e5e7eb"/>
        <line x1="680" y1="250" x2="850" y2="250" stroke="#e5e7eb"/>
        <line x1="680" y1="280" x2="860" y2="280" stroke="#e5e7eb"/>

        <text x="700" y="300" fontWeight="bold" fill="#111">
          ¥2,350
        </text>

        <rect x="690" y="320" width="180" height="120" rx="12" fill="#f8fafc"/>
        <line x1="700" y1="430" x2="860" y2="430" stroke="#e5e7eb"/>

        <rect x="710" y="330" width="22" height="100" rx="6" fill="#3b82f6"/>
        <rect x="750" y="325" width="22" height="105" rx="6" fill="#f97316"/>
        <rect x="790" y="328" width="22" height="102" rx="6" fill="#facc15"/>

        <rect
          x="260"
          y="320"
          width="240"
          height="160"
          rx="20"
          fill="white"
          style={{
           filter:
           "drop-shadow(0 20px 30px rgba(0,0,0,0.1))"
          }}
        />

        <polyline
          points="280,440 320,370 360,410 420,350"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="5"
        />
      </svg>


      <div className="login-card-wrapper">
        <div className="login-card">

          <h2 className="title">
            SHOW ME <br/>
            <span>THE MONEY</span>
          </h2>

          <form onSubmit={onSubmit}>

            <div className="input-box">
              <span>👤</span>

              <input name="loginId"value={form.loginId}onChange={onChange}placeholder="Email"/>
            </div>

            <div className="input-box">
              <span>🔒</span>

              <input type="password"name="password"value={form.password}onChange={onChange}placeholder="Password"/>
            </div>

            {error &&
              <p className="error-msg">
                {error}
              </p>
            }

            <button
              className="login-btn"
              type="submit"
              disabled={loading}
            >
              {
                loading
                ? "LOGINING..."
                : "LOGIN"
              }
            </button>

          </form>

        </div>

        <div className="card-base"></div>

      </div>

    </div>
  );
}

export default LoginPage;