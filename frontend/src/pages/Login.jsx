import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../lib/axios";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  return (
    <main
      className="min-h-screen
bg-slate-100
flex
items-center
justify-center
px-4"
    >
      <div
        className="bg-white w-full max-w-md p-8
rounded-2xl
shadow-xl"
      >
        <h1
          className="text-slate-900
text-center
text-2xl
font-bold
    "
        >
          Login
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault(); //console.log(formData);
            if (formData.email === "" || formData.password === "") {
              alert("Please fill in all fields");
              return; //alert k bd return na kro to api phr b reqst send kr deta h hmy empty data ni chahye so islye return kr dia
            }
            api
              .post("/login", formData)
              .then((res) => {
                console.log(res.data);

                localStorage.setItem("token", res.data.token);
                localStorage.setItem("role", res.data.user.role);
                const role = res.data.user.role;

                if (role === "job_seeker") {
                  window.location.href = "/job-seeker-dashboard";
                } else if (role === "employer") {
                  window.location.href = "/employer-dashboard";
                } else if (role === "admin") {
                  window.location.href = "/admin-dashboard";
                }
              })
              .catch((err) => {
                // console.log(err);
                alert("Invalid email or password");
              });
          }}
          className="space-y-4"
        >
          <label
            className="mb-2
block
text-sm
font-medium
text-slate-900"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="w-full px-3 py-2 outline-1
-outline-offset-1
outline-slate-300
focus:outline-2
focus:-outline-offset-2
focus:outline-blue-600 rounded-md text-slate-900 focus:* bg-white"
            name="email"
            id="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
          />
          <label
            className="mb-2
block
text-sm
font-medium
text-slate-900"
            htmlFor="password"
          >
            Password
          </label>
          <input
            className="w-full px-3 py-2 outline-1
-outline-offset-1
outline-slate-300
focus:outline-2
focus:-outline-offset-2
focus:outline-blue-600 rounded-md text-slate-900 focus:* bg-white"
            name="password"
            id="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({
                ...formData,
                password: e.target.value,
              })
            }
          />
          <button
            className="
          w-full
py-2
px-3.5
text-sm
font-semibold
text-white
bg-blue-600
border
border-blue-600
rounded-md
hover:bg-blue-700
transition-all
cursor-pointer"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="mt-6 text-slate-900 text-sm text-center">
          Don't have an account?{" "}
          <Link className="text-blue-600 hover:underline" to="/register">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
};
export default Login;
